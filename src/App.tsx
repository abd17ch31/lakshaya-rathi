import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RootLayout } from './layouts/RootLayout';
import { CinematicOpening } from './sections/CinematicOpening';
import { StoryIntroduction } from './sections/StoryIntroduction';
import { PersonalizedQuiz } from './sections/PersonalizedQuiz';
import { MemoryTimeline } from './sections/MemoryTimeline';
import { ScrapbookExperience } from './sections/ScrapbookExperience';
import { WishNotepad } from './sections/WishNotepad';
import { AudioExperience } from './sections/AudioExperience';
import { BirthdayCakeScene } from './sections/BirthdayCakeScene';
import { FinalBirthdayReveal } from './sections/FinalBirthdayReveal';
import { AdminAuth } from './admin/AdminAuth';
import { AdminDashboard } from './admin/AdminDashboard';
import { AudioToggle } from './components/audio/AudioToggle';
import { Container } from './components/ui/Container';
import { Lock } from 'lucide-react';
import { StoryContentProvider, useStoryContent } from './context/StoryContentContext';

function StoryExperience() {
  const [hasEnteredExperience, setHasEnteredExperience] = useState(false);
  const [isQuizUnlocked, setIsQuizUnlocked] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const { content } = useStoryContent();

  useEffect(() => {
    // Check initial route / hash for admin
    if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
      setIsAdminView(true);
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleEnter = () => {
    setHasEnteredExperience(true);
  };

  const handleQuizCompleted = () => {
    setIsQuizUnlocked(true);
    setTimeout(() => {
      const memSection = document.getElementById('memory-timeline');
      memSection?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  const handleReplayOpening = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setHasEnteredExperience(false);
  };

  const handleOpenAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminView(true);
  };

  const handleExitAdmin = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  // 1. ADMIN MODE VIEW
  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <AdminAuth
          onAuthenticated={() => setIsAdminAuthenticated(true)}
          onExit={handleExitAdmin}
        />
      );
    }

    return (
      <AdminDashboard
        onExitAdmin={handleExitAdmin}
      />
    );
  }

  // 2. PUBLIC BIRTHDAY EXPERIENCE VIEW
  return (
    <RootLayout>
      {/* 1. CINEMATIC OPENING */}
      <AnimatePresence>
        {!hasEnteredExperience && (
          <CinematicOpening onEnter={handleEnter} />
        )}
      </AnimatePresence>

      {/* 2. MAIN STORYLINE AFTER ENTRANCE */}
      {hasEnteredExperience && (
        <>
          {/* Floating Audio Controller */}
          <AudioToggle />

          {/* Chapter 0: Story Introduction */}
          <StoryIntroduction />

          {/* Chapter 1: Personalized Quiz (Mandatory Gatekeeper) */}
          <PersonalizedQuiz
            isUnlocked={isQuizUnlocked}
            onQuizCompleted={handleQuizCompleted}
          />

          {/* LOCKED STORY GATE (Visible only when quiz is not completed) */}
          {!isQuizUnlocked && (
            <div className="py-20 bg-[#fff0f4] border-t border-pink-100 text-center">
              <Container width="narrow">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 sm:p-10 rounded-3xl bg-white border border-pink-200 shadow-[0_10px_35px_rgba(244,114,182,0.12)] space-y-4 max-w-md mx-auto"
                >
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 border border-pink-300 flex items-center justify-center mx-auto text-pink-600">
                    <Lock className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-serif text-[#3b0d1e] font-bold">Story Chapters Locked</h4>
                    <p className="text-xs text-rose-800/80 leading-relaxed font-sans-body">
                      Answer all memory questions correctly above to unlock our timeline, voice notes, photo scrapbook, and birthday cake!
                    </p>
                  </div>
                </motion.div>
              </Container>
            </div>
          )}

          {/* UNLOCKED STORYLINE (Only revealed when quiz is completed) */}
          <AnimatePresence>
            {isQuizUnlocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {/* Chapter 2: Memory Timeline */}
                <MemoryTimeline />

                {/* Chapter 3: Scrapbook Photo Experience */}
                <ScrapbookExperience />

                {/* Chapter 4: Wish Notepad & Permanent Stars */}
                <WishNotepad />

                {/* Chapter 5: Audio Experience & Voice Messages */}
                <AudioExperience />

                {/* Chapter 6: Interactive Birthday Cake & Candles */}
                <BirthdayCakeScene />

                {/* Chapter 7: Final Cinematic Birthday Reveal */}
                <FinalBirthdayReveal onReplayJourney={handleReplayOpening} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* FOOTER */}
          <footer className="py-12 border-t border-pink-100 text-center text-xs text-rose-800/70 bg-[#fff0f4]">
            <Container width="default">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-medium">Crafted with love for {content.meta.boyfriendName} · Chapter {new Date().getFullYear()}</p>
                <button
                  onClick={handleOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-pink-700 hover:text-pink-900 transition-colors cursor-pointer font-mono text-[11px] font-semibold"
                  title="Open Creator Control Room"
                >
                  <Lock className="w-3 h-3" />
                  <span>Story Control Room</span>
                </button>
              </div>
            </Container>
          </footer>
        </>
      )}
    </RootLayout>
  );
}

export default function App() {
  return (
    <StoryContentProvider>
      <StoryExperience />
    </StoryContentProvider>
  );
}
