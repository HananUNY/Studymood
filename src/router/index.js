import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '../stores/userStore'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'onboarding',
            component: () => import('../views/OnboardingView.vue'),
            meta: { layout: 'empty' }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('../views/DashboardView.vue')
        },
        {
            path: '/daily-log',
            name: 'daily-log',
            component: () => import('../views/DailyLogView.vue'),
            meta: { layout: 'empty' }
        },
        {
            path: '/weekly-log',
            name: 'weekly-log',
            component: () => import('../views/WeeklyLogView.vue'),
            meta: { layout: 'empty' }
        },
        {
            path: '/analytics',
            name: 'analytics',
            component: () => import('../views/AnalyticsView.vue')
        },
        {
            path: '/ai-analysis',
            name: 'ai-analysis',
            component: () => import('../views/ComingSoonView.vue'),
            meta: { layout: 'empty' }
        },
        {
            path: '/calendar',
            name: 'calendar',
            component: () => import('../views/CalendarView.vue')
        },
        {
            path: '/subjects',
            name: 'subjects',
            component: () => import('../views/SubjectsView.vue')
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfileView.vue')
        },
        {
            path: '/pixels',
            name: 'pixels',
            component: () => import('../views/YearInPixelsView.vue'),
            meta: { layout: 'empty' }
        }
    ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
    // We access the store inside the guard. 
    // Since router is used after app.use(pinia), the pinia instance is active.
    const userStore = useUserStore()

    const publicPages = ['onboarding']
    const authRequired = !publicPages.includes(to.name)
    const isOnboarded = userStore.isOnboarded

    // 1. If trying to access protected page without being onboarded
    if (authRequired && !isOnboarded) {
        return next({ name: 'onboarding' })
    }

    // 2. If trying to access onboarding page while already onboarded
    if (to.name === 'onboarding' && isOnboarded) {
        return next({ name: 'dashboard' })
    }

    next()
})

export default router
