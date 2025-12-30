<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSubjectStore } from '../stores/subjectStore'
import { useLocaleStore } from '../stores/localeStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const subjectStore = useSubjectStore()
const localeStore = useLocaleStore()
const { t } = storeToRefs(localeStore)

// State
const { subjects } = storeToRefs(subjectStore)
const newSubjectName = ref('')
const selectedPaletteIndex = ref(0)
const showValidation = ref(false)

// Palette Options
const palette = [
  { color: 'bg-blue-100 text-blue-800', ring: 'ring-blue-300', bg: 'bg-blue-300' },
  { color: 'bg-pink-100 text-pink-800', ring: 'ring-pink-300', bg: 'bg-pink-300' },
  { color: 'bg-green-100 text-green-800', ring: 'ring-green-300', bg: 'bg-green-300' },
  { color: 'bg-yellow-100 text-yellow-800', ring: 'ring-yellow-300', bg: 'bg-yellow-300' },
  { color: 'bg-purple-100 text-purple-800', ring: 'ring-purple-300', bg: 'bg-purple-300' },
  { color: 'bg-orange-100 text-orange-800', ring: 'ring-orange-300', bg: 'bg-orange-300' },
  { color: 'bg-cyan-100 text-cyan-800', ring: 'ring-cyan-300', bg: 'bg-cyan-300' },
  { color: 'bg-red-100 text-red-800', ring: 'ring-red-300', bg: 'bg-red-300' },
]

// Actions
const goBack = () => router.back()

const addNewSubject = () => {
    if (!newSubjectName.value.trim()) {
        showValidation.value = true
        setTimeout(() => showValidation.value = false, 2000)
        return
    }

    const id = newSubjectName.value.toLowerCase().trim().replace(/\s+/g, '-')
    // Check duplicate
    if (subjects.value.find(s => s.id === id)) {
        alert('Subject already exists!')
        return
    }

    const colorObj = palette[selectedPaletteIndex.value]
    
    subjectStore.addSubject({
        id,
        label: newSubjectName.value.trim(),
        emoji: '🔖', // Default emoji, maybe add picker later
        color: colorObj.color,
        ring: colorObj.ring
    })

    newSubjectName.value = ''
    // minimal feedback
}

const deleteSubject = (id) => {
    if (confirm('Are you sure you want to delete this subject?')) {
        subjectStore.removeSubject(id)
    }
}

</script>

<template>
    <div class="flex flex-col min-h-screen font-display bg-slate-50 dark:bg-background-dark pb-24">
        
        <!-- Top App Bar -->
        <div class="sticky top-2 z-20 mx-2 mt-2 flex items-center bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl p-3 justify-between rounded-[2rem] shadow-sm border border-white/20 dark:border-slate-700/50">
            <button @click="goBack" class="text-slate-600 dark:text-slate-300 flex w-12 shrink-0 items-center justify-start cursor-pointer hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h2 class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">Manage Subjects</h2>
            <div class="w-12"></div> <!-- Spacer -->
        </div>

        <div class="p-6 flex flex-col gap-8">

            <!-- Add New Section -->
            <section>
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Add New Subject</h3>
                
                <div class="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700/50">
                    <!-- Name Input -->
                    <div class="flex items-center gap-2 mb-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 pl-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <input 
                            v-model="newSubjectName" 
                            @keyup.enter="addNewSubject"
                            type="text" 
                            placeholder="Subject name (e.g. Biology)" 
                            class="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-white placeholder-slate-400 font-bold"
                        >
                        <button 
                            @click="addNewSubject"
                            class="w-10 h-10 flex items-center justify-center rounded-xl transition-all"
                            :class="newSubjectName.trim() ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'"
                            :disabled="!newSubjectName.trim()"
                        >
                            <span class="material-symbols-outlined">add</span>
                        </button>
                    </div>

                    <!-- Palette -->
                    <div>
                         <p class="text-xs font-bold text-slate-400 mb-2">Color Tag</p>
                         <div class="flex flex-wrap gap-3">
                            <button 
                                v-for="(p, index) in palette" 
                                :key="index"
                                @click="selectedPaletteIndex = index"
                                class="w-8 h-8 rounded-full transition-all duration-200 focus:outline-none ring-offset-2 dark:ring-offset-slate-800 flex items-center justify-center transform"
                                :class="[p.bg, selectedPaletteIndex === index ? 'ring-2 ring-slate-400 scale-110' : 'hover:scale-105']"
                            >
                                <span v-show="selectedPaletteIndex === index" class="material-symbols-outlined text-slate-900/50 text-sm font-bold">check</span>
                            </button>
                         </div>
                    </div>
                </div>
            </section>

            <!-- Existing List -->
            <section>
                 <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Your Subjects</h3>
                 
                 <div class="grid grid-cols-1 gap-3">
                     <div v-for="subj in subjects" :key="subj.id" class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm group">
                         <div class="flex items-center gap-4">
                             <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner" :class="subj.color">
                                 {{ subj.emoji }}
                             </div>
                             <span class="font-bold text-slate-800 dark:text-white text-base">{{ subj.label }}</span>
                         </div>
                         
                         <button @click="deleteSubject(subj.id)" class="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                             <span class="material-symbols-outlined text-lg">delete</span>
                         </button>
                     </div>
                     
                     <div v-if="subjects.length === 0" class="text-center py-8 text-slate-400">
                         No subjects yet. Add one above!
                     </div>
                 </div>
            </section>

        </div>
    </div>
</template>
