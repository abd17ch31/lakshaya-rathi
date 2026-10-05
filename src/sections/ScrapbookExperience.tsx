import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Maximize2, X, Bookmark } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { scrapbookCard } from '../animations/motionVariants';

interface ScrapbookPhoto {
  id: string;
  title: string;
  note: string;
  date: string;
  imageUrl: string;
  tag: string;
  rotationClass: string;
}

const defaultScrapbookPhotos: ScrapbookPhoto[] = [
  {
    id: 'sb-1',
    title: 'Midnight Sparklers',
    note: '“You made even the cold air feel like celebration.”',
    date: 'New Year’s Eve',
    imageUrl: '/src/assets/images/scrapbook_concert_lights_1791182737885.jpg',
    tag: 'SPARK',
    rotationClass: 'sm:-rotate-2',
  },
  {
    id: 'sb-2',
    title: 'Highway to Nowhere',
    note: '“Windows down, singing off-key to old tracks.”',
    date: 'Mountain Getaway',
    imageUrl: '/src/assets/images/scrapbook_roadtrip_mirror_1791182752019.jpg',
    tag: 'ROADTRIP',
    rotationClass: 'sm:rotate-3',
  },
  {
    id: 'sb-3',
    title: 'Candid Smiles',
    note: '“I caught you looking at me right before this.”',
    date: 'Sunday Afternoon',
    imageUrl: '/src/assets/images/scrapbook_polaroid_laughter_1791182776106.jpg',
    tag: 'FAVORITE',
    rotationClass: 'sm:-rotate-1',
  },
];

export const ScrapbookExperience: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<ScrapbookPhoto | null>(null);

  return (
    <Section id="scrapbook-experience" background="surface" hasVignette className="border-t border-pink-100 py-24 sm:py-36">
      <Container width="wide">
        <div className="space-y-16 sm:space-y-24">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-white border border-pink-200 text-xs uppercase tracking-[0.28em] text-pink-700 font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>CHAPTER III · THE SCRAPBOOK VAULT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light font-serif text-[#3b0d1e] tracking-tight">
              Scattered Pieces of Our Story
            </h2>
            <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed font-sans-body">
              Like pages from an unwritten journal — little polaroids, handwritten sticky notes, and timestamps we never want to forget.
            </p>
          </div>

          {/* 1. SCATTERED SCRAPBOOK POLAROID GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-4">
            {defaultScrapbookPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                variants={scrapbookCard}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className={`relative group ${photo.rotationClass} hover:rotate-0 transition-all duration-500`}
              >
                {/* Washi Tape Decal */}
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-pink-200/70 backdrop-blur-xs border border-pink-300/80 -rotate-1 rounded-xs shadow-xs z-10 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Polaroid Paper Frame (Crisp White with Soft Blush Shadow) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white text-[#381c2b] shadow-[0_15px_40px_rgba(244,114,182,0.14)] space-y-4 border border-pink-200">
                  {/* Photo Slot */}
                  <div
                    onClick={() => setActivePhoto(photo)}
                    className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-pink-50 cursor-pointer group/photo"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                    />

                    {/* Hover expand lens */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/80 text-pink-900 flex items-center justify-center backdrop-blur-sm">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Polaroid Handwritten Caption */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-rose-700 uppercase tracking-wider font-semibold">
                      <span>{photo.date}</span>
                      <span className="text-pink-700 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200">{photo.tag}</span>
                    </div>
                    <p className="text-2xl sm:text-3xl text-rose-950 font-handwriting leading-snug">
                      {photo.note}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. CINEMATIC FULL-WIDTH SPOTLIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden bg-white border-2 border-pink-200 shadow-xl group"
          >
            <div className="relative aspect-16/9 sm:aspect-21/9 w-full max-h-[520px] overflow-hidden">
              <img
                src="/src/assets/images/scrapbook_stargazing_sky_1791182763491.jpg"
                alt="Under the starry sky together"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-12 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-pink-300 uppercase tracking-widest font-bold">
                  <Bookmark className="w-4 h-4 text-pink-400" />
                  <span>Cinematic Memory · Stargazing Moments</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-serif text-white max-w-2xl leading-tight font-normal">
                  “Under a million stars, I only had eyes for you.”
                </h3>
                <p className="text-xs sm:text-sm text-pink-100 max-w-xl font-sans-body leading-relaxed">
                  No matter where the seasons take us or how fast time flies, the universe quieted down whenever we looked up at the stars together.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* FULLSCREEN SCRAPBOOK PREVIEW LIGHTBOX */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 select-none"
            onClick={() => setActivePhoto(null)}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative max-w-3xl w-full flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 rounded-2xl bg-white text-[#381c2b] shadow-2xl border-4 border-white w-full">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[65vh] object-contain rounded-xl bg-pink-50"
                />
                <div className="pt-3 px-2 text-center">
                  <p className="text-xs text-rose-700 font-mono font-semibold">{activePhoto.date}</p>
                  <p className="text-2xl sm:text-3xl text-rose-950 font-handwriting pt-1">
                    {activePhoto.note}
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
