import {
  MemoryItem,
  QuizQuestionItem,
  WishStarItem,
  VoiceSubmissionItem,
  SiteDataSchema,
  SupabaseHealthStatus,
} from '../../types';
import { siteData } from '../../data/siteData';
import { supabase, isSupabaseConfigured } from './client';

// Local storage cache keys
const LOCAL_STORAGE_PREFIX = 'cinematic_bd_';

class DbService {
  /**
   * Health & connectivity check for Supabase
   */
  public async checkHealth(): Promise<SupabaseHealthStatus> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        isConfigured: false,
        isConnected: false,
        latencyMs: null,
        mode: 'local_fallback',
        message: 'Running in local fallback mode. Configure VITE_SUPABASE_URL to connect.',
      };
    }

    const start = performance.now();
    try {
      const { error } = await supabase.from('site_content').select('id').limit(1);
      const latencyMs = Math.round(performance.now() - start);

      if (error && error.code !== 'PGRST116') {
        return {
          isConfigured: true,
          isConnected: false,
          latencyMs,
          mode: 'supabase',
          message: `Connected to Supabase (${error.message})`,
        };
      }

      return {
        isConfigured: true,
        isConnected: true,
        latencyMs,
        mode: 'supabase',
        message: `Connected to Supabase live database (${latencyMs}ms latency).`,
      };
    } catch (err) {
      return {
        isConfigured: true,
        isConnected: false,
        latencyMs: null,
        mode: 'local_fallback',
        message: err instanceof Error ? err.message : 'Connection failed',
      };
    }
  }

  // ==========================================
  // 1. SITE CONTENT (Draft / Published System)
  // ==========================================

  public async getPublishedSiteContent(): Promise<SiteDataSchema> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('section_key, published_data')
          .eq('is_published', true);

        if (!error && data && data.length > 0) {
          const merged: Partial<SiteDataSchema> = { ...siteData };
          for (const row of data) {
            if (row.section_key === 'hero' && row.published_data) merged.hero = row.published_data;
            if (row.section_key === 'meta' && row.published_data) merged.meta = row.published_data;
            if (row.section_key === 'final_reveal' && row.published_data) merged.finalReveal = row.published_data;
          }
          return merged as SiteDataSchema;
        }
      } catch (err) {
        console.warn('Falling back to default/cached site content:', err);
      }
    }

    const saved = this.getLocal<Partial<SiteDataSchema>>('published_content');
    return { ...siteData, ...(saved || {}) };
  }

  public async saveDraftSiteContent(content: SiteDataSchema): Promise<boolean> {
    this.setLocal('draft_content', content);

    if (isSupabaseConfigured && supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const sections = [
          { section_key: 'meta', draft_data: content.meta, updated_at: new Date().toISOString() },
          { section_key: 'hero', draft_data: content.hero, updated_at: new Date().toISOString() },
          { section_key: 'final_reveal', draft_data: content.finalReveal, updated_at: new Date().toISOString() },
        ];

        for (const sec of sections) {
          const { error } = await supabase
            .from('site_content')
            .upsert(sec as Record<string, unknown>, { onConflict: 'section_key' });
          if (error) {
            console.error('Error saving draft section:', error);
            throw new Error(error.message);
          }
        }
      }
    }

    return true;
  }

  public async publishLiveSiteContent(content: SiteDataSchema): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      // 1. Verify that a real authenticated Supabase session exists
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error('Admin session expired or unauthenticated. Please log in to publish changes.');
      }

      // 2. Perform live upsert to Supabase site_content table
      const sections = [
        {
          section_key: 'meta',
          published_data: content.meta,
          is_published: true,
          updated_at: new Date().toISOString(),
        },
        {
          section_key: 'hero',
          published_data: content.hero,
          is_published: true,
          updated_at: new Date().toISOString(),
        },
        {
          section_key: 'final_reveal',
          published_data: content.finalReveal,
          is_published: true,
          updated_at: new Date().toISOString(),
        },
      ];

      for (const sec of sections) {
        const { error } = await supabase
          .from('site_content')
          .upsert(sec as Record<string, unknown>, { onConflict: 'section_key' });
        if (error) {
          console.error(`Error publishing section "${sec.section_key}":`, error);
          throw new Error(error.message);
        }
      }
    }

    // Persist to local cache
    this.setLocal('published_content', content);
    this.setLocal('draft_content', content);

    return true;
  }

  // ==========================================
  // 2. MEMORIES (CRUD + Reordering)
  // ==========================================

  public async getMemories(): Promise<MemoryItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            title: d.title,
            description: d.description,
            date: d.date_text,
            location: d.location,
            imageUrl: d.image_url,
            videoUrl: d.video_url,
            captionNote: d.caption_note,
            sortOrder: d.sort_order,
            isPublished: d.is_published,
          }));
        }
      } catch (err) {
        console.warn('Fallback to local memories:', err);
      }
    }

    return this.getLocal<MemoryItem[]>('memories') || siteData.memories;
  }

  public async saveMemory(memory: Partial<MemoryItem>): Promise<MemoryItem> {
    const item: MemoryItem = {
      id: memory.id || `mem-${Date.now()}`,
      title: memory.title || 'Untitled Memory',
      description: memory.description || '',
      date: memory.date || '',
      location: memory.location || '',
      imageUrl: memory.imageUrl || '/src/assets/images/scrapbook_roadtrip_mirror_1791182752019.jpg',
      videoUrl: memory.videoUrl,
      captionNote: memory.captionNote,
      sortOrder: memory.sortOrder ?? 0,
      isPublished: memory.isPublished ?? true,
    };

    if (isSupabaseConfigured && supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { error } = await supabase.from('memories').upsert({
          id: item.id.includes('-') && !item.id.startsWith('mem-') ? item.id : undefined,
          title: item.title,
          description: item.description,
          date_text: item.date,
          location: item.location,
          image_url: item.imageUrl,
          video_url: item.videoUrl,
          caption_note: item.captionNote,
          sort_order: item.sortOrder,
          is_published: item.isPublished,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          throw new Error(error.message);
        }
      }
    }

    const current = await this.getMemories();
    const index = current.findIndex((m) => m.id === item.id);
    const updated = index >= 0 ? current.map((m, i) => (i === index ? item : m)) : [...current, item];
    this.setLocal('memories', updated);
    return item;
  }

  public async deleteMemory(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { error } = await supabase.from('memories').delete().eq('id', id);
        if (error) {
          throw new Error(error.message);
        }
      }
    }

    const current = await this.getMemories();
    this.setLocal('memories', current.filter((m) => m.id !== id));
    return true;
  }

  // ==========================================
  // 3. QUIZ QUESTIONS (CRUD + Reordering)
  // ==========================================

  public async getQuizQuestions(): Promise<QuizQuestionItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctOptionId: q.correct_option_id,
            explanation: q.explanation,
            reactionCorrect: q.reaction_correct,
            reactionWrong: q.reaction_wrong,
            sortOrder: q.sort_order,
            isPublished: q.is_published,
          }));
        }
      } catch (err) {
        console.warn('Fallback to local quiz:', err);
      }
    }

    return this.getLocal<QuizQuestionItem[]>('quiz') || siteData.quizQuestions;
  }

  public async saveQuizQuestion(question: Partial<QuizQuestionItem>): Promise<QuizQuestionItem> {
    const item: QuizQuestionItem = {
      id: question.id || `quiz-${Date.now()}`,
      question: question.question || 'QUIZ_QUESTION',
      options: question.options || [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
      ],
      correctOptionId: question.correctOptionId || 'a',
      explanation: question.explanation || '',
      reactionCorrect: question.reactionCorrect || 'Correct!',
      reactionWrong: question.reactionWrong || 'Try again!',
      sortOrder: question.sortOrder ?? 0,
      isPublished: question.isPublished ?? true,
    };

    if (isSupabaseConfigured && supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { error } = await supabase.from('quiz_questions').upsert({
          id: item.id.includes('-') && !item.id.startsWith('quiz-') ? item.id : undefined,
          question: item.question,
          options: item.options,
          correct_option_id: item.correctOptionId,
          explanation: item.explanation,
          reaction_correct: item.reactionCorrect,
          reaction_wrong: item.reactionWrong,
          sort_order: item.sortOrder,
          is_published: item.isPublished,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          throw new Error(error.message);
        }
      }
    }

    const current = await this.getQuizQuestions();
    const index = current.findIndex((q) => q.id === item.id);
    const updated = index >= 0 ? current.map((q, i) => (i === index ? item : q)) : [...current, item];
    this.setLocal('quiz', updated);
    return item;
  }

  // ==========================================
  // 4. WISHES (Permanent Stars)
  // ==========================================

  public async submitWish(wishText: string): Promise<WishStarItem> {
    const xRatio = parseFloat((0.1 + Math.random() * 0.8).toFixed(4));
    const yRatio = parseFloat((0.1 + Math.random() * 0.6).toFixed(4));

    const star: WishStarItem = {
      id: `star-${Date.now()}`,
      wishText,
      xRatio,
      yRatio,
      size: Math.floor(Math.random() * 3) + 2,
      brightness: parseFloat((0.7 + Math.random() * 0.3).toFixed(2)),
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('wishes')
          .insert({
            wish_text: wishText,
            x_ratio: xRatio,
            y_ratio: yRatio,
          })
          .select('id, x_ratio, y_ratio, created_at')
          .single();

        if (!error && data) {
          star.id = data.id;
        }
      } catch (err) {
        console.error('Error submitting wish to Supabase:', err);
      }
    }

    const stars = this.getLocal<WishStarItem[]>('public_stars') || [];
    const publicStar: WishStarItem = { ...star };
    delete publicStar.wishText;
    this.setLocal('public_stars', [...stars, publicStar]);

    const adminWishes = this.getLocal<WishStarItem[]>('admin_wishes') || [];
    this.setLocal('admin_wishes', [...adminWishes, star]);

    return star;
  }

  public async getPublicStars(): Promise<WishStarItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('public_stars_view')
          .select('id, x_ratio, y_ratio, created_at');

        if (!error && data) {
          return data.map((s, idx) => ({
            id: s.id,
            xRatio: s.x_ratio,
            yRatio: s.y_ratio,
            size: (idx % 3) + 2,
            brightness: 0.8,
            createdAt: s.created_at,
          }));
        }
      } catch (err) {
        console.warn('Fallback to local stars:', err);
      }
    }

    return this.getLocal<WishStarItem[]>('public_stars') || [];
  }

  public async getAdminWishes(): Promise<WishStarItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('wishes')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((w) => ({
            id: w.id,
            wishText: w.wish_text,
            xRatio: w.x_ratio,
            yRatio: w.y_ratio,
            createdAt: w.created_at,
          }));
        }
      } catch (err) {
        console.error('Error fetching admin wishes:', err);
      }
    }

    return this.getLocal<WishStarItem[]>('admin_wishes') || [];
  }

  public async deleteWish(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('wishes').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting wish:', err);
      }
    }

    const admin = this.getLocal<WishStarItem[]>('admin_wishes') || [];
    const stars = this.getLocal<WishStarItem[]>('public_stars') || [];
    this.setLocal('admin_wishes', admin.filter((w) => w.id !== id));
    this.setLocal('public_stars', stars.filter((s) => s.id !== id));
    return true;
  }

  // ==========================================
  // 5. VOICE SUBMISSIONS
  // ==========================================

  public async submitVoiceRecording(
    audioBlob: Blob,
    durationSeconds: number
  ): Promise<VoiceSubmissionItem> {
    const timestamp = Date.now();
    const filename = `voice_${timestamp}.webm`;
    let storagePath = `voice-submissions/${filename}`;
    let audioUrl = URL.createObjectURL(audioBlob);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('voice-submissions')
          .upload(filename, audioBlob, {
            contentType: audioBlob.type || 'audio/webm',
            cacheControl: '3600',
            upsert: false,
          });

        if (!uploadErr && uploadData) {
          storagePath = uploadData.path;
          const { data: dbData } = await supabase
            .from('voice_submissions')
            .insert({
              storage_path: storagePath,
              duration_seconds: durationSeconds,
            })
            .select('*')
            .single();

          if (dbData) {
            return {
              id: dbData.id,
              storagePath: dbData.storage_path,
              durationSeconds: dbData.duration_seconds,
              createdAt: dbData.created_at,
              audioUrl,
            };
          }
        }
      } catch (err) {
        console.error('Error uploading voice submission:', err);
      }
    }

    const item: VoiceSubmissionItem = {
      id: `voice-${timestamp}`,
      storagePath,
      durationSeconds,
      audioUrl,
      createdAt: new Date().toISOString(),
    };

    const list = this.getLocal<VoiceSubmissionItem[]>('admin_voice_subs') || [];
    this.setLocal('admin_voice_subs', [item, ...list]);
    return item;
  }

  public async getAdminVoiceSubmissions(): Promise<VoiceSubmissionItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('voice_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((v) => ({
            id: v.id,
            storagePath: v.storage_path,
            durationSeconds: v.duration_seconds,
            createdAt: v.created_at,
          }));
        }
      } catch (err) {
        console.error('Error fetching voice submissions:', err);
      }
    }

    return this.getLocal<VoiceSubmissionItem[]>('admin_voice_subs') || [];
  }

  // ==========================================
  // HELPERS
  // ==========================================

  private getLocal<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private setLocal<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  }
}

export const dbService = new DbService();
