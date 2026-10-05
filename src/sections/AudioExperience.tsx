import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Play,
  Pause,
  Mic,
  Square,
  Send,
  CheckCircle2,
  RotateCcw,
  Radio,
  Lock,
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useStoryContent } from '../context/StoryContentContext';
import { audioManager } from '../services/audio/audioManager';
import { dbService } from '../services/supabase/dbService';
import { formatTime } from '../lib/utils';
import { scrapbookCard } from '../animations/motionVariants';

export const AudioExperience: React.FC = () => {
  const { content } = useStoryContent();

  // Girlfriend Player State
  const [isPlayingGf, setIsPlayingGf] = useState(false);
  const [gfProgress, setGfProgress] = useState(0);
  const [gfCurrentTime, setGfCurrentTime] = useState(0);
  const [gfDuration, setGfDuration] = useState(48);
  const gfAudioRef = useRef<HTMLAudioElement | null>(null);

  // Boyfriend Voice Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);
  const [voiceSubmitted, setVoiceSubmitted] = useState(false);
  const [recorderError, setRecorderError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = content.meta.audioAssetPath;
    audio.preload = 'metadata';

    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setGfDuration(Math.floor(audio.duration));
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setGfCurrentTime(Math.floor(audio.currentTime));
        setGfProgress(audio.currentTime / audio.duration);
      }
    });

    audio.addEventListener('ended', () => {
      setIsPlayingGf(false);
      setGfProgress(0);
      setGfCurrentTime(0);
      audioManager.setVolume(0.25);
    });

    gfAudioRef.current = audio;

    return () => {
      audio.pause();
      gfAudioRef.current = null;
    };
  }, [content.meta.audioAssetPath]);

  const togglePlayGirlfriendAudio = () => {
    const audio = gfAudioRef.current;
    if (!audio) return;

    if (isPlayingGf) {
      audio.pause();
      setIsPlayingGf(false);
      audioManager.setVolume(0.25);
    } else {
      audioManager.setVolume(0.04);
      audio
        .play()
        .then(() => {
          setIsPlayingGf(true);
        })
        .catch(() => {
          setIsPlayingGf(true);
          const interval = setInterval(() => {
            setGfCurrentTime((curr) => {
              if (curr >= gfDuration) {
                clearInterval(interval);
                setIsPlayingGf(false);
                audioManager.setVolume(0.25);
                return 0;
              }
              setGfProgress((curr + 1) / gfDuration);
              return curr + 1;
            });
          }, 1000);
        });
    }
  };

  const handleSeekGirlfriendAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setGfProgress(val);
    if (gfAudioRef.current && gfAudioRef.current.duration) {
      gfAudioRef.current.currentTime = val * gfAudioRef.current.duration;
      setGfCurrentTime(Math.floor(gfAudioRef.current.currentTime));
    }
  };

  const startRecording = async () => {
    setRecorderError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      setRecorderError('Microphone permission was denied or is unavailable on this device.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handlePreviewPlay = () => {
    if (!recordedAudioUrl) return;
    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(recordedAudioUrl);
      previewAudioRef.current.onended = () => setIsPlayingPreview(false);
    }

    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const handleSubmitVoiceRecording = async () => {
    if (!recordedBlob) return;
    setIsUploadingVoice(true);
    try {
      await dbService.submitVoiceRecording(recordedBlob, recordDuration);
      setIsUploadingVoice(false);
      setVoiceSubmitted(true);
    } catch {
      setRecorderError('Failed to send recording. Please try again.');
      setIsUploadingVoice(false);
    }
  };

  const handleRecordAgain = () => {
    setRecordedBlob(null);
    setRecordedAudioUrl(null);
    setVoiceSubmitted(false);
    setRecordDuration(0);
    setRecorderError(null);
  };

  return (
    <Section id="audio-experience" background="deep" hasVignette className="border-t border-pink-100 py-24 sm:py-36">
      <Container width="default">
        <div className="space-y-16 sm:space-y-20">
          {/* Header */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-pink-100 border border-pink-200 text-xs uppercase tracking-[0.28em] text-pink-700 font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>CHAPTER V · VOICE OF THE HEART</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light font-serif text-[#3b0d1e] tracking-tight">
              Words Spoken Out Loud
            </h2>
            <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed font-sans-body">
              Some emotions cannot fit into written ink — they exist only in the cadence of a voice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* 1. GIRLFRIEND PRERECORDED VOICE NOTE PLAYER */}
            <motion.div
              variants={scrapbookCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-pink-200 shadow-[0_15px_45px_rgba(244,114,182,0.15)] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-pink-700 font-mono border-b border-pink-100 pb-3 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-pink-500" />
                    From {content.meta.girlfriendName}
                  </span>
                  <span className="text-[11px] text-pink-600">Audio Ducking Enabled</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif text-[#3b0d1e]">
                  A Birthday Audio Message
                </h3>
                <p className="text-xs sm:text-sm font-handwriting text-2xl text-rose-900 leading-snug">
                  “Put on your headphones, close your eyes, and listen...”
                </p>
              </div>

              {/* Soundwave Visualizer */}
              <div className="p-5 rounded-2xl bg-[#fff8fa] border border-pink-100 space-y-4">
                <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-14">
                  {Array.from({ length: 28 }).map((_, idx) => {
                    const isHigh = idx % 3 === 0;
                    const isMed = idx % 2 === 0;
                    const heightClass = isPlayingGf
                      ? isHigh
                        ? 'animate-[pulse_0.7s_ease-in-out_infinite]'
                        : isMed
                        ? 'animate-[pulse_1.1s_ease-in-out_infinite]'
                        : 'animate-[pulse_0.9s_ease-in-out_infinite]'
                      : 'h-2';

                    return (
                      <span
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlayingGf ? 'bg-pink-500' : 'bg-pink-200'
                        } ${heightClass}`}
                        style={{
                          height: isPlayingGf ? `${Math.sin(idx * 0.4) * 20 + 26}px` : '4px',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Range Seek */}
                <div className="space-y-1.5">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={gfProgress}
                    onChange={handleSeekGirlfriendAudio}
                    className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-rose-700 font-medium">
                    <span>{formatTime(gfCurrentTime)}</span>
                    <span>{formatTime(gfDuration)}</span>
                  </div>
                </div>

                {/* Play Button */}
                <div className="flex items-center justify-center pt-2">
                  <button
                    onClick={togglePlayGirlfriendAudio}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(244,114,182,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                    aria-label={isPlayingGf ? 'Pause message' : 'Play message'}
                  >
                    {isPlayingGf ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 2. BOYFRIEND VOICE REPLY RECORDER */}
            <motion.div
              variants={scrapbookCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-pink-200 shadow-[0_15px_45px_rgba(244,114,182,0.15)] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-pink-700 font-mono border-b border-pink-100 pb-3 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-pink-500" />
                    Reply to {content.meta.girlfriendName}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                    <Lock className="w-3 h-3" /> Private Vault
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif text-[#3b0d1e]">
                  Send Her a Voice Note
                </h3>
                <p className="text-xs sm:text-sm text-rose-900/80 font-sans-body">
                  Record a message back to her directly. Your recording will be safely encrypted into her private storage vault.
                </p>
              </div>

              {/* Recorder Interaction Box */}
              <div className="p-5 rounded-2xl bg-[#fff8fa] border border-pink-100 flex flex-col items-center justify-center min-h-[190px] space-y-4 text-center">
                <AnimatePresence mode="wait">
                  {voiceSubmitted ? (
                    <motion.div
                      key="submitted"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-serif text-[#3b0d1e] font-bold">Voice Note Sent to Her Vault!</p>
                      <Button variant="ghost" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={handleRecordAgain}>
                        Record Another
                      </Button>
                    </motion.div>
                  ) : isRecording ? (
                    <motion.div
                      key="recording"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 text-rose-600 text-xs font-mono uppercase tracking-wider font-bold animate-pulse">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>Recording in progress...</span>
                      </div>
                      <div className="text-3xl font-mono text-[#3b0d1e] font-bold">
                        {formatTime(recordDuration)}
                      </div>
                      <Button variant="secondary" size="md" icon={<Square className="w-4 h-4 text-rose-600 fill-current" />} onClick={stopRecording}>
                        Stop Recording
                      </Button>
                    </motion.div>
                  ) : recordedBlob ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 w-full"
                    >
                      <div className="text-xs font-mono text-rose-800 font-semibold">
                        Recording Ready ({formatTime(recordDuration)})
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <Button variant="secondary" size="sm" icon={isPlayingPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />} onClick={handlePreviewPlay}>
                          {isPlayingPreview ? 'Pause' : 'Preview'}
                        </Button>
                        <Button variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5 text-white" />} isLoading={isUploadingVoice} onClick={handleSubmitVoiceRecording}>
                          Send to Her Vault
                        </Button>
                      </div>
                      <button onClick={handleRecordAgain} className="text-xs text-rose-600 hover:text-rose-900 underline cursor-pointer pt-1">
                        Discard & re-record
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <button
                        onClick={startRecording}
                        className="w-14 h-14 rounded-full bg-pink-100 border border-pink-300 text-pink-600 flex items-center justify-center hover:bg-pink-200 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer mx-auto shadow-[0_0_20px_rgba(244,114,182,0.2)]"
                        aria-label="Start recording voice note"
                      >
                        <Mic className="w-6 h-6" />
                      </button>
                      <p className="text-xs text-rose-700 font-mono font-medium">Tap mic to start recording</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {recorderError && (
                  <p className="text-xs text-rose-600 pt-1 font-medium">{recorderError}</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
