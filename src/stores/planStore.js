import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const usePlanStore = defineStore('plan', () => {
    const plans = ref([])

    // Init
    const storedPlans = localStorage.getItem('sm_plans')
    if (storedPlans) {
        try {
            const parsed = JSON.parse(storedPlans)
            plans.value = (Array.isArray(parsed) ? parsed : []).filter(p => p && typeof p === 'object')
        } catch (e) { console.error(e); plans.value = [] }
    } else {
        const legacy = localStorage.getItem('studyMood_plans')
        if (legacy) {
            try {
                const parsed = JSON.parse(legacy)
                plans.value = (Array.isArray(parsed) ? parsed : []).filter(p => p && typeof p === 'object')
            } catch (e) { plans.value = [] }
        }
    }

    // Persist
    watch(plans, (newPlans) => {
        localStorage.setItem('sm_plans', JSON.stringify(newPlans))
    }, { deep: true })

    // Actions
    function addPlan(planData) {
        // planData: { title, duration, subject, notes }
        const newPlan = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completed: false,
            ...planData
        }
        plans.value.unshift(newPlan)
    }

    function togglePlan(id) {
        const plan = plans.value.find(p => p.id === id)
        if (plan) {
            plan.completed = !plan.completed
        }
    }

    function removePlan(id) {
        plans.value = plans.value.filter(p => p.id !== id)
    }

    return {
        plans,
        addPlan,
        togglePlan,
        removePlan
    }
})
