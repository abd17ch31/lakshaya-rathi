import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, RotateCcw, Feather } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { dbService } from '../services/supabase/dbService';
import { gsap } from '../animations/gsap';
import { scrapbookCard } from '../animations/motionVariants';

export const WishNotepad: React.FC = () => {
  const [wishText, setWishText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const starFlyerRef = useRef<HTMLDivElement>(null);

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) {
      setErrorMsg('Please write a few words for your wish...');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await dbService.submitWish(wishText.trim());

      if (cardRef.current && starFlyerRef.current) {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsSubmitting(false);
            setIsSent(true);
            window.dispatchEvent(new CustomEvent('wish-star-created'));
          },
        });

        tl.to(cardRef.current, {
          scale: 0.1,
          opacity: 0,
          rotate: 15,
          duration: 0.7,
          ease: 'power3.in',
        })
          .set(starFlyerRef.current, {
            display: 'flex',
            x: 0,
            y: 0,
            scale: 0.5,
            opacity: 1,
          })
          .to(starFlyerRef.current, {
            scale: 2.2,
            duration: 0.3,
            ease: 'back.out(2)',
          })
          .to(starFlyerRef.current, {
            x: 450,
            y: -350,
            scale: 0.2,
            opacity: 0,
            duration: 1.1,
            ease: 'power2.inOut',
          });
      } else {
        setIsSubmitting(false);
        setIsSent(true);
        window.dispatchEvent(new CustomEvent('wish-star-created'));
      }
    } catch {
      setErrorMsg('Could not save your wish. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleWriteAnother = () => {
    setWishText('');
    setIsSent(false);
    if (cardRef.current) {
      gsap.set(cardRef.current, { scale: 1, opacity: 1, rotate: 0 });
    }
  };

  return (
    <Section id="wish-notepad" background="deep" hasVignette className="border-t border-pink-100 py-24 sm:py-36 relative overflow-hidden">
      {/* Dynamic Shooting Star Flyer Element */}
      <div
        ref={starFlyerRef}
        className="hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none items-center justify-center"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-pink-400/50 blur-xl animate-pulse" />
          <Star className="w-12 h-12 text-pink-500 fill-pink-400 drop-shadow-[0_0_25px_rgba(244,114,182,1)]" />
        </div>
      </div>

      <Container width="narrow">
        <div className="space-y-12 sm:space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-pink-100 border border-pink-200 text-xs uppercase tracking-[0.28em] text-pink-700 font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>CHAPTER IV · A WISH AMONG THE STARS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light font-serif text-[#3b0d1e] tracking-tight">
              What Do You Wish For This Year?
            </h2>
            <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed font-sans-body">
              Write the wish you hold closest to your heart. Once released, it will transform into a permanent star that shines over our journey.
            </p>
          </div>

          {/* NOTEPAD LETTER INTERACTION */}
          <div className="relative max-w-xl mx-auto">
            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.div
                  key="notepad-card"
                  ref={cardRef}
                  variants={scrapbookCard}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative p-6 sm:p-10 rounded-3xl bg-white text-[#381c2b] shadow-[0_15px_45px_rgba(244,114,182,0.15)] border border-pink-200 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-pink-700 uppercase tracking-wider font-bold">
                      <Feather className="w-4 h-4 text-pink-500" />
                      <span>Private Wish Letter</span>
                    </div>
                    <span className="text-xs text-rose-700 font-serif italic font-medium">
                      Private & Sealed
                    </span>
                  </div>

                  {/* Handwritten Textarea */}
                  <form onSubmit={handleSendWish} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="wish-input" className="sr-only">
                        Your Birthday Wish
                      </label>
                      <textarea
                        id="wish-input"
                        rows={5}
                        maxLength={500}
                        value={wishText}
                        onChange={(e) => setWishText(e.target.value)}
                        placeholder="I wish for more unhurried mornings together, countless new adventures, and that we..."
                        className="w-full bg-transparent resize-none outline-none font-handwriting text-2xl sm:text-3xl text-rose-950 placeholder:text-rose-300 leading-relaxed tracking-wide border-b border-transparent focus:border-pink-400 transition-colors"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-rose-700 font-mono pt-2 border-t border-pink-100">
                      <span>{wishText.length} / 500 characters</span>
                      <span className="text-rose-700 italic font-serif">Encrypted for her eyes only</span>
                    </div>

                    {errorMsg && (
                      <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white text-sm font-bold tracking-wide shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>{isSubmitting ? 'Transforming into Star...' : 'Send Wish to the Stars'}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                /* Post-Submission Celebration Card */
                <motion.div
                  key="sent-card"
                  variants={scrapbookCard}
                  initial="hidden"
                  animate="visible"
                  className="p-8 sm:p-12 rounded-3xl bg-white text-[#381c2b] border border-pink-200 shadow-[0_15px_45px_rgba(244,114,182,0.18)] text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center mx-auto text-pink-600 shadow-[0_0_35px_rgba(244,114,182,0.3)]">
                    <Star className="w-8 h-8 fill-pink-400" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.25em] text-pink-600 font-mono font-bold">
                      Wish Ascended
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-serif text-[#3b0d1e]">
                      Your Star Now Shines in Our Sky
                    </h3>
                    <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed max-w-md mx-auto font-sans-body">
                      Look up — a new permanent glowing star has joined our sky. May every word you wished quietly come true.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      icon={<Sparkles className="w-4 h-4 text-white" />}
                      onClick={() => {
                        const nextSection = document.getElementById('phase-audio-placeholder');
                        nextSection?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Continue Journey
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-800 hover:text-rose-950 hover:bg-pink-100"
                      icon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={handleWriteAnother}
                    >
                      Write Another Wish
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
};
