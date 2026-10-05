import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, MapPin, Maximize2, X, Play } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { MemoryItem } from '../types';
import { useStoryContent } from '../context/StoryContentContext';
import { scrapbookCard } from '../animations/motionVariants';

export const MemoryTimeline: React.FC = () => {
  const { content, replacePlaceholders } = useStoryContent();
  const [memories, setMemories] = useState<MemoryItem[]>(content.memories);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryItem | null>(null);

  useEffect(() => {
    if (content.memories && content.memories.length > 0) {
      setMemories(content.memories);
    }
  }, [content.memories]);

  return (
    <Section id="memory-timeline" background="deep" hasVignette className="border-t border-pink-100 py-24 sm:py-36 relative">
      <Container width="default">
        <div className="space-y-16 sm:space-y-24">
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-pink-100 border border-pink-200 text-xs uppercase tracking-[0.28em] text-pink-700 font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>CHAPTER II · THE TIMELINE OF US</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light font-serif text-[#3b0d1e] tracking-tight">
              Chapters We Wrote Together
            </h2>
            <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed font-sans-body">
              Every photograph holds a heartbeat, a whisper of laughter, and a moment when the entire world melted away.
            </p>
          </div>

          {/* TIMELINE TRACK */}
          <div className="relative">
            {/* Center Timeline Spine in vibrant pastel pink */}
            <div
              className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-transparent via-pink-300 to-transparent -translate-x-1/2 pointer-events-none hidden sm:block rounded-full"
              aria-hidden="true"
            />

            {/* Dynamic Memories List */}
            <div className="space-y-16 sm:space-y-24">
              {memories.map((memory, index) => {
                const isEven = index % 2 === 0;
                const isSpotlight = (index + 1) % 4 === 0;

                return (
                  <motion.div
                    key={memory.id}
                    variants={scrapbookCard}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className={`relative flex flex-col ${
                      isSpotlight
                        ? 'items-center text-center'
                        : isEven
                        ? 'sm:flex-row items-center sm:items-start'
                        : 'sm:flex-row-reverse items-center sm:items-start'
                    } gap-8 sm:gap-14`}
                  >
                    {/* Center Timeline Node Marker in bright pink */}
                    <div className="hidden sm:flex absolute left-1/2 top-10 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-3 border-pink-500 items-center justify-center shadow-[0_4px_15px_rgba(244,114,182,0.4)] z-10">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    </div>

                    {/* PHOTO CARD (Crisp White Polaroid Frame with Cheerful Washi Tape) */}
                    <div className={`w-full ${isSpotlight ? 'max-w-3xl' : 'sm:w-1/2'}`}>
                      <div
                        className={`group relative p-4 rounded-2xl bg-white text-[#381c2b] border border-pink-200 shadow-[0_15px_40px_rgba(244,114,182,0.12)] transition-all duration-500 hover:border-pink-400 hover:shadow-[0_20px_50px_rgba(244,114,182,0.22)] ${
                          isEven ? 'sm:-rotate-1' : 'sm:rotate-1'
                        } hover:rotate-0`}
                      >
                        {/* Washi Tape */}
                        <div
                          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-pink-200/70 backdrop-blur-xs border border-pink-300/80 rotate-2 rounded-xs shadow-xs pointer-events-none z-10"
                          aria-hidden="true"
                        />

                        {/* Image Container */}
                        <div
                          onClick={() => setSelectedPhoto(memory)}
                          className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-pink-50 cursor-pointer select-none"
                        >
                          <img
                            src={memory.imageUrl}
                            alt={memory.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                            <span className="text-[11px] font-mono text-white uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-pink-300" /> Click to expand
                            </span>
                            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-pink-800">
                              <Maximize2 className="w-4 h-4" />
                            </div>
                          </div>

                          {/* Video Badge */}
                          {memory.videoUrl && (
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-pink-200 text-pink-800 text-[10px] font-bold flex items-center gap-1 font-mono uppercase shadow-sm">
                              <Play className="w-3 h-3 text-pink-600 fill-pink-600" /> Video
                            </div>
                          )}
                        </div>

                        {/* Handwritten Caption Note */}
                        {memory.captionNote && (
                          <div className="pt-3 px-2 text-center sm:text-left">
                            <p className="text-2xl sm:text-3xl text-rose-950 font-handwriting tracking-wide">
                              {replacePlaceholders(memory.captionNote)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* STORY TEXT & METADATA CONTENT */}
                    <div
                      className={`w-full ${
                        isSpotlight ? 'max-w-2xl text-center' : 'sm:w-1/2'
                      } space-y-3 sm:space-y-4`}
                    >
                      {/* Metadata */}
                      <div
                        className={`flex items-center gap-3 text-xs text-pink-700 font-mono font-bold ${
                          isSpotlight ? 'justify-center' : isEven ? 'justify-start' : 'sm:justify-end'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-pink-500" />
                          {replacePlaceholders(memory.date)}
                        </span>
                        <span aria-hidden="true" className="text-pink-300">
                          ·
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-pink-500" />
                          {replacePlaceholders(memory.location)}
                        </span>
                      </div>

                      {/* Memory Title */}
                      <h3 className="text-2xl sm:text-3xl font-serif text-[#3b0d1e] tracking-tight leading-snug font-medium">
                        {replacePlaceholders(memory.title)}
                      </h3>

                      {/* Memory Description Prose */}
                      <p className="text-sm sm:text-base text-rose-950/80 font-sans-body leading-relaxed max-w-lg">
                        {replacePlaceholders(memory.description)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 select-none"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white max-h-[75vh] bg-white">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[75vh]"
                />
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-lg sm:text-xl font-serif text-white">{replacePlaceholders(selectedPhoto.title)}</h4>
                <p className="text-xs text-pink-200 font-mono">
                  {selectedPhoto.date} · {selectedPhoto.location}
                </p>
                {selectedPhoto.captionNote && (
                  <p className="text-2xl sm:text-3xl text-pink-100 font-handwriting pt-1">
                    {replacePlaceholders(selectedPhoto.captionNote)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
