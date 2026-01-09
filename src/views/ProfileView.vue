<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useMoodStore } from '../stores/moodStore'
import { usePlanStore } from '../stores/planStore'
import { useSubjectStore } from '../stores/subjectStore'
import { useLocaleStore } from '../stores/localeStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const moodStore = useMoodStore()
const planStore = usePlanStore()
const subjectStore = useSubjectStore()
const localeStore = useLocaleStore()
const { t, locale } = storeToRefs(localeStore)

// State Mapping (Keeps template compatible)
const { name: userName, avatar: userAvatar, age: userAge, hobby: userHobby, motto: userMotto, preferences, pin } = storeToRefs(userStore)
const { logs } = storeToRefs(moodStore)

// Derived Stats
const totalLogs = computed(() => logs.value.length)
const streak = computed(() => moodStore.streak) // Getter from store

// Editing State
const showEditModal = ref(false)
const editingUser = ref({ name: '', age: '', hobby: '', motto: '' })
const fileInput = ref(null)

// Handlers
const openEditModal = () => {
    editingUser.value = {
        name: userName.value,
        age: userAge.value,
        hobby: userHobby.value,
        motto: userMotto.value
    }
    showEditModal.value = true
}

const saveProfile = () => {
    userStore.updateProfile({
        name: editingUser.value.name,
        age: editingUser.value.age,
        hobby: editingUser.value.hobby,
        motto: editingUser.value.motto
    })
    showEditModal.value = false
}

const randomizeAvatar = () => {
    const seed = Math.random().toString(36).substring(7)
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
    userStore.updateProfile({ avatar: newAvatar })
}

const toggleTheme = () => {
    userStore.toggleTheme()
}

const toggleNotifications = async () => {
    // 1. Save preference state locally
    userStore.updateProfile({ preferences: preferences.value })

    // 2. Check if Notifications are supported
    if (!('Notification' in window)) {
        alert("This browser does not support desktop notifications.")
        preferences.value.notifications = false
        return
    }

    // 3. Handle Permission if turned ON
    if (preferences.value.notifications) {
        if (Notification.permission === 'granted') {
            // Already granted, maybe show a test?
            new Notification("Study Mood", { body: "Notifications are enabled!" })
        } else if (Notification.permission !== 'denied') {
            // Request permission
            const permission = await Notification.requestPermission()
            if (permission === 'granted') {
                new Notification("Study Mood", { body: "Notifications are enabled!" })
            } else {
                preferences.value.notifications = false // User denied
            }
        } else {
            // Denied previously
            alert("Notifications are blocked. Please enable them in your device settings.")
            preferences.value.notifications = false
        }
    }
}

const toggleLanguage = () => {
    const newLang = locale.value === 'en' ? 'id' : 'en'
    localeStore.setLocale(newLang)
}

// Data Management
const exportData = () => {
    const userData = { ...userStore.$state }
    delete userData.pin // Keep PIN device-local

    const data = {
        user: userData,
        logs: moodStore.logs,
        weeklyLogs: moodStore.weeklyLogs,
        plans: planStore.plans,
        subjects: subjectStore.subjects,
        version: '1.0'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `studymood_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

const triggerImport = () => {
    fileInput.value.click()
}

const handleImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result)
            
            if (confirm("This will overwrite your current data. Are you sure?")) {
                // Restore User
                if (data.user) {
                    userStore.updateProfile(data.user)
                    // Explicitly handle preferences if deeply nested
                    if (data.user.preferences) {
                        // Ensure theme is applied
                        if (data.user.preferences.theme !== undefined) {
                            userStore.toggleTheme() // Toggle twice or check logic? 
                            // Better: userStore has logic to apply theme based on state
                            // We updated state via updateProfile, now force apply
                            if (data.user.preferences.theme) document.documentElement.classList.remove('dark')
                            else document.documentElement.classList.add('dark')
                        }
                    }
                }

                // Restore Logs
                if (data.logs && Array.isArray(data.logs)) {
                    moodStore.logs = data.logs
                }
                if (data.weeklyLogs && Array.isArray(data.weeklyLogs)) {
                    moodStore.weeklyLogs = data.weeklyLogs
                }

                // Restore Plans
                if (data.plans && Array.isArray(data.plans)) {
                    planStore.plans = data.plans
                }

                // Restore Subjects
                if (data.subjects && Array.isArray(data.subjects)) {
                    console.log('Restoring subjects:', data.subjects)
                    subjectStore.setSubjects(data.subjects)
                } else {
                    console.warn('No subjects found in import data', data.subjects)
                }

                alert("Data imported successfully! Reloading...")
                // Refresh to ensure all states are clean
                window.location.reload()
            }
        } catch (err) {
            console.error(err)
            alert("Failed to import data. Invalid file format.")
        }
    }
    reader.readAsText(file)
    // Reset input
    event.target.value = ''
}

const clearData = () => {
    if (confirm("Are you sure you want to clear ALL data? This cannot be undone.")) {
        localStorage.clear()
        // Force hard reload to root to trigger fresh state and router guard
        window.location.href = '/'
    }
}

// Coming Soon Features
const showComingSoon = ref(false)
const comingSoonData = ref({ title: '', message: '', icon: '' })

const manageSubjects = () => {
    comingSoonData.value = {
        title: 'Subject Management',
        message: 'Soon you will be able to add, edit, and color-code your subjects here!',
        icon: 'library_books'
    }
    showComingSoon.value = true
}

const weeklyGoals = () => {
    comingSoonData.value = {
        title: 'Weekly Goals',
        message: 'Set targets for your study hours and mood stability. Coming in v1.1!',
        icon: 'flag'
    }
    showComingSoon.value = true
}

const showTutorial = () => {
    userStore.resetTutorial()
    router.push('/dashboard')
}

    const showAbout = () => {
    comingSoonData.value = {
        title: 'StudyMood v0.1.3 (Alpha Build)',
        message: 'This is an Alpha Build (v0.1.3). Updated: 30 Dec 2025. Features are subject to change. Thank you for testing!',
        icon: 'info'
    }
    showComingSoon.value = true
}

const showTerms = () => {
    comingSoonData.value = {
        title: 'Terms of Service',
        message: 'Terms of Service content will be available here soon.',
        icon: 'gavel'
    }
    showComingSoon.value = true
}

const showPrivacy = () => {
    comingSoonData.value = {
        title: 'Privacy Policy',
        message: 'Privacy Policy content will be visible here. Your data is stored locally on your device.',
        icon: 'shield'
    }
    showComingSoon.value = true
}

// PIN Management
const showPinModal = ref(false)
// steps: 'create', 'confirm', 'remove'
const pinStep = ref('create') 
const tempPin = ref('')
const pinError = ref('')
const pinInputRef = ref('')

const openPinSetup = () => {
    if (pin.value) {
        // If pin exists, ask to remove
        pinStep.value = 'remove'
    } else {
        pinStep.value = 'create'
    }
    tempPin.value = ''
    pinInputRef.value = ''
    pinError.value = ''
    showPinModal.value = true
}

const savePin = () => {
    const val = pinInputRef.value
    if (val.length !== 4) {
        pinError.value = 'PIN must be 4 digits'
        return
    }

    if (pinStep.value === 'create') {
        tempPin.value = val
        pinStep.value = 'confirm'
        pinInputRef.value = ''
        pinError.value = ''
    } else if (pinStep.value === 'confirm') {
        if (val === tempPin.value) {
            userStore.setPin(val)
            showPinModal.value = false
        } else {
            pinError.value = 'PINs do not match. Try again.'
            pinStep.value = 'create'
            pinInputRef.value = ''
            tempPin.value = ''
        }
    } else if (pinStep.value === 'remove') {
        // Verify current pin to remove (Simplified: just compare)
        if (val === pin.value) {
            userStore.removePin()
            showPinModal.value = false
        } else {
            pinError.value = 'Incorrect PIN'
        }
    }
}
</script>

<template>
    <div class="flex flex-col min-h-screen font-display pb-24">
        
        <!-- Top App Bar (Floating) -->
        <div class="sticky top-2 z-20 mx-2 mt-2 flex items-center bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl p-3 justify-between rounded-[2rem] shadow-sm border border-white/20 dark:border-slate-700/50">
            <button @click="$router.push('/dashboard')" class="text-slate-600 dark:text-slate-300 flex w-12 shrink-0 items-center justify-start cursor-pointer hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h2 class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">{{ t.profile.title }}</h2>
            <div @click="openEditModal" class="flex w-12 items-center justify-end cursor-pointer text-primary hover:text-primary/80">
                <span class="material-symbols-outlined">edit</span>
            </div>
        </div>

        <!-- Profile Header -->
        <div class="flex p-4 flex-col items-center mt-4 animate-fade-in-down">
            <div class="relative">
                <div class="bg-white dark:bg-slate-800 rounded-full h-32 w-32 shadow-lg border-4 border-white dark:border-slate-800 overflow-hidden">
                    <img :src="userAvatar" alt="Avatar" class="w-full h-full object-cover">
                </div>
                <div @click="randomizeAvatar" class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-md cursor-pointer hover:bg-primary/90 transition-colors active:scale-90">
                    <span class="material-symbols-outlined text-sm">autorenew</span>
                </div>
            </div>
            <div class="flex flex-col items-center justify-center mt-4">
                <p class="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight text-center">{{ userName }}</p>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{{ userAge }} y/o</span>
                    <span class="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{{ userHobby }}</span>
                </div>
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium italic mt-2 text-center max-w-[250px]">"{{ userMotto }}"</p>
                <div class="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-primary/10 rounded-full">
                    <span class="material-symbols-outlined text-primary text-xs">verified</span>
                    <p class="text-primary text-xs font-bold uppercase tracking-wide">Pro Member</p>
                </div>
            </div>
        </div>

        <!-- ... Stats ... -->
        


        <!-- Security Section -->
        <div class="px-4 pb-2 mt-4">
             <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Security</h3>
             <div class="flex flex-col rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div @click="openPinSetup" class="flex items-center gap-4 p-4 justify-between active:bg-slate-50 dark:active:bg-slate-700/30 cursor-pointer transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-slate-500 flex items-center justify-center rounded-xl bg-slate-500/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">lock</span>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-slate-900 dark:text-white text-base font-medium leading-normal">{{ pin ? 'Manage App Lock' : 'Set App Lock' }}</p>
                            <p class="text-slate-400 text-xs">{{ pin ? 'PIN is set' : 'Protect your diary' }}</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
             </div>
        </div>

        <!-- Settings Section: Preferences -->
        <div class="px-4 pb-2 mt-8">
            <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 ml-1">{{ t.profile.settings }}</h3>
            <div class="flex flex-col rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <!-- Language Item -->
                <div class="flex items-center gap-4 p-4 justify-between border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-indigo-500 flex items-center justify-center rounded-xl bg-indigo-500/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">language</span>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-slate-900 dark:text-white text-base font-medium leading-normal">{{ t.profile.language }}</p>
                            <p class="text-slate-400 text-xs">{{ locale === 'en' ? t.profile.english : t.profile.indonesian }}</p>
                        </div>
                    </div>
                    <div class="shrink-0">
                        <button @click="toggleLanguage" class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-primary transition-all active:scale-95">
                            {{ locale === 'en' ? 'EN' : 'ID' }}
                        </button>
                    </div>
                </div>
                <!-- Theme Item -->
                <div class="flex items-center gap-4 p-4 justify-between border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">palette</span>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-slate-900 dark:text-white text-base font-medium leading-normal">{{ t.profile.dark_mode }}</p>
                            <p class="text-slate-400 text-xs">Toggle light/dark mode</p>
                        </div>
                    </div>
                    <div class="shrink-0">
                        <label class="relative flex h-[28px] w-[48px] cursor-pointer items-center rounded-full border-none bg-slate-200 dark:bg-slate-600 p-1 transition-all duration-200"
                           :class="{'bg-primary': preferences.theme}"
                        >
                            <input type="checkbox" :checked="preferences.theme" @change="toggleTheme" class="hidden" />
                            <div class="h-5 w-5 rounded-full bg-white shadow-sm transition-all transform"
                                :class="{ 'translate-x-5': preferences.theme }"
                            ></div>
                        </label>
                    </div>
                </div>
                <!-- Notifications Item -->
                <div class="flex items-center gap-4 p-4 justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-pink-500 flex items-center justify-center rounded-xl bg-pink-500/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">notifications</span>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-slate-900 dark:text-white text-base font-medium leading-normal">{{ t.profile.notifications }}</p>
                            <p class="text-slate-400 text-xs">8:00 PM</p>
                        </div>
                    </div>
                    <div class="shrink-0">
                         <label class="relative flex h-[28px] w-[48px] cursor-pointer items-center rounded-full border-none bg-slate-200 dark:bg-slate-600 p-1 transition-all duration-200"
                           :class="{'bg-primary': preferences.notifications}"
                        >
                            <input type="checkbox" v-model="preferences.notifications" @change="toggleNotifications" class="hidden" />
                            <div class="h-5 w-5 rounded-full bg-white shadow-sm transition-all transform"
                                :class="{ 'translate-x-5': preferences.notifications }"
                            ></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Settings Section: Study & Goals -->
        <div class="px-4 pb-2 mt-4">
            <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Study & Goals</h3>
            <div class="flex flex-col rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <!-- Subject Management -->
                <div @click="$router.push('/subjects')" class="flex items-center gap-4 p-4 justify-between border-b border-slate-50 dark:border-slate-700/50 active:bg-slate-50 dark:active:bg-slate-700/30 cursor-pointer transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-blue-500 flex items-center justify-center rounded-xl bg-blue-500/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">menu_book</span>
                        </div>
                        <p class="text-slate-900 dark:text-white text-base font-medium leading-normal flex-1 truncate">Manage Subjects</p>
                    </div>
                    <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
                <!-- Weekly Goal Setting -->
                <div @click="weeklyGoals" class="flex items-center gap-4 p-4 justify-between active:bg-slate-50 dark:active:bg-slate-700/30 cursor-pointer transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-amber-500 flex items-center justify-center rounded-xl bg-amber-500/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">flag</span>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-slate-900 dark:text-white text-base font-medium leading-normal">Weekly Goals</p>
                            <p class="text-slate-400 text-xs">3/5 Goals met</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
            </div>
        </div>

        <!-- Settings Section: App Guide -->
        <div class="px-4 pb-2 mt-4">
            <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Help & Guide</h3>
            <div class="flex flex-col rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <!-- Show Tutorial -->
                <div @click="showTutorial" class="flex items-center gap-4 p-4 justify-between active:bg-slate-50 dark:active:bg-slate-700/30 cursor-pointer transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-teal-500 flex items-center justify-center rounded-xl bg-teal-500/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">help</span>
                        </div>
                        <p class="text-slate-900 dark:text-white text-base font-medium leading-normal flex-1 truncate">Show Tutorial</p>
                    </div>
                    <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
            </div>
        </div>

        <!-- Settings Section: Data & Privacy -->
        <div class="px-4 pb-2 mt-4">
            <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Data & Privacy</h3>
            <div class="flex flex-col rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <!-- Import Data -->
                <div @click="triggerImport" class="flex items-center gap-4 p-4 justify-between border-b border-slate-50 dark:border-slate-700/50 active:bg-slate-50 dark:active:bg-slate-700/30 cursor-pointer transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-purple-600 flex items-center justify-center rounded-xl bg-purple-600/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">upload</span>
                        </div>
                        <p class="text-slate-900 dark:text-white text-base font-medium leading-normal flex-1 truncate">Import Data</p>
                    </div>
                    <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                    <input type="file" ref="fileInput" @change="handleImport" accept=".json" class="hidden" />
                </div>
                <!-- Export Data -->
                <div @click="exportData" class="flex items-center gap-4 p-4 justify-between border-b border-slate-50 dark:border-slate-700/50 active:bg-slate-50 dark:active:bg-slate-700/30 cursor-pointer transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-green-600 flex items-center justify-center rounded-xl bg-green-600/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">download</span>
                        </div>
                        <p class="text-slate-900 dark:text-white text-base font-medium leading-normal flex-1 truncate">Export My Data</p>
                    </div>
                    <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
                <!-- Clear Data -->
                <div @click="clearData" class="flex items-center gap-4 p-4 justify-between active:bg-red-50 dark:active:bg-red-900/10 cursor-pointer group transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-red-500 flex items-center justify-center rounded-xl bg-red-500/10 shrink-0 w-10 h-10 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <span class="material-symbols-outlined">delete_forever</span>
                        </div>
                        <p class="text-red-500 text-base font-medium leading-normal flex-1 truncate">{{ t.profile.clear_data }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Settings Section: About & Legal -->
        <div class="px-4 pb-6 mt-4">
            <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 ml-1">About & Legal</h3>
            <div class="flex flex-col rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <!-- About App -->
                <div @click="showAbout" class="flex items-center gap-4 p-4 justify-between border-b border-slate-50 dark:border-slate-700/50 active:bg-slate-50 dark:active:bg-slate-700/30 cursor-pointer transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-slate-500 flex items-center justify-center rounded-xl bg-slate-500/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">info</span>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-slate-900 dark:text-white text-base font-medium leading-normal">About App</p>
                            <p class="text-slate-400 text-xs font-mono">v0.1.3 Alpha</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
                <!-- Terms of Service -->
                <div @click="showTerms" class="flex items-center gap-4 p-4 justify-between border-b border-slate-50 dark:border-slate-700/50 active:bg-slate-50 dark:active:bg-slate-700/30 cursor-pointer transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-slate-500 flex items-center justify-center rounded-xl bg-slate-500/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">gavel</span>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-slate-900 dark:text-white text-base font-medium leading-normal">Terms of Service</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
                <!-- Privacy Policy -->
                <div @click="showPrivacy" class="flex items-center gap-4 p-4 justify-between active:bg-slate-50 dark:active:bg-slate-700/30 cursor-pointer transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="text-slate-500 flex items-center justify-center rounded-xl bg-slate-500/10 shrink-0 w-10 h-10">
                            <span class="material-symbols-outlined">shield</span>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-slate-900 dark:text-white text-base font-medium leading-normal">Privacy Policy</p>
                        </div>
                    </div>
                    <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                </div>
            </div>
        </div>

    </div>

    <!-- Edit Profile Modal -->
    <Teleport to="body">
        <!-- 1. Backdrop (Fade Only) -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="showEditModal" class="fixed inset-0 z-[9998] bg-slate-900/20 backdrop-blur-sm pointer-events-auto" @click="showEditModal = false"></div>
        </Transition>

        <!-- 2. Modal Content (Slide Only) -->
        <Transition
            enter-active-class="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            enter-from-class="translate-y-8 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-8 opacity-0"
        >
            <div v-if="showEditModal" class="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center pointer-events-none p-4 pb-6 sm:pb-4">
                <div class="w-full max-w-md bg-white/90 dark:bg-[#1a202c]/90 backdrop-blur-2xl rounded-[2.5rem] p-6 pb-12 shadow-2xl transform transition-all pointer-events-auto border border-white/20 dark:border-slate-700/50">
                    
                    <div class="flex justify-center mb-6">
                        <div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>

                    <h3 class="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">Edit Profile</h3>

                    <div class="space-y-4">
                        <!-- Name -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Display Name</label>
                            <input v-model="editingUser.name" type="text" class="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-4 py-3 border-2 border-transparent focus:border-primary focus:outline-none transition-all font-bold placeholder:font-medium" placeholder="Your Name">
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <!-- Age -->
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Age</label>
                                <input v-model="editingUser.age" type="number" class="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-4 py-3 border-2 border-transparent focus:border-primary focus:outline-none transition-all font-bold placeholder:font-medium" placeholder="18">
                            </div>
                            <!-- Hobby -->
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Hobby</label>
                                <input v-model="editingUser.hobby" type="text" class="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-4 py-3 border-2 border-transparent focus:border-primary focus:outline-none transition-all font-bold placeholder:font-medium" placeholder="Reading">
                            </div>
                        </div>

                        <!-- Motto -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Life Motto</label>
                            <textarea v-model="editingUser.motto" rows="2" class="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl px-4 py-3 border-2 border-transparent focus:border-primary focus:outline-none transition-all font-bold placeholder:font-medium resize-none" placeholder="Your favorite quote..."></textarea>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-8">
                        <button @click="showEditModal = false" class="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                        <button @click="saveProfile" class="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all">Save Changes</button>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>

    <!-- Coming Soon Modal -->
    <Teleport to="body">
        <!-- 1. Backdrop (Fade Only) -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="showComingSoon" class="fixed inset-0 z-[9998] bg-slate-900/20 backdrop-blur-sm pointer-events-auto" @click="showComingSoon = false"></div>
        </Transition>

        <!-- 2. Modal Content (Slide Only) -->
        <Transition
            enter-active-class="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            enter-from-class="translate-y-8 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-8 opacity-0"
        >
            <div v-if="showComingSoon" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <div class="w-full max-w-sm bg-white/90 dark:bg-[#1a202c]/90 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl transform transition-all pointer-events-auto text-center border border-white/20 dark:border-slate-700/50">
                    
                    <div class="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <span class="material-symbols-outlined text-3xl text-primary">{{ comingSoonData.icon }}</span>
                    </div>

                    <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">{{ comingSoonData.title }}</h3>
                    <p class="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">{{ comingSoonData.message }}</p>

                    <button @click="showComingSoon = false" class="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Got it!
                    </button>

                </div>
            </div>
        </Transition>
    </Teleport>

    <!-- PIN Setup Modal -->
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div v-if="showPinModal" class="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-800 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-white/20">
                    <div class="flex items-center justify-center mb-6">
                        <div class="bg-primary/10 p-4 rounded-full">
                            <span class="material-symbols-outlined text-3xl text-primary">lock</span>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
                        {{ pinStep === 'remove' ? 'Remove PIN' : (pinStep === 'confirm' ? 'Confirm PIN' : 'Set New PIN') }}
                    </h3>
                    <p class="text-center text-slate-500 dark:text-slate-400 text-sm mb-6">
                        {{ pinStep === 'remove' ? 'Enter current PIN to disable.' : (pinStep === 'confirm' ? 'Re-enter your PIN.' : 'Enter a 4-digit PIN.') }}
                    </p>

                    <div class="flex justify-center mb-6">
                        <input 
                            v-model="pinInputRef" 
                            type="password" 
                            inputmode="numeric" 
                            maxlength="4" 
                            class="text-center text-3xl font-bold tracking-[0.5em] bg-slate-100 dark:bg-slate-700 rounded-xl py-3 w-40 border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
                            placeholder="••••"
                        />
                    </div>

                    <p v-if="pinError" class="text-red-500 text-xs font-bold text-center mb-4 animate-pulse">{{ pinError }}</p>

                    <div class="flex gap-3">
                        <button @click="showPinModal = false" class="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                        <button @click="savePin" class="flex-1 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg hover:opacity-90 active:scale-95 transition-all">
                            {{ pinStep === 'remove' ? 'Remove' : 'Save' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* Animation classes if needed, reuse global or define here */
</style>
