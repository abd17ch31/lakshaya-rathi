import React from 'react';
import { SiteDataSchema } from '../../types';
import { Heart, Image, FileText } from 'lucide-react';

interface FinalRevealTabProps {
  content: SiteDataSchema;
  onChange: (updated: SiteDataSchema) => void;
}

export const FinalRevealTab: React.FC<FinalRevealTabProps> = ({ content, onChange }) => {
  const updateFinal = (field: keyof SiteDataSchema['finalReveal'], value: string) => {
    onChange({
      ...content,
      finalReveal: {
        ...content.finalReveal,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Climax Titles */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-6">
        <div className="flex items-center gap-2 text-sm font-serif text-amber-300">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>Final Reveal Header</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Celebratory Headline</label>
            <input
              type="text"
              value={content.finalReveal.title}
              onChange={(e) => updateFinal('title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Subtitle Dedication</label>
            <input
              type="text"
              value={content.finalReveal.subtitle}
              onChange={(e) => updateFinal('subtitle', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>
        </div>
      </div>

      {/* 2. Girlfriend Portrait & Photo URL */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-6">
        <div className="flex items-center gap-2 text-sm font-serif text-amber-300">
          <Image className="w-4 h-4" />
          <span>Girlfriend Showcase Portrait</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-4 aspect-3/4 max-w-[200px] rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
            <img
              src={content.finalReveal.girlfriendPhotoUrl}
              alt="Girlfriend portrait preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:col-span-8 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400">Portrait Image URL / Path</label>
              <input
                type="text"
                value={content.finalReveal.girlfriendPhotoUrl}
                onChange={(e) => updateFinal('girlfriendPhotoUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
              />
            </div>
            <p className="text-xs text-neutral-500">
              Provide any public HTTPS image URL or asset path.
            </p>
          </div>
        </div>
      </div>

      {/* 3. The Heartfelt Birthday Letter */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-6">
        <div className="flex items-center gap-2 text-sm font-serif text-amber-300">
          <FileText className="w-4 h-4" />
          <span>Heartfelt Birthday Letter Body</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Complete Message Text</label>
            <textarea
              rows={6}
              value={content.finalReveal.heartfeltMessage}
              onChange={(e) => updateFinal('heartfeltMessage', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50 leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Handwritten Signoff</label>
            <input
              type="text"
              value={content.finalReveal.signoff}
              onChange={(e) => updateFinal('signoff', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-amber-300 font-handwriting text-xl outline-none focus:border-amber-400/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
