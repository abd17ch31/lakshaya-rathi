import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../../services/audio/audioManager';

export interface AudioToggleProps {
  className?: string;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({ className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((playing, muted) => {
      setIsPlaying(playing);
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    audioManager.toggleMute();
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isMuted || !isPlaying ? 'Unmute background music' : 'Mute background music'}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-pink-200 shadow-[0_4px_20px_rgba(244,114,182,0.25)] text-pink-800 hover:border-pink-400 hover:text-pink-950 transition-all duration-300 active:scale-95 cursor-pointer ${className || ''}`}
    >
      {isMuted || !isPlaying ? (
        <>
          <VolumeX className="w-4 h-4 text-rose-400" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-rose-500">
            Music Muted
          </span>
        </>
      ) : (
        <>
          <div className="flex items-center gap-0.5 h-3.5">
            <span className="w-1 h-full bg-pink-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
            <span className="w-1 h-2/3 bg-pink-500 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" />
            <span className="w-1 h-4/5 bg-pink-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
          </div>
          <Volume2 className="w-4 h-4 text-pink-600" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-pink-700">
            Music Playing ♫
          </span>
        </>
      )}
    </button>
  );
};
