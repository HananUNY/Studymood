<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMoodStore } from '../stores/moodStore'
import { moodDefinitions } from '../data/moodDefinitions'
import { ChevronLeftIcon, ArrowUpTrayIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const moodStore = useMoodStore()

const currentYear = ref(new Date().getFullYear())
const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const days = Array.from({ length: 31 }, (_, i) => i + 1)

// Helper to get logs efficiently
// Map: "YYYY-MM-DD" -> Mood Key
const logMap = computed(() => {
    const map = new Map()
    moodStore.logs.forEach(log => {
        const date = new Date(log.date || log.timestamp)
        const dateStr = date.toLocaleDateString('en-CA') // YYYY-MM-DD
        
        let key = 'neutral'
        if (log.stressLevel) key = log.stressLevel
        else if (typeof log.mood === 'number') {
            if (log.mood >= 4.5) key = 'calm'
            else if (log.mood >= 3.5) key = 'happy'
            else if (log.mood >= 2.5) key = 'okay'
            else if (log.mood >= 1.5) key = 'sad'
            else key = 'high'
        } else if (log.mood) {
            key = log.mood
        }
        
        // Only store the latest log per day if duplicates exist (Store puts latest first, so we use that)
        if (!map.has(dateStr)) {
            map.set(dateStr, key)
        }
    })
    return map
})

const getMoodColor = (monthIndex, day) => {
    // Construct Date
    // Note: Month is 0-indexed in JS Date
    const checkDate = new Date(currentYear.value, monthIndex, day)
    
    // Check validity (e.g., Feb 30)
    if (checkDate.getMonth() !== monthIndex) return 'bg-transparent' // Invalid date
    
    const dateStr = checkDate.toLocaleDateString('en-CA')
    const moodKey = logMap.value.get(dateStr)
    
    if (moodKey && moodDefinitions[moodKey]) {
        // Extract bg color class, handling "bg-red-100 text-red-600" -> "bg-red-100" (simplification or use specific mapping)
        // Actually, let's map to a solid circle color.
        // The definitions use bg-light, text-dark. We might want a stronger color for the pixel.
        // Let's use a custom mapping or try to extract a better color class.
        // For now, let's use the define 'color' bg class but maybe we need 'bg-red-400' for better visibility in small dots.
        
        // Map keys to specific strong colors for the pixel grid
        const pixelColors = {
            'burnout': 'bg-red-600',
            'high': 'bg-red-500',
            'not_great': 'bg-orange-500',
            'sad': 'bg-orange-400',
            'neutral': 'bg-slate-400',
            'okay': 'bg-blue-400',
            'good': 'bg-teal-500',
            'happy': 'bg-teal-400',
            'energetic': 'bg-green-500',
            'calm': 'bg-emerald-500'
        }
        return pixelColors[moodKey] || 'bg-slate-200 dark:bg-slate-700'
    }
    
    return 'bg-slate-100 dark:bg-slate-800' // Empty day
}

const legendItems = [
    { label: 'Amazing', color: 'bg-green-500' },
    { label: 'Good', color: 'bg-teal-400' },
    { label: 'Okay', color: 'bg-blue-400' },
    { label: 'Stressed', color: 'bg-orange-400' },
    { label: 'Bad', color: 'bg-red-500' },
]

const goBack = () => {
    router.back()
}

// Share function (Mock)
const share = () => {
    // In a real app, uses html2canvas or navigator.share
    alert('Sharing Year in Pixels...')
}

</script>

<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-display pb-10">
        
        <!-- Header -->
        <div class="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
            <button @click="goBack" class="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                <ChevronLeftIcon class="w-6 h-6" />
            </button>
            <h1 class="text-lg font-bold text-slate-800 dark:text-white">Mood Tahunan</h1>
            <button @click="share" class="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                <ArrowUpTrayIcon class="w-6 h-6" />
            </button>
        </div>

        <div class="flex-1 px-4 py-6 flex flex-col items-center">
            
            <!-- Controls -->
            <div class="flex items-center gap-4 mb-6">
                <button @click="currentYear--" class="text-slate-400 hover:text-primary transition-colors">
                    <ChevronLeftIcon class="w-5 h-5" />
                </button>
                <span class="text-2xl font-black text-slate-800 dark:text-white">{{ currentYear }}</span>
                <button @click="currentYear++" class="text-slate-400 hover:text-primary transition-colors" :disabled="currentYear >= new Date().getFullYear()">
                    <ChevronLeftIcon class="w-5 h-5 rotate-180" :class="{'opacity-30': currentYear >= new Date().getFullYear()}" />
                </button>
            </div>

            <!-- Grid Container -->
            <div class="bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-700 w-full max-w-md overflow-x-auto">
                <div class="min-w-[300px]">
                    <!-- Month Header -->
                    <div class="grid grid-cols-[20px_repeat(12,1fr)] gap-1 mb-2">
                        <div class="text-[10px] font-bold text-slate-300"></div>
                        <div v-for="m in months" :key="m" class="text-center text-[10px] font-bold text-slate-400">
                            {{ m }}
                        </div>
                    </div>

                    <!-- Days Rows -->
                    <div class="flex flex-col gap-1">
                        <div v-for="day in days" :key="day" class="grid grid-cols-[20px_repeat(12,1fr)] gap-1 items-center">
                            <!-- Day Number -->
                            <div class="text-[8px] font-bold text-slate-300 text-right pr-1">
                                {{ day }}
                            </div>
                            <!-- Month Cells for this Day -->
                            <div v-for="(m, mIndex) in months" :key="mIndex" class="aspect-square flex items-center justify-center">
                                <div 
                                    class="w-3 h-3 md:w-4 md:h-4 rounded-full transition-all hover:scale-125"
                                    :class="getMoodColor(mIndex, day)"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Legend -->
            <div class="mt-8 flex flex-wrap justify-center gap-4 px-4">
                <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" :class="item.color"></div>
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ item.label }}</span>
                </div>
            </div>

        </div>

    </div>
</template>
