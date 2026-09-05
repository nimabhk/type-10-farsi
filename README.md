# Typist (تایپیست) — Persian 10-Finger Touch Typing Tutor

> An intelligent, modern Persian (Farsi) touch-typing platform featuring interactive keyboard visualization, adaptive layout detection (ISIRI 9147, Windows, macOS), error diagnostics, speed benchmarking, and racing modes.

[![Live Demo](https://img.shields.io/badge/Live_Demo-type10farsi.ai.studio-0d9488?style=for-the-badge&logo=google-chrome&logoColor=white)](https://type10farsi.ai.studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌐 Live URL

- **Web Application:** [https://type10farsi.ai.studio](https://type10farsi.ai.studio)
- *Note for GitHub Repository:* Set the repository **About** section website to: `https://type10farsi.ai.studio`

---

## ✨ Features

- **Persian Keyboard Auto-Detection:** Automatically identifies whether your keyboard sends standard ISIRI 9147 Persian characters (e.g. `ژ`, `پ`, `گ`, `ک`, `ی`) or Windows/macOS keycodes, with one-click calibration.
- **ISIRI 9147 & Standard Half-Space (ZWNJ):** Full native support for standard Persian punctuation, diacritics, and Zero-Width Non-Joiner (`Shift + Space`).
- **Interactive Virtual Keyboard & Finger Guide:** Visual representation of hand positions with real-time key targeting and color-coded finger assignments.
- **Structured Curriculum:** Step-by-step progressive lessons from home row fundamentals (`ب`, `ت`, `ن`, `م`) to advanced full-text typing.
- **Diagnostic Error Heatmap:** Identifies weak keys and generates personalized remedial drills to overcome common mistakes.
- **Live Speed Benchmarks:** Standard 30s, 60s, 120s, and 180s timed typing assessments with WPM, CPM, and accuracy metrics.
- **Live Bot Racing:** Race in real time against virtual bots with varying typing speeds.
- **Optimized Persian Typography:** High-legibility Persian display powered by the **Vazirmatn** font with distinct space and character separators.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/typist-persian-touch-typing.git

# Navigate into directory
cd typist-persian-touch-typing

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:3000` to begin typing.

### Production Build

```bash
# Compile and bundle for production
npm run build

# Preview production build
npm run preview
```

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS
- **Bundler:** Vite
- **Typography:** Vazirmatn Persian Font
- **Icons:** Lucide React
- **Celebration FX:** Canvas Confetti

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
