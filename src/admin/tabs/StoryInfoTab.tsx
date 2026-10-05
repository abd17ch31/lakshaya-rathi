import React from 'react';
import { SiteDataSchema } from '../../types';
import { Sparkles, User, Music } from 'lucide-react';

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
      <div className="p-6 rounded-2xl bg-white border border-pink-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-sm font-serif text-pink-700 font-bold">
          <User className="w-4 h-4 text-pink-500" />
          <span>Core Characters & Milestone</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-800 font-semibold">Boyfriend Name</label>
            <input
              type="text"
              value={content.meta.boyfriendName}
              onChange={(e) => updateMeta('boyfriendName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-800 font-semibold">Girlfriend Name</label>
            <input
              type="text"
              value={content.meta.girlfriendName}
              onChange={(e) => updateMeta('girlfriendName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-800 font-semibold">Birth Date / Month</label>
            <input
              type="text"
              value={content.meta.birthDate}
              onChange={(e) => updateMeta('birthDate', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-800 font-semibold">Relationship Milestone Tag</label>
            <input
              type="text"
              value={content.meta.relationshipMilestone}
              onChange={(e) => updateMeta('relationshipMilestone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Hero & Introduction Quotes */}
      <div className="p-6 rounded-2xl bg-white border border-pink-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-sm font-serif text-pink-700 font-bold">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>Opening Presentation & Hero Copy</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-800 font-semibold">Hero Main Title</label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => updateHero('title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-800 font-semibold">Hero Subtitle</label>
            <textarea
              rows={2}
              value={content.hero.subtitle}
              onChange={(e) => updateHero('subtitle', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-800 font-semibold">Atmospheric Quote</label>
            <textarea
              rows={2}
              value={content.hero.atmosphericQuote}
              onChange={(e) => updateHero('atmosphericQuote', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Audio Assets */}
      <div className="p-6 rounded-2xl bg-white border border-pink-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-sm font-serif text-pink-700 font-bold">
          <Music className="w-4 h-4 text-pink-500" />
          <span>Soundtrack & Voice Assets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-800 font-semibold">Background Music Audio Path / URL</label>
            <input
              type="text"
              value={content.meta.defaultBackgroundMusicPath}
              onChange={(e) => updateMeta('defaultBackgroundMusicPath', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-800 font-semibold">Girlfriend Voice Message Path / URL</label>
            <input
              type="text"
              value={content.meta.audioAssetPath}
              onChange={(e) => updateMeta('audioAssetPath', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
