<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMoodStore } from '../stores/moodStore'
import { usePlanStore } from '../stores/planStore'
import MonthlyCalendar from '../components/calendar/MonthlyCalendar.vue'
import DailyJournal from '../components/calendar/DailyJournal.vue'
import WeeklySchedule from '../components/calendar/WeeklySchedule.vue'

import { useLocaleStore } from '../stores/localeStore'

const moodStore = useMoodStore()
const planStore = usePlanStore()
const localeStore = useLocaleStore()
const { t } = storeToRefs(localeStore)

const { logs } = storeToRefs(moodStore)
const { plans } = storeToRefs(planStore)

const activeTab = ref('monthly') // 'daily', 'weekly', 'monthly'
const selectedDate = ref(new Date())

// No onMounted needed for data fetching as Stores are reactive and auto-init

const handleDaySelect = (date) => {
    console.log('Selected Date:', date)
    selectedDate.value = date
    activeTab.value = 'daily'
}
</script>

<template>
  <div class="flex flex-col min-h-screen font-display pb-32">
    <!-- Header -->
    <div class="px-6 pt-6 pb-3 bg-white dark:bg-background-dark relative rounded-[2.5rem] mb-1 shadow-sm z-10">
      <div class="flex justify-between items-center mb-6">
        <div>
           <h1 class="text-2xl font-bold text-slate-800 dark:text-white leading-tight">{{ t.calendar.title }}</h1>
           <p class="text-xs font-semibold text-slate-400">{{ t.calendar.subtitle }}</p>
        </div>
        <div class="flex items-center gap-2">
            <button @click="$router.push('/pixels')" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span class="material-symbols-outlined text-slate-500">grid_view</span>
            </button>
            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span class="material-symbols-outlined text-slate-500">calendar_month</span>
            </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
          <button 
            @click="activeTab = 'daily'"
            class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            :class="activeTab === 'daily' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'"
          >
            {{ t.calendar.daily }}
          </button>
          <button 
            @click="activeTab = 'weekly'"
            class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            :class="activeTab === 'weekly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'"
          >
            {{ t.calendar.weekly }}
          </button>
          <button 
            @click="activeTab = 'monthly'"
            class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            :class="activeTab === 'monthly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'"
          >
            {{ t.calendar.monthly }}
          </button>
      </div>
    </div>

    <!-- Content -->
    <main class="flex-1 px-2">
        
        <Transition name="fade" mode="out-in">
            <!-- DAILY VIEW -->
            <div v-if="activeTab === 'daily'" class="pt-6 pb-16 bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden min-h-[500px]">
                <DailyJournal :date="selectedDate" :logs="logs" />
            </div>

            <!-- WEEKLY VIEW -->
            <div v-else-if="activeTab === 'weekly'" class="h-full pb-20 bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden min-h-[500px]">
                <WeeklySchedule 
                    :logs="logs" 
                    :plans="plans" 
                    :currentDate="selectedDate"
                    @selectDate="handleDaySelect"
                />
            </div>

            <!-- MONTHLY VIEW -->
            <div v-else-if="activeTab === 'monthly'" class="bg-white dark:bg-slate-900 rounded-[2.5rem] pb-10 mt-2">
                <MonthlyCalendar :logs="logs" @selectDay="handleDaySelect" />
                
                <!-- Quick Legend -->
                <div class="flex justify-center gap-4 mt-4 opacity-70">
                    <div class="flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span class="text-[10px] uppercase font-bold text-slate-500">{{ t.calendar.calm }}</span>
                    </div>
                     <div class="flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span class="text-[10px] uppercase font-bold text-slate-500">{{ t.calendar.high_stress }}</span>
                    </div>
                </div>
            </div>
        </Transition>

    </main>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
