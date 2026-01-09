<script setup>
import { computed, ref } from 'vue'
import { useLocaleStore } from '../../stores/localeStore'
import { useSubjectStore } from '../../stores/subjectStore'
import { storeToRefs } from 'pinia'

const props = defineProps(['logs', 'plans', 'currentDate'])
const emit = defineEmits(['selectDate'])
const localeStore = useLocaleStore()
const subjectStore = useSubjectStore()
const { t } = storeToRefs(localeStore)

// Helper: Get Start of Week (Monday)
const getStartOfWeek = (d) => {
    const date = new Date(d)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    return new Date(date.setDate(diff))
}

const currentWeekStart = computed(() => getStartOfWeek(new Date())) // Stick to current week for demo? Or based on props.currentDate?
// Let's stick to "Current Week" for now as per design

const weekDays = computed(() => {
    const start = currentWeekStart.value
    const days = []
    for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        days.push(d)
    }
    return days
})

const isToday = (d) => {
    return new Date().toDateString() === d.toDateString()
}

const isSameDay = (d1, d2) => {
    return new Date(d1).toDateString() === new Date(d2).toDateString()
}

// Helpers for Data Mapping
const getDayMood = (date) => {
    if (!props.logs) return null
    const dateStr = date.toDateString()
    // Find latest log for this day
    const dayLogs = props.logs.filter(l => new Date(l.date).toDateString() === dateStr)
    if (dayLogs.length === 0) return null
    // Return most significant or latest? Latest.
    return dayLogs[0] // logs are sorted newest first in parent usually, or we sort here
}

const getDayPlans = (date) => {
    if (!props.plans) return []
    const dateStr = date.toDateString()
    return props.plans.filter(p => {
        // Handle "Today" logic in plan.date or actual ISO string
        if (!p.date || p.date === 'Today') {
             // If plan.date is literal "Today" (legacy), map to actual today
             if (isToday(date)) return true
             return false
        }
        return new Date(p.date).toDateString() === dateStr
    }).sort((a,b) => (a.startTime || '').localeCompare(b.startTime || ''))
}

const getSubjectBg = (subj) => {
    const style = subjectStore.getSubjectStyle(subj)
    // We want a solid background color class for the bar. 
    // Store usually gives 'bg-blue-100 text-blue-800'.
    // We can extract 'bg-blue-100' -> upgrade to 'bg-blue-400' for visibility?
    // WeeklySchedule uses `bg-orange-400` etc in original.
    // Let's try to map 'bg-X-100' to 'bg-X-400'.
    const base = style.bgClass || 'bg-slate-100'
    return base.replace('100', '400')
}

const getMoodStyle = (moodLabel) => {
    // Map from mood label or known keys
    const m = moodLabel ? moodLabel.toLowerCase() : ''
    if (m.includes('good') || m.includes('happy')) return { emoji: '😊', bg: 'bg-green-100 text-green-600 border-green-200' }
    if (m.includes('stress') || m.includes('high')) return { emoji: '🤯', bg: 'bg-orange-100 text-orange-600 border-orange-200' }
    if (m.includes('sad')) return { emoji: '😓', bg: 'bg-blue-100 text-blue-600 border-blue-200' }
    if (m.includes('energetic')) return { emoji: '🤩', bg: 'bg-yellow-100 text-yellow-600 border-yellow-200' }
    return { emoji: '😐', bg: 'bg-slate-100 text-slate-600 border-slate-200' }
}

</script>

<template>
    <div class="flex flex-col h-full bg-transparent">
        
        <!-- Sticky Header: Week Strip -->
        <div class="sticky top-0 z-10 bg-white dark:bg-background-dark border-b border-slate-100 dark:border-slate-800 transition-all">
            <!-- Month Nav (Static for now) -->
            <div class="flex items-center justify-between px-4 py-3">
                <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                    <span class="material-symbols-outlined">chevron_left</span>
                </button>
                <h2 class="text-base font-bold text-slate-900 dark:text-white capitalize">
                    {{ weekDays[0].toLocaleDateString(localeStore.locale === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' }) }}
                </h2>
                <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                    <span class="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            <!-- Days Grid -->
            <div class="grid grid-cols-7 gap-1 px-2 pb-4">
                <div v-for="day in weekDays" :key="day" 
                    @click="$emit('selectDate', day)"
                    class="flex flex-col items-center gap-1 cursor-pointer group"
                >
                    <span class="text-[10px] font-bold uppercase tracking-wider" 
                        :class="isToday(day) ? 'text-primary' : 'text-slate-400'">
                        {{ day.toLocaleDateString(localeStore.locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'narrow' }) }}
                    </span>
                    
                    <div class="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all"
                        :class="isToday(day) 
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                            : 'text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800'"
                    >
                        {{ day.getDate() }}
                    </div>

                    <!-- Dot (Status) -->
                    <div v-if="getDayMood(day)" class="w-1.5 h-1.5 rounded-full mt-0.5" 
                        :class="getMoodStyle(getDayMood(day).moodLabel).bg.split(' ')[0].replace('bg-', 'bg-').replace('100', '400')">
                    </div>
                    <div v-else class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 mt-0.5"></div>
                </div>
            </div>
        </div>

        <!-- Main Scrollable List -->
        <div class="p-4 flex flex-col gap-4 pb-32">
            
            <template v-for="day in weekDays" :key="day.toISOString()">
                <!-- Day Card -->
                <article class="relative flex flex-col gap-3 rounded-[1.5rem] bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-all"
                    :class="[
                        isToday(day) ? 'ring-2 ring-primary/50 shadow-md transform scale-[1.01] z-10' : 'opacity-90 grayscale-[0.2]',
                        day > new Date() ? 'opacity-60' : ''
                    ]"
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-0.5">
                                {{ day.toLocaleDateString(localeStore.locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' }) }} 
                            </h3>
                            <p v-if="getDayMood(day)" class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {{ getDayMood(day).subjectLabel ? t.calendar.focused_on.replace('{subject}', getDayMood(day).subjectLabel) : t.calendar.checkin_logged }}
                            </p>
                            <p v-else class="text-xs text-slate-400 font-medium italic">{{ t.calendar.no_log }}</p>
                        </div>
                        
                        <!-- Mood Icon -->
                        <div v-if="getDayMood(day)" class="w-10 h-10 rounded-full flex items-center justify-center text-xl border transition-colors"
                            :class="getMoodStyle(getDayMood(day).moodLabel).bg"
                        >
                            {{ getMoodStyle(getDayMood(day).moodLabel).emoji }}
                        </div>
                        <div v-else class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-xl flex items-center justify-center grayscale opacity-50">
                            ☁️
                        </div>
                    </div>

                    <!-- Mood Trend Graph (Only for Today or Active days) -->
                    <div v-if="getDayMood(day)" class="h-12 w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center px-4 relative overflow-hidden mt-1">
                         <div class="absolute inset-0 opacity-10" :class="getMoodStyle(getDayMood(day).moodLabel).bg.split(' ')[0]"></div>
                         <span class="text-[10px] font-bold text-slate-400 z-10 uppercase tracking-widest">{{ t.calendar.daily_vibe }}</span>
                         <!-- Fake Wave -->
                         <svg class="absolute bottom-0 right-0 h-full w-2/3 text-current opacity-10" viewBox="0 0 100 40" preserveAspectRatio="none"
                            :class="getMoodStyle(getDayMood(day).moodLabel).bg.split(' ')[1]"
                         >
                            <path d="M0 40 C 30 0 70 0 100 40 L 100 40 L 0 40" fill="currentColor" />
                         </svg>
                    </div>

                    <!-- Sessions List -->
                    <div class="flex flex-col gap-2 mt-1">
                        <div v-for="plan in getDayPlans(day)" :key="plan.id" class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800">
                            <div class="w-1 h-8 rounded-full" :class="getSubjectBg(plan.subject)"></div>
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-center mb-0.5">
                                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300">
                                        {{ plan.subject }}
                                    </span>
                                    <span class="text-[10px] text-slate-400 font-bold">{{ plan.startTime }}</span>
                                </div>
                                <p class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ plan.title }}</p>
                            </div>
                            <div v-if="plan.completed" class="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <span class="material-symbols-outlined text-xs">check</span>
                            </div>
                        </div>

                        <!-- Empty State for Sessions -->
                        <div v-if="getDayPlans(day).length === 0" class="py-2 text-center">
                            <p class="text-[10px] text-slate-400 font-medium">{{ t.calendar.no_sessions }}</p>
                        </div>
                    </div>

                </article>
            </template>
        </div>

    </div>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
