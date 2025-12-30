<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.back()
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-[#0e161b] font-display transition-colors">
    <!-- Header -->
    <header class="p-4 flex items-center">
      <button @click="goBack" class="flex w-10 h-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
        <span class="material-symbols-outlined">chevron_left</span>
      </button>
      <div class="ml-4">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">AI Insights</h2>
          <p class="text-xs text-slate-400 font-medium">Premium Features</p>
      </div>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center p-8 text-center">
        
        <div class="w-48 h-48 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20 absolute pointer-events-none"></div>

        <div class="relative z-10 w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-indigo-500/10">
            <span class="material-symbols-outlined text-5xl text-indigo-500 animate-pulse">auto_awesome</span>
        </div>

        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">Coming Soon</h1>
        <p class="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xs mb-8">
            We are training our AI models to provide you with personalized mental health insights and PDF exportable reports.
        </p>

        <!-- Feature List -->
        <div class="w-full max-w-sm space-y-4">
            <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-center gap-4 text-left">
                 <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                     <span class="material-symbols-outlined">psychology_alt</span>
                 </div>
                 <div>
                     <h4 class="font-bold text-slate-900 dark:text-white text-sm">Deep AI Analysis</h4>
                     <p class="text-xs text-slate-500">Find hidden patterns in your stress.</p>
                 </div>
            </div>

             <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-center gap-4 text-left">
                 <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                     <span class="material-symbols-outlined">picture_as_pdf</span>
                 </div>
                 <div>
                     <h4 class="font-bold text-slate-900 dark:text-white text-sm">PDF Export</h4>
                     <p class="text-xs text-slate-500">Share reports with counselors.</p>
                 </div>
            </div>
        </div>

        <button @click="goBack" class="mt-12 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            Return to Analytics
        </button>

    </main>
  </div>
</template>
