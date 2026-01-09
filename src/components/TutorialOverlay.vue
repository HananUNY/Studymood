<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const currentStep = ref(0)

const steps = [
    {
        title: "Welcome to Study Mood!",
        desc: "Balance your study life with your energy. Use this Dashboard to check-in your mood daily and add new study plans.",
        emoji: "🚀",
        color: "bg-blue-100 text-blue-600 ring-blue-200",
        route: '/dashboard'
    },
    {
        title: "Track Your Journey",
        desc: "The Calendar View helps you see your mood history and study streaks. Spot patterns in your energy levels here.",
        emoji: "📅",
        color: "bg-purple-100 text-purple-600 ring-purple-200",
        route: '/calendar'
    },
    {
        title: "Weekly Assessment",
        desc: "At the end of each week, visit the Weekly Log to review your progress and get AI-driven insights.",
        emoji: "📊",
        color: "bg-indigo-100 text-indigo-600 ring-indigo-200",
        route: '/weekly-log'
    },
    {
        title: "Important: Data Privacy",
        desc: "All your data is stored LOCALLY on this device. If you clear your browser cache, your data will be LOST forever.",
        emoji: "⚠️",
        color: "bg-red-100 text-red-600 ring-red-200",
        route: '/dashboard' // Go back home to finish
    }
]

const current = computed(() => steps[currentStep.value])

// Auto-navigate when step changes
watch(currentStep, (newIndex) => {
    const routeName = steps[newIndex].route
    if (routeName) {
        router.push(routeName)
    }
})

const next = () => {
    if (currentStep.value < steps.length - 1) {
        currentStep.value++
    } else {
        finish()
    }
}

const prev = () => {
    if (currentStep.value > 0) {
        currentStep.value--
    }
}

const finish = () => {
    userStore.completeTutorial()
    router.push('/dashboard')
}
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center pointer-events-none p-4 pb-24 sm:pb-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto transition-opacity"></div>

            <!-- Card -->
            <div class="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-2xl flex flex-col items-center text-center pointer-events-auto border border-white/20 dark:border-slate-700/50">
                
                <!-- Step Indicator -->
                <div class="absolute top-6 left-6 text-xs font-bold text-slate-300 dark:text-slate-600">
                    {{ currentStep + 1 }} / {{ steps.length }}
                </div>



                <!-- Icon -->
                <div class="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm ring-4 transition-all duration-300 mt-2"
                    :class="current.color">
                    {{ current.emoji }}
                </div>

                <!-- Content -->
                <h2 class="text-xl font-black text-slate-800 dark:text-white mb-2 leading-tight">{{ current.title }}</h2>
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6 px-2">
                    {{ current.desc }}
                </p>

                <!-- Dots -->
                <div class="flex gap-1.5 mb-6">
                    <span v-for="(step, idx) in steps" :key="idx" 
                        class="h-1.5 rounded-full transition-all duration-300"
                        :class="idx === currentStep ? 'bg-primary w-6' : 'bg-slate-200 dark:bg-slate-700 w-1.5'"
                    ></span>
                </div>

                <!-- Actions -->
                <div class="flex items-center w-full gap-3">
                    <button v-if="currentStep > 0" @click="prev" class="px-5 py-3 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-sm">
                        Back
                    </button>
                    <div v-else class="flex-1"></div>

                    <button @click="next" class="flex-1 bg-primary text-white py-3 rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all text-sm">
                        {{ currentStep === steps.length - 1 ? "I Understand, Let's Start!" : 'Next' }}
                    </button>
                </div>

            </div>
        </div>
    </Teleport>
</template>
