<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps(['logs'])

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    }
  }
}

const chartData = computed(() => {
    // Count occurrences
    const counts = { calm: 0, happy: 0, okay: 0, sad: 0, high: 0 }
    
    props.logs.forEach(log => {
        if (counts[log.stressLevel] !== undefined) {
            counts[log.stressLevel]++
        }
    })

    return {
        labels: ['Calm', 'Happy', 'Okay', 'Sad', 'High Stress'],
        datasets: [{
            backgroundColor: ['#34d399', '#2dd4bf', '#60a5fa', '#fbbf24', '#f43f5e'],
            data: [counts.calm, counts.happy, counts.okay, counts.sad, counts.high]
        }]
    }
})
</script>

<template>
  <div class="h-64">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
