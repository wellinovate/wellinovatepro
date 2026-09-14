# Wellinovate — Healthcare Platform

> **Empowering Better Health Decisions Through Innovation.**

Wellinovate builds integrated clinical hardware, interoperable software, and connected diagnostic intelligence for African and global healthcare systems.

---

## 🌟 Features

- **Broadsheet Editorial Design System**: Custom typography (Source Serif 4) with print-plate CMYK separation aesthetics.
- **Brand Identity**: Teal (`#008276`), Navy (`#0E2B4C`), and Radiant Gold (`#EDA822`) color harmony with official logo emblem.
- **Standalone Multi-Page Architecture**:
  - `index.html` — Front page, masthead dateline, product ecosystem index, and welliRecord spotlight.
  - `about.html` — Purpose, story, clinical-first principles, and vision/mission.
  - `solutions.html` — The 8-product suite (welliRecord, welliID, WelliCare, WelliPharm, WelliDiagnostic, WelliPay, WellISight, WelliMate).
  - `team.html` — Executive leadership team portraits and Board of Directors directory.
  - `process.html` — Disciplined 8-stage innovation lifecycle with interactive contact and dispatch transmission form.
- **Vite Build System**: Ultra-fast HMR in development and optimized Rollup bundling in production.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### GitHub Pages Deployment
The repository includes an automated GitHub Actions CI/CD workflow (`.github/workflows/deploy.yml`).
To activate GitHub Pages on your repository:
1. Go to **Settings → Pages** on GitHub.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Every push to `main` will automatically build and deploy the live site.

---

## 📁 Project Structure

```
├── public/
│   └── assets/              # High-resolution hardware, team, and logo assets
├── styles/
│   └── main.css             # Main styling, brand tokens, and responsive layouts
├── _ds/                     # Broadsheet design system components and press driver
├── index.html               # Homepage
├── about.html               # About & Principles
├── solutions.html           # Product Ecosystem
├── team.html                # Leadership & Board
├── process.html             # Innovation Process & Contact Form
├── package.json             # Scripts & dependencies
└── vite.config.js           # Multi-page Rollup build configuration
```

---

## 📄 License
© 2026 Wellinovate Ltd. All rights reserved.
