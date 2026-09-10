import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronLeft, ChevronRight, BookOpen, Clock, Calendar } from 'lucide-react';
import MoodBadge from './MoodBadge';
import { formatLongDate, excerpt } from '../utils/format';

export default function MemoryLaneCard({ memories = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!memories || memories.length === 0) return null;

  const current = memories[currentIndex] || memories[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-stone-50/90 dark:from-amber-950/40 dark:via-stone-900/70 dark:to-stone-950/80 p-5 sm:p-6 shadow-paper">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-300/20 dark:bg-amber-600/10 blur-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </span>
          <div>
            <h2 className="font-serif text-lg font-medium text-amber-950 dark:text-amber-100 flex items-center gap-2">
              On This Day <span className="text-xs font-normal opacity-70">Memory Lane</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
            {current.timeAgo || 'Past Memory'}
          </span>

          {memories.length > 1 && (
            <div className="flex items-center gap-1 pl-1">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1 rounded-lg hover:bg-amber-200/50 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 transition-colors"
                title="Previous memory"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[11px] font-medium text-amber-800 dark:text-amber-300 tabular-nums">
                {currentIndex + 1}/{memories.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="p-1 rounded-lg hover:bg-amber-200/50 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 transition-colors"
                title="Next memory"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Entry Body */}
      <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-900/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          <time className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <Calendar size={12} className="text-amber-600 dark:text-amber-400" />
            {formatLongDate(current.date)}
          </time>
          <MoodBadge mood={current.mood} size="sm" />
        </div>

        <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100 mb-2 line-clamp-1">
          {current.title || 'Untitled entry'}
        </h3>

        <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed line-clamp-3 mb-4 font-sans">
          "{excerpt(current.content, 180)}"
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {current.tags?.slice(0, 2).map((t) => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                #{t}
              </span>
            ))}
          </div>

          <Link
            to={`/journal/${current._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white transition-colors"
          >
            <BookOpen size={13} /> Read memory
          </Link>
        </div>
      </div>
    </div>
  );
}
