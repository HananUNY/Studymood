import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useMoodStore = defineStore('mood', () => {
    const logs = ref([])
    const weeklyLogs = ref([])

    // Init
    console.log('MoodStore Init - Loading Data...')
    const storedLogs = localStorage.getItem('sm_logs')
    const storedWeekly = localStorage.getItem('sm_weekly_logs')

    // Load Daily Logs
    // Load Daily Logs
    if (storedLogs) {
        try {
            const parsed = JSON.parse(storedLogs)
            logs.value = (Array.isArray(parsed) ? parsed : []).filter(l => l && typeof l === 'object')
        } catch (e) { console.error(e); logs.value = [] }
    } else {
        const legacy = localStorage.getItem('studyMood_logs')
        if (legacy) {
            try {
                const parsed = JSON.parse(legacy)
                logs.value = (Array.isArray(parsed) ? parsed : []).filter(l => l && typeof l === 'object')
            } catch (e) { logs.value = [] }
        }
    }

    // Load Weekly Logs
    if (storedWeekly) {
        try {
            const parsed = JSON.parse(storedWeekly)
            weeklyLogs.value = (Array.isArray(parsed) ? parsed : []).filter(l => l && typeof l === 'object')
        } catch (e) { console.error(e); weeklyLogs.value = [] }
    } else {
        const legacyWeekly = localStorage.getItem('studyMood_weekly_logs')
        if (legacyWeekly) {
            try {
                const parsed = JSON.parse(legacyWeekly)
                weeklyLogs.value = (Array.isArray(parsed) ? parsed : []).filter(l => l && typeof l === 'object')
            } catch (e) { weeklyLogs.value = [] }
        }
    }

    // Persist Daily
    watch(logs, (newLogs) => {
        localStorage.setItem('sm_logs', JSON.stringify(newLogs))
    }, { deep: true })

    // Persist Weekly
    watch(weeklyLogs, (newVal) => {
        localStorage.setItem('sm_weekly_logs', JSON.stringify(newVal))
    }, { deep: true })

    // Actions
    function addLog(logData) {
        // ... (existing addLog logic)
        const newLog = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            ...logData
        }
        logs.value.unshift(newLog)
    }

    function addWeeklyLog(logData) {
        const newLog = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            ...logData
        }
        weeklyLogs.value.push(newLog)
    }

    // Getters
    const todayLog = computed(() => {
        if (logs.value.length === 0) return null
        const latest = logs.value[0]
        const logDate = new Date(latest.date || latest.timestamp).toDateString()
        const today = new Date().toDateString()
        return logDate === today ? latest : null
    })

    const streak = computed(() => {
        // Simple streak: Count distinct days logged
        if (logs.value.length === 0) return 0
        const distinctDays = new Set(logs.value.map(l => new Date(l.date || l.timestamp).toDateString()))
        return distinctDays.size
    })

    const weeklyStats = computed(() => {
        // Placeholder to prevent ReferenceError
        return []
    })

    // Helper for Week Number
    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    }

    const hasLoggedThisWeek = computed(() => {
        const now = new Date()
        const currentWeek = getWeekNumber(now)
        const currentYear = now.getFullYear()

        return weeklyLogs.value.some(log => {
            const d = new Date(log.date)
            return d.getFullYear() === currentYear && getWeekNumber(d) === currentWeek
        })
    })

    return {
        logs,
        weeklyLogs,
        addLog,
        addWeeklyLog,
        weeklyStats,
        streak,
        todayLog,
        hasLoggedThisWeek
    }
})
