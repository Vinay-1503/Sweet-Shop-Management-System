# 🍰 Kata Sweets - Premium Sweet & Dessert E-Commerce

A beautiful, modern e-commerce application for a premium sweet shop. Built with React, TypeScript, and Tailwind CSS, featuring a clean white-first design with soft pink accents.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Color Palette](#color-palette)
- [How to Change Colors](#how-to-change-colors)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Key Features](#key-features)

---

## 🎯 Overview

Kata Sweets is a static, showcase e-commerce application designed for a premium sweet shop. The app features:

- **Single-page design** with smooth scrolling
- **Mock data** - no backend required
- **Clean, minimal UI** with white-first theme
- **Responsive design** for mobile, tablet, and desktop
- **Static showcase** - perfect for demonstrations or portfolio

---

## 🛠 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Lucide React** - Icons
- **Capacitor** - Mobile app support

---

## 📁 Project Structure

```
Kata Sweets/
│
├── public/                          # Static assets
│   ├── categories/                  # Category images
│   ├── FeaturedSweets/             # Featured product images
│   ├── festiveSweetHampers/        # Festive section images
│   ├── banner-1.png, banner-2.png  # Homepage banners
│   └── favicon.svg                  # App icon
│
├── src/
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── unified-product-card.tsx    # Product display card
│   │   │   ├── circular-category-card.tsx  # Category display
│   │   │   ├── banner-slider.tsx           # Homepage banner carousel
│   │   │   ├── festive-collage.tsx         # Festive section
│   │   │   ├── desktop-navigation.tsx      # Desktop header
│   │   │   ├── mobile-appbar.tsx           # Mobile header
│   │   │   ├── bottom-navigation.tsx       # Mobile bottom nav
│   │   │   ├── footer.tsx                  # Site footer
│   │   │   ├── profile-dropdown.tsx       # User profile menu
│   │   │   └── ... (other UI components)
│   │   └── LoginDialog.tsx         # Login modal
│   │
│   ├── pages/                       # Page components
│   │   ├── Home.tsx                 # Main homepage (single-page app)
│   │   ├── Products.tsx             # Products listing page
│   │   ├── ProductDetail.tsx        # Individual product page
│   │   ├── Cart.tsx                  # Shopping cart
│   │   ├── SimpleLogin.tsx          # Login page
│   │   ├── SplashScreen.tsx         # App splash screen
│   │   └── NotFound.tsx             # 404 page
│   │
│   ├── data/                        # Mock data
│   │   ├── mockSweets.ts            # Product data
│   │   └── banners.ts               # Banner data
│   │
│   ├── store/                       # State management
│   │   └── useStore.ts              # Zustand store (cart, user)
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-mobile.tsx           # Mobile detection
│   │   └── use-mobile-header-offset.ts  # Header spacing
│   │
│   ├── lib/                         # Utilities
│   │   ├── utils.ts                 # Helper functions
│   │   └── api.ts                   # API utilities (unused)
│   │
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # App entry point
│   └── index.css                    # Global styles & CSS variables
│
├── tailwind.config.ts               # Tailwind configuration
├── vite.config.ts                   # Vite configuration
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## 🎨 Color Palette

The app uses a **strict, disciplined color palette** with white as the dominant background and pink for accents.

### Primary Colors

| Color | Hex Code | Usage | CSS Variable |
|-------|----------|-------|--------------|
| **Rose Pink** | `#FF6DAA` | Primary accent, buttons, highlights | `--primary` |
| **Blush Pink** | `#FFD1E3` | Hover states, soft UI elements | `--primary-hover` |
| **Crimson Red** | `#DC143C` | Urgent actions, notifications, "ADD" buttons | `--accent-red` |

### Background Colors

| Color | Hex Code | Usage | CSS Variable |
|-------|----------|-------|--------------|
| **Pure White** | `#FFFFFF` | Main background (80-90% of page) | `--white`, `--bg-page` |
| **Soft Cream** | `#FFF7EC` | Rare highlights, section backgrounds | `--bg-section` |

### Text Colors

| Color | Hex Code | Usage | CSS Variable |
|-------|----------|-------|--------------|
| **Near-Black** | `#1F1F1F` | Headings, body text | `--text-primary` |
| **Medium Gray** | `#6F6F6F` | Secondary text, muted content | `--text-secondary` |
| **Light Gray** | `#9CA3AF` | Placeholders, disabled text | `--text-muted` |

### Border Colors

| Color | Hex Code | Usage | CSS Variable |
|-------|----------|-------|--------------|
| **Light Pink** | `#F3E1EA` | Borders, dividers | `--border-color` |

### Design Philosophy

- ✅ **White-first**: White is the dominant background (80-90% of the page)
- ✅ **Pink for emphasis**: Pink used only for buttons, accents, and important actions
- ✅ **Cream sparingly**: Cream used only for rare highlights, not as main background
- ❌ **No gradients**: Avoid gradients, use solid colors
- ❌ **No gold/green**: Stick to the pink/white/cream palette

---

## 🎨 How to Change Colors

### Method 1: CSS Variables 

The easiest way to change colors globally is through CSS variables in `src/index.css`.

**Location:** `src/index.css` (lines 100-150)

```css
:root {
  /* Primary Brand Colors - Pink */
  --primary: #FF6DAA;              /* Change this for main pink */
  --primary-hover: #FFD1E3;        /* Change this for hover states */
  
  /* Accent Colors - Red */
  --accent-red: 220 20 60;         /* Change this for red accents */
  
  /* Background Colors */
  --bg-page: 255 255 255;          /* Main background (white) */
  --bg-section: 255 244 234;       /* Section highlights (cream) */
  
  /* Text Colors */
  --text-primary: 31 31 31;        /* Main text (near-black) */
  --text-secondary: 107 114 128;    /* Secondary text (gray) */
  
  /* Border Colors */
  --border-color: 243 225 234;     /* Borders (light pink) */
}
```

**After changing CSS variables:**
1. Save the file
2. The changes will apply automatically in development
3. Rebuild for production: `npm run build`

### Method 2: Tailwind Config

For Tailwind-specific colors, edit `tailwind.config.ts`.

**Location:** `tailwind.config.ts` (lines 87-103)

```typescript
colors: {
  'primary-blue': {
    DEFAULT: '#FF6DAA',      // Change main pink
    hover: '#FF9FC6',        // Change hover pink
  },
  'accent-red': {
    DEFAULT: '#DC143C'       // Change red accent
  },
  // ... other colors
}
```

### Method 3: Direct Inline Styles

For component-specific colors, you can use inline styles or Tailwind classes directly in components.

**Example:**
```tsx
<button className="bg-[#FF6DAA] hover:bg-[#FFD1E3]">
  Click me
</button>
```

### Quick Color Change Guide

| What to Change | File | Line Range |
|----------------|------|------------|
| **Main pink color** | `src/index.css` | ~108 |
| **Hover pink color** | `src/index.css` | ~109 |
| **Red accent color** | `src/index.css` | ~118 |
| **Background white** | `src/index.css` | ~122 |
| **Cream highlight** | `src/index.css` | ~123 |
| **Text colors** | `src/index.css` | ~129-131 |
| **Border colors** | `src/index.css` | ~134 |
| **Tailwind colors** | `tailwind.config.ts` | ~87-103 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git** (optional, for version control)

### Installation

1. **Clone or download the project**
   ```bash
   cd "Kata Sweets"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will be available at `http://localhost:5173`
   - The port may vary if 5173 is in use

### First Time Setup

1. The app uses **mock data** - no backend setup needed
2. All product data is in `src/data/mockSweets.ts`
3. All banner data is in `src/data/banners.ts`
4. Images are in the `public/` folder

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (web) |
| `npm run build:web` | Build for web deployment |
| `npm run build:mobile` | Build for mobile app (Capacitor) |
| `npm run build:both` | Build for both web and mobile |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## ✨ Key Features

### Homepage Sections

1. **Banner Slider** - Rotating promotional banners
2. **Shop by Category** - Circular category cards
3. **Festive Collage** - "Our Presents, Children's Smiles" section
4. **Inspirational Banner** - "Life is short. Eat dessert first"
5. **Our Best Work** - Featured sweet showcase
6. **Featured Sweets** - "You Might Miss These If You're Late"
7. **Customer Reviews** - Happy customers section

### Shopping Features

- ✅ **Product browsing** - Browse by category or search
- ✅ **Product details** - View individual product pages
- ✅ **Shopping cart** - Add/remove items, adjust quantities
- ✅ **Simple login** - ID + Password (no backend validation)
- ✅ **Responsive design** - Works on mobile, tablet, desktop

### Design Features

- ✅ **White-first theme** - Clean, modern, premium feel
- ✅ **No animations** - Stable, distraction-free interface
- ✅ **Minimal UI** - Focus on products and content
- ✅ **Pink accents** - Soft, sweet-themed color palette

---

## 📝 Notes

- **No Backend**: This is a static showcase app. No API calls, no database.
- **Mock Data**: All products and content are in `src/data/` folder.
- **Mobile Ready**: Built with Capacitor for potential mobile app deployment.
- **No Animations**: All animations have been removed for a calm, stable experience.

---

## 🤝 Contributing

This is a showcase project. Feel free to:
- Customize colors and styling
- Add more mock products
- Modify sections and layouts
- Use as a template for your own projects

---

## 📄 License

This project is for demonstration purposes.

---

## 💡 Tips

- **Changing images**: Replace files in `public/` folder and update paths in data files
- **Adding products**: Edit `src/data/mockSweets.ts`
- **Modifying sections**: Edit `src/pages/Home.tsx`
- **Styling changes**: Use `src/index.css` for global styles, or Tailwind classes in components

---

**Made with ❤️ for Kata Sweets**
