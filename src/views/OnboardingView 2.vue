<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToTracker = () => {
  router.push('/tracker')
}

const skipOnboarding = () => {
  router.push('/')
}
</script>

<template>
  <div class="relative flex h-[100dvh] w-full max-w-md mx-auto flex-col overflow-hidden bg-white dark:bg-background-dark shadow-2xl sm:my-8 sm:rounded-[3rem] sm:border-[8px] sm:border-slate-900 sm:h-[800px] transition-colors duration-300 font-display">
    <!-- Ambient Background Gradients (Pastel Aesthetic) -->
    <div class="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-gradient-to-br from-pastel-pink/60 via-pastel-lavender/40 to-transparent dark:from-primary/10 dark:via-primary/5 dark:to-transparent rounded-full blur-[80px] pointer-events-none z-0"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[100%] h-[50%] bg-gradient-to-tl from-pastel-mint/50 to-transparent dark:from-primary/5 dark:to-transparent rounded-full blur-[60px] pointer-events-none z-0"></div>

    <!-- Top Navigation -->
    <div class="relative z-20 flex px-6 py-4 justify-end pt-12 sm:pt-8">
      <button 
        @click="skipOnboarding"
        class="flex min-w-[64px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm text-slate-600 dark:text-slate-300 text-sm font-bold leading-normal hover:bg-white/80 dark:hover:bg-black/30 transition-all"
      >
        <span class="truncate">Skip</span>
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="relative z-10 flex flex-1 flex-col items-center justify-center w-full px-6">
      <!-- Hero Illustration Container -->
      <div class="relative w-full max-w-[340px] aspect-[4/5] flex items-center justify-center mb-6">
        <!-- Abstract Organic Shapes -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-pastel-lavender dark:bg-slate-800 rounded-[3rem] -rotate-3 transition-transform duration-700 hover:rotate-0"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-pastel-pink/50 dark:bg-slate-700/50 rounded-[3rem] rotate-2 transition-transform duration-700 hover:rotate-0"></div>
        
        <!-- Main Image -->
        <div 
          class="relative w-[80%] h-[80%] bg-center bg-no-repeat bg-cover rounded-[2.5rem] shadow-sm z-10 overflow-hidden ring-4 ring-white dark:ring-slate-700" 
          aria-label="Illustration of a student sitting at a desk with floating mood emojis like happy and focused faces" 
          style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXhDRKJ0mSKN69kiziuKfrPKO3ZFWLYijL5NPZ0SzPKjw6KUsYGFkqg113HUDSxNdqzzPkeP1RQLE_7JlcufTkMjUlLwMJ6GED2Cqy4zP26efBjB7U1oJ9brWF_ktE9GgSnHJAbGEAMyj1CxIT9OEF1PCVvSLajQAUtD_h3AQt6wsRcl87fZ8YfLSKr9BkwvRgLFqXBnRbyTasuT-aDHFWPEQSNZGU40l4M_bsVazJmxfjsG93zetzn6z2bGslGUQNTMEQpyOI59o');"
        >
          <!-- Subtle Gradient Overlay on Image -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>

        <!-- Floating Emojis (Micro-interactions) -->
        <div class="absolute top-[10%] right-[5%] z-20 animate-bounce" style="animation-duration: 3s;">
          <div class="w-12 h-12 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center text-2xl ring-2 ring-pastel-pink dark:ring-primary/20">
            🥰
          </div>
        </div>
        <div class="absolute bottom-[15%] left-[5%] z-20 animate-bounce" style="animation-duration: 4s; animation-delay: 1s;">
          <div class="w-10 h-10 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center text-xl ring-2 ring-pastel-mint dark:ring-primary/20">
            📚
          </div>
        </div>
      </div>

      <!-- Typography -->
      <div class="flex flex-col items-center text-center space-y-3 max-w-[320px]">
        <h1 class="text-[#0d141b] dark:text-white tracking-tight text-[32px] font-extrabold leading-[1.15]">
          How are you <br/>
          <span class="text-primary relative inline-block">
            studying?
            <!-- Underline decoration -->
            <svg class="absolute w-full h-2 -bottom-0 left-0 text-pastel-pink dark:text-primary/30 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
              <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" stroke-width="8"></path>
            </svg>
          </span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed">
          Track your emotions during study sessions to find your best workflow and mental rhythm.
        </p>
      </div>
    </div>

    <!-- Bottom Navigation Area -->
    <div class="relative z-20 flex w-full flex-row items-center justify-between px-8 py-8 sm:pb-12">
      <!-- Page Indicators -->
      <div class="flex flex-row items-center gap-2">
        <div class="h-2.5 w-8 rounded-full bg-primary transition-all duration-300"></div>
        <div class="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300"></div>
        <div class="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300"></div>
      </div>

      <!-- Next Button (FAB style) -->
      <button 
        @click="navigateToTracker"
        class="group relative flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span class="material-symbols-outlined text-2xl group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles if needed, though most are handled by Tailwind utility classes */
</style>
