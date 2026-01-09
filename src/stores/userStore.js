import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'

export const useUserStore = defineStore('user', () => {
    // State
    const name = ref('Student')
    const avatar = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')
    const age = ref('18')
    const hobby = ref('Reading')
    const motto = ref('Focus on progress, not perfection.')
    const isOnboarded = ref(false)
    const educationStage = ref('High School')
    const hasSeenTutorial = ref(false)
    const pin = ref(null) // null = no pin set
    const isLocked = ref(false) // Session lock state

    // Preferences
    const preferences = ref({
        theme: true, // true = Pastel (Light), false = Dark
        notifications: true
    })

    // Init Logic
    function init() {
        const stored = localStorage.getItem('sm_user')
        if (stored) {
            try {
                const data = JSON.parse(stored)
                if (data) {
                    name.value = data.name || 'Student'
                    avatar.value = data.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
                    age.value = data.age || '18'
                    hobby.value = data.hobby || 'Reading'
                    motto.value = data.motto || 'Focus on progress, not perfection.'
                    isOnboarded.value = data.isOnboarded || false
                    educationStage.value = data.educationStage || 'High School'
                    if (data.preferences) preferences.value = data.preferences
                    if (data.preferences) preferences.value = data.preferences
                    if (data.hasSeenTutorial !== undefined) hasSeenTutorial.value = data.hasSeenTutorial
                    if (data.pin) {
                        pin.value = data.pin
                        isLocked.value = true // Auto-lock on load if pin exists
                    }
                }
            } catch (e) {
                console.error('Error loading user data', e)
                // Fallback to defaults already set in state refs
            }
        }

        // Setup Legacy Migration if needed (from old keys to new sm_user)
        migrateLegacyData()

        applyTheme()
    }

    function migrateLegacyData() {
        if (localStorage.getItem('studyMood_userName')) {
            name.value = localStorage.getItem('studyMood_userName')
            localStorage.removeItem('studyMood_userName')
        }
        if (localStorage.getItem('studyMood_userAvatar')) {
            avatar.value = localStorage.getItem('studyMood_userAvatar')
            localStorage.removeItem('studyMood_userAvatar')
        }
        // ... migrate others if critical
    }

    // Actions
    function updateProfile(updates) {
        if (updates.name) name.value = updates.name
        if (updates.age) age.value = updates.age
        if (updates.hobby) hobby.value = updates.hobby
        if (updates.motto) motto.value = updates.motto
        if (updates.avatar) avatar.value = updates.avatar
        if (updates.educationStage) educationStage.value = updates.educationStage
        if (updates.isOnboarded !== undefined) isOnboarded.value = updates.isOnboarded
        if (updates.preferences) preferences.value = { ...preferences.value, ...updates.preferences }
        save()
    }

    function setOnboarded(status) {
        isOnboarded.value = status
        save()
    }

    function completeTutorial() {
        hasSeenTutorial.value = true
        save()
    }

    function resetTutorial() {
        hasSeenTutorial.value = false
        save()
    }

    function toggleTheme() {
        preferences.value.theme = !preferences.value.theme
        applyTheme()
        save()
    }

    function applyTheme() {
        if (preferences.value.theme) {
            document.documentElement.classList.remove('dark')
        } else {
            document.documentElement.classList.add('dark')
        }
    }

    function save() {
        const data = {
            name: name.value,
            avatar: avatar.value,
            age: age.value,
            hobby: hobby.value,
            motto: motto.value,
            isOnboarded: isOnboarded.value,
            educationStage: educationStage.value,
            preferences: preferences.value,
            preferences: preferences.value,
            hasSeenTutorial: hasSeenTutorial.value,
            pin: pin.value
        }
        localStorage.setItem('sm_user', JSON.stringify(data))
    }

    // Security Actions
    function setPin(newPin) {
        pin.value = newPin
        save()
    }

    function removePin() {
        pin.value = null
        save()
    }

    function unlockApp() {
        isLocked.value = false
    }

    function lockApp() {
        if (pin.value) isLocked.value = true
    }

    // Initialize on creation
    init()

    return {
        name,
        avatar,
        age,
        hobby,
        motto,
        isOnboarded,
        educationStage,
        preferences,
        hasSeenTutorial,
        pin,
        isLocked,
        updateProfile,
        setOnboarded,
        toggleTheme,
        completeTutorial,
        resetTutorial,
        setPin,
        removePin,
        unlockApp,
        lockApp
    }
})
