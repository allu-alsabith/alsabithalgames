import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
      className="fixed bottom-20 md:bottom-6 left-4 z-40 p-3 rounded-full mac-liquid-pill text-slate-300 hover:text-emerald-300 hover:border-emerald-400/50 transition-all active:scale-90 flex items-center justify-center animate-in fade-in zoom-in duration-200 cursor-pointer group shadow-2xl"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};
