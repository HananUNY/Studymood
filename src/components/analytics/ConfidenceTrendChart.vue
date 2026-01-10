<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps(['logs'])

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            max: 100,
            grid: {
                display: false
            }
        },
        x: {
            grid: {
                display: false
            }
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
}

const chartData = computed(() => {
    // Sort logs by date and take last 7 days
    const sorted = [...props.logs]
        .filter(l => l.confidence !== undefined)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-7)

    return {
        labels: sorted.map(l => new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' })),
        datasets: [{
            label: 'Confidence',
            backgroundColor: (ctx) => {
                const canvas = ctx.chart.ctx;
                const gradient = canvas.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // Blue-500
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
                return gradient;
            },
            borderColor: '#3b82f6',
            data: sorted.map(l => l.confidence),
            fill: true,
            tension: 0.4
        }]
    }
})
</script>

<template>
  <div class="h-48 w-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
