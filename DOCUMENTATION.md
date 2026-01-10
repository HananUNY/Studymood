# 📖 Study Mood 0.1.3 Alpha - Technical Documentation

Welcome to the technical documentation for **Study Mood 0.1.3 Alpha**. This document is designed to help contributors understand the codebase, architecture, and feature implementations.

## 🏗️ Architecture Overview

Study Mood 0.1.3 Alpha is a **Single Page Application (SPA)** built with **Vue 3** and **Vite**. It follows a component-based architecture and relies heavily on **Pinia** for global state management.

### Key Technologies
- **Vue 3 (Composition API)**: `script setup` syntax for cleaner and more performant components.
- **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS v4**: Utility-first styling framework.
- **Pinia**: Intuitive, type-safe state management.
- **Vue Router**: Client-side routing.
- **Vite PWA**: Offline capabilities and installability.

### Directory Structure
```
src/
├── assets/         # Static resources (images, base styles)
├── components/     # Reusable UI components
│   ├── calendar/   # Calendar widgets (Monthly, Weekly, Daily)
│   ├── common/     # Generic widgets (PinLock, Modals)
│   └── layout/     # App shells (Header, Navigation)
├── data/           # Config files (moodDefinitions.js)
├── stores/         # Pinia stores (Logic center)
├── views/          # Page-level components
└── App.vue         # Root component (handles Layouts & Global Overlays)
```

---

## 🎨 Design & Theming

The application uses a custom color palette defined in `src/style.css` using the **OKLCH** color space to ensure vibrant and accessible colors across different displays.

### Color Palette

| Variable Name | Value (OKLCH) | Description |
| :--- | :--- | :--- |
| `primary` | `oklch(60% 0.18 250)` | Core brand color (Vibrant Blue) |
| `background-light` | `oklch(97% 0.01 250)` | Application background in Light Mode |
| `background-dark` | `oklch(14% 0.03 250)` | Application background in Dark Mode |
| `pastel-pink` | `oklch(90% 0.08 10)` | Soft pink accent |
| `pastel-mint` | `oklch(92% 0.08 160)` | Soft mint green accent |
| `pastel-lavender` | `oklch(90% 0.08 290)` | Soft purple accent |

> **Note**: These variables are mapped to Tailwind utilities. For example, you can use `bg-primary`, `text-pastel-pink`, etc.

---

## 🧠 State Management (Pinia)

The application logic is decentralized into modular stores located in `src/stores/`.

### 1. `userStore.js`
Manages user profile, settings, and application security.
- **State**: `name`, `avatar`, `preferences` (theme, notifications), `pin`, `isLocked`.
- **Persistence**: Auto-saves to `localStorage` key `sm_user`.
- **Security Logic**:
    - `pin`: Stored as a plain string (Note: Local-only, not encrypted).
    - `isLocked`: Session state. If `pin` exists, `isLocked` defaults to `true` on reload.

### 2. `moodStore.js`
Manages the core diary entries.
- **State**: `logs` (Array of entries), `weeklyLogs`.
- **Persistence**: Auto-saves to `localStorage`.
- **Key Concepts**:
    - **Logs**: Objects containing `mood` (key), `timestamp`, `note`, `activities`.
    - **Streak**: Calculated getter based on consecutive daily entries.

### 3. `planStore.js` & `subjectStore.js`
Manage study plans and academic subjects respectively.

### 4. `userStore.js` (Updates)
- **New State**: `gender` ('male'/'female'), `periodData` (Array of timestamps).
- **Logic**: Handles gender-specific UI toggles (e.g., Cycle Tracker in Daily Log).

---

## 🩸 Menstruation Tracker Implementation

### Overview
A privacy-focused tracker integrated into the daily log flow.

- **Components**:
    - `DailyLogView.vue`: Conditionally renders "Cycle Tracker" card if `user.gender === 'female'`.
    - `AnalyticsView.vue`: Computes "Cycle Impact" by comparing `Focus Score` during period vs. non-period days.
- **Data Structure**:
    - `isPeriod` (boolean flag in daily logs).
    - `symptoms` (Array of strings in daily logs).


---

## 🔐 Security & Privacy Implementation

We prioritize student privacy by keeping data strictly local.

### App Lock (PIN)
- **Implementation**: `src/components/common/PinLock.vue` overlays the entire app if `userStore.isLocked` is true.
- **Storage**: The PIN is stored in `localStorage`.
- **Export Safety**: When exporting data via `ProfileView.vue`, the `exportData` function **explicitly deletes the `pin`** property from the JSON object before generating the file. This prevents users from accidentally exposing their lock code when sharing backups.

---

## 🎨 Feature Deep Dive

### Mood Tahunan (Year in Pixels)
- **File**: `src/views/YearInPixelsView.vue`
- **Data Source**: Uses `moodStore.logs`.
- **Logic**: Maps logs to a `YYYY-MM-DD` grid. Prioritizes the *latest* log of the day if multiple exist.
- **Styling**: Uses `moodDefinitions.js` to determine the color of each pixel based on the mood key.

### PWA & Notifications
- **Config**: `vite.config.js` using `vite-plugin-pwa`.
- **Notifications**:
    - Logic resides in `ProfileView.vue` (`toggleNotifications`).
    - Checks `Notification.permission`.
    - Sends a test notification upon enabling.

---

## 🚀 Development Guidelines

### Adding a New Mood
1. Open `src/data/moodDefinitions.js`.
2. Add a new key-value pair with the mood's properties (color, emoji, animation).
3. The app will automatically pick it up in the Dashboard and pixel grids.

### Routing
New pages must be registered in `src/router/index.js`.
- Use specific meta fields if needed (e.g., `meta: { layout: 'empty' }` for pages without the bottom nav).

### Code Style
- Use **Composition API** with `<script setup>`.
- Use **Tailwind** classes for styling. avoid custom CSS unless for complex animations.
- Comments are encouraged for complex logic (e.g., calendar math).
