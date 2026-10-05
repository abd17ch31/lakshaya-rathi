import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, RotateCcw, Maximize2, X, Sparkles, PartyPopper } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useStoryContent } from '../context/StoryContentContext';
import { scrapbookCard } from '../animations/motionVariants';

export interface FinalBirthdayRevealProps {
  onReplayJourney: () => void;
}

export const FinalBirthdayReveal: React.FC<FinalBirthdayRevealProps> = ({ onReplayJourney }) => {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const { content, replacePlaceholders } = useStoryContent();
  const finalData = content.finalReveal;

  return (
    <Section id="final-reveal" background="deep" hasVignette className="border-t border-pink-100 py-24 sm:py-36 relative overflow-hidden">
      {/* Ambient Cheerful Bloom */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-pink-300/30 blur-[120px] pointer-events-none" />

      <Container width="default">
        <div className="space-y-16 sm:space-y-24">
          {/* 1. GRAND CELEBRATORY HEADER */}
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-xs font-mono text-pink-700 font-bold uppercase tracking-widest shadow-xs"
            >
              <PartyPopper className="w-4 h-4 text-pink-500" />
              <span>THE CLIMAX · CHAPTER VII</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-7xl font-light font-serif text-[#3b0d1e] tracking-tight leading-[1.1]"
            >
              {replacePlaceholders(finalData.title)}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base text-rose-900/90 max-w-xl mx-auto font-sans-body leading-relaxed"
            >
              {replacePlaceholders(finalData.subtitle)}
            </motion.p>
          </div>

          {/* 2. THE HEARTFELT LETTER & GIRLFRIEND PORTRAIT CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center max-w-5xl mx-auto">
            {/* GIRLFRIEND PORTRAIT (Crisp Whipped Cream Scrapbook Polaroid Style) */}
            <motion.div
              variants={scrapbookCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative group max-w-sm w-full p-4 sm:p-5 rounded-2xl bg-white text-[#381c2b] shadow-[0_20px_50px_rgba(244,114,182,0.18)] border border-pink-200 sm:-rotate-2 hover:rotate-0 transition-all duration-500">
                {/* Washi Tape Decal */}
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-200/70 backdrop-blur-xs border border-pink-300/80 rotate-1 rounded-xs shadow-xs pointer-events-none z-10"
                  aria-hidden="true"
                />

                {/* Photo Slot */}
                <div
                  onClick={() => setIsPhotoOpen(true)}
                  className="relative aspect-3/4 w-full rounded-xl overflow-hidden bg-pink-50 cursor-pointer select-none group/photo"
                >
                  <img
                    src={finalData.girlfriendPhotoUrl}
                    alt={content.meta.girlfriendName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                  />

                  {/* Hover expansion overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/80 text-pink-900 flex items-center justify-center backdrop-blur-sm">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Handwritten Tag */}
                <div className="pt-3 px-1 text-center space-y-0.5">
                  <p className="text-2xl sm:text-3xl text-rose-950 font-handwriting">
                    With all my heart, {content.meta.girlfriendName}
                  </p>
                  <span className="text-[11px] font-mono text-rose-700 uppercase tracking-widest font-semibold">
                    {content.meta.relationshipMilestone}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* HEARTFELT LETTER SCROLL */}
            <motion.div
              variants={scrapbookCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-white text-[#381c2b] border border-pink-200 shadow-[0_20px_50px_rgba(244,114,182,0.15)] space-y-6"
            >
              <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-pink-700 uppercase tracking-wider font-bold">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>A Letter For Your New Year</span>
                </div>
                <span className="text-xs text-rose-700 font-mono font-semibold">
                  {content.meta.birthDate}
                </span>
              </div>

              {/* Heartfelt Message Body */}
              <div className="space-y-4 text-rose-950 font-sans-body text-base sm:text-lg leading-relaxed">
                <p>{replacePlaceholders(finalData.heartfeltMessage)}</p>
              </div>

              {/* Signature */}
              <div className="pt-6 border-t border-pink-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-2xl sm:text-3xl font-handwriting text-rose-900 font-bold">
                    {replacePlaceholders(finalData.signoff)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 3. EXPERIENCE CONCLUSION & REPLAY LOOP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-8 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                icon={<RotateCcw className="w-4 h-4 text-white" />}
                onClick={onReplayJourney}
              >
                Relive Our Journey From The Beginning
              </Button>
            </div>

            <p className="text-xs text-pink-800/70 font-mono font-medium">
              Thank you for exploring our story · Always and forever
            </p>
          </motion.div>
        </div>
      </Container>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {isPhotoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 select-none"
            onClick={() => setIsPhotoOpen(false)}
          >
            <button
              onClick={() => setIsPhotoOpen(false)}
              className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative max-w-2xl w-full flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 rounded-2xl bg-white text-[#381c2b] shadow-2xl border-4 border-white">
                <img
                  src={finalData.girlfriendPhotoUrl}
                  alt={content.meta.girlfriendName}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[70vh] object-contain rounded-xl bg-pink-50"
                />
                <div className="pt-3 text-center">
                  <p className="text-2xl sm:text-3xl text-rose-950 font-handwriting">
                    {replacePlaceholders(finalData.signoff)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
