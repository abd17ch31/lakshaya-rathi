import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, HelpCircle, CheckCircle2, RotateCcw, ArrowRight, Award, Lock, Unlock } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { QuizQuestionItem } from '../types';
import { useStoryContent } from '../context/StoryContentContext';
import { scrapbookCard } from '../animations/motionVariants';

export interface PersonalizedQuizProps {
  isUnlocked?: boolean;
  onQuizCompleted?: () => void;
}

export const PersonalizedQuiz: React.FC<PersonalizedQuizProps> = ({ isUnlocked = false, onQuizCompleted }) => {
  const { content, replacePlaceholders } = useStoryContent();
  const [questions, setQuestions] = useState<QuizQuestionItem[]>(content.quizQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<'unanswered' | 'correct' | 'wrong'>('unanswered');
  const [isCompleted, setIsCompleted] = useState<boolean>(isUnlocked);
  const [correctCount, setCorrectCount] = useState<number>(0);

  useEffect(() => {
    if (content.quizQuestions && content.quizQuestions.length > 0) {
      setQuestions(content.quizQuestions);
    }
  }, [content.quizQuestions]);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleSelectOption = (optionId: string) => {
    if (answerState === 'correct') return;

    setSelectedOptionId(optionId);
    if (optionId === currentQuestion.correctOptionId) {
      setAnswerState('correct');
      setCorrectCount((prev) => prev + 1);
    } else {
      setAnswerState('wrong');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setAnswerState('unanswered');
    } else {
      setIsCompleted(true);
      if (onQuizCompleted) {
        onQuizCompleted();
      }
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOptionId(null);
    setAnswerState('unanswered');
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setAnswerState('unanswered');
    setIsCompleted(false);
    setCorrectCount(0);
  };

  return (
    <Section id="quiz-section" background="surface" hasVignette className="border-t border-pink-100 py-24 sm:py-32">
      <Container width="narrow">
        <div className="space-y-10">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-white border border-pink-200 text-xs uppercase tracking-[0.25em] text-pink-700 font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>CHAPTER I · HOW WELL DO YOU REMEMBER?</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light font-serif text-[#3b0d1e] tracking-tight">
              Our Little Memory Test
            </h2>
            <p className="text-xs sm:text-sm text-rose-900/80 max-w-md mx-auto">
              A playful walk through our sweetest moments. Answer correctly to unlock the story chapters ahead!
            </p>
          </div>

          {/* QUIZ INTERACTION CARD */}
          <AnimatePresence mode="wait">
            {!isCompleted && currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                variants={scrapbookCard}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="relative p-6 sm:p-10 rounded-3xl bg-white border border-pink-200 shadow-[0_15px_45px_rgba(244,114,182,0.15)] space-y-8"
              >
                {/* Top Status Row */}
                <div className="flex items-center justify-between text-xs text-rose-700 font-mono border-b border-pink-100 pb-4">
                  <span className="flex items-center gap-1.5 text-pink-700 font-bold">
                    <HelpCircle className="w-4 h-4 text-pink-500" />
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-1">
                    {questions.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentIndex
                            ? 'w-6 bg-pink-500'
                            : idx < currentIndex
                            ? 'w-2 bg-pink-300'
                            : 'w-2 bg-pink-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-serif text-[#3b0d1e] leading-snug">
                    {replacePlaceholders(currentQuestion.question)}
                  </h3>
                </div>

                {/* Answer Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrect = answerState === 'correct' && isSelected;
                    const isWrong = answerState === 'wrong' && isSelected;
                    const letter = String.fromCharCode(65 + idx);

                    let stateStyles = 'border-pink-100 bg-[#fff8fa] text-rose-950 hover:border-pink-300 hover:bg-pink-50 shadow-xs';
                    if (isCorrect) {
                      stateStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] font-semibold';
                    } else if (isWrong) {
                      stateStyles = 'border-rose-400 bg-rose-50 text-rose-950 shadow-[0_0_20px_rgba(244,63,94,0.15)]';
                    }

                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleSelectOption(option.id)}
                        whileTap={{ scale: 0.98 }}
                        animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className={`group relative flex items-start gap-3 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer select-none ${stateStyles}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-pink-200/60 border border-pink-300 flex items-center justify-center text-xs font-mono font-bold text-pink-800 shrink-0 group-hover:border-pink-500">
                          {letter}
                        </span>
                        <span className="text-sm font-sans-body leading-snug pt-0.5">
                          {replacePlaceholders(option.text)}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Reaction Feedback */}
                <AnimatePresence>
                  {answerState !== 'unanswered' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className={`p-5 rounded-2xl border transition-all duration-300 space-y-3 ${
                        answerState === 'correct'
                          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50/90 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm font-bold">
                        {answerState === 'correct' ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Correct!</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                            <span>Not quite, my love!</span>
                          </>
                        )}
                      </div>

                      <p className="text-sm font-sans-body leading-relaxed">
                        {answerState === 'correct'
                          ? replacePlaceholders(currentQuestion.reactionCorrect || currentQuestion.explanation)
                          : replacePlaceholders(currentQuestion.reactionWrong || 'Think back carefully and try once more...')}
                      </p>

                      <div className="pt-2 flex items-center justify-end gap-3">
                        {answerState === 'wrong' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<RotateCcw className="w-3.5 h-3.5" />}
                            onClick={handleRetryQuestion}
                          >
                            Try Again
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<ArrowRight className="w-3.5 h-3.5" />}
                            onClick={handleNextQuestion}
                          >
                            {currentIndex < questions.length - 1 ? 'Next Question' : 'Unlock Our Journey'}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Locked Gate Notice */}
                <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono text-rose-700/80 border-t border-pink-100">
                  <Lock className="w-3.5 h-3.5 text-pink-500" />
                  <span>Answer correctly to unlock our memory timeline & scrapbook</span>
                </div>
              </motion.div>
            ) : (
              /* Quiz Completion Celebration Card */
              <motion.div
                key="completion-card"
                variants={scrapbookCard}
                initial="hidden"
                animate="visible"
                className="text-center p-8 sm:p-12 rounded-3xl bg-white border border-pink-200 shadow-[0_15px_45px_rgba(244,114,182,0.2)] space-y-6 max-w-lg mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center mx-auto text-pink-600 shadow-[0_0_30px_rgba(244,114,182,0.25)]">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-800 text-xs font-mono font-bold">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Story Journey Unlocked</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#3b0d1e]">
                    You Know Us by Heart
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed max-w-sm mx-auto font-sans-body">
                    Every shared smile and tiny detail is etched in our story. The rest of our journey is now unlocked below!
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    icon={<Sparkles className="w-4 h-4 text-white" />}
                    onClick={() => {
                      const nextSection = document.getElementById('memory-timeline');
                      nextSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Step Into Our Timeline
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-800 hover:text-rose-950 hover:bg-pink-100"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={handleRestartQuiz}
                  >
                    Play Again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
};
