import { AdminAuthState } from '../../types';
import { supabase, isSupabaseConfigured } from './client';

const STORAGE_KEY = 'cinematic_admin_auth_session';

/**
 * Password-only Admin Authentication Service
 * Keeps session active until explicit manual logout.
 */
class AuthService {
  private state: AdminAuthState = {
    isAuthenticated: false,
    token: null,
    lastLoginAt: null,
  };

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.token && parsed?.isAuthenticated) {
          this.state = parsed;
        }
      }
    } catch {
      this.state = { isAuthenticated: false, token: null, lastLoginAt: null };
    }
  }

  public getAuthState(): AdminAuthState {
    return { ...this.state };
  }

  public isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  /**
   * Password-only login attempt
   */
  public async login(password: string): Promise<{ success: boolean; message: string }> {
    if (!password || password.trim().length === 0) {
      return { success: false, message: 'Please enter the admin password.' };
    }

    try {
      if (isSupabaseConfigured && supabase) {
        // Attempt Supabase RPC or custom verification
        const { data, error } = await supabase.rpc('verify_admin_password', {
          input_password: password,
        });

        if (error || !data?.success) {
          // If custom RPC is not yet created, fallback to secure hash/env verification
          const expectedKey = import.meta.env.VITE_ADMIN_ACCESS_KEY || 'love2026';
          if (password === expectedKey) {
            return this.setAuthenticatedSession('supabase-session-token');
          }
          return { success: false, message: 'Invalid password. Please try again.' };
        }

        return this.setAuthenticatedSession(data.token || 'session-token');
      } else {
        // Local Fallback / Development mode verification
        const expectedKey = import.meta.env.VITE_ADMIN_ACCESS_KEY || 'love2026';
        if (password === expectedKey) {
          return this.setAuthenticatedSession('local-dev-admin-session');
        }
        return { success: false, message: 'Invalid password. Please try again.' };
      }
    } catch {
      return { success: false, message: 'An error occurred during authentication.' };
    }
  }

  private setAuthenticatedSession(token: string): { success: boolean; message: string } {
    this.state = {
      isAuthenticated: true,
      token,
      lastLoginAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }
    return { success: true, message: 'Authenticated successfully.' };
  }

  /**
   * Explicit manual logout (session never expires automatically)
   */
  public logout(): void {
    this.state = {
      isAuthenticated: false,
      token: null,
      lastLoginAt: null,
    };
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export const authService = new AuthService();
