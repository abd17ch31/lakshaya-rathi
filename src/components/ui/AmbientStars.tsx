import React, { useEffect, useState, useMemo } from 'react';
import { dbService } from '../../services/supabase/dbService';
import { WishStarItem } from '../../types';

interface AmbientStar {
  id: number;
  top: string;
  left: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export const AmbientStars: React.FC = () => {
  const [permanentStars, setPermanentStars] = useState<WishStarItem[]>([]);

  // 1. Static ambient background starfield
  const ambientStars = useMemo<AmbientStar[]>(() => {
    const items: AmbientStar[] = [];
    for (let i = 0; i < 45; i++) {
      items.push({
        id: i,
        top: `${(i * 19.3) % 100}%`,
        left: `${(i * 37.7) % 100}%`,
        size: (i % 3) + 1,
        opacity: 0.15 + ((i % 5) * 0.12),
        duration: 3 + (i % 4),
        delay: (i % 3) * 0.7,
      });
    }
    return items;
  }, []);

  // 2. Fetch permanent stars submitted by users
  const loadPermanentStars = async () => {
    try {
      const stars = await dbService.getPublicStars();
      setPermanentStars(stars);
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    loadPermanentStars();

    // Listen for custom star creation events
    const handleStarAdded = () => {
      loadPermanentStars();
    };

    window.addEventListener('wish-star-created', handleStarAdded);
    return () => window.removeEventListener('wish-star-created', handleStarAdded);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Static ambient stars */}
      {ambientStars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-amber-100/70"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `pulse ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Dynamic Permanent Wish Stars (Extra luminous with golden halo) */}
      {permanentStars.map((pStar, idx) => {
        const topPercent = (pStar.yRatio ?? (0.15 + ((idx * 0.19) % 0.65))) * 100;
        const leftPercent = (pStar.xRatio ?? (0.1 + ((idx * 0.29) % 0.8))) * 100;
        const size = pStar.size ?? 3.5;

        return (
          <div
            key={pStar.id}
            className="absolute z-10 flex items-center justify-center"
            style={{
              top: `${topPercent}%`,
              left: `${leftPercent}%`,
            }}
          >
            {/* Outer golden halo */}
            <span
              className="absolute rounded-full bg-amber-400/40 animate-ping"
              style={{
                width: `${size * 3.5}px`,
                height: `${size * 3.5}px`,
                animationDuration: `${3.5 + (idx % 3)}s`,
              }}
            />
            {/* Core glowing star */}
            <span
              className="relative rounded-full bg-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
              style={{
                width: `${size}px`,
                height: `${size}px`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
