import { bakery } from '../lib/data'
// 1. Image-ah top-la import pannikonga bro
import bakeryLogo from '../assets/logo.png' 

export default function Header({ page, onNav }) {
  const tabs = [
    { id: 'home',    label: 'Home'    },
    { id: 'menu',    label: 'Menu'    },
    { id: 'reviews', label: 'Reviews' },
  ]

  return (
    <header className="sticky top-0 z-50 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between bg-white/88 backdrop-blur-xl rounded-full px-4 py-2 shadow-soft border border-white/60">
        
        {/* Logo */}
        <button onClick={() => onNav('home')} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center overflow-hidden">
            {/* 2. Inga string path-ku badhula variable {bakeryLogo} use பண்ணிருக்கேன் */}
            <img 
              src={bakeryLogo} 
              alt="Bakery Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="font-display text-2xl bg-gradient-to-br from-primary-dark to-primary-light bg-clip-text text-transparent">
            Cookie Jar
          </span>
        </button>

        {/* Nav (If you want to uncomment later) */}
        {/* <nav className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onNav(t.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                page === t.id ? 'text-primary' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav> */}
        
      </div>
    </header>
  )
}