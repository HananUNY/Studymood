<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../stores/userStore'
import { LockClosedIcon, BackspaceIcon } from '@heroicons/vue/24/solid'

const userStore = useUserStore()
const pinInput = ref('')
const error = ref(false)

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

const handleInput = (digit) => {
    if (digit === 'del') {
        pinInput.value = pinInput.value.slice(0, -1)
        error.value = false
        return
    }
    
    if (digit === '') return

    if (pinInput.value.length < 4) {
        pinInput.value += digit
        error.value = false
    }

    if (pinInput.value.length === 4) {
        checkPin()
    }
}

const checkPin = () => {
    if (pinInput.value === userStore.pin) {
        // Success
        setTimeout(() => {
            userStore.unlockApp()
            pinInput.value = ''
        }, 200)
    } else {
        // Error
        error.value = true
        setTimeout(() => {
            pinInput.value = ''
            error.value = false
        }, 500)
    }
}
</script>

<template>
    <div class="fixed inset-0 z-[10000] bg-slate-900 flex flex-col items-center justify-center p-6 text-white safe-area-inset-bottom">
        
        <div class="mb-10 flex flex-col items-center animate-fade-in-down">
            <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <LockClosedIcon class="w-8 h-8 text-white" />
            </div>
            <h2 class="text-2xl font-bold mb-2">Locked</h2>
            <p class="text-slate-400 text-sm font-medium">Enter your passcode to continue</p>
        </div>

        <!-- Dots -->
        <div class="flex gap-4 mb-12 animate-pulse-short" :class="{'shake': error}">
            <div v-for="i in 4" :key="i" 
                class="w-4 h-4 rounded-full border-2 transition-all duration-300"
                :class="i <= pinInput.length ? (error ? 'bg-red-500 border-red-500' : 'bg-white border-white') : 'border-slate-600 bg-transparent'"
            ></div>
        </div>

        <!-- Numpad -->
        <div class="grid grid-cols-3 gap-6 w-full max-w-[280px]">
            <button 
                v-for="digit in digits" 
                :key="digit"
                @click="handleInput(digit)"
                class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all active:scale-90"
                :class="digit === '' ? 'invisible' : 'bg-white/10 hover:bg-white/20 active:bg-white/30'"
            >
                <template v-if="digit === 'del'">
                    <BackspaceIcon class="w-8 h-8" />
                </template>
                <template v-else>
                    {{ digit }}
                </template>
            </button>
        </div>

    </div>
</template>

<style scoped>
.shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.safe-area-inset-bottom {
    padding-bottom: env(safe-area-inset-bottom);
}
</style>
