<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useUserStore } from '../stores/userStore'
import { useMoodStore } from '../stores/moodStore'
import { useSubjectStore } from '../stores/subjectStore'
import { usePWA } from '../composables/usePWA'

const router = useRouter()
const userStore = useUserStore()
const moodStore = useMoodStore()
const subjectStore = useSubjectStore()

const { canInstall, installApp } = usePWA()

const currentStep = ref(1)

// Made reactive to support adding new subjects
const subjects = ref([
  { id: 'math', label: 'Math', emoji: '📐', color: 'bg-blue-100 text-blue-800', ring: 'ring-blue-100' },
  { id: 'literature', label: 'Literature', emoji: '📚', color: 'bg-pink-100 text-pink-800', ring: 'ring-pink-100' },
  { id: 'science', label: 'Science', emoji: '🧬', color: 'bg-green-100 text-green-800', ring: 'ring-green-100' },
  { id: 'history', label: 'History', emoji: '🏛️', color: 'bg-yellow-100 text-yellow-800', ring: 'ring-yellow-100' },
  { id: 'languages', label: 'Languages', emoji: '💬', color: 'bg-purple-100 text-purple-800', ring: 'ring-purple-100' },
  { id: 'art', label: 'Art', emoji: '🎨', color: 'bg-orange-100 text-orange-800', ring: 'ring-orange-100' },
  { id: 'compsci', label: 'Comp Sci', emoji: '💻', color: 'bg-cyan-100 text-cyan-800', ring: 'ring-cyan-100' },
])

const selectedSubjects = ref(['math'])
const customSubject = ref('')

// Palette options for new subjects
const palette = [
  { color: 'bg-pink-100 text-pink-800', ring: 'ring-pink-300', bg: 'bg-pink-300' },
  { color: 'bg-blue-100 text-blue-800', ring: 'ring-blue-300', bg: 'bg-blue-300' },
  { color: 'bg-green-100 text-green-800', ring: 'ring-green-300', bg: 'bg-green-300' },
  { color: 'bg-yellow-100 text-yellow-800', ring: 'ring-yellow-300', bg: 'bg-yellow-300' },
  { color: 'bg-purple-100 text-purple-800', ring: 'ring-purple-300', bg: 'bg-purple-300' },
]
const selectedColorIndex = ref(0)

// Step 3: Moods
const moods = [
  { id: 'burnout', label: 'Burnout', emoji: '🤯', color: 'bg-red-100 text-red-600', ring: 'red-200' },
  { id: 'not_great', label: 'Not Great', emoji: '😞', color: 'bg-orange-100 text-orange-600', ring: 'orange-200' },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-yellow-100 text-yellow-600', ring: 'yellow-200' },
  { id: 'good', label: 'Good', emoji: '🙂', color: 'bg-lime-100 text-lime-600', ring: 'lime-200' },
  { id: 'energetic', label: 'Energetic', emoji: '🤩', color: 'bg-green-100 text-green-600', ring: 'green-200' },
]

// Step 1: User Profile
const userName = ref('')
const educationLevel = ref('')
const educationOptions = ['Elementary', 'Middle School', 'High School', 'University']
const showValidation = ref(false)

const selectedMood = ref('neutral') // Default to neutral
const selectedCheckInSubject = ref(null)
const note = ref('')
const moodContainer = ref(null)

const handleMoodScroll = () => {
    if (!moodContainer.value) return
    const container = moodContainer.value
    const center = container.scrollLeft + (container.clientWidth / 2)
    
    let closestMood = null
    let minDistance = Infinity

    Array.from(container.children).forEach(child => {
        const childCenter = child.offsetLeft + (child.clientWidth / 2)
        const distance = Math.abs(center - childCenter)
        
        if (distance < minDistance) {
            minDistance = distance
            closestMood = child.getAttribute('data-id')
        }
    })

    if (closestMood && closestMood !== selectedMood.value) {
        selectedMood.value = closestMood
    }
}

const fullScrollToMood = (id) => {
    selectedMood.value = id
    const container = moodContainer.value
    if (!container) return
    
    const target = Array.from(container.children).find(child => child.getAttribute('data-id') === id)
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
}


const mySubjects = computed(() => subjects.value.filter(s => selectedSubjects.value.includes(s.id)))

const toggleSubject = (id) => {
  if (selectedSubjects.value.includes(id)) {
    selectedSubjects.value = selectedSubjects.value.filter(s => s !== id)
  } else {
    selectedSubjects.value.push(id)
  }
}

const addCustomSubject = () => {
    if (!customSubject.value.trim()) return

    const newId = customSubject.value.toLowerCase().replace(/\s+/g, '-')
    const newSubject = {
        id: newId,
        label: customSubject.value.trim(),
        emoji: '🔖', 
        color: palette[selectedColorIndex.value].color,
        ring: palette[selectedColorIndex.value].ring
    }

    subjects.value.push(newSubject)
    selectedSubjects.value.push(newId)
    customSubject.value = ''
}

const transitionName = ref('slide-left')

const nextStep = () => {
  if (currentStep.value === 1) {
      if (!userName.value.trim() || !educationLevel.value) {
          showValidation.value = true
          setTimeout(() => showValidation.value = false, 2000)
          return
      }
  }

  transitionName.value = 'slide-left'
  if (currentStep.value < 3) currentStep.value++
  else finishOnboarding()
}

const prevStep = () => {
  transitionName.value = 'slide-right'
  if (currentStep.value > 1) currentStep.value--
}

const goToStep3 = () => {
    transitionName.value = 'slide-left'
    currentStep.value = 3
    if (mySubjects.value.length > 0) selectedCheckInSubject.value = mySubjects.value[0].id
    
    nextTick(() => {
        fullScrollToMood('neutral')
    })
}

const isDark = ref(document.documentElement.classList.contains('dark'))

const toggleTheme = () => {
    // We can use store or just manual toggle. 
    // Store toggle is better but userStore might not be persisted fully till finishOnboarding.
    // For now, let's just toggle visually and update UserStore silently if we want.
    isDark.value = !isDark.value
    userStore.toggleTheme() // This ensures persistence
}

const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 5) return { text: 'Good Evening', icon: '🌙' }
    if (hour < 12) return { text: 'Good Morning', icon: '🌅' }
    if (hour < 18) return { text: 'Good Afternoon', icon: '☀️' }
    return { text: 'Good Evening', icon: '🌙' }
})

const finishOnboarding = () => {
  // 1. Save Profile
  userStore.updateProfile({
      name: userName.value,
      educationStage: educationLevel.value,
      isOnboarded: true
  })
  
  // 2. Save Subjects
  // Filter the full subjects list to only include those selected or added
  const activeSubjects = subjects.value.filter(s => selectedSubjects.value.includes(s.id))
  subjectStore.setSubjects(activeSubjects)
  
  // 3. Add Initial Log
  if (selectedMood.value) {
      moodStore.addLog({
          mood: selectedMood.value,
          subject: selectedCheckInSubject.value,
          note: note.value
      })
  }

  router.push('/dashboard')
}



// GSAP Transition Handlers
const onEnter = (el, done) => {
  const isNext = transitionName.value === 'slide-left'
  gsap.fromTo(el,
    { x: isNext ? '100%' : '-100%' },
    { x: 0, duration: 0.6, ease: 'power3.out', onComplete: done }
  )
}

const onLeave = (el, done) => {
  const isNext = transitionName.value === 'slide-left'
  gsap.to(el,
    { x: isNext ? '-100%' : '100%', duration: 0.6, ease: 'power3.out', onComplete: done }
  )
}
</script>

<template>
  <div class="relative flex h-[100dvh] w-full max-w-md mx-auto flex-col overflow-hidden bg-slate-50 shadow-2xl sm:my-8 sm:rounded-[3rem] sm:border-[8px] sm:border-slate-900 sm:h-[800px] transition-colors duration-300 font-display">
    
    <Transition @enter="onEnter" @leave="onLeave" :css="false">
        <!-- STEP 1: WELCOME BOARD -->
        <div v-if="currentStep === 1" class="absolute inset-0 w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 z-10 transition-colors duration-300">
            <!-- Top Navigation -->
            <div class="relative z-20 flex px-6 py-4 justify-between items-center pt-12 sm:pt-8 min-h-[80px]">
                <!-- Dots Indicator (Moved to Top) -->
                <div class="flex flex-row items-center gap-2">
                    <div class="h-2.5 w-8 rounded-full bg-primary transition-all duration-300"></div>
                    <div class="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300"></div>
                    <div class="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300"></div>
                </div>

                <div class="flex items-center gap-3">
                    <!-- Theme Toggle -->
                    <button @click="toggleTheme" class="w-9 h-9 flex items-center justify-center rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all">
                        <span class="material-symbols-outlined text-xl">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
                    </button>


                </div>
            </div>

            <!-- Main Content Area -->
            <div class="relative z-10 flex flex-1 flex-col items-center justify-center w-full px-6 overflow-y-auto no-scrollbar pb-10">
                <!-- Hero Illustration (Smaller) -->
                <div class="relative w-[180px] h-[180px] flex items-center justify-center mb-6 shrink-0">
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-pastel-lavender rounded-[2rem] -rotate-3"></div>
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-pastel-pink/50 rounded-[2rem] rotate-2"></div>
                    <div class="relative w-[80%] h-[80%] bg-white rounded-[1.8rem] shadow-sm z-10 overflow-hidden ring-4 ring-white flex items-center justify-center p-4">
                        <img src="/logo.svg" alt="Study Mood Logo" class="w-full h-full object-contain" />
                    </div>
                </div>

                <!-- Typography -->
                <div class="flex flex-col items-center text-center space-y-2 max-w-[320px] mb-8">
                    <h1 class="text-slate-900 dark:text-white tracking-tight text-[28px] font-extrabold leading-[1.15] transition-colors">Welcome to <br/><span class="text-primary relative inline-block">Study Mood <svg class="absolute w-full h-2 -bottom-0 left-0 text-pastel-pink -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" stroke-width="8"></path></svg></span></h1>
                    <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed transition-colors">Let's get to know you better to personalize your experience.</p>
                </div>

                <!-- Setup Form -->
                <div class="w-full max-w-xs space-y-5">
                    <!-- Name Input -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1 transition-colors">Your Name</label>
                        <input 
                            v-model="userName"
                            type="text" 
                            placeholder="Enter your nickname"
                            class="w-full px-5 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-slate-700 dark:text-white placeholder-slate-400 shadow-sm"
                        >
                    </div>

                    <!-- Education Level Selector -->
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1 transition-colors">Education Level</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button 
                                v-for="level in educationOptions"
                                :key="level"
                                @click="educationLevel = level"
                                class="py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all duration-200"
                                :class="educationLevel === level ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'"
                            >
                                {{ level }}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Validation Message -->
                     <div v-if="showValidation" class="text-red-500 text-xs font-bold text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg animate-pulse">
                        Please enter your name and select a level!
                    </div>
                </div>
            </div>

            <!-- Bottom Nav -->
            <div class="relative z-20 flex w-full flex-row items-center justify-end px-8 py-8 sm:pb-12">
                <button @click="nextStep" class="group relative flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95">
                    <span class="material-symbols-outlined text-2xl group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </button>
            </div>
        </div>


        <!-- STEP 2: SUBJECT SELECTION -->
        <div v-else-if="currentStep === 2" class="absolute inset-0 w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 z-10 p-8 pt-12 sm:pt-8 transition-colors duration-300">
            <!-- Header -->
            <div class="relative z-20 flex justify-between items-center mb-8">
                <button @click="prevStep" class="w-8 h-8 rounded-full bg-white/60 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <span class="material-symbols-outlined text-lg">arrow_back</span>
                </button>
                
                <div class="flex flex-row items-center gap-2">
                    <div class="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300"></div>
                    <div class="h-2.5 w-8 rounded-full bg-primary transition-all duration-300"></div>
                    <div class="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300"></div>
                </div>

                <!-- Placeholder to balance flex or Skip -->
                <div class="w-8"></div> 
            </div>

            <div class="flex-1 overflow-y-auto no-scrollbar pb-20">
                <h1 class="text-slate-900 dark:text-white tracking-tight text-[32px] font-extrabold leading-[1.15] mb-3 transition-colors">What are you <br/>studying?</h1>
                <p class="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed mb-8 transition-colors">Pick the subjects you want to track to personalize your mood journal.</p>

                <!-- Suggested Subjects -->
                <div class="mb-8">
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Suggested Subjects</h3>
                    <div class="flex flex-wrap gap-3">
                        <button 
                            v-for="subject in subjects" 
                            :key="subject.id"
                            @click="toggleSubject(subject.id)"
                            class="flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 border-2"
                            :class="selectedSubjects.includes(subject.id) ? `${subject.color} border-current shadow-sm` : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
                        >
                            <span>{{ subject.emoji }}</span>
                            <span class="font-bold text-sm">{{ subject.label }}</span>
                            <span v-if="selectedSubjects.includes(subject.id)" class="material-symbols-outlined text-base">check_circle</span>
                        </button>
                    </div>
                </div>

                <!-- Custom Subject -->
                <div>
                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Custom Subject</h3>
                    <div class="flex items-center gap-2 mb-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-2 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <input 
                            v-model="customSubject" 
                            @keyup.enter="addCustomSubject"
                            type="text" 
                            placeholder="Add a new subject..." 
                            class="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-white placeholder-slate-400 font-medium"
                        >
                        <button 
                            @click="addCustomSubject"
                            class="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                            :class="customSubject.trim() ? 'bg-primary text-white hover:brightness-110' : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-500 cursor-not-allowed'"
                            :disabled="!customSubject.trim()"
                        >
                            <span class="material-symbols-outlined">add</span>
                        </button>
                    </div>
                    <!-- Palette -->
                    <div class="flex items-center gap-2 px-2">
                        <span class="text-xs text-slate-400 font-medium">Palette:</span>
                        <button 
                            v-for="(p, index) in palette" 
                            :key="index"
                            @click.prevent="selectedColorIndex = index"
                            class="w-10 h-10 rounded-full transition-all duration-200 focus:outline-none ring-offset-2 dark:ring-offset-slate-900 flex items-center justify-center transform"
                            :class="[p.bg, selectedColorIndex === index ? 'ring-4 ring-slate-300 dark:ring-slate-600 scale-110 shadow-md' : 'hover:scale-105']"
                            type="button"
                        >
                            <span v-show="selectedColorIndex === index" class="material-symbols-outlined text-slate-900 text-xl font-bold select-none">check</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Bottom Action -->
            <div class="flex flex-col items-center gap-4 mt-auto">
                <button @click="goToStep3" class="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                    All Set
                    <span class="material-symbols-outlined">arrow_forward</span>
                </button>

            </div>
        </div>

        <!-- STEP 3: MOOD CHECK-IN -->
        <div v-else class="absolute inset-0 w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 z-10 p-8 pt-12 sm:pt-8 transition-colors duration-300">
            <!-- Navbar/Indicators for Step 3 -->
            <div class="relative z-20 flex justify-between items-center mb-6">
                <button @click="prevStep" class="w-8 h-8 rounded-full bg-white/60 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <span class="material-symbols-outlined text-lg">arrow_back</span>
                </button>

                <div class="flex flex-row items-center gap-2">
                    <div class="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300"></div>
                    <div class="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300"></div>
                    <div class="h-2.5 w-8 rounded-full bg-primary transition-all duration-300"></div>
                </div>

            </div>

            <!-- Greeting Pill -->
            <div class="flex justify-center mb-6">
                <div class="bg-primary/10 backdrop-blur-sm px-6 py-2 rounded-full text-xs font-bold tracking-wider text-primary uppercase shadow-sm border border-primary/20">
                    {{ greeting.text }} {{ greeting.icon }}
                </div>
            </div>

            <div class="flex-1 overflow-y-auto no-scrollbar pb-20">
                <!-- Question -->
                <div class="text-center mb-8 space-y-2">
                <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight transition-colors">
                    How are you <br/>
                    <span class="text-primary relative inline-block">
                    feeling today?
                    <svg class="absolute w-full h-2 -bottom-0 left-0 text-pastel-pink -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" stroke-width="8"></path></svg>
                    </span>
                </h1>
                </div>

                <!-- Mood Selector (Swipeable) -->
                <div class="relative w-full mb-10 group">
                    <!-- Gradient Fade Masks -->
                    <div class="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none transition-colors duration-300"></div>
                    <div class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none transition-colors duration-300"></div>

                    <div 
                        ref="moodContainer"
                        @scroll="handleMoodScroll"
                        class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-[calc(50%-3rem)] py-8 gap-6"
                    >
                        <button 
                            v-for="mood in moods" 
                            :key="mood.id"
                            @click="fullScrollToMood(mood.id)"
                            :data-id="mood.id"
                            class="snap-center shrink-0 flex flex-col items-center justify-center transition-all duration-300 ease-out transform"
                            :class="selectedMood === mood.id ? 'scale-125 opacity-100 z-20' : 'scale-90 opacity-40 grayscale blur-[0.5px] z-10'"
                        >
                            <div 
                                class="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg transition-all duration-500 mb-3"
                                :class="[
                                    selectedMood === mood.id ? mood.color + ' ring-4 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-900' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500',
                                    selectedMood === mood.id ? 'ring-' + mood.ring : ''
                                ]"
                            >
                                <span class="transform transition-transform duration-300" :class="selectedMood === mood.id ? 'scale-110' : ''">{{ mood.emoji }}</span>
                            </div>
                            <span 
                                class="text-sm font-extrabold tracking-wide uppercase transition-colors duration-300"
                                :class="selectedMood === mood.id ? 'text-slate-800 dark:text-slate-200 translate-y-0 opacity-100' : 'text-slate-300 dark:text-slate-600 translate-y-2 opacity-0'"
                            >
                                {{ mood.label }}
                            </span>
                        </button>
                    </div>
                </div>

                <!-- Subject Selector -->
                <div class="mb-8">
                <h3 class="text-center text-sm font-bold text-slate-900 dark:text-white mb-4 transition-colors">What are you studying?</h3>
                <div class="flex overflow-x-auto no-scrollbar gap-3 px-1 py-2 -mx-5 px-5 snap-x">
                    <button 
                        v-for="subject in mySubjects" 
                        :key="subject.id"
                        @click="selectedCheckInSubject = subject.id"
                        class="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-200 border-2 snap-center"
                        :class="selectedCheckInSubject === subject.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 transform -translate-y-1' : 'bg-white dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
                    >
                        <span class="text-lg">{{ subject.emoji }}</span>
                        <span class="font-bold whitespace-nowrap">{{ subject.label }}</span>
                    </button>
                    <div v-if="mySubjects.length === 0" class="text-sm text-slate-400 italic w-full text-center">
                    No subjects selected.
                    </div>
                </div>
                </div>

                <!-- Note Input -->
                <div class="mb-4">
                <textarea 
                    v-model="note"
                    placeholder="Quick notes (optional)..."
                    class="w-full h-32 bg-white dark:bg-slate-800 rounded-[2rem] p-6 text-slate-700 dark:text-white placeholder-slate-400 border-none focus:ring-0 shadow-sm resize-none text-base transition-colors"
                ></textarea>
                </div>
            </div>

            <!-- Bottom Action -->
            <div class="flex flex-col items-center gap-4 mt-auto">
                <button @click="finishOnboarding" class="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                    Next
                </button>
            </div>
        </div>
    </Transition>
  </div>

  <!-- PWA Install Modal -->
  <Teleport to="body">
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-10" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-10">
      <div v-if="canInstall" class="fixed bottom-6 left-4 right-4 z-[9990] flex justify-center pointer-events-none">
        <div class="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-4 w-full max-w-sm pointer-events-auto">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-xl">download</span>
             </div>
             <div>
                <h4 class="font-bold text-sm">Install App</h4>
                <p class="text-xs text-slate-300">Works offline & faster access.</p>
             </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="canInstall = false" class="text-xs font-bold text-slate-400 hover:text-white transition-colors px-2 py-1">Later</button>
            <button @click="installApp" class="text-xs font-bold bg-white text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">Install</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>



<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
