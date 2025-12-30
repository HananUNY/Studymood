# 🎓 Study Mood v2 (Alpha)

![Version](https://img.shields.io/badge/version-0.1.3%20Alpha-blueviolet)
![Status](https://img.shields.io/badge/status-Active%20Development-green)
![Tech](https://img.shields.io/badge/tech-Vue%203%20%7C%20Tailwind%20%7C%20Vite-blue)

**Study Mood** is a beautiful, privacy-focused mood tracker designed specifically for students. It helps you track your academic journey, monitor your mental well-being, and visualize your progress throughout the year—all stored locally on your device.

> 🚀 **Community Release**: This project is currently in Alpha (v0.1.3). We are opening it up to the **GitHub** community for feedback, bug fixes, and feature contributions!

---

## ✨ Features

- **📊 Mood Tracking**: Log your daily mood with expressive emojis and study context.
- **📅 Calendar Integration**: View your mood history in monthly, weekly, and daily views.
- **🎨 Mood Tahunan (Year in Pixels)**: Visualize your entire year's mood in a beautiful pixel grid.
- **🔒 Privacy First**:
    - **Local Storage**: All data stays on your device.
    - **App Lock**: Secure your diary with a 4-digit PIN.
    - **Private Exports**: PINs are stripped from data exports for safety.
- **💄 Modern UI/UX**:
    - **Glassmorphism Design**: Sleek, modern aesthetic.
    - **Dark Mode**: Fully supported system-wide dark theme.
    - **PWA Support**: Installable as a native-like app on mobile and desktop.
- **🌍 Bilingual**: English and Indonesian (Bahasa Indonesia) support.

## 🛠️ Tech Stack

Built with the latest modern web technologies:

- **Framework**: [Vue 3](https://vuejs.org/) (Script Setup)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Router**: [Vue Router](https://router.vuejs.org/)
- **Icons**: [Material Symbols](https://fonts.google.com/icons) & [Heroicons](https://heroicons.com/)
- **PWA**: [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

## 🚀 Getting Started

Want to contribute or run it locally? Follow these steps:

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/study-mood-v2.git
   cd study-mood-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to view it in the browser.

### Building for Production
```bash
npm run build
```
To preview the build locally:
```bash
npm run preview
```

## 📂 Project Structure

Here's a quick map to help you navigate the codebase:

```
src/
├── assets/          # Static assets (images, global css)
├── components/      # Reusable Vue components
│   ├── calendar/    # Calendar-specific components
│   ├── common/      # Generic UI elements (PinLock, etc.)
│   └── layout/      # App layout wrappers
├── data/            # Static data definitions (Moods, Colors)
├── router/          # Vue Router configuration
├── stores/          # Pinia State Stores (User, Mood, etc.)
├── views/           # Main Page Views
│   ├── DashboardView.vue   # Home/Dashboard
│   ├── CalendarView.vue    # Calendar & Journal
│   ├── YearInPixelsView.vue # Year in Pixels Grid
│   └── ProfileView.vue     # Settings & Data Management
└── App.vue          # Root Component
```

## 🤝 Contribution Guidelines

We welcome all contributions from the **GitHub** community! Whether you're fixing a bug, improving the UI, or adding a new feature, here's how you can help:

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

### Ideas for Contributions 💡
- [ ] **Data Visualization**: Add charts for study subjects vs. mood.
- [ ] **Export/Import**: Improve data portability (CSV export?).
- [ ] **Gamification**: Add achievements or badges.
- [ ] **Accessibility**: Improve ARIA labels and keyboard navigation.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Credits

- **Developer**: Hanan Dimas Prasetya
- **AI Copilot**: Gemini AI (Google DeepMind)

---
*Made with ❤️ for students everywhere.*
