import { AdminAuthState } from '../../types';
import { supabase, isSupabaseConfigured } from './client';

type AuthListener = (isAuthenticated: boolean) => void;

/**
 * Password-only Admin Authentication Service backed by real Supabase Auth.
 * Automatically uses the dedicated admin email while presenting a clean
 * password-only interface to the user.
 */
class AuthService {
  private state: AdminAuthState = {
    isAuthenticated: false,
    token: null,
    lastLoginAt: null,
  };
  private listeners: Set<AuthListener> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      this.isInitialized = true;
      return;
    }

    try {
      // 1. Check real Supabase Auth session on startup
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user && session?.access_token) {
        this.state = {
          isAuthenticated: true,
          token: session.access_token,
          lastLoginAt: new Date().toISOString(),
        };
      } else {
        this.state = {
          isAuthenticated: false,
          token: null,
          lastLoginAt: null,
        };
      }

      // 2. Listen to real Supabase auth state changes (sign in, sign out, token refresh)
      supabase.auth.onAuthStateChange((_event, session) => {
        const isAuth = Boolean(session?.user && session?.access_token);
        this.state = {
          isAuthenticated: isAuth,
          token: session?.access_token ?? null,
          lastLoginAt: isAuth ? this.state.lastLoginAt || new Date().toISOString() : null,
        };
        this.notifyListeners(isAuth);
      });
    } catch (err) {
      console.error('Failed to initialize Supabase session:', err);
      this.state = { isAuthenticated: false, token: null, lastLoginAt: null };
    } finally {
      this.isInitialized = true;
      this.notifyListeners(this.state.isAuthenticated);
    }
  }

  public async getSession() {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }

  public getAuthState(): AdminAuthState {
    return { ...this.state };
  }

  public isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    if (this.isInitialized) {
      listener(this.state.isAuthenticated);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(isAuth: boolean): void {
    this.listeners.forEach((listener) => {
      try {
        listener(isAuth);
      } catch (err) {
        console.error('Error in auth listener:', err);
      }
    });
  }

  /**
   * Password-only login using real Supabase Auth.
   * Sends the admin email and password to Supabase Auth to establish a real JWT session.
   */
  public async login(password: string): Promise<{ success: boolean; message: string }> {
    if (!password || password.trim().length === 0) {
      return { success: false, message: 'Please enter the admin password.' };
    }

    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message: 'Supabase is not configured. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@yourbirthday.site';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: password.trim(),
      });

      if (error || !data.session) {
        const errorMsg =
          error?.message === 'Invalid login credentials'
            ? `Incorrect password for admin account (${adminEmail}).`
            : error?.message || 'Authentication failed. Please check your credentials in Supabase Auth.';
        return { success: false, message: errorMsg };
      }

      this.state = {
        isAuthenticated: true,
        token: data.session.access_token,
        lastLoginAt: new Date().toISOString(),
      };
      this.notifyListeners(true);

      return { success: true, message: 'Authenticated successfully with Supabase Auth.' };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during login.';
      return { success: false, message: msg };
    }
  }

  /**
   * Explicit manual logout.
   * Calls Supabase auth.signOut() to destroy the real JWT session.
   */
  public async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error during Supabase signOut:', err);
      }
    }

    this.state = {
      isAuthenticated: false,
      token: null,
      lastLoginAt: null,
    };
    this.notifyListeners(false);
  }
}

export const authService = new AuthService();
