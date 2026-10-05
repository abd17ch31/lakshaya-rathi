import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/supabase/dbService';
import { WishStarItem, VoiceSubmissionItem } from '../../types';
import { Mail, Mic, Star, Play, Pause, RefreshCw, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { formatTime } from '../../lib/utils';

export const PrivateInboxTab: React.FC = () => {
  const [wishes, setWishes] = useState<WishStarItem[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<VoiceSubmissionItem[]>([]);
  const [stars, setStars] = useState<WishStarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const loadInboxData = async () => {
    setIsLoading(true);
    try {
      const [w, v, s] = await Promise.all([
        dbService.getAdminWishes(),
        dbService.getAdminVoiceSubmissions(),
        dbService.getPublicStars(),
      ]);
      setWishes(w);
      setVoiceNotes(v);
      setStars(s);
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInboxData();
  }, []);

  const handlePlayVoice = (item: VoiceSubmissionItem) => {
    if (!item.audioUrl) return;
    if (playingVoiceId === item.id) {
      audioPlayer?.pause();
      setPlayingVoiceId(null);
    } else {
      audioPlayer?.pause();
      const newAudio = new Audio(item.audioUrl);
      newAudio.onended = () => setPlayingVoiceId(null);
      newAudio.play();
      setAudioPlayer(newAudio);
      setPlayingVoiceId(item.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Private & Encrypted Vault</span>
          </div>
          <h3 className="text-base font-serif text-white">Responses & Submissions from Boyfriend</h3>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          onClick={loadInboxData}
        >
          Refresh Inbox
        </Button>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
            <Mail className="w-4 h-4" />
            <span>Wishes Received</span>
          </div>
          <div className="text-2xl font-serif text-white">{wishes.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-xs text-rose-300 font-mono">
            <Mic className="w-4 h-4" />
            <span>Voice Notes</span>
          </div>
          <div className="text-2xl font-serif text-white">{voiceNotes.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-xs text-amber-200 font-mono">
            <Star className="w-4 h-4" />
            <span>Permanent Stars in Sky</span>
          </div>
          <div className="text-2xl font-serif text-white">{stars.length}</div>
        </div>
      </div>

      {/* 1. BOYFRIEND'S WRITTEN WISHES */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-sm font-serif text-amber-300 border-b border-white/5 pb-3">
          <Mail className="w-4 h-4" />
          <span>Written Wishes ({wishes.length})</span>
        </div>

        {wishes.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-4 text-center font-mono">
            No wishes submitted yet. When he writes a wish, it will appear here in full.
          </p>
        ) : (
          <div className="space-y-3">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-xl bg-neutral-950 border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>{new Date(w.createdAt).toLocaleString()}</span>
                  <span className="text-amber-300/80">Permanent Star Created</span>
                </div>
                <p className="text-lg text-amber-100 font-handwriting leading-snug">
                  “{w.wishText}”
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. BOYFRIEND'S RECORDED VOICE NOTES */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-sm font-serif text-rose-300 border-b border-white/5 pb-3">
          <Mic className="w-4 h-4" />
          <span>Boyfriend Voice Recordings ({voiceNotes.length})</span>
        </div>

        {voiceNotes.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-4 text-center font-mono">
            No voice recordings received yet.
          </p>
        ) : (
          <div className="space-y-3">
            {voiceNotes.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-xl bg-neutral-950 border border-white/5 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-xs text-white font-mono">
                    Voice Note ({formatTime(v.durationSeconds)})
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    {new Date(v.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {v.audioUrl && (
                    <button
                      onClick={() => handlePlayVoice(v)}
                      className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 flex items-center justify-center transition-colors cursor-pointer"
                      title={playingVoiceId === v.id ? 'Pause' : 'Play'}
                    >
                      {playingVoiceId === v.id ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  )}
                  {v.audioUrl && (
                    <a
                      href={v.audioUrl}
                      download="boyfriend-voice-message.webm"
                      className="text-xs text-neutral-400 hover:text-white underline font-mono"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
