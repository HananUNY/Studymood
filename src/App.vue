<script setup>
/**
 * Study Mood v2
 * Version: 0.1.3 Alpha
 * Developed by: Hanan Dimas Prasetya + Gemini AI
 */
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'
import TutorialOverlay from './components/TutorialOverlay.vue'
import PinLock from './components/common/PinLock.vue'
import { useUserStore } from './stores/userStore'

const route = useRoute()
const userStore = useUserStore()
const isDefaultLayout = computed(() => route.meta.layout !== 'empty')
</script>

<template>
  <AppLayout v-if="isDefaultLayout">
    <RouterView />
  </AppLayout>
  <RouterView v-else />

  <TutorialOverlay v-if="!userStore.hasSeenTutorial && route.name !== 'onboarding'" />
  <PinLock v-if="userStore.isLocked" />

  <!-- Watermark -->
  <div class="fixed top-2 right-4 z-[9999] text-[8px] font-bold text-slate-300 dark:text-slate-600 pointer-events-none opacity-50 select-none">
      v0.1.3 Alpha (30 Dec 2025) • Dikembangkan oleh Hanan Dimas Prasetya + Gemini AI
  </div>
</template>
