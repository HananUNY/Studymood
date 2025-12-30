<script setup>
import { RouterLink } from 'vue-router'
import { 
  HomeIcon, 
  ChartBarIcon, 
  ChartPieIcon,
  CalendarIcon, 
  UserIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import { 
  HomeIcon as HomeIconSolid, 
  ChartBarIcon as ChartBarIconSolid,
  CalendarIcon as CalendarIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocaleStore } from '../../stores/localeStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const localeStore = useLocaleStore()
const { t } = storeToRefs(localeStore)
const showMenu = ref(false)

const navigateToDaily = () => {
    console.log('Navigating to Daily Log...')
    showMenu.value = false
    router.push('/daily-log')
}

const navigateToWeekly = () => {
    console.log('Navigating to Weekly Log...')
    showMenu.value = false
    router.push('/weekly-log')
}
</script>

<template>
  <div v-if="t && t.nav" class="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe pointer-events-none">
    <div class="relative w-full max-w-md md:max-w-2xl pointer-events-auto z-50">
      
      <!-- FAB Button (Floating Center) -->
      <div class="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
        <RouterLink 
            to="/analytics" 
            class="relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 group"
            :class="$route.path === '/analytics' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400'"
        >
            <ChartPieIcon 
                class="w-6 h-6 transition-all duration-300"
                :class="$route.path === '/analytics' ? 'scale-110 drop-shadow-md' : 'group-hover:scale-105'" 
            />
            <span v-if="$route.path === '/analytics'" class="absolute -bottom-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
        </RouterLink>
      </div>

      <!-- Navigation Bar -->
      <!-- Enhanced Glassmorphism: lower opacity, higher blur -->
      <div class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border-t border-white/20 dark:border-slate-700/30 shadow-[0_-4px_30px_rgba(0,0,0,0.05)] h-20 rounded-t-3xl flex items-center justify-between px-6 transition-colors duration-300 relative z-30">
        
        <!-- Left Group -->
        <div class="flex items-center gap-1">
          <RouterLink to="/dashboard" active-class="active" class="nav-item group">
            <div class="icon-container">
              <HomeIconSolid class="w-7 h-7 absolute transition-all duration-300 active-icon" />
              <HomeIcon class="w-7 h-7 transition-all duration-300 default-icon group-hover:text-slate-600 dark:group-hover:text-slate-200" />
            </div>
            <span class="label">{{ t.nav.home }}</span>
          </RouterLink>

          <RouterLink to="/analytics" active-class="active" class="nav-item group">
            <div class="icon-container">
              <ChartBarIconSolid class="w-7 h-7 absolute transition-all duration-300 active-icon" />
              <ChartBarIcon class="w-7 h-7 transition-all duration-300 default-icon group-hover:text-slate-600 dark:group-hover:text-slate-200" />
            </div>
            <span class="label">{{ t.nav.analytics }}</span>
          </RouterLink>
        </div>

        <!-- Spacer for FAB -->
        <div class="w-12"></div>

        <!-- FAB Button (Center) -->
        <div class="absolute left-1/2 -top-6 -translate-x-1/2 z-50">
            <button 
                @click="showMenu = !showMenu"
                class="w-16 h-16 rounded-full bg-linear-to-tr from-primary to-purple-400 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white border-4 border-slate-50 dark:border-slate-900 transition-transform duration-300 hover:scale-105 active:scale-95 group"
                :class="showMenu ? 'rotate-45' : ''"
            >
                <PlusIcon class="w-8 h-8 stroke-[3px]" />
            </button>
        </div>

        <!-- Right Group -->
        <div class="flex items-center gap-1">
          <RouterLink to="/calendar" active-class="active" class="nav-item group">
             <div class="icon-container">
              <CalendarIconSolid class="w-7 h-7 absolute transition-all duration-300 active-icon" />
              <CalendarIcon class="w-7 h-7 transition-all duration-300 default-icon group-hover:text-slate-600 dark:group-hover:text-slate-200" />
            </div>
            <span class="label">{{ t.nav.calendar }}</span>
          </RouterLink>

          <RouterLink to="/profile" active-class="active" class="nav-item group">
             <div class="icon-container">
              <UserIconSolid class="w-7 h-7 absolute transition-all duration-300 active-icon" />
              <UserIcon class="w-7 h-7 transition-all duration-300 default-icon group-hover:text-slate-600 dark:group-hover:text-slate-200" />
            </div>
            <span class="label">{{ t.nav.profile }}</span>
          </RouterLink>
        </div>

      </div>
    </div>

    <!-- Check-in Menu Overlay -->
    <Transition name="fade">
        <div v-if="showMenu" class="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm" @click="showMenu = false"></div>
    </Transition>

    <Transition name="slide-up">
        <div v-if="showMenu" class="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-[90%] max-w-sm pointer-events-auto">
            <button 
                @click="navigateToDaily" 
                class="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 active:scale-95 transition-all w-full text-left"
            >
                <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <span class="material-symbols-outlined text-2xl">edit_calendar</span>
                </div>
                <div>
                     <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ t.nav.daily }}</h3>
                     <p class="text-xs text-slate-500">{{ t.nav.daily_desc }}</p>
                </div>
            </button>

            <button 
                @click="navigateToWeekly"
                class="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 active:scale-95 transition-all w-full text-left"
            >
                <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <span class="material-symbols-outlined text-2xl">analytics</span>
                </div>
                <div>
                     <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ t.nav.weekly }}</h3>
                     <p class="text-xs text-slate-500">{{ t.nav.weekly_desc }}</p>
                </div>
            </button>
        </div>
    </Transition>

  </div>
</template>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 100%;
  color: #94A3B8; /* Slate 400 */
  transition: all 0.3s ease;
  position: relative;
}

.label {
  font-size: 10px;
  font-weight: 600;
  margin-top: 4px;
  transition: color 0.3s ease;
}

.icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
}

/* Default state for SOLID icons (Hidden by default) */
.active-icon {
  opacity: 0;
  transform: scale(0.5);
}

/* Default state for OUTLINE icons (Visible by default) */
.default-icon {
  opacity: 1;
  transform: scale(1);
}

/* Active State */
.nav-item.active {
  color: var(--color-primary);
}

/* When active: Show SOLID icon and scale UP */
.nav-item.active .active-icon {
  opacity: 1;
  transform: scale(1.25); /* Significant growth */
}

/* When active: Hide OUTLINE icon and scale DOWN */
.nav-item.active .default-icon {
  opacity: 0;
  transform: scale(0.5);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 20px);
  opacity: 0;
}
</style>
