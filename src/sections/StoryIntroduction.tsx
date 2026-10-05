import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, ChevronDown, Calendar, PartyPopper } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { useStoryContent } from '../context/StoryContentContext';
import { fadeUp, staggerContainer, scrapbookCard } from '../animations/motionVariants';

export const StoryIntroduction: React.FC = () => {
  const { content, replacePlaceholders } = useStoryContent();

  return (
    <div className="relative">
      {/* 1. HERO CHAPTER ENTRANCE */}
      <Section background="deep" className="pt-28 sm:pt-36 pb-20 min-h-screen flex flex-col justify-center">
        <Container width="default">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8 max-w-3xl mx-auto"
          >
            {/* Metadata separator */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-xs uppercase tracking-[0.25em] text-pink-700 font-bold shadow-xs mx-auto"
            >
              <PartyPopper className="w-3.5 h-3.5 text-pink-500" />
              <span>{replacePlaceholders(content.hero.eyebrow)}</span>
              <span aria-hidden="true">·</span>
              <span>{content.meta.relationshipMilestone}</span>
            </motion.div>

            {/* Main Display Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#3b0d1e] font-serif leading-[1.15]"
            >
              Happy Birthday, <br />
              <span className="font-normal text-pink-600 italic">{content.meta.boyfriendName}</span>
            </motion.h1>

            {/* Subtitle / Prose */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-rose-900/90 font-sans-body max-w-2xl mx-auto leading-relaxed"
            >
              {replacePlaceholders(content.hero.subtitle)}
            </motion.p>

            {/* Handwritten Scrapbook Accent Card (Crisp Whipped Cream Ivory) */}
            <motion.div
              variants={scrapbookCard}
              className="relative mx-auto max-w-lg p-6 sm:p-8 rounded-2xl bg-white text-[#381c2b] border border-pink-200 shadow-[0_15px_40px_rgba(244,114,182,0.15)] space-y-3 sm:-rotate-1 hover:rotate-0 transition-transform duration-300"
            >
              {/* Washi Tape */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-200/60 backdrop-blur-xs border border-pink-300/80 rotate-1 rounded-xs shadow-xs pointer-events-none"
                aria-hidden="true"
              />

              <div className="flex items-center justify-between text-xs text-rose-800 font-mono border-b border-pink-100 pb-2.5">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" />
                  {content.meta.birthDate || 'Special Day'}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-rose-600">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  From {content.meta.girlfriendName}
                </span>
              </div>

              <p className="text-2xl sm:text-3xl text-rose-950 font-handwriting leading-snug pt-2 text-left">
                {replacePlaceholders(content.hero.atmosphericQuote)}
              </p>
            </motion.div>

            {/* Scroll Indication */}
            <motion.div variants={fadeUp} className="pt-8 flex flex-col items-center gap-2 text-pink-600">
              <span className="text-xs uppercase tracking-widest font-mono text-pink-700 font-medium">
                Scroll to explore our story
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-5 h-5 text-pink-500" />
              </motion.div>
            </motion.div>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
};
