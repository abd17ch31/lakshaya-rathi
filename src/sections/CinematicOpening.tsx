import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { CosmicAtmosphereCanvas } from '../components/canvas/CosmicAtmosphereCanvas';
import { useStoryContent } from '../context/StoryContentContext';
import { audioManager } from '../services/audio/audioManager';
import { gsap } from '../animations/gsap';

export interface CinematicOpeningProps {
  onEnter: () => void;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({ onEnter }) => {
  const { content } = useStoryContent();
  const [isOpening, setIsOpening] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const handleBegin = async () => {
    if (isOpening) return;
    setIsOpening(true);

    audioManager.unlockAndPlay(content.meta.defaultBackgroundMusicPath);

    if (portalRef.current && containerRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          onEnter();
        },
      });

      tl.to(textRef.current, {
        opacity: 0,
        y: -30,
        filter: 'blur(10px)',
        duration: 0.8,
        ease: 'power2.inOut',
      })
        .to(
          portalRef.current,
          {
            scale: 24,
            opacity: 0.95,
            duration: 1.4,
            ease: 'expo.inOut',
          },
          '-=0.4'
        )
        .to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3'
        );
    } else {
      setTimeout(onEnter, 1000);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#fff0f4] via-[#fff5f8] to-[#fdeef3] text-[#4a1528] overflow-hidden select-none"
    >
      {/* Dynamic Cheerful Confetti & Pastel Sparkles */}
      <CosmicAtmosphereCanvas intensity={45} />

      {/* Atmospheric Warm Glowing Sunburst & Soft Peach Clouds */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] rounded-full bg-gradient-to-tr from-pink-300/30 via-rose-200/40 to-amber-200/30 blur-3xl" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-pink-100/60 blur-2xl" />
      </div>

      {/* Central Interactive Cheerful Portal */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-xl mx-auto text-center space-y-8">
        {/* Orbit Rings in Fresh Pastel Pink */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-pink-300/40 border-dashed"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
            className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-rose-300/30"
          />

          {/* Glowing Whipped Cream Core */}
          <div
            ref={portalRef}
            className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border-2 border-pink-300 backdrop-blur-md flex items-center justify-center shadow-[0_10px_35px_rgba(244,114,182,0.35)]"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center"
            >
              <Heart className="w-7 h-7 text-pink-500 fill-pink-500/80" />
            </motion.div>
          </div>
        </div>

        {/* Cheerful Typography Stage */}
        <div ref={textRef} className="space-y-4 pt-2">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 border border-pink-300/60 text-xs uppercase tracking-[0.28em] text-pink-700 font-bold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>A CHEERFUL BIRTHDAY STORY</span>
            <span aria-hidden="true">·</span>
            <span>{content.meta.relationshipMilestone || `CHAPTER ${new Date().getFullYear()}`}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-6xl font-light font-serif tracking-tight text-[#3b0d1e] leading-tight"
          >
            Happy Birthday, <br />
            <span className="font-medium text-pink-600 underline decoration-pink-300 decoration-2 underline-offset-8">
              {content.meta.boyfriendName}
            </span>
          </motion.h1>

          {/* Handwritten Invitation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="text-2xl sm:text-3xl text-rose-800 font-handwriting tracking-wide max-w-md mx-auto pt-1"
          >
            “A special celebration made just for you with all my love...”
          </motion.p>

          {/* Enter Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="pt-6 flex flex-col items-center gap-3"
          >
            <button
              onClick={handleBegin}
              disabled={isOpening}
              className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_10px_30px_rgba(236,72,153,0.35)] hover:shadow-[0_15px_40px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              <Heart className="w-5 h-5 text-white fill-white group-hover:scale-125 transition-transform duration-300" />
              <span>{isOpening ? 'Opening Your Surprise...' : 'Step Inside Our Story'}</span>
            </button>

            <span className="text-[11px] tracking-wider text-pink-800/70 font-mono font-medium">
              Tap to enter with birthday music ♫
            </span>
          </motion.div>
        </div>
      </div>

      {/* Subtle Bottom Vignette */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center text-[11px] text-pink-800/60 font-mono tracking-widest uppercase pointer-events-none">
        Crafted with love by {content.meta.girlfriendName}
      </div>
    </div>
  );
};
