import React from 'react';
import { useLenis } from '../hooks/useLenis';
import { AmbientStars } from '../components/ui/AmbientStars';

export interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  // Initialize Lenis smooth scroll
  useLenis({ enabled: true });

  return (
    <div className="relative min-h-screen bg-[#08090d] text-neutral-100 flex flex-col selection:bg-amber-400/20 selection:text-amber-200">
      {/* Background Starfield */}
      <AmbientStars />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};
