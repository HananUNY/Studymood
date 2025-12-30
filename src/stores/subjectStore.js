import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubjectStore = defineStore('subject', () => {
    // State
    const subjects = ref([
        // Default fallbacks in case storage is empty
        { id: 'math', label: 'Math', emoji: '📐', color: 'bg-blue-100 text-blue-800', ring: 'ring-blue-100' },
        { id: 'science', label: 'Science', emoji: '🧬', color: 'bg-green-100 text-green-800', ring: 'ring-green-100' },
        { id: 'history', label: 'History', emoji: '🏛️', color: 'bg-yellow-100 text-yellow-800', ring: 'ring-yellow-100' },
        { id: 'literature', label: 'Literature', emoji: '📚', color: 'bg-pink-100 text-pink-800', ring: 'ring-pink-100' },
    ])

    // Init Logic
    function init() {
        // Try new key first
        const storedNew = localStorage.getItem('sm_subjects')
        if (storedNew) {
            try {
                subjects.value = JSON.parse(storedNew)
            } catch (e) { console.error('Error parsing sm_subjects', e) }
            return
        }

        // Try legacy keys (Migration)
        const storedOld = localStorage.getItem('studyMood_subjects')
        const storedSelected = localStorage.getItem('studyMood_selectedSubjects')

        if (storedOld && storedSelected) {
            try {
                const allOld = JSON.parse(storedOld)
                const selectedIds = JSON.parse(storedSelected)
                // Filter to only include selected ones
                const migrated = allOld.filter(s => selectedIds.includes(s.id))
                if (migrated.length > 0) {
                    subjects.value = migrated
                    save() // Save to new key immediately
                }
            } catch (e) {
                console.error('Error migrating subjects', e)
            }
        }
    }

    // Actions
    function setSubjects(newSubjects) {
        subjects.value = newSubjects
        save()
    }

    function addSubject(subject) {
        // Prevent duplicates by ID
        if (!subjects.value.find(s => s.id === subject.id)) {
            subjects.value.push(subject)
            save()
        }
    }

    function removeSubject(id) {
        subjects.value = subjects.value.filter(s => s.id !== id)
        save()
    }

    function updateSubject(id, updates) {
        const idx = subjects.value.findIndex(s => s.id === id)
        if (idx !== -1) {
            subjects.value[idx] = { ...subjects.value[idx], ...updates }
            save()
        }
    }

    // Helper for UI consumption
    // key: ID or Label (case-insensitive try)
    function getSubjectStyle(key) {
        if (!key) return { emoji: '📚', color: 'bg-slate-100 text-slate-600', ring: 'ring-slate-100' }

        const k = key.toLowerCase()
        const s = subjects.value.find(sub => sub.id === k || sub.label.toLowerCase() === k)

        if (s) {
            return {
                emoji: s.emoji,
                color: s.color,
                ring: s.ring,
                // bg-only helper for cases needing just background
                bgClass: s.color.split(' ')[0]
            }
        }

        // Return a generic style if not found
        return { emoji: '📚', color: 'bg-slate-100 text-slate-600', ring: 'ring-slate-100', bgClass: 'bg-slate-100' }
    }

    function save() {
        localStorage.setItem('sm_subjects', JSON.stringify(subjects.value))
    }

    // Initialize
    init()

    return {
        subjects,
        setSubjects,
        addSubject,
        removeSubject,
        updateSubject,
        getSubjectStyle
    }
})
