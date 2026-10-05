import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Save,
  Globe,
  Sliders,
  HelpCircle,
  Clock,
  Mail,
  Heart,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SiteDataSchema } from '../types';
import { useStoryContent } from '../context/StoryContentContext';
import { StoryInfoTab } from './tabs/StoryInfoTab';
import { QuizManagerTab } from './tabs/QuizManagerTab';
import { MemoryManagerTab } from './tabs/MemoryManagerTab';
import { PrivateInboxTab } from './tabs/PrivateInboxTab';
import { FinalRevealTab } from './tabs/FinalRevealTab';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onContentUpdated?: (newContent: SiteDataSchema) => void;
}

type TabType = 'story' | 'quiz' | 'memories' | 'inbox' | 'reveal';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onContentUpdated,
}) => {
  const { content: globalContent, publishContent, saveDraft } = useStoryContent();
  const [activeTab, setActiveTab] = useState<TabType>('story');
  const [content, setContent] = useState<SiteDataSchema>(globalContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setContent(globalContent);
  }, [globalContent]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const success = await saveDraft(content);
      setIsSaving(false);
      if (success) {
        showToast('Draft saved successfully!');
      } else {
        showToast('Failed to save draft.', 'error');
      }
    } catch {
      setIsSaving(false);
      showToast('Failed to save draft.', 'error');
    }
  };

  const handlePublishLive = async () => {
    setIsPublishing(true);
    try {
      const success = await publishContent(content);
      setIsPublishing(false);
      if (success) {
        if (onContentUpdated) onContentUpdated(content);
        showToast('Published live! Boyfriend name and all edits are now active.');
      } else {
        showToast('Failed to publish changes.', 'error');
      }
    } catch {
      setIsPublishing(false);
      showToast('Failed to publish changes.', 'error');
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'story', label: 'Story & Audio', icon: <Sliders className="w-4 h-4" /> },
    { id: 'quiz', label: 'Trivia Quiz', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'memories', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'inbox', label: 'Private Vault (Inbox)', icon: <Mail className="w-4 h-4 text-pink-600" /> },
    { id: 'reveal', label: 'Final Letter', icon: <Heart className="w-4 h-4 text-rose-500" /> },
  ];

  return (
    <div className="min-h-screen bg-[#fff5f7] text-[#4a1528] flex flex-col font-sans-body">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-pink-200 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-pink-100 border border-pink-300 text-pink-600 flex items-center justify-center font-serif text-sm font-bold">
            ✦
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-serif text-[#3b0d1e] leading-none font-bold">
              Birthday Story Control Room
            </h1>
            <span className="text-[11px] font-mono text-rose-700">
              Editing for: <span className="text-pink-600 font-bold">{content.meta.boyfriendName}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={<Globe className="w-3.5 h-3.5" />}
            onClick={onExitAdmin}
            title="Preview Public Story"
          >
            <span className="hidden sm:inline">Preview Story</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Save className="w-3.5 h-3.5" />}
            isLoading={isSaving}
            onClick={handleSaveDraft}
          >
            <span className="hidden sm:inline">Save</span> Draft
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5 text-white" />}
            isLoading={isPublishing}
            onClick={handlePublishLive}
          >
            Publish Live
          </Button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-pink-200 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25'
                    : 'bg-white border border-pink-200 text-rose-800 hover:text-pink-950 hover:bg-pink-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels (Cards inside white container) */}
        <div className="pt-2">
          {activeTab === 'story' && (
            <StoryInfoTab content={content} onChange={setContent} />
          )}

          {activeTab === 'quiz' && (
            <QuizManagerTab content={content} onChange={setContent} />
          )}

          {activeTab === 'memories' && (
            <MemoryManagerTab content={content} onChange={setContent} />
          )}

          {activeTab === 'inbox' && (
            <PrivateInboxTab />
          )}

          {activeTab === 'reveal' && (
            <FinalRevealTab content={content} onChange={setContent} />
          )}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-mono border backdrop-blur-xl ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-500'
              : 'bg-rose-900 text-rose-100 border-rose-500'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </motion.div>
      )}
    </div>
  );
};
