# Cookie Jar Bakery 🍪

A React + Tailwind CSS bakery web app.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── lib/
│   └── data.js              # Products, categories, reviews, bakery info
├── components/
│   ├── Stars.jsx            # Star rating display
│   ├── StockBadge.jsx       # In Stock / Low Stock / Out of Stock badge
│   ├── Toast.jsx            # Notification toast
│   ├── SplashScreen.jsx     # App loading screen
│   ├── Header.jsx           # Sticky top navigation
│   ├── BottomNav.jsx        # Mobile bottom navigation
│   ├── HeroSection.jsx      # Hero banner with greeting
│   ├── SearchBar.jsx        # Search input + category pills
│   ├── ProductCard.jsx      # Product grid card
│   ├── ReviewCard.jsx       # Review display card
│   └── Footer.jsx           # Footer with map & contact
├── pages/
│   ├── HomePage.jsx         # Home with search, products, reviews
│   ├── MenuPage.jsx         # Category grid
│   ├── CategoryPage.jsx     # Products filtered by category
│   ├── ProductDetailPage.jsx# Full product detail
│   └── ReviewsPage.jsx      # Reviews list + submit form
├── App.jsx                  # Root component & routing
├── main.jsx                 # Entry point
└── index.css                # Tailwind + custom animations
```

## Tech Stack

- **React 18** — UI library
- **Vite** — Build tool
- **Tailwind CSS v3** — Utility-first styling
