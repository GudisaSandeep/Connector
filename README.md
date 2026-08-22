# ⚡ Connector — Tinder for Tech Students & Builders

> **Connector** is a gamified, high-synergy swipe-and-match platform tailored specifically for computer science students, hackathon builders, and aspiring startup co-founders.

---

## 🚀 Key Features

- **🃏 Authentic Tinder Swipe Deck**:
  - Physics-based card swiping using **Framer Motion** (`drag="x"`, velocity tracking, rotation).
  - Dynamic swipe stamps: **LIKE** (Green `#20D5A0`), **NOPE** (Red `#FE3C72`), and **SUPER LIKE ⭐** (Blue `#2DB1FF`).
  - The 5 iconic round action buttons: Rewind (Yellow `#F5B800`), Nope, Super Like, Like, and Boost (Purple `#A644FF`).
  - Keyboard shortcuts (`←` Pass, `→` Connect, `↑` Super Like, `Space` Expand Card).

- **📊 Dev Card & Story Media Segments**:
  - Segmented story progress bars at top of card (tap left/right to cycle project spotlights and photos).
  - Verified student credentials (University, Major, Graduation year, Location, Remote status).
  - Real-time GitHub statistics: Commit streaks, repository counts, star counts, and top languages distribution bar.
  - LinkedIn milestones & internship proofs.

- **🔥 AI Synergy Match Engine**:
  - Automatically calculates a **Synergy Match Score (%)** based on role complementarity (e.g. Next.js Frontend + PyTorch AI/ML Engineer), shared hackathon intents, and skill compatibility.
  - Explains why candidates match with concise, high-signal summaries.

- **🎉 "It's a Match!" Celebration & Icebreakers**:
  - Dual avatar convergence with particle confetti explosions.
  - 1-click Icebreaker Prompt selector tailored to candidate tech projects.

- **💬 Real-Time Collaboration & Chat**:
  - Syntax-highlighted code snippet sharing with copy-to-clipboard.
  - Instant hackathon squad invitations directly in chat.

- **🏆 Hackathon Squad Dream Team Builder**:
  - Form 3-4 person squads for HackMIT, TreeHacks, CalHacks, or Hack the North.
  - Assign matched candidates to specialized role slots (Frontend Architect, AI Specialist, 3D Designer, DevOps).

- **⚡ Webcmd Public Profile Enricher**:
  - Automated public signal extraction for GitHub repositories and LinkedIn milestones.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/) + React 19 + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Official Tinder Brand Theme Palette
- **Components**: [shadcn/ui](https://ui.shadcn.com/) + Radix UI primitives
- **Gestures & Animations**: [Framer Motion](https://www.framer-motion.com/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/) + Custom Crisp SVG Brand Vectors

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Since this repository contains the Next.js app directly at the root, simply import the repo on Vercel and it will automatically build and deploy with zero configuration!

---

## 📄 License
MIT License. Built for tech students and developers everywhere.
