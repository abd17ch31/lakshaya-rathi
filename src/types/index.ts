/**
 * Centralized Type Definitions for the Birthday Cinematic Experience
 */

export interface SiteMetadataConfig {
  boyfriendName: string;
  girlfriendName: string;
  relationshipMilestone?: string;
  birthDate?: string;
  audioAssetPath: string; // Prerecorded girlfriend message (frontend asset)
  defaultBackgroundMusicPath: string;
}

export interface HeroSectionContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  atmosphericQuote: string;
}

export interface QuizAnswerOption {
  id: string;
  text: string;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: QuizAnswerOption[];
  correctOptionId: string;
  explanation: string;
  reactionCorrect: string;
  reactionWrong: string;
  sortOrder: number;
  isPublished?: boolean;
}

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  videoUrl?: string;
  captionNote?: string;
  sortOrder: number;
  isPublished?: boolean;
}

export interface WishStarItem {
  id: string;
  wishText?: string; // Private in DB; only loaded on client for author or admin
  xRatio?: number; // 0.0 to 1.0 for sky positioning
  yRatio?: number;
  size?: number;
  brightness?: number;
  createdAt: string;
}

export interface VoiceSubmissionItem {
  id: string;
  storagePath: string;
  durationSeconds: number;
  audioUrl?: string;
  createdAt: string;
}

export interface MediaAssetItem {
  id: string;
  assetName: string;
  assetType: 'image' | 'audio' | 'video';
  usageContext: 'hero' | 'memory' | 'final_reveal' | 'scrapbook' | 'bg_music' | 'general';
  storagePath: string;
  publicUrl: string;
  fileSize: number;
  mimeType?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CakeCandleConfig {
  totalCandles: number;
  allowMicrophoneBlow: boolean;
  blowThreshold: number; // Web Audio API RMS volume threshold
}

export interface FinalRevealContent {
  title: string;
  subtitle: string;
  girlfriendPhotoUrl: string;
  heartfeltMessage: string;
  signoff: string;
}

export interface SiteDataSchema {
  meta: SiteMetadataConfig;
  hero: HeroSectionContent;
  quizQuestions: QuizQuestionItem[];
  memories: MemoryItem[];
  finalReveal: FinalRevealContent;
  candleConfig: CakeCandleConfig;
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  token: string | null;
  lastLoginAt: string | null;
}

export interface SupabaseHealthStatus {
  isConfigured: boolean;
  isConnected: boolean;
  latencyMs: number | null;
  mode: 'supabase' | 'local_fallback';
  message: string;
}
