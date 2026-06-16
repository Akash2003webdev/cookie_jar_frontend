import { bakery } from "../lib/data";

export default function HeroSection() {
  const h = new Date().getHours();
  const greeting =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  return (
    <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white px-5 pt-6 pb-10">
      <div className="max-w-6xl mx-auto">
        {/* Greeting bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold">{greeting}! 🌟</h2>
            <p className="text-sm text-white/70 mt-0.5">
              Your favourite bakes await.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center overflow-hidden">
            <img
              src="/src/assets/logo.png" /* Inga unga image path-ah potukoanga */
              alt="Bakery Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Banner */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-3xl shadow-xl">
          <img
            src="/src/assets/hero.png"
            alt="Cookie Jar Bakery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
            <p className="text-xl sm:text-2xl font-black leading-tight">
              {bakery.name}
            </p>
            <p className="text-xs sm:text-sm text-white/80 mt-1">
              {bakery.tagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
