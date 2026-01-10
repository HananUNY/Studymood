<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronLeftIcon,
  CheckCircleIcon,
  PencilSquareIcon 
} from '@heroicons/vue/24/solid'
import { useMoodStore } from '../stores/moodStore'
import { useLocaleStore } from '../stores/localeStore'
import { useUserStore } from '../stores/userStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const router = useRouter()
const moodStore = useMoodStore()
const localeStore = useLocaleStore()
const userStore = useUserStore()

import { useSubjectStore } from '../stores/subjectStore'
const subjectStore = useSubjectStore()
const { t } = storeToRefs(localeStore)

// --- State ---
const categories = ref([])
const selectedCategoryId = ref('')
const stressLevelId = ref('okay')
const confidence = ref(75)
const selectedStressors = ref(['deadlines'])
const journalText = ref('')
// Period Tracker
const isPeriod = ref(false)
const selectedSymptoms = ref([])


onMounted(() => {
  // Load Subjects from LocalStorage (Sync with Onboarding)
  // Note: We might want a SubjectStore later, but reading localStorage is safe for now as Onboarding writes it there.
  // Load Subjects from Store
  const userSubjects = subjectStore.subjects.map(s => ({
    id: s.id,
    name: s.label,
    icon: s.emoji,
    colorClass: s.color || 'bg-slate-100 text-slate-600',
    iconColorClass: '', 
    textColorClass: ''
  }))

  if (userSubjects.length > 0) {
    categories.value = userSubjects
    selectedCategoryId.value = userSubjects[0].id
  } else {
    // Fallback if no subjects found
    categories.value = [
      { id: 'general', name: computed(() => t.value.daily_log.categories.general), icon: '📝', colorClass: 'bg-slate-100 text-slate-800' }
    ]
    selectedCategoryId.value = 'general'
  }

  // Scroll to default stress
  setTimeout(() => {
     scrollToStress('okay')
  }, 100)
})

const STRESS_LEVELS = computed(() => [
  { id: 'high', label: t.value.daily_log.levels.high, icon: '🤯', value: 5 },
  { id: 'sad', label: t.value.daily_log.levels.sad, icon: '😓', value: 4 },
  { id: 'okay', label: t.value.daily_log.levels.okay, icon: '😐', value: 3 },
  { id: 'happy', label: t.value.daily_log.levels.happy, icon: '🙂', value: 2 },
  { id: 'calm', label: t.value.daily_log.levels.calm, icon: '😌', value: 1 },
])

const STRESSORS = computed(() => [
  { id: 'deadlines', label: t.value.daily_log.stressors.deadlines, icon: 'schedule' },
  { id: 'exams', label: t.value.daily_log.stressors.exams, icon: 'school' },
  { id: 'peers', label: t.value.daily_log.stressors.peers, icon: 'group' },
  { id: 'sleep', label: t.value.daily_log.stressors.sleep, icon: 'bedtime' },
])

const PERIOD_SYMPTOMS = [
    { id: 'cramps', label: 'Cramps', icon: 'health_and_safety' }, // Using general icons as fallback
    { id: 'headache', label: 'Headache', icon: 'healing' },
    { id: 'fatigue', label: 'Fatigue', icon: 'battery_alert' },
    { id: 'bloating', label: 'Bloating', icon: 'water_drop' },
    { id: 'moody', label: 'Mood Swings', icon: 'sentiment_dissatisfied' },
]


// --- Scroll & Snap Logic ---
const stressContainer = ref(null)
let scrollTimeout = null

const scrollToStress = (id) => {
    stressLevelId.value = id
    const container = stressContainer.value
    if (!container) return

    const el = container.querySelector(`[data-id="${id}"]`)
    if (el) {
        const containerCenter = container.clientWidth / 2
        const elCenter = el.offsetLeft + el.clientWidth / 2
        container.scrollTo({
            left: elCenter - containerCenter,
            behavior: 'smooth'
        })
    }
}

const handleStressScroll = (e) => {
    if (scrollTimeout) clearTimeout(scrollTimeout)
    
    // Snapping logic on scroll end
    scrollTimeout = setTimeout(() => {
        const container = e.target
        const center = container.scrollLeft + container.clientWidth / 2
        
        let closestId = null
        let minDistance = Infinity

        STRESS_LEVELS.value.forEach(level => {
            const el = container.querySelector(`[data-id="${level.id}"]`)
            if (el) {
                const elCenter = el.offsetLeft + el.clientWidth / 2
                const distance = Math.abs(center - elCenter)
                if (distance < minDistance) {
                    minDistance = distance
                    closestId = level.id
                }
            }
        })

        if (closestId && closestId !== stressLevelId.value) {
            stressLevelId.value = closestId
        }
    }, 100) // Debounce
}


// --- Actions ---
const toggleStressor = (id) => {
  if (selectedStressors.value.includes(id)) {
    selectedStressors.value = selectedStressors.value.filter(s => s !== id)
  } else {
    selectedStressors.value.push(id)
  }
}

const toggleSymptom = (id) => {
  if (selectedSymptoms.value.includes(id)) {
    selectedSymptoms.value = selectedSymptoms.value.filter(s => s !== id)
  } else {
    selectedSymptoms.value.push(id)
  }
}


const handleSave = () => {
  // Create Log Object
  const newLog = {
    // id: Date.now(), // Store handles IDs
    timestamp: new Date().toISOString(), // Store uses 'timestamp' usually or 'date'
    date: new Date().toISOString(),
    type: 'daily',
    
    // Core Data
    subjectId: selectedCategoryId.value,
    stressLevel: stressLevelId.value,
    confidence: confidence.value,
    stressors: selectedStressors.value,
    note: journalText.value,
    
    // Period Data
    isPeriod: isPeriod.value,
    symptoms: isPeriod.value ? selectedSymptoms.value : [],

    // UI mappings expected by Dashboard

    mood: stressLevelId.value, 
    subject: selectedCategoryId.value 
  }

  // Use Store Action
  moodStore.addLog(newLog)

  router.push('/dashboard')
}

const goBack = () => router.back()

</script>

<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-background-dark font-display transition-colors pb-32">
    
    <!-- Header -->
    <header class="sticky top-0 z-20 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      <button @click="goBack" class="flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-white">
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <h2 class="text-slate-900 dark:text-white text-lg font-bold">{{ t.daily_log.new_entry }}</h2>
      <div class="w-10"></div>
    </header>

    <main class="flex-1 flex flex-col max-w-md mx-auto w-full px-4 pt-4">
      
      <!-- Date Display -->
      <div class="flex flex-col items-center py-4">
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {{ new Date().toLocaleDateString(localeStore.locale === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }}
        </p>
      </div>

      <!-- Category Selector -->
      <div class="w-full overflow-x-auto no-scrollbar pb-2 mb-6 -mx-4 px-4">
        <div class="flex gap-3 min-w-max">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="selectedCategoryId = cat.id"
            class="group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-4 transition-all duration-300 border border-transparent"
            :class="selectedCategoryId === cat.id ? cat.colorClass + ' shadow-md scale-105' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm border-slate-100 dark:border-slate-700'"
          >
            <!-- Just render emoji as text since Onboarding uses emojis -->
            <span class="text-lg">{{ cat.icon }}</span>
            <span class="text-sm font-bold">{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- STRESS CARD -->
      <div class="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
        
        <!-- Header -->
        <div class="flex items-center gap-2 mb-6">
            <span class="material-symbols-outlined text-primary">analytics</span>
            <h3 class="text-slate-900 dark:text-white text-lg font-bold leading-tight">{{ t.daily_log.stress_check }}</h3>
        </div>

        <!-- Stress Level Faces (Swipeable) -->
        <div class="mb-8">
            <p class="text-sm font-bold text-slate-600 dark:text-slate-300 mb-4 ml-1 uppercase tracking-wider">{{ t.daily_log.current_stress }}</p>
            
            <div class="relative w-full group -mx-6 px-6">
                <!-- Gradient Fade Masks -->
                <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-slate-800 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-slate-800 to-transparent z-10 pointer-events-none"></div>

                <div 
                    ref="stressContainer"
                    class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar py-8 gap-6 px-[calc(50%-3rem)]"
                    style="scroll-behavior: smooth;"
                    @scroll="handleStressScroll"
                >
                    <button 
                        v-for="level in STRESS_LEVELS" 
                        :key="level.id"
                        :data-id="level.id"
                        @click="scrollToStress(level.id)"
                        class="snap-center shrink-0 flex flex-col items-center justify-center transition-all duration-300 ease-out transform"
                        :class="stressLevelId === level.id ? 'scale-125 opacity-100 z-20' : 'scale-90 opacity-40 grayscale blur-[0.5px] z-10'"
                    >
                        <!-- Glow Effect -->
                         <div v-if="stressLevelId === level.id" class="absolute -inset-4 bg-primary/10 rounded-full blur-xl transition-all duration-500"></div>

                         <div 
                            class="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg transition-all duration-500 mb-3"
                            :class="[
                                stressLevelId === level.id ? 'ring-4 ring-offset-4 ring-offset-white dark:ring-offset-slate-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500',
                                
                                // Custom Colors based on level
                                level.id === 'calm' ? (stressLevelId === level.id ? 'bg-emerald-100 text-emerald-600 ring-emerald-200' : '') : '',
                                level.id === 'happy' ? (stressLevelId === level.id ? 'bg-teal-100 text-teal-600 ring-teal-200' : '') : '',
                                level.id === 'okay' ? (stressLevelId === level.id ? 'bg-primary text-white ring-primary/30 shadow-primary/40' : '') : '',
                                level.id === 'sad' ? (stressLevelId === level.id ? 'bg-orange-100 text-orange-600 ring-orange-200' : '') : '',
                                level.id === 'high' ? (stressLevelId === level.id ? 'bg-rose-100 text-rose-600 ring-rose-200' : '') : '',
                            ]"
                         >
                            <span class="transform transition-transform duration-300" :class="stressLevelId === level.id ? 'scale-110' : ''">{{ level.icon }}</span>
                         </div>
                         <span 
                            class="text-sm font-extrabold tracking-wide uppercase transition-colors duration-300" 
                            :class="stressLevelId === level.id ? 'text-slate-900 dark:text-white' : 'text-transparent'"
                         >
                            {{ level.label || level.id }}
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Confidence Slider -->
        <div class="mb-8">
            <div class="flex justify-between items-end mb-4 px-1">
                <p class="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{{ t.daily_log.confidence }}</p>
                <div class="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                    <span class="text-primary font-bold text-lg leading-none">{{ confidence }}%</span>
                </div>
            </div>
            
            <div class="relative h-6 w-full group cursor-pointer">
                <!-- Glass Track -->
                <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 bg-slate-100 dark:bg-slate-700/50 backdrop-blur-md rounded-full overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
                    <!-- Dynamic Fill Bar -->
                    <div 
                        class="h-full bg-linear-to-r from-blue-400 to-primary transition-all duration-100 ease-out rounded-full shadow-[0_0_10px_rgba(66,153,240,0.5)]"
                        :style="{ width: confidence + '%' }"
                    ></div>
                </div>

                <!-- Input (Invisible but interactive) -->
                <input 
                    type="range" 
                    v-model.number="confidence" 
                    min="0" 
                    max="100" 
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                >

                <!-- Custom Handle (Minimalist) -->
                <div 
                    class="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white shadow-md rounded-full transition-all duration-100 ease-out pointer-events-none z-20"
                    :style="{ left: `calc(${confidence}% - 10px)` }"
                ></div>
            </div>
        </div>

        <!-- Stressors -->
        <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 ml-1">{{ t.daily_log.main_stressors }}</p>
            <div class="flex flex-wrap gap-2">
                <button 
                    v-for="stressor in STRESSORS"
                    :key="stressor.id"
                    @click="toggleStressor(stressor.id)"
                    class="flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 border border-transparent"
                    :class="selectedStressors.includes(stressor.id) ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
                >
                    <span class="material-symbols-outlined text-lg">{{ stressor.icon }}</span>
                    <span class="text-sm font-medium">{{ stressor.label }}</span>
                </button>
            </div>
        </div>
      </div>

      <!-- Period / Cycle Tracker (Female Only) -->
      <div v-if="userStore.gender === 'female'" class="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 transition-all">
          <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-pink-500">water_drop</span>
                  <h3 class="text-slate-900 dark:text-white text-lg font-bold">Cycle Tracker</h3>
              </div>
              <!-- Toggle -->
              <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="isPeriod" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
          </div>
          
          <p class="text-slate-500 text-sm mb-4">Haid hari ini?</p>

          <!-- Symptoms (Conditional) -->
          <div v-if="isPeriod" class="animate-fade-in-down">
              <p class="text-sm font-bold text-slate-600 dark:text-slate-300 mb-3 ml-1 uppercase tracking-wider">Gejala / Symptoms</p>
              <div class="flex flex-wrap gap-2">
                  <button 
                      v-for="sym in PERIOD_SYMPTOMS"
                      :key="sym.id"
                      @click="toggleSymptom(sym.id)"
                      class="flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 border border-transparent"
                      :class="selectedSymptoms.includes(sym.id) ? 'bg-pink-50 text-pink-600 border-pink-200' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
                  >
                      <span class="material-symbols-outlined text-lg">{{ sym.icon }}</span>
                      <span class="text-sm font-medium">{{ sym.label }}</span>
                  </button>
              </div>
          </div>
      </div>

      <!-- Journal Entry -->
      <div class="flex-1 mb-8 relative group">

        <textarea 
            v-model="journalText"
            :placeholder="t.daily_log.journal_ph"
            class="w-full resize-none rounded-[2rem] border-0 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 p-6 text-base font-normal leading-relaxed focus:ring-2 focus:ring-primary/20 shadow-sm min-h-[240px] transition-shadow duration-200 outline-none"
        ></textarea>
        <div class="absolute bottom-6 right-6 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors">
            <PencilSquareIcon class="w-6 h-6" />
        </div>
      </div>

    </main>

    <!-- Footer Save Button -->
    <div class="fixed bottom-0 left-0 w-full z-10 bg-gradient-to-t from-white dark:from-background-dark via-white/95 dark:via-background-dark/95 to-transparent pb-8 pt-10 px-4 pointer-events-none">
        <div class="max-w-md mx-auto pointer-events-auto">
            <button 
                @click="handleSave"
                class="w-full bg-primary hover:bg-purple-600 text-white font-bold text-lg h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:shadow-primary/40"
            >
                <span>{{ t.daily_log.save }}</span>
                <CheckCircleIcon class="w-6 h-6" />
            </button>
        </div>
    </div>

  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
