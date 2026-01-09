<script setup>
import { computed } from 'vue'
import { useLocaleStore } from '../../stores/localeStore'
import { storeToRefs } from 'pinia'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const localeStore = useLocaleStore()
const { t } = storeToRefs(localeStore)

const props = defineProps(['logs'])

const STRESSOR_LABELS = computed(() => ({
    'deadlines': `${t.value.daily_log.stressors.deadlines} ⏰`,
    'exams': `${t.value.daily_log.stressors.exams} 📝`,
    'peers': `${t.value.daily_log.stressors.peers} 👥`,
    'sleep': `${t.value.daily_log.stressors.sleep} 😴`,
    'focus': `${t.value.daily_log.stressors.focus} 😵‍💫`,
    'health': `${t.value.daily_log.stressors.health} 🤒`,
    'financial': `${t.value.daily_log.stressors.financial} 💸`,
    'family': `${t.value.daily_log.stressors.family} 🏠`
}))

const chartData = computed(() => {
    const counts = {}
    
    // Aggregate counts
    props.logs.forEach(log => {
        if (log.stressors && Array.isArray(log.stressors)) {
            log.stressors.forEach(s => {
                counts[s] = (counts[s] || 0) + 1
            })
        }
    })

    // Sort and Top 5
    const sorted = Object.entries(counts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)

    const labels = sorted.map(([k]) => STRESSOR_LABELS.value[k] || k)
    const data = sorted.map(([,v]) => v)

    return {
        labels,
        datasets: [{
            label: t.value.chart.times_reported,
            data,
            backgroundColor: [
                'rgba(244, 63, 94, 0.8)', // Rose
                'rgba(249, 115, 22, 0.8)', // Orange
                'rgba(234, 179, 8, 0.8)',  // Yellow
                'rgba(168, 85, 247, 0.8)', // Purple
                'rgba(59, 130, 246, 0.8)'  // Blue
            ],
            borderRadius: 6,
            barThickness: 20
        }]
    }
})

const chartOptions = {
    indexAxis: 'y', // Horizontal Bar
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1e293b',
            bodyColor: '#1e293b',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            displayColors: false
        }
    },
    scales: {
        x: {
            display: false,
            grid: { display: false }
        },
        y: {
            grid: { display: false },
            ticks: {
                color: '#64748b',
                font: { weight: 'bold', size: 11 }
            }
        }
    }
}
</script>

<template>
    <div class="w-full h-full">
        <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
        <div v-else class="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
            <span class="material-symbols-outlined mb-1">block</span>
            <p class="text-xs">{{ t.chart.no_stressors }}</p>
        </div>
    </div>
</template>
