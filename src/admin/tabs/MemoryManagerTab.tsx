import React from 'react';
import { SiteDataSchema, MemoryItem } from '../../types';
import { Plus, Trash2, Image, MapPin, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface MemoryManagerTabProps {
  content: SiteDataSchema;
  onChange: (updated: SiteDataSchema) => void;
}

export const MemoryManagerTab: React.FC<MemoryManagerTabProps> = ({ content, onChange }) => {
  const memories = content.memories || [];

  const handleUpdateMemory = (index: number, updated: MemoryItem) => {
    const next = [...memories];
    next[index] = updated;
    onChange({ ...content, memories: next });
  };

  const handleAddMemory = () => {
    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title: 'New Memory Title',
      description: 'Describe the magic of this moment and why it stays with you.',
      date: 'Summer Evening',
      location: 'City Viewpoint',
      imageUrl: '/src/assets/images/memory_autumn_city_walk_1791181913689.jpg',
      captionNote: '“One of my favorite days with you.”',
      sortOrder: memories.length + 1,
    };
    onChange({ ...content, memories: [...memories, newMem] });
  };

  const handleDeleteMemory = (index: number) => {
    const next = memories.filter((_, i) => i !== index);
    onChange({ ...content, memories: next });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-serif text-white">Memory Timeline Chapters</h3>
          <p className="text-xs text-neutral-400">
            Organize chronological milestones, locations, and photo cards.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleAddMemory}
        >
          Add Milestone
        </Button>
      </div>

      <div className="space-y-6">
        {memories.map((mem, idx) => (
          <div
            key={mem.id}
            className="p-6 rounded-2xl bg-neutral-900/70 border border-white/10 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-mono text-amber-300">Milestone #{idx + 1}</span>
              <button
                onClick={() => handleDeleteMemory(idx)}
                className="text-neutral-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                title="Delete memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Photo Preview & Path */}
              <div className="md:col-span-4 space-y-2">
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400">Image Asset URL</label>
                  <input
                    type="text"
                    value={mem.imageUrl}
                    onChange={(e) =>
                      handleUpdateMemory(idx, { ...mem, imageUrl: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              {/* Memory Details Form */}
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400">Milestone Title</label>
                  <input
                    type="text"
                    value={mem.title}
                    onChange={(e) =>
                      handleUpdateMemory(idx, { ...mem, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Date / Season</label>
                    <input
                      type="text"
                      value={mem.date}
                      onChange={(e) =>
                        handleUpdateMemory(idx, { ...mem, date: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-400">Location Tag</label>
                    <input
                      type="text"
                      value={mem.location}
                      onChange={(e) =>
                        handleUpdateMemory(idx, { ...mem, location: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400">Story Description</label>
                  <textarea
                    rows={2}
                    value={mem.description}
                    onChange={(e) =>
                      handleUpdateMemory(idx, { ...mem, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400">Handwritten Polaroid Caption</label>
                  <input
                    type="text"
                    value={mem.captionNote}
                    onChange={(e) =>
                      handleUpdateMemory(idx, { ...mem, captionNote: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-amber-200 text-xs font-handwriting outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
