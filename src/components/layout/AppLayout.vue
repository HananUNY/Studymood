<script setup>
import BottomNav from './BottomNav.vue'
</script>

<template>
  <div class="min-h-screen font-sans text-base-content relative overflow-hidden flex flex-col items-center">
    <!-- Main Content Area -->
    <main class="w-full max-w-md md:max-w-2xl flex-grow px-4 sm:px-6 pb-32 pt-14 relative z-10 overflow-y-auto no-scrollbar">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
