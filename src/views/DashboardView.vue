<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { 
  FireIcon, 
  FlagIcon, 
  ClockIcon,
  FaceSmileIcon,
  EllipsisHorizontalIcon
} from '@heroicons/vue/24/solid'
import { useUserStore } from '../stores/userStore'
import { useMoodStore } from '../stores/moodStore'
import { usePlanStore } from '../stores/planStore'
import { useLocaleStore } from '../stores/localeStore'
import { useSubjectStore } from '../stores/subjectStore'

// Stores
const userStore = useUserStore()
const moodStore = useMoodStore()
const planStore = usePlanStore()
const localeStore = useLocaleStore()
const subjectStore = useSubjectStore()
const { t } = storeToRefs(localeStore)

// State Mapping
const { name: userName, avatar: userAvatar } = storeToRefs(userStore)
const { logs, streak, todayLog } = storeToRefs(moodStore)
const { plans: studyPlans } = storeToRefs(planStore)
const { subjects } = storeToRefs(subjectStore)


const currentDate = ref('')
const subjectsMap = ref({})
const showAddPlanModal = ref(false)
const newPlan = ref({ title: '', date: '', startTime: '09:00', duration: '1h', subject: 'Math', predictedStress: 'Medium' })

// Sort Plans: Uncompleted first, then by time. Completed at the bottom.
const sortedStudyPlans = computed(() => {
    if (!studyPlans.value || !Array.isArray(studyPlans.value)) return []
    // Strict filter to ensure no nulls reach the template
    const validPlans = studyPlans.value.filter(p => p && typeof p === 'object')
    return [...validPlans].sort((a, b) => {
        if (a.completed === b.completed) {
           return (a.startTime || '').localeCompare(b.startTime || '')
        }
        return a.completed ? 1 : -1
    })
})

const archivePlanToLog = (planId) => {
    if (!studyPlans.value) return
    const plan = studyPlans.value.find(p => p.id === planId)
    if (!plan) return

    // Create Log Entry
    let stressKey = 'okay'
    if (plan.predictedStress === 'High') stressKey = 'high'
    if (plan.predictedStress === 'Low') stressKey = 'calm'

    // Construct Date from plan.endTime (as completion time)
    let logDate = new Date()
    if (plan.date) {
        logDate = new Date(plan.date)
        if (plan.endTime) {
             const [h, m] = plan.endTime.split(':').map(Number)
             logDate.setHours(h, m)
        }
    }

    const logEntry = {
        date: logDate.toISOString(), 
        mood: stressKey, 
        subject: plan.subject, 
        note: `Completed: ${plan.title}`,
    }

    // Add to logs via Store
    moodStore.addLog(logEntry)

    // Remove from Plans via Store
    planStore.removePlan(planId)
}

// Data Definitions (Matching Onboarding & Daily Log)
import { moodDefinitions } from '../data/moodDefinitions'

// Processed Logs for Display
const recentLogs = computed(() => {
    if (!logs.value || !Array.isArray(logs.value)) return []
    // Strict filter
    const validLogs = logs.value.filter(l => l && typeof l === 'object')
    
    return validLogs.map(log => {
          if (!log) return null // Should be caught by filter but double safe
          
          let key = 'neutral'
          
          if (log.stressLevel) {
              key = log.stressLevel
          } else if (typeof log.mood === 'number') {
              // Map 1-5 to keys if stressLevel is missing
              if (log.mood >= 4.5) key = 'calm'
              else if (log.mood >= 3.5) key = 'happy'
              else if (log.mood >= 2.5) key = 'okay'
              else if (log.mood >= 1.5) key = 'sad'
              else key = 'high'
          } else if (log.mood) {
              key = log.mood // Legacy String
          }

          const moodDef = moodDefinitions[key] || moodDefinitions['neutral']
          
          const subjectLabel = log.subject || 'General' 
          
          return {
              ...log,
              moodLabel: moodDef.label,
              emoji: moodDef.emoji,
              color: moodDef.color,
              subjectLabel: subjectLabel,
              timeFormatted: formatTimeAgo(log.date || log.timestamp)
          }
    }).filter(Boolean).slice(0, 10)
})

// Weekly Progress Logic
const weeklyProgress = computed(() => {
    if (!logs.value || !Array.isArray(logs.value)) return { count: 0, percentage: 0 }
    
    const now = new Date()
    const startOfWeek = new Date(now)
    // Adjust to Monday (1) 
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) 
    startOfWeek.setDate(diff)
    startOfWeek.setHours(0, 0, 0, 0)

    const thisWeekLogs = logs.value.filter(log => {
        const d = new Date(log.date || log.timestamp)
        return d >= startOfWeek
    })

    const count = thisWeekLogs.length
    const percentage = Math.min((count / 10) * 100, 100)
    
    return { count, percentage }
})

// Today's Mood (Latest Log, Decorated)
const todayMood = computed(() => {
    // 1. Get raw log from store (already finds today's log)
    if (!logs.value || !Array.isArray(logs.value)) return null
    const rawLog = todayLog.value 
    if (!rawLog || typeof rawLog !== 'object') return null

    // 2. Decorate it
    // 2. Decorate it
    let key = 'neutral'
    if (rawLog.stressLevel) {
        key = rawLog.stressLevel
    } else if (typeof rawLog.mood === 'number') {
        if (rawLog.mood >= 4.5) key = 'calm'
        else if (rawLog.mood >= 3.5) key = 'happy'
        else if (rawLog.mood >= 2.5) key = 'okay'
        else if (rawLog.mood >= 1.5) key = 'sad'
        else key = 'high'
    } else if (rawLog.mood) {
        key = rawLog.mood
    }

    const moodDef = moodDefinitions[key] || moodDefinitions['neutral']
    return {
        ...rawLog,
        moodLabel: moodDef.label,
        emoji: moodDef.emoji,
        color: moodDef.color,
        gradient: moodDef.gradient,
        textColor: moodDef.text,
        animation: moodDef.animation
    }
})

onMounted(() => {
  try {
      // Formatting Date
      const now = new Date()
      currentDate.value = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      // Checking for expired completed plans
      const nowTime = Date.now()
      if (studyPlans.value && Array.isArray(studyPlans.value)) {
          studyPlans.value.forEach(plan => {
              if (plan && plan.completed && plan.completedAt) {
                  const diff = nowTime - new Date(plan.completedAt).getTime() 
                  if (diff > 300000) { // 5 minutes
                      archivePlanToLog(plan.id)
                  } else {
                      setTimeout(() => archivePlanToLog(plan.id), 300000 - diff)
                  }
              }
          })
      }
      
      // Default new plan subject to first available
      if (subjects.value.length > 0) {
          newPlan.value.subject = subjects.value[0].label
      }
  } catch (e) {
      console.error("Error in Dashboard onMounted:", e)
  }
})

// Helper: Time Ago
const formatTimeAgo = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Yesterday'
    return `${diffInDays}d ago`
}

// Plan Helper Styles
const getSubjectStyle = (sub) => {
    const style = subjectStore.getSubjectStyle(sub)
    // Map store style to dashboard's expected { emoji, bg } format
    // Store: color='bg-blue-100 text-blue-800'
    // Dashboard: bg='from-blue-50 to-blue-100 text-blue-600' (Gradient)
    // We will stick to using the flat color for now or try to adapt
    return { 
        emoji: style.emoji, 
        bg: style.color // Just usage of flat class
    }
}

const getStressStyle = (level) => {
    if (level === 'High') return 'bg-red-50 text-red-600 border-red-100'
    if (level === 'Medium') return 'bg-yellow-50 text-yellow-600 border-yellow-100'
    return 'bg-emerald-50 text-emerald-600 border-emerald-100'
}

// Plan Actions
const openAddModal = () => {
    showAddPlanModal.value = true
}

const addPlan = () => {
    if (!newPlan.value.title) return
    
    // Calculate End Time
    let end = newPlan.value.startTime
    try {
        const [h, m] = newPlan.value.startTime.split(':').map(Number)
        const date = new Date()
        date.setHours(h, m)
        
        const durMap = { '30m': 30, '45m': 45, '1h': 60, '1.5h': 90, '2h': 120 }
        const addMins = durMap[newPlan.value.duration] || 60
        
        date.setMinutes(date.getMinutes() + addMins)
        end = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    } catch(e) { console.log(e) }

    const plan = {
        ...newPlan.value,
        endTime: end
    }
    
    planStore.addPlan(plan)
    
    showAddPlanModal.value = false
    newPlan.value = { title: '', date: '', startTime: '09:00', duration: '1h', subject: subjects.value[0]?.label || 'Math', predictedStress: 'Medium' }
}

const togglePlanComplete = (plan) => {
    // We modify the plan object directly here if it's reactive from store, 
    // but better to use store action if we want strictness.
    // However, planStore.togglePlan toggles by ID.
    planStore.togglePlan(plan.id)
    
    // Re-find the plan to check its new status (since 'plan' arg might be a copy or ref)
    const updatedPlan = studyPlans.value.find(p => p.id === plan.id)

    if (updatedPlan && updatedPlan.completed) {
        // Schedule archive
        setTimeout(() => archivePlanToLog(updatedPlan.id), 300000) 
    }
}

const deletePlan = (id) => {
    planStore.removePlan(id)
}

// Greeting Logic
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return t.value.greeting.morning
  if (hour < 18) return t.value.greeting.afternoon
  return t.value.greeting.evening
})

// Date Format helper
const formatDateShort = (d) => {
    if (!d || d === 'Today') return 'Today'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="flex flex-col min-h-screen font-display px-1 pb-24">
    
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-12 h-12 rounded-full bg-pastel-lavender/50 border-2 border-white dark:border-transparent overflow-hidden">
            <img :src="userAvatar" alt="Avatar" class="w-full h-full object-cover">
          </div>
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-slate-800 rounded-full"></div>
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-white leading-tight">{{ greeting }}, {{ userName }} 👋</h1>
          <p class="text-xs font-semibold text-primary">{{ t.greeting.checkin }}</p>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary text-sm">calendar_month</span>
        <span class="text-xs font-bold text-primary">{{ currentDate }}</span>
      </div>
    </div>

    <!-- MAIN GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      
      <!-- DAILY SNAPSHOT (Left Column - Tall) -->
      <div 
        class="col-span-1 relative overflow-hidden rounded-[2rem] shadow-lg min-h-[260px] flex flex-col items-center justify-between p-5 text-center group transition-all duration-500 hover:scale-[1.02]"
        :class="todayMood ? `bg-gradient-to-br ${todayMood.gradient} ${todayMood.bgAnimation}` : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900'"
      >
        <!-- Background Decor -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/10 via-white/5 to-white/20 pointer-events-none mix-blend-overlay"></div>
        <!-- Animated Blobs -->
        <div v-if="todayMood" class="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div v-if="todayMood" class="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl animate-float-slow"></div>
        
        <div class="relative z-10 w-full">
            <p class="text-[10px] font-bold tracking-widest uppercase opacity-80 mb-1"
               :class="todayMood ? todayMood.textColor : 'text-slate-500 dark:text-slate-400'">
               {{ t.dashboard.snapshot }}
            </p>
            <h2 class="text-xl font-extrabold leading-none whitespace-pre-line"
                :class="todayMood ? todayMood.textColor : 'text-slate-800 dark:text-white'">
                {{ t.dashboard.mood_title }}
            </h2>
        </div>

        <!-- Dynamic Mood Content -->
        <div v-if="todayMood" class="relative z-10 my-2 transform transition-transform group-hover:scale-110 duration-300">
             <div class="text-8xl filter drop-shadow-lg transition-all duration-500" :class="todayMood.animation">
                {{ todayMood.emoji }}
             </div>
        </div>
        <div v-else class="relative z-10 my-2 opacity-50">
             <div class="text-6xl grayscale">😶</div>
        </div>

        <div v-if="todayMood" class="relative z-10 w-full bg-white/20 backdrop-blur-md rounded-2xl py-3 px-2 border border-white/30 shadow-inner">
             <p class="text-[10px] font-bold uppercase mb-0.5 opacity-90" :class="todayMood.textColor">{{ t.dashboard.feeling }}</p>
             <p class="text-2xl font-black tracking-tight" :class="todayMood.textColor">{{ todayMood.moodLabel }}</p>
        </div>
        <div v-else class="relative z-10 w-full bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-2xl py-3 px-2 border border-white/20 dark:border-white/5">
             <p class="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase mb-0.5">{{ t.dashboard.no_data }}</p>
             <p class="text-sm font-bold text-slate-800 dark:text-white">{{ t.dashboard.check_in_btn }}</p>
        </div>
      </div>

      <!-- STATS COLUMN (Right Column) -->
      <div class="col-span-1 flex flex-col gap-4">
        
        <!-- STREAK CARD -->
        <div class="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
             <div class="absolute top-4 right-4 bg-orange-100 dark:bg-orange-900/30 text-orange-500 p-1.5 rounded-full">
                <FireIcon class="w-4 h-4" />
             </div>
             
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">{{ t.dashboard.streak_title }}</p>
             <div class="flex items-baseline gap-1 mb-2">
                 <span class="text-4xl font-extrabold text-slate-800 dark:text-white">{{ streak }}</span>
                 <span class="text-sm font-bold text-slate-400">{{ t.dashboard.streak_unit }}</span>
             </div>
             
             <div class="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                 <span class="text-[10px] font-bold text-orange-600 dark:text-orange-400">{{ t.dashboard.streak_msg }}</span>
             </div>
        </div>

        <!-- GOAL CARD -->
        <div class="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
             <div class="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/30 text-blue-500 p-1.5 rounded-full">
                <FlagIcon class="w-4 h-4" />
             </div>

             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">{{ t.dashboard.tracker_title }} (Week)</p>
             <div class="flex items-baseline justify-between mb-3">
                 <span class="text-xl font-extrabold text-slate-800 dark:text-white">{{ weeklyProgress.count }}/10</span>
                 <span class="text-[10px] font-bold text-slate-400">{{ t.dashboard.milestone }}</span>
             </div>

             <!-- Progress Bar -->
             <div class="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                 <div class="h-full bg-blue-500 rounded-full transition-all duration-1000" :style="{ width: weeklyProgress.percentage + '%' }"></div>
             </div>
        </div>

      </div>
    </div>

    <!-- TODAY'S STUDY PLAN -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4 px-1">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ t.dashboard.study_plan }}</h3>
          <span class="material-symbols-outlined text-slate-400 text-lg">calendar_today</span>
      </div>

      <div class="flex flex-col gap-3">
          
          <!-- Plan Items -->
          <div v-for="plan in sortedStudyPlans" :key="plan.id" class="relative group bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center transition-all hover:scale-[1.01] hover:shadow-md"
              :class="plan.completed ? 'opacity-60 bg-slate-50 dark:bg-slate-800/50 grayscale-[0.5]' : ''">
                
                <!-- Left: Checkbox & Info -->
                <div class="flex items-center gap-4 overflow-hidden">
                    <!-- Checkbox -->
                    <button @click="togglePlanComplete(plan)" class="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                        :class="plan.completed ? 'bg-primary border-primary' : 'border-slate-200 dark:border-slate-600 hover:border-primary'">
                        <span v-if="plan.completed" class="material-symbols-outlined text-white text-sm font-bold">check</span>
                    </button>

                    <!-- Icon & Text -->
                    <div class="flex items-center gap-3 overflow-hidden">
                        <div class="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center text-xl shadow-inner" 
                            :class="getSubjectStyle(plan.subject).bg">
                            {{ getSubjectStyle(plan.subject).emoji }}
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-slate-800 dark:text-white text-base leading-tight mb-0.5 truncate pr-2"
                                :class="plan.completed ? 'line-through text-slate-400' : ''">
                                {{ plan.title }}
                            </h4>
                            <div class="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                 <ClockIcon class="w-3.5 h-3.5" />
                                 {{ formatDateShort(plan.date) }} • {{ plan.startTime }} - {{ plan.endTime }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Actions -->
                <div class="flex items-center gap-2 pl-2 shrink-0">
                    <!-- Stress Pill -->
                    <span class="px-2 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap" 
                        :class="getStressStyle(plan.predictedStress)">
                        {{ plan.predictedStress }}
                    </span>

                    <!-- Delete Button (Visible) -->
                    <button @click="deletePlan(plan.id)" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors">
                        <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
          </div>

          <!-- Add Button -->
          <button @click="openAddModal" class="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] flex items-center justify-center gap-2 text-primary font-bold transition-all hover:bg-primary/5 hover:border-primary/30 active:scale-95">
              <span class="material-symbols-outlined bg-primary/10 rounded-full p-1 text-lg">add</span>
              {{ t.dashboard.add_plan }}
          </button>

      </div>
    </div>

    <!-- RECENT LOGS -->
    <div>
      <div class="flex items-center gap-2 mb-4 px-1">
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ t.dashboard.recent_logs }}</h3>
          <ClockIcon class="w-4 h-4 text-slate-400" />
      </div>

      <div class="flex flex-col gap-3 pb-24"> <!-- Added padding-bottom for nav -->
          <div v-if="logs.length === 0" class="text-center py-10 opacity-50">
              <p class="text-slate-500">{{ t.dashboard.no_logs }}</p>
          </div>

          <div v-for="log in recentLogs" :key="log.id" class="group flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer">
              <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl" :class="log.color">
                      {{ log.emoji }}
                  </div>
                  <div>
                      <h4 class="font-bold text-slate-800 dark:text-white text-base">{{ log.moodLabel }}</h4>
                      <div class="flex items-center gap-1.5">
                          <span class="w-1.5 h-1.5 rounded-full" :class="log.color.split(' ')[0].replace('bg-', 'bg-')"></span>
                          <span class="text-xs font-semibold text-slate-400">{{ log.subjectLabel }}</span>
                      </div>
                  </div>
              </div>
              
              <div class="bg-slate-50 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                  <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">{{ log.timeFormatted }}</span>
              </div>
          </div>
      </div>
    </div>

    <!-- ADD PLAN MODAL -->
    <Teleport to="body">
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-full opacity-0"
    >
        <div v-if="showAddPlanModal" class="fixed inset-0 z-[9999] bg-white dark:bg-slate-900 overflow-y-auto">
            <div class="px-6 py-4 w-full max-w-lg mx-auto min-h-screen flex flex-col">
                
                <!-- Header -->
                <div class="flex items-center justify-between mb-8 pt-4">
                    <button @click="showAddPlanModal = false" class="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
                        <span class="material-symbols-outlined text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">close</span>
                    </button>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ t.modal.title }}</h3>
                    <div class="w-10"></div> <!-- Spacer -->
                </div>

                <div class="space-y-6">
                    
                    <!-- 1. Subject Select -->
                    <div>
                        <h4 class="text-lg font-bold text-slate-800 dark:text-white mb-4">{{ t.modal.subject_q }}</h4>
                        
                        <!-- Dynamic Subject List (Horizontal Scroll Pill Style) -->
                        <div v-if="subjects.length === 0" class="text-center py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                            <p class="text-slate-400">No subjects found. Please add some in Profile.</p>
                        </div>
                        
                        <div v-else class="w-full overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                             <div class="flex gap-3 min-w-max">
                                 <button 
                                    v-for="subj in subjects" 
                                    :key="subj.id"
                                    @click="newPlan.subject = subj.label"
                                    class="group flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-5 transition-all duration-300 border-2"
                                    :class="newPlan.subject === subj.label 
                                        ? `border-transparent shadow-md scale-105 ${subj.color}` 
                                        : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
                                >
                                    <span class="text-xl">{{ subj.emoji }}</span>
                                    <span class="font-bold text-sm">{{ subj.label }}</span>
                                </button>
                             </div>
                        </div>
                    </div>

                    <!-- 2. When? (Date & Duration) -->
                    <div>
                        <h4 class="text-sm font-bold text-slate-800 dark:text-white mb-3">{{ t.modal.when }}</h4>
                        
                        <!-- Date & Start Time -->
                        <div class="mb-3 grid grid-cols-2 gap-2">
                             <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{{ t.modal.date }}</label>
                                <div class="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 border border-slate-100 dark:border-slate-700/50">
                                    <span class="material-symbols-outlined text-slate-400 mr-2 text-sm">calendar_month</span>
                                    <input v-model="newPlan.date" type="date" class="bg-transparent border-none text-slate-800 dark:text-white font-bold text-xs w-full focus:ring-0 p-0">
                                </div>
                             </div>
                             <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{{ t.modal.start_time }}</label>
                                <div class="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 border border-slate-100 dark:border-slate-700/50">
                                    <span class="material-symbols-outlined text-slate-400 mr-2 text-sm">schedule</span>
                                    <input v-model="newPlan.startTime" type="time" class="bg-transparent border-none text-slate-800 dark:text-white font-bold text-sm w-full focus:ring-0 p-0">
                                </div>
                             </div>
                        </div>

                        <!-- Duration Pills -->
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase mb-2 block">{{ t.modal.duration }}</label>
                            <div class="flex flex-wrap gap-2">
                                <button 
                                    v-for="dur in ['30m', '45m', '1h', '1.5h', '2h']" 
                                    :key="dur"
                                    @click="newPlan.duration = dur"
                                    class="px-4 py-2 rounded-xl text-xs font-bold border transition-all"
                                    :class="newPlan.duration === dur 
                                        ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800' 
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-200'"
                                >
                                    {{ dur }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Stress Check -->
                    <div>
                        <h4 class="text-sm font-bold text-slate-800 dark:text-white mb-3">{{ t.modal.stress_check }}</h4>
                        <div class="grid grid-cols-3 gap-3">
                            <button @click="newPlan.predictedStress = 'Low'" 
                                class="flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all h-24"
                                :class="newPlan.predictedStress === 'Low' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'"
                            >
                                <span class="text-2xl mb-1 grayscale" :class="{'grayscale-0': newPlan.predictedStress === 'Low'}">😌</span>
                                <span class="text-xs font-bold">{{ t.modal.low }}</span>
                            </button>
                            
                            <button @click="newPlan.predictedStress = 'Medium'" 
                                class="flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all h-24"
                                :class="newPlan.predictedStress === 'Medium' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'"
                            >
                                <span class="text-2xl mb-1 grayscale" :class="{'grayscale-0': newPlan.predictedStress === 'Medium'}">😐</span>
                                <span class="text-xs font-bold">{{ t.modal.medium }}</span>
                            </button>

                            <button @click="newPlan.predictedStress = 'High'" 
                                class="flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all h-24"
                                :class="newPlan.predictedStress === 'High' ? 'bg-rose-50 border-rose-400 text-rose-700' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'"
                            >
                                <span class="text-2xl mb-1 grayscale" :class="{'grayscale-0': newPlan.predictedStress === 'High'}">😣</span>
                                <span class="text-xs font-bold">{{ t.modal.high }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- 4. Goals & Topics -->
                    <div>
                        <h4 class="text-lg font-bold text-slate-800 dark:text-white mb-4">{{ t.modal.goals }}</h4>
                        <div class="relative">
                            <textarea 
                                v-model="newPlan.title" 
                                :placeholder="t.modal.goals_ph" 
                                rows="3"
                                class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-base font-bold focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder:font-normal"
                            ></textarea>
                            <span class="material-symbols-outlined absolute bottom-3 right-3 text-slate-300 text-sm">edit</span>
                        </div>
                    </div>

                </div>

                <!-- Footer Action -->
                <div class="mt-auto pt-8 pb-6">
                    <button @click="addPlan" class="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined">check_circle</span>
                        {{ t.modal.save_btn }}
                    </button>
                </div>

            </div>
        </div>
    </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
