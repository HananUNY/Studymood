import { ref, onMounted, onUnmounted } from 'vue'

export function usePWA() {
    const deferredPrompt = ref(null)
    const canInstall = ref(false)

    const handleInstallPrompt = (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        // Stash the event so it can be triggered later.
        deferredPrompt.value = e
        canInstall.value = true
        console.log('PWA Install Prompt Captured')
    }

    const installApp = async () => {
        if (!deferredPrompt.value) return
        // Show the install prompt
        deferredPrompt.value.prompt()
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.value.userChoice
        console.log(`User response to the install prompt: ${outcome}`)
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt.value = null
        canInstall.value = false
    }

    onMounted(() => {
        window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    })

    onUnmounted(() => {
        window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
    })

    return {
        canInstall,
        installApp
    }
}
