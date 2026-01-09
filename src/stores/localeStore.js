import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLocaleStore = defineStore('locale', () => {
    // State
    const locale = ref(localStorage.getItem('sm_locale') || 'en')

    // Translations Dictionary
    const translations = {
        en: {
            greeting: {
                morning: 'Good Morning',
                afternoon: 'Good Afternoon',
                evening: 'Good Evening',
                checkin: "Let's check in"
            },
            dashboard: {
                snapshot: 'Daily Snapshot',
                mood_title: "Today's Mood",
                feeling: 'Feeling',
                no_data: 'No Data',
                check_in_btn: 'Check in!',
                streak_title: 'Total Logs',
                streak_unit: 'check-ins',
                streak_msg: 'Keep logging! 🔥',
                tracker_title: 'Tracker',
                milestone: 'milestone',
                study_plan: 'Study Plan',
                add_plan: 'Add New Study Plan',
                recent_logs: 'Recent Logs',
                no_logs: 'No logs yet. Tap + to check in!',
                time_ago: {
                    just_now: 'Just now',
                    min_ago: 'm ago',
                    hr_ago: 'h ago',
                    yesterday: 'Yesterday',
                    gl_ago: 'd ago'
                }
            },
            modal: {
                title: 'New Session',
                subject_q: 'What are you studying?',
                when: 'When?',
                date: 'Date',
                start_time: 'Start Time',
                duration: 'Duration',
                stress_check: 'Stress Check',
                low: 'Low',
                medium: 'Moderate',
                high: 'High',
                goals: 'Goals & Topics',
                goals_ph: 'What specific chapters or problems are you focusing on today?',
                save_btn: 'Save Plan'
            },
            subjects: {
                Math: 'Math',
                Science: 'Science',
                History: 'History',
                Coding: 'Coding',
                Art: 'Art',
                Reading: 'Reading'
            },
            profile: {
                title: 'Profile',
                settings: 'Settings',
                language: 'Language',
                english: 'English',
                indonesian: 'Indonesian',
                dark_mode: 'Dark Mode',
                notifications: 'Notifications',
                clear_data: 'Clear Data (Debug)',
                student_id: 'Student ID',
                joined: 'Joined',
                edit: 'Edit'
            },
            weekly: {
                title: 'Weekly Check-in',
                subtitle: 'Reflect on your week',
                q1: 'How was your study load this week?',
                q2: 'How confident did you feel?',
                q3: 'Did you have time for hobbies?',
                q4: 'How was your sleep quality?',
                submit: 'Submit Assessment',
                completed: 'Assessment Completed!',
                see_results: 'See Results'
            },
            analytics: {
                title: 'Analytics',
                subtitle: 'Your progress & trends',
                avg_mood: 'Average Mood',
                weekly_report: 'Weekly Reports',
                top_stressors: 'Top Stressors',
                subject_insights: 'Subject Insights',
                most_studied: 'Most Studied',
                calm_subjects: 'Calm Subjects',
                high_stress: 'High Stress',
                suggestion: 'Suggestion',
                mindful_tip: 'Mindful Tip',
                read_more: 'Read more tips',
                no_data: 'No data yet',
                log_week: 'Log this week!',
                tips_title: 'Mindful Tip',
                tips_content: "Based on your logs, you're doing great! Try to maintain this balance by taking short breaks every 45 minutes of studying.",
                most_recent_stress: 'Most Recent Stress',
                no_assessment: 'No Assessment',
                no_reports: 'No weekly reports available.',
                stress_level: 'Stress Level',
                score: 'Score'
            },
            weekly_analysis: {
                title: 'Weekly Analysis',
                from_logs: 'From Daily Logs',
                top_stressors: 'Top Stressors This Week',
                no_stressors: 'No specific stressors recorded this week.',
                from_survey: 'From Weekly Survey',
                no_concerns: 'No significant concerns identified in the survey. Great job!',
                reason: 'Reason',
                you_rated: 'You rated this',
                suggestion: 'Suggestion',
                suggestion_text: 'Based on your high stress regarding "{issue}", consider breaking down tasks into smaller steps or talking to a peer.'
            },
            nav: {
                home: 'Home',
                analytics: 'Analytics',
                calendar: 'Calendar',
                profile: 'Profile',
                daily: 'Daily Log',
                daily_desc: 'Track mood & focus',
                weekly: 'Weekly Assessment',
                weekly_desc: 'Analyze stress levels'
            },
            calendar: {
                title: 'Calendar',
                subtitle: 'Plan & Reflect',
                daily: 'Daily',
                weekly: 'Weekly',
                monthly: 'Monthly',
                daily_journal: 'Daily Journal',
                journal_timeline: 'Journal Timeline',
                empty_day: 'No entries for this day.',
                latest_update: 'Latest Update',
                no_note: 'No note added.',
                daily_vibe: 'Daily Vibe',
                no_log: 'No mood log',
                checkin_logged: 'Check-in logged',
                focused_on: 'Focused on {subject}',
                no_sessions: 'No sessions planned',
                calm: 'Calm',
                high_stress: 'High Stress'
            },
            daily_log: {
                new_entry: 'New Entry',
                stress_check: 'Academic Stress Check-in',
                current_stress: 'Current Stress Level',
                confidence: 'Confidence in Material',
                main_stressors: 'Main Stressors',
                journal_ph: 'How are you feeling about your studies today? Take a deep breath and write freely...',
                save: 'Save Entry',
                levels: {
                    high: 'High',
                    sad: 'Stressed',
                    okay: 'Okay',
                    happy: 'Good',
                    calm: 'Calm'
                },
                categories: {
                    general: 'General'
                },
                stressors: {
                    deadlines: 'Deadlines',
                    exams: 'Exams',
                    peers: 'Peers',
                    sleep: 'Sleep',
                    focus: 'Focus Issues',
                    health: 'Health',
                    financial: 'Financial',
                    family: 'Family'
                }
            },
            chart: {
                mood_score: 'Mood Score',
                calm_exc: 'Calm / Excellent 😌',
                good: 'Good 🙂',
                okay: 'Okay 😐',
                stressed: 'Stressed 😓',
                high_stress: 'High Stress 🤯',
                times_reported: 'Times Reported',
                no_stressors: 'No stressors recorded'
            }
        },
        id: {
            greeting: {
                morning: 'Selamat Pagi',
                afternoon: 'Selamat Siang',
                evening: 'Selamat Malam',
                checkin: "Mari periksa kondisimu"
            },
            dashboard: {
                snapshot: 'Ringkasan Harian',
                mood_title: "Mood Hari Ini",
                feeling: 'Perasaan',
                no_data: 'Belum Ada Data',
                check_in_btn: 'Isi Jurnal!',
                streak_title: 'Total Jurnal',
                streak_unit: 'kali check-in',
                streak_msg: 'Pertahankan! 🔥',
                tracker_title: 'Target',
                milestone: 'pencapaian',
                study_plan: 'Rencana Belajar',
                add_plan: 'Tambah Rencana Baru',
                recent_logs: 'Riwayat Terbaru',
                no_logs: 'Belum ada data. Tekan + untuk mulai!',
                time_ago: {
                    just_now: 'Baru saja',
                    min_ago: 'm yang lalu',
                    hr_ago: 'j yang lalu',
                    yesterday: 'Kemarin',
                    gl_ago: 'h yang lalu'
                }
            },
            modal: {
                title: 'Sesi Baru',
                subject_q: 'Belajar apa hari ini?',
                when: 'Kapan?',
                date: 'Tanggal',
                start_time: 'Jam Mulai',
                duration: 'Durasi',
                stress_check: 'Perkiraan Stress',
                low: 'Rendah',
                medium: 'Sedang',
                high: 'Tinggi',
                goals: 'Target & Topik',
                goals_ph: 'Bab atau materi apa yang ingin difokuskan?',
                save_btn: 'Simpan Rencana'
            },
            subjects: {
                Math: 'Matematika',
                Science: 'Sains',
                History: 'Sejarah',
                Coding: 'Koding',
                Art: 'Seni',
                Reading: 'Membaca'
            },
            profile: {
                title: 'Profil',
                settings: 'Pengaturan',
                language: 'Bahasa',
                english: 'Inggris',
                indonesian: 'Indonesia',
                dark_mode: 'Mode Gelap',
                notifications: 'Notifikasi',
                clear_data: 'Hapus Data (Debug)',
                student_id: 'ID Siswa',
                joined: 'Bergabung',
                edit: 'Ubah'
            },
            weekly: {
                title: 'Evaluasi Mingguan',
                subtitle: 'Refleksi minggu ini',
                q1: 'Bagaimana beban belajar minggu ini?',
                q2: 'Seberapa percaya diri kamu?',
                q3: 'Sempat melakukan hobi?',
                q4: 'Bagaimana kualitas tidurmu?',
                submit: 'Kirim Evaluasi',
                completed: 'Evaluasi Selesai!',
                see_results: 'Lihat Hasil'
            },
            analytics: {
                title: 'Analitik',
                subtitle: 'Progress & Tren',
                avg_mood: 'Rata-rata Mood',
                weekly_report: 'Laporan Mingguan',
                top_stressors: 'Sumber Stress Utama',
                subject_insights: 'Wawasan Mata Pelajaran',
                most_studied: 'Paling Sering Dipelajari',
                calm_subjects: 'Pelajaran Menenangkan',
                high_stress: 'Stress Tinggi',
                suggestion: 'Saran',
                mindful_tip: 'Tips Mindfulness',
                read_more: 'Baca tips lainnya',
                no_data: 'Belum ada data',
                log_week: 'Isi jurnal minggu ini!',
                tips_title: 'Tips Mindfulness',
                tips_content: 'Berdasarkan catatanmu, kamu melakukannya dengan baik! Coba pertahankan keseimbangan ini dengan istirahat sejenak setiap 45 menit belajar.',
                most_recent_stress: 'Stress Terakhir',
                no_assessment: 'Belum Ada Evaluasi',
                no_reports: 'Tidak ada laporan mingguan.',
                stress_level: 'Tingkat Stress',
                score: 'Skor'
            },
            weekly_analysis: {
                title: 'Analisis Mingguan',
                from_logs: 'Dari Jurnal Harian',
                top_stressors: 'Sumber Stress Minggu Ini',
                no_stressors: 'Tidak ada stressor spesifik minggu ini.',
                from_survey: 'Dari Survei Mingguan',
                no_concerns: 'Tidak ada masalah signifikan. Kerja bagus!',
                reason: 'Alasan',
                you_rated: 'Kamu menilai ini',
                suggestion: 'Saran',
                suggestion_text: 'Berdasarkan tingkat stress tinggimu pada "{issue}", coba pecah tugas menjadi langkah kecil atau bicara dengan teman.'
            },
            nav: {
                home: 'Beranda',
                analytics: 'Analitik',
                calendar: 'Kalender',
                profile: 'Profil',
                daily: 'Jurnal Harian',
                daily_desc: 'Catat mood & fokus',
                weekly: 'Evaluasi Mingguan',
                weekly_desc: 'Analisis tingkat stres'
            },
            calendar: {
                title: 'Kalender',
                subtitle: 'Rencana & Refleksi',
                daily: 'Harian',
                weekly: 'Mingguan',
                monthly: 'Bulanan',
                daily_journal: 'Jurnal Harian',
                journal_timeline: 'Jurnal Hari Ini',
                empty_day: 'Tidak ada entri untuk hari ini.',
                latest_update: 'Update Terakhir',
                no_note: 'Tidak ada catatan.',
                daily_vibe: 'Vibe Harian',
                no_log: 'Belum ada log mood',
                checkin_logged: 'Check-in tercatat',
                focused_on: 'Fokus pada {subject}',
                no_sessions: 'Tidak ada sesi terencana',
                calm: 'Tenang',
                high_stress: 'Stress Tinggi'
            },
            daily_log: {
                new_entry: 'Entri Baru',
                stress_check: 'Cek Stress Akademik',
                current_stress: 'Tingkat Stress Saat Ini',
                confidence: 'Keyakinan Menguasai Materi',
                main_stressors: 'Penyebab Stress Utama',
                journal_ph: 'Bagaimana perasaanmu tentang pelajaran hari ini? Tarik napas dalam dan tulislah dengan bebas...',
                save: 'Simpan Entri',
                levels: {
                    high: 'Tinggi',
                    sad: 'Tertekan',
                    okay: 'Oke',
                    happy: 'Baik',
                    calm: 'Tenang'
                },
                categories: {
                    general: 'Umum'
                },
                stressors: {
                    deadlines: 'Tenggat Waktu',
                    exams: 'Ujian',
                    peers: 'Teman Sebaya',
                    sleep: 'Kurang Tidur',
                    focus: 'Masalah Fokus',
                    health: 'Kesehatan',
                    financial: 'Finansial',
                    family: 'Keluarga'
                }
            },
            chart: {
                mood_score: 'Skor Mood',
                calm_exc: 'Tenang / Bagus 😌',
                good: 'Baik 🙂',
                okay: 'Oke 😐',
                stressed: 'Tertekan 😓',
                high_stress: 'Stress Tinggi 🤯',
                times_reported: 'Kali Dilaporkan',
                no_stressors: 'Belum ada data stressor'
            }
        }
    }

    // Actions
    function setLocale(newLocale) {
        if (translations[newLocale]) {
            locale.value = newLocale
            localStorage.setItem('sm_locale', newLocale)
        }
    }

    // Getters / Helper
    const t = computed(() => {
        return translations[locale.value] || translations['en']
    })

    return {
        locale,
        setLocale,
        t
    }
})
