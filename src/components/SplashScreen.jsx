import { useEffect, useRef, useState } from "react";

// Inga duration-ah maathிக்கலாம் (6 seconds)
const SPLASH_DURATION_MS = 5000;

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // Fade-out transition mudiya 400ms delay
      setTimeout(onFinish, 400);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <video
        ref={videoRef}
        src="/splash.mp4" /* Neenga unga video-va public folder-la 'splash.mp4' name-la potukanum */
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    </div>
  );
}