<script setup>
import { ref, computed } from 'vue'
import { getHoliday } from '../../data/holidays'

const props = defineProps(['logs'])
const emit = defineEmits(['selectDay'])

const currentDate = ref(new Date())
const selectedDay = ref(new Date().getDate())

const monthName = computed(() => currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' }))

const daysInMonth = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const days = new Date(year, month + 1, 0).getDate()
    
    // First day of month offset (0=Sun, 1=Mon...)
    const firstDay = new Date(year, month, 1).getDay()
    
    // Allow empty slots
    const res = []
    for (let i = 0; i < firstDay; i++) res.push({ day: 0 })
    
    for (let i = 1; i <= days; i++) {
        const d = new Date(year, month, i)
        res.push({ 
            day: i, 
            holiday: getHoliday(d),
            isSunday: d.getDay() === 0
        })
    }
    return res
})

const getLogForDay = (day) => {
    if (day === 0 || !props.logs) return null
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    
    // Find log matching this date
    const targetDateStr = new Date(year, month, day).toDateString()
    
    return props.logs.find(l => new Date(l.date).toDateString() === targetDateStr)
}

const getMoodStyle = (log) => {
    if (!log) return {}
    
    const id = log.stressLevel
    if (id === 'calm') return { emoji: '😌', color: 'bg-emerald-400' }
    if (id === 'happy') return { emoji: '🙂', color: 'bg-teal-400' }
    if (id === 'okay') return { emoji: '😐', color: 'bg-blue-400' }
    if (id === 'sad') return { emoji: '😓', color: 'bg-amber-400' }
    if (id === 'high') return { emoji: '🤯', color: 'bg-orange-500' }
    
    // Numeric fallback
    const num = Number(id)
    if (num === 1) return { emoji: '😌', color: 'bg-emerald-400' }
    if (num === 5) return { emoji: '🤯', color: 'bg-orange-500' }
    
    return { emoji: '😐', color: 'bg-blue-400' }
}

const changeMonth = (offset) => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + offset)
    currentDate.value = newDate
    selectedDay.value = null
}

const selectDay = (day) => {
    if (day !== 0) {
        selectedDay.value = day
        const newDate = new Date(currentDate.value)
        newDate.setDate(day)
        emit('selectDay', newDate)
    }
}
</script>

<template>
    <div class="px-4 py-2">
        <!-- Month Header -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white capitalize">{{ monthName }}</h2>
            <div class="flex gap-2">
                 <button @click="changeMonth(-1)" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                    <span class="material-symbols-outlined">chevron_left</span>
                 </button>
                 <button @click="changeMonth(1)" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                    <span class="material-symbols-outlined">chevron_right</span>
                 </button>
            </div>
        </div>

        <!-- Days Header -->
        <div class="grid grid-cols-7 mb-2">
            <div v-for="(d, i) in ['S','M','T','W','T','F','S']" :key="d" 
                class="text-[11px] font-bold uppercase tracking-wider text-center py-2"
                :class="i === 0 ? 'text-rose-500' : 'text-slate-400 dark:text-gray-500'"
            >
                {{ d }}
            </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-y-4 gap-x-1">
            <template v-for="(dayObj, index) in daysInMonth" :key="index">
                
                <!-- Empty Slot -->
                <div v-if="dayObj.day === 0"></div>

                <!-- Active Day -->
                <button 
                    v-else
                    @click="selectDay(dayObj.day)"
                    class="relative group flex flex-col items-center justify-start h-16 w-full rounded-2xl transition-all duration-300"
                    :class="[
                        selectedDay === dayObj.day 
                            ? 'bg-white dark:bg-[#2c2249] ring-2 ring-primary shadow-lg shadow-primary/10 z-10 scale-105 -mt-1' 
                            : 'hover:bg-slate-100 dark:hover:bg-white/5'
                    ]"
                >
                    <span 
                        class="text-sm font-bold pt-2 transition-colors relative z-10"
                        :class="[
                            selectedDay === dayObj.day ? 'text-primary' : (dayObj.holiday || dayObj.isSunday ? 'text-rose-500' : 'text-slate-600 dark:text-gray-400')
                        ]"
                    >
                        {{ dayObj.day }}
                    </span>

                    <!-- Holiday Dot/Indicator (If no Log) -->
                    <div v-if="dayObj.holiday && !getLogForDay(dayObj.day)" class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></div>

                    <!-- Log Data -->
                    <div v-if="getLogForDay(dayObj.day)" class="mt-0.5 flex flex-col items-center">
                         <span class="text-xl leading-none animate-pulse-once filter drop-shadow-sm">
                             {{ getMoodStyle(getLogForDay(dayObj.day)).emoji }}
                         </span>
                         <div class="flex gap-0.5 mt-1">
                             <div class="w-1.5 h-1.5 rounded-full" :class="getMoodStyle(getLogForDay(dayObj.day)).color"></div>
                         </div>
                    </div>
                    
                    <!-- Holiday Text (Small at bottom) -->
                    <div v-else-if="dayObj.holiday" class="mt-1 px-1">
                        <p class="text-[9px] font-bold text-rose-400 leading-tight line-clamp-2 opacity-80">
                            {{ dayObj.holiday }}
                        </p>
                    </div>

                    <!-- Selected Indicator Arrow -->
                    <div v-if="selectedDay === dayObj.day" class="absolute -bottom-2.5 bg-primary text-white rounded-full p-0.5 shadow-sm scale-75 z-20">
                         <span class="material-symbols-outlined text-[12px] block font-bold">keyboard_arrow_down</span>
                    </div>

                </button>
            </template>
        </div>
    </div>
</template>
