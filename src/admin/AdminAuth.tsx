import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, Key, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { authService } from '../services/supabase/authService';

interface AdminAuthProps {
  onAuthenticated: () => void;
  onExit: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated, onExit }) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password.trim()) {
      setErrorMsg('Please enter your admin password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login(password);
      setIsLoading(false);

      if (result.success) {
        onAuthenticated();
      } else {
        setErrorMsg(result.message);
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('An unexpected error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff0f4] to-[#fdeef3] flex items-center justify-center p-4 sm:p-8 relative">
      {/* Ambient background bloom */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-pink-300/30 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white border border-pink-200 shadow-[0_20px_60px_rgba(244,114,182,0.2)] space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 border border-pink-300 flex items-center justify-center mx-auto text-pink-600">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif text-[#3b0d1e] font-bold">Story Control Room</h2>
          <p className="text-xs text-rose-800/80">
            Enter your admin password to manage story details and view private responses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-800 font-semibold">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500 transition-colors"
              />
              <Key className="w-4 h-4 text-pink-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            isLoading={isLoading}
            icon={<Sparkles className="w-4 h-4 text-white" />}
          >
            Log In to Control Room
          </Button>
        </form>

        <div className="pt-4 border-t border-pink-100 text-center">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 text-xs text-rose-700 hover:text-rose-950 transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Birthday Experience</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
