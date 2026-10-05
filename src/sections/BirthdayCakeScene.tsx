import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mic, Wind, ArrowDown, PartyPopper, RotateCcw } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { VectorBirthdayCake } from '../components/cake/VectorBirthdayCake';
import { scrapbookCard } from '../animations/motionVariants';

export interface BirthdayCakeSceneProps {
  onAllCandlesExtinguished?: () => void;
}

export const BirthdayCakeScene: React.FC<BirthdayCakeSceneProps> = ({ onAllCandlesExtinguished }) => {
  const TOTAL_CANDLES = 5;
  const [candlesLit, setCandlesLit] = useState<boolean[]>(Array(TOTAL_CANDLES).fill(true));
  const [isMicActive, setIsMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [allExtinguished, setAllExtinguished] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const litCount = candlesLit.filter(Boolean).length;

  useEffect(() => {
    if (litCount === 0 && !allExtinguished) {
      setAllExtinguished(true);
      stopMic();
      if (onAllCandlesExtinguished) {
        onAllCandlesExtinguished();
      }
    }
  }, [litCount, allExtinguished, onAllCandlesExtinguished]);

  const handleToggleCandle = (index: number) => {
    setCandlesLit((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const handleBlowAll = () => {
    setCandlesLit(Array(TOTAL_CANDLES).fill(false));
  };

  const handleRelight = () => {
    setCandlesLit(Array(TOTAL_CANDLES).fill(true));
    setAllExtinguished(false);
  };

  const toggleMicrophoneBlow = async () => {
    if (isMicActive) {
      stopMic();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      setIsMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkBlow = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(1, average / 100);
        setMicVolume(normalized);

        // Extinguish candle when user blows
        if (normalized > 0.3) {
          setCandlesLit((prev) => {
            const firstLitIdx = prev.findIndex((lit) => lit);
            if (firstLitIdx !== -1) {
              const next = [...prev];
              next[firstLitIdx] = false;
              return next;
            }
            return prev;
          });
        }

        animFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch {
      setIsMicActive(false);
    }
  };

  const stopMic = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsMicActive(false);
    setMicVolume(0);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  return (
    <Section id="birthday-cake" background="deep" hasVignette className="border-t border-pink-100 py-24 sm:py-36 relative overflow-hidden">
      <Container width="narrow">
        <div className="space-y-12 sm:space-y-16 text-center">
          {/* Header */}
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-pink-100 border border-pink-200 text-xs uppercase tracking-[0.28em] text-pink-700 font-bold shadow-xs">
              <PartyPopper className="w-3.5 h-3.5 text-pink-500" />
              <span>CHAPTER VI · MAKE A BIRTHDAY WISH</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light font-serif text-[#3b0d1e] tracking-tight">
              Blow Out Your Birthday Candles! 🎂
            </h2>
            <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed font-sans-body">
              Make a wish in your heart. Tap the candles or blow into your microphone to extinguish them.
            </p>
          </div>

          {/* CAKE CARD CONTAINER (Crisp White & Pastel Party Style) */}
          <motion.div
            variants={scrapbookCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative p-6 sm:p-10 rounded-3xl bg-white border border-pink-200 shadow-[0_20px_60px_rgba(244,114,182,0.18)] max-w-xl mx-auto flex flex-col items-center justify-center space-y-8"
          >
            {/* Ambient Warmth */}
            <div
              className={`absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full transition-opacity duration-1000 pointer-events-none ${
                litCount > 0 ? 'bg-pink-300/25 blur-3xl opacity-100' : 'opacity-0'
              }`}
            />

            {/* VECTOR BIRTHDAY CAKE */}
            <div className="w-full flex items-center justify-center">
              <VectorBirthdayCake
                candlesLit={candlesLit}
                onToggleCandle={handleToggleCandle}
              />
            </div>

            {/* CONTROLS BAR */}
            <div className="space-y-4 w-full pt-2">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* Microphone Blow Button */}
                <Button
                  variant={isMicActive ? 'primary' : 'secondary'}
                  size="sm"
                  icon={isMicActive ? <Mic className="w-4 h-4 text-white animate-pulse" /> : <Mic className="w-4 h-4 text-pink-600" />}
                  onClick={toggleMicrophoneBlow}
                >
                  {isMicActive ? 'Listening for blow...' : 'Blow with Microphone'}
                </Button>

                {/* Instant Tap/Blow All Button */}
                {litCount > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-pink-700 hover:text-pink-950 hover:bg-pink-100"
                    icon={<Wind className="w-4 h-4 text-pink-600" />}
                    onClick={handleBlowAll}
                  >
                    Blow All Candles
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-pink-700 hover:text-pink-950 hover:bg-pink-100"
                    icon={<RotateCcw className="w-3.5 h-3.5 text-pink-600" />}
                    onClick={handleRelight}
                  >
                    Relight Candles
                  </Button>
                )}
              </div>

              {/* Mic Decibel Meter */}
              {isMicActive && (
                <div className="max-w-xs mx-auto space-y-1">
                  <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-75"
                      style={{ width: `${Math.min(100, micVolume * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-rose-700 font-medium">Blow directly into your mic to extinguish</p>
                </div>
              )}
            </div>

            {/* ALL CANDLES EXTINGUISHED CELEBRATION MODAL */}
            <AnimatePresence>
              {allExtinguished && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border border-pink-300 text-center space-y-3.5 w-full shadow-[0_10px_35px_rgba(244,114,182,0.25)]"
                >
                  <div className="flex items-center justify-center gap-2 text-rose-950 font-serif text-xl sm:text-2xl font-bold">
                    <PartyPopper className="w-6 h-6 text-pink-600" />
                    <span>Your Birthday Wish Has Been Made!</span>
                  </div>

                  <p className="text-xs sm:text-sm text-rose-900 font-sans-body max-w-sm mx-auto">
                    All 5 candles are blown out! Continue down to the final reveal to read her heartfelt birthday letter.
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ArrowDown className="w-3.5 h-3.5 text-white animate-bounce" />}
                      onClick={() => {
                        const finalEl = document.getElementById('final-reveal');
                        finalEl?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Unveil Final Birthday Letter
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};
