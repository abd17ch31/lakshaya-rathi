import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, Key, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { dbService } from '../services/supabase/dbService';

interface AdminAuthProps {
  onAuthenticated: () => void;
  onExit: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated, onExit }) => {
  const [email, setEmail] = useState('girlfriend@birthday.story');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usePasscodeMode, setUsePasscodeMode] = useState(true);

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (passcode.trim() === 'birthday2026' || passcode.trim() === 'love' || passcode.trim() === 'admin') {
      setTimeout(() => {
        setIsLoading(false);
        onAuthenticated();
      }, 400);
    } else {
      setIsLoading(false);
      setErrorMsg('Incorrect passcode. Try "birthday2026" or "love"');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const success = await dbService.signInWithEmail(email, password);
      setIsLoading(false);
      if (success) {
        onAuthenticated();
      } else {
        setErrorMsg('Invalid email credentials. You can also use Quick Passcode login.');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('Authentication error. Try using Quick Passcode.');
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
            Private customization & response vault for the creator.
          </p>
        </div>

        {usePasscodeMode ? (
          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-rose-800 font-semibold">Secret Story Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter secret passcode..."
                  className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500 transition-colors"
                />
                <Key className="w-4 h-4 text-pink-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
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
              Unlock Control Room
            </Button>

            <div className="flex items-center justify-between text-xs text-pink-700 pt-2 font-mono">
              <button
                type="button"
                onClick={() => setUsePasscodeMode(false)}
                className="hover:text-pink-900 underline cursor-pointer"
              >
                Use Email Sign-in
              </button>
              <span>Hint: birthday2026</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-rose-800 font-semibold">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-rose-800 font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-pink-50/50 border border-pink-200 text-[#3b0d1e] text-sm outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In to Supabase
            </Button>

            <div className="text-center text-xs text-pink-700 pt-2 font-mono">
              <button
                type="button"
                onClick={() => setUsePasscodeMode(true)}
                className="hover:text-pink-900 underline cursor-pointer"
              >
                Switch back to Secret Passcode
              </button>
            </div>
          </form>
        )}

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
