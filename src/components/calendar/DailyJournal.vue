<script setup>
import { computed } from 'vue'
import { useLocaleStore } from '../../stores/localeStore'
import { useSubjectStore } from '../../stores/subjectStore'
import { storeToRefs } from 'pinia'

const props = defineProps(['date', 'logs'])
const localeStore = useLocaleStore()
const subjectStore = useSubjectStore()
const { t } = storeToRefs(localeStore)

const dayLogs = computed(() => {
    if (!props.logs || !props.date) return []
    const targetDate = new Date(props.date).toDateString()
    return props.logs
        .filter(l => new Date(l.date).toDateString() === targetDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ascending for timeline
})

const summaryLog = computed(() => {
    if (dayLogs.value.length === 0) return null
    // Use the latest log for the "Current State" / Summary
    return dayLogs.value[dayLogs.value.length - 1]
})

const formatDate = (d) => {
    return new Date(d).toLocaleDateString(localeStore.locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

const formatTime = (d) => {
    return new Date(d).toLocaleTimeString(localeStore.locale === 'id' ? 'id-ID' : 'en-US', { hour: 'numeric', minute: '2-digit' })
}

const getMoodStyle = (stressLevel) => {
    const id = stressLevel
    if (id === 'calm') return { emoji: '😌', color: 'text-emerald-500 bg-emerald-100', label: 'Calm' }
    if (id === 'happy') return { emoji: '🙂', color: 'text-teal-500 bg-teal-100', label: 'Good' }
    if (id === 'okay') return { emoji: '😐', color: 'text-blue-500 bg-blue-100', label: 'Okay' }
    if (id === 'sad') return { emoji: '😓', color: 'text-amber-500 bg-amber-100', label: 'Sad' }
    if (id === 'high') return { emoji: '🤯', color: 'text-orange-500 bg-orange-100', label: 'High Stress' }
    
    // Numeric fallback
    const num = Number(id)
    if (num === 1) return { emoji: '😌', color: 'text-emerald-500 bg-emerald-100', label: 'Calm'}
    if (num === 5) return { emoji: '🤯', color: 'text-orange-500 bg-orange-100', label: 'Stress' }
    return { emoji: '😐', color: 'text-blue-500 bg-blue-100', label: 'Okay' }
}

const getSubjectStyle = (subj) => {
    return subjectStore.getSubjectStyle(subj)
}
</script>

<template>
    <div class="px-2">
        <!-- Date Header -->
        <div class="flex flex-col items-center mb-6">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {{ formatDate(props.date) }}
            </h2>
            <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ t.calendar.daily_journal }}</span>
        </div>

        <!-- Empty State -->
        <div v-if="dayLogs.length === 0" class="flex flex-col items-center justify-center py-12 opacity-60">
            <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <span class="material-symbols-outlined text-3xl text-slate-400">edit_off</span>
            </div>
            <p class="text-sm font-bold text-slate-500">{{ t.calendar.empty_day }}</p>
        </div>

        <div v-else>
            <!-- Daily Summary Card (Latest Entry) -->
            <div class="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 mb-8 relative overflow-hidden">
                <div class="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{{ t.calendar.latest_update }}</p>
                        <h3 class="text-2xl font-bold text-slate-900 dark:text-white leading-tight capitalize">
                            {{ summaryLog.subject || 'General' }} Check-in
                        </h3>
                    </div>
                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner"
                        :class="getMoodStyle(summaryLog.stressLevel).color.replace('text-', 'bg-opacity-20 text-')"
                    >
                        {{ getMoodStyle(summaryLog.stressLevel).emoji }}
                    </div>
                </div>
                
                <!-- Journal Text -->
                <div class="relative z-10 bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-4 mb-3">
                    <p v-if="summaryLog.note" class="text-slate-600 dark:text-slate-300 text-sm font-medium italic">
                        "{{ summaryLog.note }}"
                    </p>
                    <p v-else class="text-slate-400 dark:text-slate-500 text-xs italic">{{ t.calendar.no_note }}</p>
                </div>

                <!-- Tags -->
                <div class="flex gap-2 relative z-10">
                    <span v-if="summaryLog.subject" class="px-3 py-1.5 rounded-full text-xs font-bold capitalize"
                        :class="getSubjectStyle(summaryLog.subject).color.replace('bg-', 'bg-opacity-20 bg-')">
                        #{{ summaryLog.subject }}
                    </span>
                    <span class="px-3 py-1.5 rounded-full text-xs font-bold capitalize"
                        :class="getMoodStyle(summaryLog.stressLevel).color"
                    >
                        #{{ getMoodStyle(summaryLog.stressLevel).label }}
                    </span>
                </div>

                <!-- Decorative BG -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <!-- TIMELINE -->
            <div class="px-2">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6 pl-2">{{ t.calendar.journal_timeline }}</h3>
                
                <div class="grid grid-cols-[48px_1fr] gap-x-0">
                    
                    <template v-for="(log, index) in dayLogs" :key="log.id">
                        <!-- Left Column: Icon & Line -->
                        <div class="flex flex-col items-center pt-2 relative">
                            <!-- Icon -->
                            <div class="w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-white dark:border-slate-900"
                                :class="getMoodStyle(log.stressLevel).color"
                            >
                                <span class="text-lg">{{ getMoodStyle(log.stressLevel).emoji }}</span>
                            </div>
                            <!-- Line (Full height for intermediate, fade out for last) -->
                            <div v-if="index !== dayLogs.length - 1" class="w-0.5 bg-slate-200 dark:bg-slate-800 h-full absolute top-10 bottom-0 left-1/2 -translate-x-1/2"></div>
                             <!-- Small tail for last item -->
                             <div v-else class="w-0.5 bg-slate-200 dark:bg-slate-800 h-6 absolute top-10 left-1/2 -translate-x-1/2"></div>
                        </div>

                        <!-- Right Column: Content Card -->
                        <div class="pb-8 pl-4">
                            <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700/50">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-primary font-bold text-xs">{{ formatTime(log.date) }}</span>
                                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ log.subject || 'General' }}</span>
                                </div>
                                <p class="text-slate-900 dark:text-white font-bold text-sm mb-1 capitalize">
                                    Feels {{ getMoodStyle(log.stressLevel).label }}
                                </p>
                                <p v-if="log.note" class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                                    {{ log.note }}
                                </p>
                            </div>
                        </div>
                    </template>

                </div>
            </div>
        </div>
    </div>
</template>
