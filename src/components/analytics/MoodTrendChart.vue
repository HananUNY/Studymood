<script setup>
import { computed, ref, onMounted } from 'vue'
import { useLocaleStore } from '../../stores/localeStore'
import { storeToRefs } from 'pinia'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

const props = defineProps({
    logs: Array,
    timeRange: { type: String, default: 'daily' }
})

const localeStore = useLocaleStore()
const { t } = storeToRefs(localeStore)

const chartData = computed(() => {
    let sortedLogs = [...props.logs]
        .filter(l => l.type === 'daily' || !l.type)
        .sort((a, b) => {
             const dateA = new Date(a.date || a.timestamp)
             const dateB = new Date(b.date || b.timestamp)
             return dateA - dateB
        })

    // Filter based on Time Range
    if (props.timeRange === 'hourly') {
        const today = new Date().toDateString()
        sortedLogs = sortedLogs.filter(l => {
             const d = new Date(l.date || l.timestamp)
             return d.toDateString() === today
        })
    } else {
        // Daily (Default 7 Days)
        sortedLogs = sortedLogs.slice(-7)
    }

    const labels = sortedLogs.map(l => {
        const d = new Date(l.date || l.timestamp)
        if (isNaN(d.getTime())) return 'N/A'
        
        if (props.timeRange === 'hourly') {
            return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        }
        return d.toLocaleDateString('en-US', { weekday: 'short' })
    })

    // Invert scale: 1 (Calm) -> 5 (High) displayed as 5 (Best) -> 1 (Worst) physically?
    // Actually, let's just map 1-5 directly but maybe invert visual if "High" stress is "Bad".
    // Let's stick to simple: Higher value = Higher Stress for now? 
    // Wait, user wants "Mood Trend". "High" stress = Bad Mood. "Calm" = Good Mood.
    // Let's map: 
    // Calm (1) -> 100 (Great)
    // Good (2) -> 80
    // Okay (3) -> 60
    // Sad (4) -> 40
    // High (5) -> 20
    
    const dataPoints = sortedLogs.map(l => {
        const id = l.stressLevel // String ID: 'calm', 'happy', etc.
        
        if (id === 'calm') return 100
        if (id === 'happy') return 80
        if (id === 'okay') return 60
        if (id === 'sad') return 40
        if (id === 'high') return 20
        
        // Fallback for old numeric data or unknown
        const num = Number(id)
        if (!isNaN(num)) {
             // Invert if it was 1-5 (1=Calm, 5=High)
             if (num === 1) return 100
             if (num === 5) return 20
             // ... simplistic fallback
        }
        return 60 // Default Okay
    })

    return {
        labels: labels,
        datasets: [
            {
                label: t.value.chart.mood_score,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)'); // Purple-500
                    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
                    return gradient;
                },
                borderColor: '#A855F7', // Purple-500
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#A855F7',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: true,
                tension: 0.4, // Smooth Key
                data: dataPoints
            }
        ]
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: { top: 20, left: 10, right: 10, bottom: 0 }
    },
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1e293b',
            bodyColor: '#1e293b',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
                label: (context) => {
                    const val = context.raw;
                    if (val >= 90) return t.value.chart.calm_exc;
                    if (val >= 70) return t.value.chart.good;
                    if (val >= 50) return t.value.chart.okay;
                    if (val >= 30) return t.value.chart.stressed;
                    return t.value.chart.high_stress;
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 110, // Prevent top clipping (100 + padding)
            display: false, 
            grid: { display: false }
        },
        x: {
            grid: { display: false },
            ticks: {
                color: '#94a3b8',
                font: { size: 10, weight: 'bold' }
            }
        }
    },
    interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'x'
    }
}
</script>

<template>
  <div class="w-full h-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
