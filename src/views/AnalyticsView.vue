<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMoodStore } from '../stores/moodStore'
import { useLocaleStore } from '../stores/localeStore'
import MoodTrendChart from '../components/analytics/MoodTrendChart.vue'
import MoodDistributionChart from '../components/analytics/MoodDistributionChart.vue'
import ConfidenceTrendChart from '../components/analytics/ConfidenceTrendChart.vue'
import StressSourcesChart from '../components/analytics/StressSourcesChart.vue'


const moodStore = useMoodStore()
const { logs, weeklyLogs } = storeToRefs(moodStore)



const localeStore = useLocaleStore()
const { t } = storeToRefs(localeStore)

// --- Computed Stats ---

const totalCheckins = computed(() => logs.value.length)

const averageMoodScore = computed(() => {
    if (logs.value.length === 0) return 0
    // Convert stress levels to mood score (100=Best, 20=Worst)
    const sum = logs.value.reduce((acc, log) => {
        const id = log.stressLevel
        let score = 60 // Default Okay
        
        if (id === 'calm') score = 100
        else if (id === 'happy') score = 80
        else if (id === 'okay') score = 60
        else if (id === 'sad') score = 40
        else if (id === 'high') score = 20
        
        return acc + score
    }, 0)
    return Math.round(sum / logs.value.length)
})

const moodStatus = computed(() => {
    const score = averageMoodScore.value
    if (score >= 90) return { label: 'Excellent', emoji: '😌', color: 'text-emerald-500' }
    if (score >= 70) return { label: 'Good', emoji: '🙂', color: 'text-teal-500' }
    if (score >= 50) return { label: 'Okay', emoji: '😐', color: 'text-blue-500' }
    if (score >= 30) return { label: 'Stressed', emoji: '😓', color: 'text-orange-500' }
    return { label: 'High Stress', emoji: '🤯', color: 'text-rose-500' }
})

const weeklyStress = computed(() => {
    if (weeklyLogs.value.length === 0) return null
    return weeklyLogs.value[weeklyLogs.value.length - 1]
})

// --- Report Selection & Analysis ---
const selectedReport = ref(null)

const timeRange = ref('daily')

const reportAnalysis = computed(() => {
    if (!selectedReport.value) return { topStressors: [], highRiskAnswers: [], primaryIssue: 'General Stress' }

    const reportDate = new Date(selectedReport.value.date)
    const weekAgo = new Date(reportDate.getTime() - 7 * 24 * 60 * 60 * 1000)

    // 1. Correlate with Daily Logs (find logs in the 7 days prior to report)
    const recentDailyLogs = logs.value.filter(log => {
        const d = new Date(log.date)
        return d <= reportDate && d >= weekAgo
    })

    // Aggregate Stressors
    const stressorCounts = {}
    recentDailyLogs.forEach(log => {
        if (log.stressors) {
            log.stressors.forEach(s => stressorCounts[s] = (stressorCounts[s] || 0) + 1)
        }
    })
    const topStressors = Object.entries(stressorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([k]) => k)

    // 2. Analyze Survey Answers (find high ratings > 2)
    const QUESTION_MAP_EN = {
        1: "Worry about exams/grades",
        2: "Overwhelmed by homework",
        3: "Trouble sleeping",
        4: "Pressure from parents",
        5: "No time to relax",
        6: "Nervous speaking in class",
        7: "Balancing extracurriculars",
        8: "Hard to focus",
        9: "Comparing grades",
        10: "Physical exhaustion"
    }

    const QUESTION_MAP_ID = {
        1: "Khawatir ujian/nilai",
        2: "Kewalahan dengan PR",
        3: "Sulit tidur",
        4: "Tekanan orang tua",
        5: "Tidak ada waktu santai",
        6: "Gugup berbicara di kelas",
        7: "Menyeimbangkan ekstrakurikuler",
        8: "Sulit fokus",
        9: "Membandingkan nilai",
        10: "Kelelahan fisik"
    }

    const map = localeStore.locale === 'id' ? QUESTION_MAP_ID : QUESTION_MAP_EN

    const highRiskAnswers = []
    if (selectedReport.value && selectedReport.value.answers) {
        Object.entries(selectedReport.value.answers).forEach(([qId, rating]) => {
            if (rating >= 3) {
                highRiskAnswers.push({
                    question: map[qId] || "Unknown Factor",
                    rating
                })
            }
        })
    }

    // Sort by rating desc
    highRiskAnswers.sort((a, b) => b.rating - a.rating)

    // 3. Dynamic Suggestions
    const SUGGESTION_MAP_ID = {
        "Khawatir ujian/nilai": "Cobalah teknik 'Spaced Repetition' untuk belajar sedikit demi sedikit namun rutin. Jangan lupa istirahat agar otak tidak overload.",
        "Kewalahan dengan PR": "Pecah tugas besar menjadi bagian-bagian kecil (Chunking). Kerjakan satu per satu dengan fokus penuh selama 25 menit (Pomodoro).",
        "Sulit tidur": "Hindari layar gadget 1 jam sebelum tidur. Coba latihan pernapasan 4-7-8 untuk menenangkan sistem sarafmu.",
        "Tekanan orang tua": "Komunikasikan perasaanmu dengan jujur namun sopan. Fokus pada progres usaha belajarmu, bukan hanya hasil akhir.",
        "Tidak ada waktu santai": "Waktu santai itu produktif! Jadwalkan 'Guilt-Free Play' selama 30 menit sehari untuk recharge energi mentalmu.",
        "Gugup berbicara di kelas": "Latih bicaramu di depan cermin atau teman dekat dulu. Ingat, kesalahan itu wajar dan bagian dari proses belajar.",
        "Menyeimbangkan ekstrakurikuler": "Buat skala prioritas mingguan. Berani bilang 'tidak' jika jadwalmu sudah terlalu padat demi kesehatan mentalmu.",
        "Sulit fokus": "Singkirkan HP saat belajar (taruh di ruangan lain). Gunakan white noise atau musik instrumental untuk membantu konsentrasi.",
        "Membandingkan nilai": "Setiap orang punya timeline suksesnya sendiri. Bandingkan dirimu hari ini dengan dirimu kemarin, bukan dengan orang lain.",
        "Kelelahan fisik": "Tubuhmu butuh istirahat untuk memproses informasi. Prioritaskan tidur 7-8 jam dan minum air putih yang cukup.",
        "Burnout": "Kamu butuh detoks singkat. Lakukan hal yang sama sekali tidak berhubungan dengan pelajaran (seperti jalan-jalan atau melukis) selama akhir pekan.",
        "High Stress": "Tarik napas dalam-dalam. Fokus pada hal yang bisa kamu kontrol saat ini. Jangan ragu curhat ke teman atau konselor sekolah.",
        "Moderate": "Kamu sedang mengalami tekanan sedang. Coba evaluasi jadwalmu dan luangkan waktu untuk hobi ringan agar stres tidak menumpuk.",
        "Low": "Kerja bagus menjaga keseimbangan! Pertahankan kebiasaan baikmu ini dan tetap waspada terhadap potensi pemicu stres baru.",
        "General Stress": "Pastikan kamu punya keseimbangan antara belajar dan istirahat. Jangan lupa untuk tetap terhidrasi dan makan teratur."
    }

    const SUGGESTION_MAP_EN = {
        "Worry about exams/grades": "Try 'Spaced Repetition' to study small chunks consistently. Don't forget to rest so your brain doesn't overload.",
        "Overwhelmed by homework": "Break big tasks into smaller chunks. Do them one by one with full focus for 25 minutes (Pomodoro).",
        "Trouble sleeping": "Avoid screens 1 hour before bed. Try 4-7-8 breathing exercises to calm your nervous system.",
        "Pressure from parents": "Communicate your feelings honestly. Focus on your progress and effort, not just the final result.",
        "No time to relax": "Relaxing is productive! Schedule 30 minutes of 'Guilt-Free Play' daily to recharge your mental energy.",
        "Nervous speaking in class": "Practice in front of a mirror or close friends first. Remember, mistakes are part of learning.",
        "Balancing extracurriculars": "Create a weekly priority list. It's okay to say 'no' if your schedule is too full.",
        "Hard to focus": "Put your phone in another room. Use white noise or instrumental music to aid concentration.",
        "Comparing grades": "Everyone has their own timeline. Compare yourself to who you were yesterday, not to others.",
        "Physical exhaustion": "Your body needs rest to process info. Prioritize 7-8 hours of sleep and drink enough water.",
        "Burnout": "You need a detox. Do something completely unrelated to school (like walking or painting) this weekend.",
        "High Stress": "Deep breaths. Focus on what you can control right now. Don't hesitate to talk to a friend or counselor.",
        "Moderate": "You're under moderate pressure. Evaluate your schedule and make time for light hobbies so stress doesn't build up.",
        "Low": "Great job maintaining balance! Keep up these good habits and stay aware of any new potential stressors.",
        "General Stress": "Ensure you balance study and rest. Stay hydrated and eat regularly."
    }

    const adviceMap = localeStore.locale === 'id' ? SUGGESTION_MAP_ID : SUGGESTION_MAP_EN
    
    // Enrich High Risk Answers with Advice
    const enrichedRisks = highRiskAnswers.map(item => ({
        ...item,
        advice: adviceMap[item.question] || adviceMap['General Stress']
    }))

    // Determine Classification Advice (Fallback or Additional)
    let generalAdvice = adviceMap['General Stress']
    if (selectedReport.value && selectedReport.value.classification) {
        generalAdvice = adviceMap[selectedReport.value.classification] || generalAdvice
    }

    return {
        topStressors,
        highRiskAnswers: enrichedRisks.slice(0, 3), 
        generalAdvice: generalAdvice
    }
})

// --- Modal States ---
const showReportDetail = ref(false)

const showHistoryModal = ref(false)
const historySubject = ref(null)
const historyType = ref('general')

const subjectHistoryLogs = computed(() => {
    if (!historySubject.value) return []
    // Filter logs for this subject
    return logs.value
        .filter(l => {
            const sName = l.subjectId || l.subject || 'general'
            return sName === historySubject.value.name
        })
        .map(l => {
            // Calculate Logic for Label/Emoji if missing
            let label = 'Neutral'
            let emoji = '😐'
            
            const id = l.stressLevel || 'okay'
            if (id === 'calm' || l.mood === 5) { label = 'Calm'; emoji = '😌' }
            else if (id === 'happy' || l.mood === 4) { label = 'Happy'; emoji = '🙂' }
            else if (id === 'okay' || l.mood === 3) { label = 'Okay'; emoji = '😐' }
            else if (id === 'sad' || l.mood === 2) { label = 'Sad'; emoji = '😓' }
            else if (id === 'high' || l.mood === 1) { label = 'High Stress'; emoji = '🤯' }

            return {
                ...l,
                moodLabel: label,
                emoji: emoji
            }
        })
        .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
})

const masteryChartData = computed(() => {
    // Take last 7 sessions for the bar chart to keep it clean, or all if less
    const logs = [...subjectHistoryLogs.value].reverse().slice(-7)
    
    if (logs.length === 0) return []

    return logs.map((log) => {
        const val = log.confidence !== undefined ? log.confidence : 50
        
        let colorClass = 'bg-slate-300 dark:bg-slate-600'
        if (val >= 80) colorClass = 'bg-gradient-to-t from-emerald-500 to-emerald-300 shadow-emerald-500/20 shadow-lg'
        else if (val >= 50) colorClass = 'bg-gradient-to-t from-blue-500 to-blue-300 shadow-blue-500/20 shadow-lg'
        else if (val >= 30) colorClass = 'bg-gradient-to-t from-orange-500 to-orange-300 shadow-orange-500/20 shadow-lg'
        else colorClass = 'bg-gradient-to-t from-rose-500 to-rose-300 shadow-rose-500/20 shadow-lg'

        return {
            height: `${val}%`,
            label: new Date(log.timestamp || log.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
            fullDate: new Date(log.timestamp || log.date).toLocaleDateString(),
            value: val,
            colorClass
        }
    })
})

const openSubjectHistory = (subject, type) => {
    historySubject.value = subject
    historyType.value = type
    showHistoryModal.value = true
}

const openReportDetail = (report) => {
    selectedReport.value = report
    showReportDetail.value = true
}

const closeReportDetail = () => {
    showReportDetail.value = false
    setTimeout(() => selectedReport.value = null, 300)
}

// --- Golden Hour Analysis ---
const goldenHour = computed(() => {
    if (logs.value.length === 0) return null

    const groups = {}

    logs.value.forEach(log => {
        if (!log.subject) return
        
        const date = new Date(log.date || log.timestamp)
        const hour = date.getHours()
        const key = `${log.subject}-${hour}`

        if (!groups[key]) {
            groups[key] = { 
                subject: log.subject, 
                hour: hour, 
                totalScore: 0, 
                count: 0 
            }
        }

        // Score based on Mood + Energy (Max 10)
        // If energy allows null, fallback to mood
        const mood = Number(log.mood) || 3
        const energy = Number(log.energy) || mood
        
        groups[key].totalScore += (mood + energy)
        groups[key].count++
    })

    // Filter and Find Best
    let best = null
    let maxAvg = -1

    Object.values(groups).forEach(group => {
        // Minimum 2 logs to be considered a "pattern" (unless very few logs total)
        if (logs.value.length > 5 && group.count < 2) return

        const avg = group.totalScore / group.count
        if (avg > maxAvg) {
            maxAvg = avg
            best = group
        }
    })

    if (!best) return null

    // Format time
    const timeStr = `${String(best.hour).padStart(2, '0')}.00`
    
    // Determine time of day text
    let period = 'pagi'
    if (best.hour >= 11 && best.hour < 15) period = 'siang'
    else if (best.hour >= 15 && best.hour < 19) period = 'sore'
    else if (best.hour >= 19) period = 'malam'

    return {
        subject: best.subject, // ID
        time: timeStr,
        period: period,
        score: maxAvg
    }
})

// --- Subject Analysis ---
const subjectStats = computed(() => {
    if (logs.value.length === 0) return { mostFrequent: null, calm: [], stressful: [] }

    const stats = {}

    logs.value.forEach(log => {
        const id = log.subjectId || log.subject || 'general'
        if (!stats[id]) {
            stats[id] = { name: id, count: 0, totalScore: 0 }
        }
        stats[id].count++
        
        // Calculate Score
        let score = 60
        const stressId = log.stressLevel
        if (stressId === 'calm') score = 100
        else if (stressId === 'happy') score = 80
        else if (stressId === 'okay') score = 60
        else if (stressId === 'sad') score = 40
        else if (stressId === 'high') score = 20
        else {
             const num = Number(stressId)
             if (num === 1) score = 100
             if (num === 5) score = 20
        }
        stats[id].totalScore += score
    })

    const subjects = Object.values(stats).map(s => ({
        ...s,
        avgScore: Math.round(s.totalScore / s.count)
    }))

    subjects.sort((a, b) => b.count - a.count)
    const mostFrequent = subjects[0]

    // Calm: Avg Score >= 80
    const calm = subjects.filter(s => s.avgScore >= 70).sort((a, b) => b.avgScore - a.avgScore)
    
    // Stressful: Avg Score <= 40
    const stressful = subjects.filter(s => s.avgScore <= 50).sort((a, b) => a.avgScore - b.avgScore)

    return { mostFrequent, calm, stressful }
})

// --- Flow / Productivity Score ---
const flowScore = computed(() => {
    if (logs.value.length === 0) return 0
    
    // Weighted Average of Confidence (Skill) vs Stress (Challenge)
    // Formula: (Confidence * MoodFactor)
    // MoodFactor: Calm=1.0, Happy=1.0, Okay=0.8, Sad=0.5, High=0.4
    
    const totalScore = logs.value.reduce((acc, log) => {
        let moodFactor = 0.8
        const s = log.stressLevel
        if (s === 'calm' || s === 'happy') moodFactor = 1.0
        else if (s === 'sad') moodFactor = 0.5
        else if (s === 'high') moodFactor = 0.4
        
        return acc + ((log.confidence || 50) * moodFactor)
    }, 0)

    return Math.round(totalScore / logs.value.length)
})

const flowStateStatus = computed(() => {
    const s = flowScore.value
    if (s >= 80) return { label: 'Optimal Flow', color: 'text-emerald-500', desc: 'Peak performance state!' }
    if (s >= 60) return { label: 'In the Zone', color: 'text-blue-500', desc: 'Good balance of skill & challenge.' }
    if (s >= 40) return { label: 'Distracted', color: 'text-orange-500', desc: 'Try to minimize interruptions.' }
    return { label: 'Struggling', color: 'text-rose-500', desc: 'Take a break and reset.' }
})

// --- Cycle Analytics (Female Only) ---
const cycleAnalysis = computed(() => {
    // 1. Separate logs
    const periodLogs = logs.value.filter(l => l.isPeriod)
    const normalLogs = logs.value.filter(l => !l.isPeriod)

    if (periodLogs.length === 0) return null

    // 2. Helper to calc average Flow Score
    const calcFlow = (list) => {
        if (list.length === 0) return 0
        const total = list.reduce((acc, log) => {
            let moodFactor = 0.8
            const s = log.stressLevel
            if (s === 'calm' || s === 'happy') moodFactor = 1.0
            else if (s === 'sad') moodFactor = 0.6 // Slightly more forgiving in general?
            else if (s === 'high') moodFactor = 0.4
            return acc + ((log.confidence || 50) * moodFactor)
        }, 0)
        return Math.round(total / list.length)
    }

    const periodScore = calcFlow(periodLogs)
    const normalScore = calcFlow(normalLogs)
    const diff = periodScore - normalScore

    let insight = ''
    if (diff > -5 && diff < 5) insight = "Your flow is consistent regardless of your cycle."
    else if (diff <= -5) insight = "You tend to have lower energy during your period. Take it easy."
    else if (diff >= 5) insight = "Surprisingly, you focus better during your period!"

    return {
        periodScore,
        normalScore,
        diff,
        insight,
        count: periodLogs.length
    }
})



</script>

<template>
  <div class="flex flex-col min-h-screen font-display px-1 pb-24">
    
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6 pt-2">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white leading-tight">{{ t.analytics.title }}</h1>
        <p class="text-xs font-semibold text-slate-400">{{ t.analytics.subtitle }}</p>
      </div>
      <RouterLink to="/ai-analysis" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
        <span class="material-symbols-outlined text-slate-500 dark:text-slate-400">insights</span>
      </RouterLink>
    </div>

    <!-- MAIN CHART CARD -->
    <div class="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div class="flex justify-between items-start mb-6 relative z-10">
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{{ t.analytics.avg_mood }}</p>
                <div class="flex items-center gap-2">
                    <span class="text-4xl">{{ moodStatus.emoji }}</span>
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ moodStatus.label }}</h3>
                        <p class="text-xs font-bold" :class="moodStatus.color">{{ averageMoodScore }}% positive</p>
                    </div>
                </div>
            </div>
            
            <select v-model="timeRange" class="bg-slate-50 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-gray-300 py-1.5 px-3 rounded-lg border-none outline-none cursor-pointer">
                <option value="daily">7 Days</option>
                <option value="hourly">Today (Hourly)</option>
            </select>
        </div>

        <!-- Chart Container -->
        <div class="h-48 w-full relative z-10">
            <MoodTrendChart v-if="logs.length > 0" :logs="logs" :timeRange="timeRange" />
            
            <!-- Empty State -->
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-400 opacity-60 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <span class="material-symbols-outlined text-3xl mb-1">show_chart</span>
                <p class="text-xs font-bold">{{ t.analytics.no_data }}</p>
            </div>
        </div>
    </div>

    <!-- GOLDEN HOUR CARD -->
    <div v-if="goldenHour" class="bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 rounded-[2rem] p-6 shadow-sm border border-amber-200/50 dark:border-amber-700/30 mb-6 relative overflow-hidden">
        <div class="absolute right-0 top-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div class="flex items-start gap-3 relative z-10">
            <div class="w-10 h-10 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-200 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined">wb_sunny</span>
            </div>
            <div>
                <p class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Golden Hour</p>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {{ t.analytics.golden_hour_prefix || "Kamu paling fokus saat belajar" }} 
                    <span class="text-amber-600 dark:text-amber-400 capitalize">{{ goldenHour.subject }}</span> 
                    {{ t.analytics.golden_hour_at || "di jam" }} 
                    <span class="text-slate-900 dark:text-white">{{ goldenHour.time }}</span> 
                    {{ goldenHour.period }}.
                </h3>
            </div>
        </div>
    </div>

    <!-- STATS GRID -->
    <div class="grid grid-cols-2 gap-4 mb-6">
        <!-- Total Logs -->
        <div class="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-32">
             <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <span class="material-symbols-outlined text-lg">edit_note</span>
             </div>
             <div>
                 <h4 class="text-2xl font-bold text-slate-900 dark:text-white">{{ totalCheckins }}</h4>
                 <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Daily entries</p>
             </div>
        </div>

        <!-- Weekly Assessment Score -->
        <div class="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-32 relative overflow-hidden group">
             <div class="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/10 opacity-50"></div>
             
             <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2 relative z-10">
                <span class="material-symbols-outlined text-lg">psychology</span>
             </div>
             
             <div class="relative z-10">
                 <div v-if="weeklyStress">
                    <h4 class="text-xl font-bold text-slate-900 dark:text-white">{{ weeklyStress.classification }}</h4>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{{ t.analytics.most_recent_stress }}</p>
                 </div>
                  <div v-else>
                      <h4 class="text-sm font-bold text-slate-500 dark:text-slate-400">{{ t.analytics.no_assessment }}</h4>
                     <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{{ t.analytics.log_week }}</p>
                 </div>
             </div>
        </div>
    </div>

    <!-- STRESS SOURCES -->
    <div class="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
        <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-rose-500">warning</span>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ t.analytics.top_stressors }}</h3>
        </div>
        <div class="h-48">
            <StressSourcesChart :logs="logs" />
        </div>
    </div>

    <!-- MOOD DISTRIBUTION -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4">Mood Distribution</h3>
            <MoodDistributionChart :logs="logs" />
        </div>

        <!-- FLOW SCORE & CONFIDENCE -->
        <div class="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
            <div class="flex justify-between items-start mb-4">
                 <div>
                    <h3 class="text-lg font-bold text-slate-800 dark:text-white">Flow Score</h3>
                    <p class="text-xs text-slate-400">Productivity Potential</p>
                 </div>
                 <div class="text-right">
                     <span class="text-3xl font-bold" :class="flowStateStatus.color">{{ flowScore }}</span>
                     <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">out of 100</p>
                 </div>
            </div>
            
            <div class="mb-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3">
                <p class="text-sm font-bold" :class="flowStateStatus.color">{{ flowStateStatus.label }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ flowStateStatus.desc }}</p>
            </div>

            <h4 class="text-sm font-bold text-slate-800 dark:text-white mb-2">Confidence Trend</h4>
            <div class="flex-1 min-h-[100px]">
                <ConfidenceTrendChart :logs="logs" />
            </div>
        </div>
    </div>


    <!-- CYCLE IMPACT (Female Only) -->
    <div v-if="cycleAnalysis" class="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/10 rounded-[2rem] p-6 shadow-sm border border-pink-100 dark:border-pink-800/30 mb-6">
        <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-pink-500">water_drop</span>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">Cycle Impact</h3>
        </div>
        
        <div class="flex items-center justify-between mb-4">
             <div class="text-center">
                 <p class="text-xs font-bold text-slate-400 uppercase">Focus Score (Normal)</p>
                 <p class="text-2xl font-bold text-slate-700 dark:text-slate-200">{{ cycleAnalysis.normalScore }}</p>
             </div>
             <div class="h-8 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
             <div class="text-center">
                 <p class="text-xs font-bold text-pink-400 uppercase">Focus Score (Period)</p>
                 <p class="text-2xl font-bold text-pink-600">{{ cycleAnalysis.periodScore }}</p>
             </div>
        </div>


        <div class="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 text-center">
            <p class="text-sm font-medium text-slate-600 dark:text-slate-300">{{ cycleAnalysis.insight }}</p>
        </div>
    </div>

    <!-- SUBJECT INSIGHTS -->
    <div class="mb-8" v-if="subjectStats.mostFrequent">

        <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4 pl-1">Subject Insights</h3>
        
        <!-- Most Frequent -->
        <div class="bg-indigo-500 text-white p-5 rounded-[2rem] mb-4 relative overflow-hidden shadow-lg shadow-indigo-500/30">
             <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
             
             <p class="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Most Studied</p>
             <h4 class="text-3xl font-bold mb-1 capitalize">{{ subjectStats.mostFrequent.name }}</h4>
             <p class="text-sm opacity-90 font-medium">{{ subjectStats.mostFrequent.count }} sessions logged</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <!-- Calming Subjects -->
            <div class="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <span class="material-symbols-outlined text-lg">spa</span>
                </div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Calm Subjects</p>
                <div v-if="subjectStats.calm.length > 0" class="flex flex-col gap-2">
                    <div 
                        v-for="sub in subjectStats.calm.slice(0, 3)" 
                        :key="sub.name" 
                        @click="openSubjectHistory(sub, 'calm')"
                        class="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1.5 -mx-1.5 rounded-lg transition-colors group"
                    >
                         <span class="text-sm font-bold text-slate-900 dark:text-white capitalize group-hover:text-emerald-600 transition-colors">{{ sub.name }}</span>
                         <span class="text-xs font-bold text-emerald-500">{{ sub.avgScore }}%</span>
                    </div>
                </div>
                <p v-else class="text-xs text-slate-400 italic">No calm subjects yet.</p>
            </div>

            <!-- Stressful Subjects -->
            <div class="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                    <span class="material-symbols-outlined text-lg">local_fire_department</span>
                </div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">High Stress</p>
                <div v-if="subjectStats.stressful.length > 0" class="flex flex-col gap-2">
                    <div 
                        v-for="sub in subjectStats.stressful.slice(0, 3)" 
                        :key="sub.name" 
                        @click="openSubjectHistory(sub, 'stressful')"
                        class="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1.5 -mx-1.5 rounded-lg transition-colors group"
                    >
                         <span class="text-sm font-bold text-slate-900 dark:text-white capitalize group-hover:text-rose-600 transition-colors">{{ sub.name }}</span>
                         <span class="text-xs font-bold text-rose-500">{{ sub.avgScore }}%</span>
                    </div>
                </div>
                 <p v-else class="text-xs text-slate-400 italic">No stressful subjects yet.</p>
            </div>
        </div>
    </div>

    <!-- WEEKLY HISTORY -->
    <div class="mb-8">
        <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4 pl-1">Weekly Reports</h3>
        
        <div v-if="weeklyLogs.length === 0" class="text-center py-8 opacity-50">
            <p class="text-slate-500 text-sm">{{ t.analytics.no_reports }}</p>
        </div>

        <div class="flex flex-col gap-3">
            <div 
                v-for="log in weeklyLogs.slice().reverse()" 
                :key="log.id"
                @click="openReportDetail(log)"
                class="bg-white dark:bg-slate-800 p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors active:scale-[0.98]"
            >
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                        :class="{
                            'bg-green-100 text-green-600': log.classification === 'Low',
                            'bg-orange-100 text-orange-600': log.classification === 'Moderate',
                            'bg-rose-100 text-rose-600': log.classification === 'High',
                            'bg-slate-100 text-slate-500': !log.classification
                        }"
                    >
                        {{ log.score || (log.classification ? log.classification[0] : '?') }}
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ new Date(log.date).toLocaleDateString() }}</h4>
                        <p class="text-xs text-slate-400">{{ log.classification || 'Unknown' }} {{ t.analytics.stress_level }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                        {{ log.stressPercentage || 0 }}%
                    </span>
                    <span class="material-symbols-outlined text-slate-300">chevron_right</span>
                </div>
            </div>
        </div>
    </div>

    <!-- REPORT DETAIL MODAL -->
    
    <!-- 1. Backdrop (Fade Only) -->
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="selectedReport" class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" @click="selectedReport = null"></div>
    </Transition>

    <!-- 2. Content (Slide Only) -->
    <Transition
        enter-active-class="transition duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
        enter-from-class="translate-y-full opacity-0 sm:translate-y-10 sm:scale-95"
        enter-to-class="translate-y-0 opacity-100 sm:scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100 sm:scale-100"
        leave-to-class="translate-y-full opacity-0 sm:translate-y-10 sm:scale-95"
    >
        <div v-if="selectedReport" class="fixed inset-0 z-[101] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
            <!-- Inner Card (Pointer Events Auto to allow interaction) -->
            <div class="bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-[2rem] p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl border border-white/10 relative pb-20 pointer-events-auto">
                
                <!-- Close Button -->
                <button @click="selectedReport = null" class="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:rotate-90 transition-transform">
                    <span class="material-symbols-outlined text-slate-500">close</span>
                </button>

                <!-- Header -->
                <div class="mb-6">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{{ t.weekly_analysis.title }}</p>
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ new Date(selectedReport.date).toLocaleDateString() }}</h2>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="px-3 py-1 rounded-full text-xs font-bold" 
                            :class="{
                                'bg-green-100 text-green-700': selectedReport.classification === 'Low',
                                'bg-orange-100 text-orange-700': selectedReport.classification === 'Moderate',
                                'bg-rose-100 text-rose-700': selectedReport.classification === 'High',
                                'bg-slate-100 text-slate-700': !selectedReport.classification
                            }">
                            {{ selectedReport.classification || 'Unknown' }} {{ t.analytics.stress_level }}
                        </span>
                        <span class="text-xs font-medium text-slate-500">{{ selectedReport.stressPercentage }}% {{ t.analytics.score }}</span>
                    </div>
                </div>

                <!-- 1. Daily Log Insights -->
                <div class="mb-6">
                    <h3 class="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-purple-500">history</span>
                        {{ t.weekly_analysis.from_logs }}
                    </h3>
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                        <p class="text-xs text-slate-400 mb-3 uppercase font-bold">{{ t.weekly_analysis.top_stressors }}</p>
                        <div v-if="reportAnalysis.topStressors.length > 0" class="flex flex-wrap gap-2">
                            <span 
                                v-for="stressor in reportAnalysis.topStressors" 
                                :key="stressor"
                                class="px-3 py-1 bg-white dark:bg-slate-700 rounded-lg text-sm font-medium shadow-sm border border-slate-100 dark:border-slate-600 capitalize"
                            >
                                {{ stressor }}
                            </span>
                        </div>
                        <p v-else class="text-sm text-slate-500 italic">{{ t.weekly_analysis.no_stressors }}</p>
                    </div>
                </div>

                <!-- 2. Survey Insights -->
                <div class="mb-8">
                    <h3 class="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-orange-500">assignment</span>
                        {{ t.weekly_analysis.from_survey }}
                    </h3>
                    <div class="space-y-3">
                        <div v-if="reportAnalysis.highRiskAnswers.length === 0" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-700 dark:text-green-400 text-sm font-medium">
                            {{ t.weekly_analysis.no_concerns }}
                        </div>
                        <div 
                            v-else
                            v-for="(item, idx) in reportAnalysis.highRiskAnswers" 
                            :key="idx"
                            class="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-900/30"
                        >
                            <div class="flex justify-between items-start mb-2">
                                <p class="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">{{ t.weekly_analysis.reason }} {{ idx + 1 }}</p>
                                <span class="text-xs font-bold text-rose-500 bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 rounded-full">{{ item.rating }}/4</span>
                            </div>
                            <p class="text-sm font-bold text-slate-800 dark:text-white leading-tight mb-2">
                                "{{ item.question }}"
                            </p>
                            <!-- Specific Advice for this item -->
                            <div class="mt-2 pt-2 border-t border-rose-200 dark:border-rose-800/30 flex gap-2 items-start opacity-90">
                                <span class="text-lg">💡</span>
                                <p class="text-xs text-rose-800 dark:text-rose-200 leading-relaxed italic">
                                    {{ item.advice }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex gap-4 items-start">
                    <span class="text-2xl">🧘</span>
                    <div>
                        <p class="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">{{ t.weekly_analysis.suggestion }}</p>
                        <p class="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                            {{ reportAnalysis.generalAdvice }}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </Transition>

    <!-- INSIGHTS -->
    <div class="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-indigo-900 dark:to-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden">
        <!-- Stars/Decor -->
        <div class="absolute top-4 right-4 text-yellow-300 animate-pulse">✨</div>
        
        <h3 class="text-lg font-bold mb-2 relative z-10">{{ t.analytics.tips_title }}</h3>
        <p class="text-sm text-slate-300 leading-relaxed mb-4 relative z-10">
            {{ t.analytics.tips_content }}
        </p>
        <button class="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold transition-colors relative z-10 border border-white/10">
            Read more tips
        </button>
    </div>


  </div>

    <!-- SUBJECT HISTORY MODAL -->
    <Teleport to="body">
        <!-- Backdrop -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="showHistoryModal" class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" @click="showHistoryModal = false"></div>
        </Transition>

        <!-- Content -->
        <Transition
            enter-active-class="transition duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
            enter-from-class="translate-y-full opacity-0 sm:translate-y-10 sm:scale-95"
            enter-to-class="translate-y-0 opacity-100 sm:scale-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100 sm:scale-100"
            leave-to-class="translate-y-full opacity-0 sm:translate-y-10 sm:scale-95"
        >
            <div v-if="showHistoryModal" class="fixed inset-0 z-[201] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
                <div class="bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-[2rem] p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl border border-white/10 relative pb-10 pointer-events-auto flex flex-col">
                    
                    <!-- Close Button -->
                    <button @click="showHistoryModal = false" class="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:rotate-90 transition-transform z-10">
                        <span class="material-symbols-outlined text-slate-500">close</span>
                    </button>

                    <!-- Header -->
                    <div class="mb-6 pt-2">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                                :class="historyType === 'calm' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'">
                                <span class="material-symbols-outlined">{{ historyType === 'calm' ? 'spa' : 'local_fire_department' }}</span>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-slate-900 dark:text-white capitalize">{{ historySubject.name }}</h2>
                                <p class="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                    {{ historyType === 'calm' ? 'Calming Subject' : 'High Stress Subject' }} • Avg {{ historySubject.avgScore }}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Mastery Graph (Bar Chart) -->
                    <div class="mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50" v-if="masteryChartData.length > 0">
                         <div class="flex justify-between items-end mb-4">
                            <h3 class="text-sm font-bold text-slate-800 dark:text-white">Mastery Trend</h3>
                            <span class="text-xs font-bold text-slate-400">Confidence Level</span>
                        </div>
                        
                        <!-- Bar Chart Container -->
                        <div class="w-full h-40 flex items-end justify-between gap-2 px-2 pb-6 relative">
                            <!-- Y-Axis Lines (Background) -->
                            <div class="absolute inset-x-0 top-0 border-t border-slate-200 dark:border-slate-700/50 border-dashed opacity-50"></div>
                            <div class="absolute inset-x-0 bottom-6 border-b border-slate-200 dark:border-slate-700/50 border-dashed opacity-50"></div>
                            <div class="absolute inset-x-0 top-1/2 -translate-y-3 border-t border-slate-200 dark:border-slate-700/50 border-dashed opacity-30"></div>

                            <div 
                                v-for="(bar, idx) in masteryChartData" 
                                :key="idx"
                                class="flex flex-col items-center justify-end h-full gap-2 group w-full max-w-[12%]"
                            >
                                <div class="w-full relative h-full flex items-end justify-center rounded-t-lg bg-slate-100 dark:bg-slate-700/30 overflow-hidden">
                                    <div 
                                        class="w-full rounded-t-lg transition-all duration-500 ease-out flex items-end justify-center group-hover:opacity-90 relative"
                                        :class="bar.colorClass"
                                        :style="{ height: bar.height }"
                                    >
                                        <!-- Value Label -->
                                        <span class="absolute -top-5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                                            {{ bar.value }}%
                                        </span>
                                    </div>
                                </div>
                                <span class="text-[9px] font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors whitespace-nowrap">{{ bar.label }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Logs List -->
                    <div class="flex-1 overflow-y-auto -mx-2 px-2 mt-2">
                        <div class="flex justify-between items-center mb-3 pl-1">
                            <h3 class="text-sm font-bold text-slate-800 dark:text-white">Recent Sessions</h3>
                        </div>
                        
                        <div v-if="subjectHistoryLogs.length === 0" class="text-center py-8 opacity-50">
                            <p class="text-xs font-bold">No sessions found.</p>
                        </div>

                        <div class="space-y-3">
                            <div 
                                v-for="log in subjectHistoryLogs" 
                                :key="log.id || log.timestamp"
                                class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl flex gap-3 items-start border border-slate-100 dark:border-slate-700/50"
                            >
                                <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-xl shadow-sm shrink-0">
                                    {{ log.emoji || '😐' }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex justify-between items-start">
                                        <p class="text-sm font-bold text-slate-800 dark:text-white leading-tight mb-0.5">
                                            {{ log.moodLabel || 'Neutral' }}
                                        </p>
                                        <span class="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                                            {{ new Date(log.timestamp || log.date).toLocaleDateString() }}
                                        </span>
                                    </div>
                                    <p v-if="log.note" class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                                        {{ log.note }}
                                    </p>
                                    <div v-if="log.stressors && log.stressors.length" class="flex flex-wrap gap-1 mt-2">
                                        <span v-for="s in log.stressors" :key="s" class="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-600 capitalize">
                                            {{ s }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>
