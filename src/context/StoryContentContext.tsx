import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SiteDataSchema } from '../types';
import { siteData as defaultSiteData } from '../data/siteData';
import { dbService } from '../services/supabase/dbService';

interface StoryContentContextType {
  content: SiteDataSchema;
  setContent: React.Dispatch<React.SetStateAction<SiteDataSchema>>;
  refreshContent: () => Promise<void>;
  publishContent: (updated: SiteDataSchema) => Promise<boolean>;
  saveDraft: (updated: SiteDataSchema) => Promise<boolean>;
  replacePlaceholders: (text: string) => string;
}

const StoryContentContext = createContext<StoryContentContextType | undefined>(undefined);

export const StoryContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteDataSchema>(defaultSiteData);

  const refreshContent = async () => {
    try {
      const live = await dbService.getPublishedSiteContent();
      setContent(live);
    } catch (err) {
      console.warn('Could not refresh live content:', err);
    }
  };

  useEffect(() => {
    refreshContent();
  }, []);

  const publishContent = async (updated: SiteDataSchema): Promise<boolean> => {
    const success = await dbService.publishLiveSiteContent(updated);
    if (success) {
      setContent(updated);
    }
    return success;
  };

  const saveDraft = async (updated: SiteDataSchema): Promise<boolean> => {
    return await dbService.saveDraftSiteContent(updated);
  };

  // Helper to dynamically replace placeholders in any string
  const replacePlaceholders = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/BOYFRIEND_NAME/g, content.meta.boyfriendName || 'My Love')
      .replace(/GIRLFRIEND_NAME/g, content.meta.girlfriendName || 'Your Love')
      .replace(/RELATIONSHIP_MILESTONE/g, content.meta.relationshipMilestone || 'Our Story')
      .replace(/BIRTH_DATE/g, content.meta.birthDate || 'Today');
  };

  return (
    <StoryContentContext.Provider
      value={{
        content,
        setContent,
        refreshContent,
        publishContent,
        saveDraft,
        replacePlaceholders,
      }}
    >
      {children}
    </StoryContentContext.Provider>
  );
};

export const useStoryContent = (): StoryContentContextType => {
  const context = useContext(StoryContentContext);
  if (!context) {
    throw new Error('useStoryContent must be used within a StoryContentProvider');
  }
  return context;
};
