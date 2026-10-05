import React from 'react';
import { SiteDataSchema } from '../../types';
import { Sparkles, User, Calendar, Music, Mic } from 'lucide-react';

interface StoryInfoTabProps {
  content: SiteDataSchema;
  onChange: (updated: SiteDataSchema) => void;
}

export const StoryInfoTab: React.FC<StoryInfoTabProps> = ({ content, onChange }) => {
  const updateMeta = (field: keyof SiteDataSchema['meta'], value: string) => {
    onChange({
      ...content,
      meta: {
        ...content.meta,
        [field]: value,
      },
    });
  };

  const updateHero = (field: keyof SiteDataSchema['hero'], value: string) => {
    onChange({
      ...content,
      hero: {
        ...content.hero,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Core Names & Milestone */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-6">
        <div className="flex items-center gap-2 text-sm font-serif text-amber-300">
          <User className="w-4 h-4" />
          <span>Core Characters & Milestone</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Boyfriend Name</label>
            <input
              type="text"
              value={content.meta.boyfriendName}
              onChange={(e) => updateMeta('boyfriendName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Girlfriend Name</label>
            <input
              type="text"
              value={content.meta.girlfriendName}
              onChange={(e) => updateMeta('girlfriendName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Birth Date / Month</label>
            <input
              type="text"
              value={content.meta.birthDate}
              onChange={(e) => updateMeta('birthDate', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Relationship Milestone Tag</label>
            <input
              type="text"
              value={content.meta.relationshipMilestone}
              onChange={(e) => updateMeta('relationshipMilestone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>
        </div>
      </div>

      {/* 2. Hero & Introduction Quotes */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-6">
        <div className="flex items-center gap-2 text-sm font-serif text-amber-300">
          <Sparkles className="w-4 h-4" />
          <span>Opening Presentation & Hero Copy</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Hero Main Title</label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => updateHero('title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Hero Subtitle</label>
            <textarea
              rows={2}
              value={content.hero.subtitle}
              onChange={(e) => updateHero('subtitle', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Atmospheric Love Quote</label>
            <textarea
              rows={2}
              value={content.hero.atmosphericQuote}
              onChange={(e) => updateHero('atmosphericQuote', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>
        </div>
      </div>

      {/* 3. Audio Assets */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-6">
        <div className="flex items-center gap-2 text-sm font-serif text-amber-300">
          <Music className="w-4 h-4" />
          <span>Soundtrack & Voice Assets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Background Music Audio Path / URL</label>
            <input
              type="text"
              value={content.meta.defaultBackgroundMusicPath}
              onChange={(e) => updateMeta('defaultBackgroundMusicPath', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400">Girlfriend Voice Message Path / URL</label>
            <input
              type="text"
              value={content.meta.audioAssetPath}
              onChange={(e) => updateMeta('audioAssetPath', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
