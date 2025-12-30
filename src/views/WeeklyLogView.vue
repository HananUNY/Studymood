<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { useMoodStore } from '../stores/moodStore'
import { useLocaleStore } from '../stores/localeStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const moodStore = useMoodStore()
const localeStore = useLocaleStore()
const { t } = storeToRefs(localeStore)

// Note: Questions are hardcoded for now until we move them to store or translate them properly item by item.
// For MVP localization, I'll translate the UI elements around them first.
// Ideally QUESTIONS should be a computed property returning translated strings.

const QUESTIONS_EN = [
  { id: 1, text: "I constantly worry about my upcoming exams and grades.", icon: "sentiment_worried", theme: "rose" },
  { id: 2, text: "I feel overwhelmed by the amount of homework I have.", icon: "menu_book", theme: "blue" },
  { id: 3, text: "I have trouble sleeping because I’m thinking about schoolwork.", icon: "bedtime", theme: "orange" },
  { id: 4, text: "I feel heavy pressure from my parents/guardians to do well.", icon: "family_restroom", theme: "purple" },
  { id: 5, text: "I struggle to find enough time to relax.", icon: "hourglass_empty", theme: "green" },
  { id: 6, text: "I feel nervous when speaking in front of the class.", icon: "record_voice_over", theme: "rose" },
  { id: 7, text: "I have trouble balancing school with extracurricular activities.", icon: "schedule", theme: "blue" },
  { id: 8, text: "I find it hard to focus during lectures or while studying.", icon: "psychology_alt", theme: "orange" },
  { id: 9, text: "I compare my grades with my classmates' grades.", icon: "group", theme: "purple" },
  { id: 10, text: "I feel physically exhausted from daily school routine.", icon: "battery_alert", theme: "green" },
]

const QUESTIONS_ID = [
  { id: 1, text: "Saya terus-menerus khawatir tentang ujian dan nilai saya.", icon: "sentiment_worried", theme: "rose" },
  { id: 2, text: "Saya merasa kewalahan dengan banyaknya pekerjaan rumah.", icon: "menu_book", theme: "blue" },
  { id: 3, text: "Saya sulit tidur karena memikirkan tugas sekolah.", icon: "bedtime", theme: "orange" },
  { id: 4, text: "Saya merasakan tekanan berat dari orang tua/wali untuk berprestasi.", icon: "family_restroom", theme: "purple" },
  { id: 5, text: "Saya kesulitan mencari waktu luang untuk bersantai.", icon: "hourglass_empty", theme: "green" },
  { id: 6, text: "Saya merasa gugup saat berbicara di depan kelas.", icon: "record_voice_over", theme: "rose" },
  { id: 7, text: "Saya kesulitan menyeimbangkan sekolah dengan kegiatan ekstrakurikuler.", icon: "schedule", theme: "blue" },
  { id: 8, text: "Saya sulit fokus saat pelajaran atau saat belajar.", icon: "psychology_alt", theme: "orange" },
  { id: 9, text: "Saya membandingkan nilai saya dengan nilai teman sekelas.", icon: "group", theme: "purple" },
  { id: 10, text: "Saya merasa lelah secara fisik karena rutinitas sekolah.", icon: "battery_alert", theme: "green" },
]

const QUESTIONS = computed(() => {
    return localeStore.locale === 'id' ? QUESTIONS_ID : QUESTIONS_EN
})

const answers = ref({})
const alreadyCompleted = ref(false)

// Check if already done this week
if (moodStore.hasLoggedThisWeek) {
    alreadyCompleted.value = true
}

const progress = computed(() => {
    const answeredCount = Object.keys(answers.value).length
    return (answeredCount / 10) * 100
})

const allAnswered = computed(() => {
    return Object.keys(answers.value).length === 10
})

const handleSelect = (questionId, value) => {
    if (alreadyCompleted.value) return
    answers.value[questionId] = value
}

const showSuccess = ref(false)

const handleSave = () => {
    if (!allAnswered.value || alreadyCompleted.value) return

    // Calculate Score
    const totalScore = Object.values(answers.value).reduce((a, b) => a + b, 0)
    const maxScore = 10 * 4
    const stressPercentage = Math.round((totalScore / maxScore) * 100)
    
    // Determine Stress Level Classification
    let classification = 'Low'
    if (stressPercentage > 60) classification = 'High'
    else if (stressPercentage > 30) classification = 'Moderate'

    const newLog = {
        type: 'weekly',
        answers: answers.value,
        totalScore,
        stressPercentage,
        classification
    }

    // Save to Store
    moodStore.addWeeklyLog(newLog)

    // Show Success Modal instead of immediate push
    showSuccess.value = true
}

const finish = () => router.push('/dashboard')
const goBack = () => router.back()
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-background-dark font-display transition-colors pb-32">
    
    <!-- Header -->
    <header class="sticky top-0 z-20 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      <button @click="goBack" class="flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-white">
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <h2 class="text-slate-900 dark:text-white text-lg font-bold">{{ t.weekly.title }}</h2>
      <div class="w-10"></div>
    </header>

    <main class="flex-1 max-w-2xl mx-auto w-full px-4 pt-6">
        
        <!-- Progress Bar -->
        <div class="mb-8 relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
                class="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out rounded-full"
                :style="{ width: progress + '%' }"
            ></div>
        </div>

        <div class="mb-2">
            <div v-if="alreadyCompleted" class="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircleIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
                <p class="text-sm font-bold text-green-800 dark:text-green-200">
                    {{ t.weekly.completed }}
                    <button @click="finish" class="underline ml-1 cursor-pointer">{{ t.weekly.see_results }}</button>
                </p>
            </div>

            <h3 class="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight whitespace-pre-line">
                {{ t.weekly.subtitle }}
            </h3>
        </div>

        <div class="mb-8">
            <p class="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">
            Rate the following statements from <span class="font-bold text-slate-900 dark:text-slate-200">0</span> to <span class="font-bold text-slate-900 dark:text-slate-200">4</span>.
            </p>
        </div>

        <!-- Questions List -->
        <div class="flex flex-col gap-6">
            <div 
                v-for="q in QUESTIONS" 
                :key="q.id"
                class="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md"
                :class="answers[q.id] !== undefined ? 'border-primary/30 dark:border-primary/30' : ''"
            >
                <div class="flex items-start gap-4 mb-6">
                    <div 
                        class="w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-2xl"
                        :class="{
                            'bg-rose-100 text-rose-600': q.theme === 'rose',
                            'bg-blue-100 text-blue-600': q.theme === 'blue',
                            'bg-orange-100 text-orange-600': q.theme === 'orange',
                            'bg-purple-100 text-purple-600': q.theme === 'purple',
                            'bg-emerald-100 text-emerald-600': q.theme === 'green',
                        }"
                    >
                        <span class="material-symbols-outlined">{{ q.icon }}</span>
                    </div>
                    <p class="text-lg font-medium text-slate-800 dark:text-white leading-relaxed pt-1">
                        {{ q.text }}
                    </p>
                </div>

                <!-- Likert Scale -->
                <div class="flex justify-between items-center gap-1 sm:gap-2">
                    <button 
                        v-for="val in [0, 1, 2, 3, 4]" 
                        :key="val"
                        @click="handleSelect(q.id, val)"
                        class="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-200 hover:scale-110"
                        :class="[
                            answers[q.id] === val 
                                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110 z-10' 
                                : 'bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        ]"
                    >
                        {{ val }}
                    </button>
                </div>
                <!-- Labels could also be translated but kept simple for now -->
            </div>
        </div>

    </main>

    <!-- Footer Submit Button -->
    <div class="fixed bottom-0 left-0 w-full z-10 bg-gradient-to-t from-white dark:from-background-dark via-white/95 dark:via-background-dark/95 to-transparent pb-8 pt-10 px-4 pointer-events-none">
        <div class="max-w-2xl mx-auto pointer-events-auto">
            <button 
                @click="handleSave"
                :disabled="!allAnswered"
                class="w-full font-bold text-lg h-14 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                :class="allAnswered 
                    ? 'bg-primary hover:bg-purple-600 text-white shadow-primary/30 hover:shadow-primary/40' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                "
            >
                <span>{{ t.weekly.submit }}</span>
                <CheckCircleIcon v-if="allAnswered" class="w-6 h-6" />
                <span v-else class="material-symbols-outlined text-xl">lock</span>
            </button>
        </div>
    </div>

    <!-- Success Modal -->
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
    >
        <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div class="bg-white dark:bg-slate-800 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl border border-white/10">
                <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-bounce-slow">
                    🎉
                </div>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">{{ t.weekly.completed }}</h3>
                <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Check the <strong class="text-primary">{{ t.analytics.title }}</strong> to view results.
                </p>
                <button 
                    @click="finish"
                    class="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    </Transition>

  </div>
</template>
