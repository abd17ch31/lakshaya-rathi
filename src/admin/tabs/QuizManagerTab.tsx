import React, { useState } from 'react';
import { SiteDataSchema, QuizQuestionItem } from '../../types';
import { Plus, Trash2, HelpCircle, Check, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface QuizManagerTabProps {
  content: SiteDataSchema;
  onChange: (updated: SiteDataSchema) => void;
}

export const QuizManagerTab: React.FC<QuizManagerTabProps> = ({ content, onChange }) => {
  const questions = content.quizQuestions || [];

  const handleUpdateQuestion = (index: number, updatedQuestion: QuizQuestionItem) => {
    const next = [...questions];
    next[index] = updatedQuestion;
    onChange({ ...content, quizQuestions: next });
  };

  const handleAddQuestion = () => {
    const newQ: QuizQuestionItem = {
      id: `quiz-${Date.now()}`,
      question: 'New Question: What was our most memorable evening?',
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' },
        { id: 'd', text: 'Option D' },
      ],
      correctOptionId: 'a',
      explanation: 'Explanation for why this is special.',
      reactionCorrect: 'You remembered!',
      reactionWrong: 'Almost, think back to our first trip.',
      sortOrder: questions.length + 1,
    };
    onChange({ ...content, quizQuestions: [...questions, newQ] });
  };

  const handleDeleteQuestion = (index: number) => {
    const next = questions.filter((_, i) => i !== index);
    onChange({ ...content, quizQuestions: next });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-serif text-white">Personalized Trivia Questions</h3>
          <p className="text-xs text-neutral-400">
            Create intimate questions that only he would know the answers to.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="p-6 rounded-2xl bg-neutral-900/70 border border-white/10 space-y-5 relative"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-mono text-amber-300">Question #{idx + 1}</span>
              <button
                onClick={() => handleDeleteQuestion(idx)}
                className="text-neutral-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                title="Delete question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400">Prompt Text</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) =>
                  handleUpdateQuestion(idx, { ...q, question: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white text-sm outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Options 4 Grid */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400">Selectable Choices (Choose correct answer)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = q.correctOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                        isCorrect
                          ? 'bg-amber-400/10 border-amber-400/50'
                          : 'bg-neutral-950 border-white/10'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuestion(idx, { ...q, correctOptionId: opt.id })
                        }
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono cursor-pointer shrink-0 ${
                          isCorrect
                            ? 'bg-amber-400 text-neutral-950 font-bold'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                        title="Set as correct answer"
                      >
                        {opt.id.toUpperCase()}
                      </button>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const nextOpts = [...q.options];
                          nextOpts[optIdx] = { ...opt, text: e.target.value };
                          handleUpdateQuestion(idx, { ...q, options: nextOpts });
                        }}
                        className="w-full bg-transparent text-xs text-white outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reactions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-emerald-400">Reaction when Correct</label>
                <input
                  type="text"
                  value={q.reactionCorrect || ''}
                  onChange={(e) =>
                    handleUpdateQuestion(idx, { ...q, reactionCorrect: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-emerald-500/20 text-white text-xs outline-none focus:border-emerald-400/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-amber-400">Reaction when Wrong</label>
                <input
                  type="text"
                  value={q.reactionWrong || ''}
                  onChange={(e) =>
                    handleUpdateQuestion(idx, { ...q, reactionWrong: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-amber-500/20 text-white text-xs outline-none focus:border-amber-400/50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
