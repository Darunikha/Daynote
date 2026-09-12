import { useState } from 'react';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import { PROMPT_CATEGORIES, getRandomPrompt } from '../utils/prompts';

/**
 * A gentle, optional writing prompt shown above the entry textarea when
 * starting a new entry. Purely a suggestion to look at while writing — it
 * never reads from or writes to the entry's content, and nothing here is
 * saved with the entry.
 */
export default function JournalPrompt() {
  const [visible, setVisible] = useState(true);
  const [category, setCategory] = useState(null);
  const [prompt, setPrompt] = useState(() => getRandomPrompt(null));

  const refresh = (nextCategory = category) => {
    setCategory(nextCategory);
    setPrompt(getRandomPrompt(nextCategory, prompt.text));
  };

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        className="mb-4 inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[rgb(var(--heading))]"
        style={{ color: 'rgb(var(--text-muted))' }}
      >
        <Sparkles size={13} aria-hidden="true" />
        Need a prompt to get started?
      </button>
    );
  }

  return (
    <div
      className="mb-5 rounded-xl border border-dashed p-4"
      style={{ borderColor: 'rgb(var(--accent) / 0.5)', backgroundColor: 'rgb(var(--accent-soft))' }}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: 'rgb(var(--heading))' }}
        >
          <Sparkles size={13} aria-hidden="true" />
          Today&apos;s prompt
        </span>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss prompt and write freely"
          title="Write without a prompt"
          className="rounded-full p-1 transition-colors hover:bg-[rgb(var(--surface))]"
          style={{ color: 'rgb(var(--text-muted))' }}
        >
          <X size={14} />
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Prompt category">
        <button
          type="button"
          onClick={() => refresh(null)}
          className="chip"
          style={{
            backgroundColor: category === null ? 'rgb(var(--accent))' : 'transparent',
            color: category === null ? '#4A3038' : 'rgb(var(--text-muted))',
            borderColor: category === null ? 'transparent' : 'rgb(var(--border))',
          }}
        >
          Surprise me
        </button>
        {PROMPT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => refresh(c.id)}
            className="chip"
            style={{
              backgroundColor: category === c.id ? 'rgb(var(--accent))' : 'transparent',
              color: category === c.id ? '#4A3038' : 'rgb(var(--text-muted))',
              borderColor: category === c.id ? 'transparent' : 'rgb(var(--border))',
            }}
          >
            <span aria-hidden="true">{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      <p className="font-hand text-xl leading-snug" style={{ color: 'rgb(var(--heading))' }}>
        {prompt.text}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => refresh()}
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[rgb(var(--heading))]"
          style={{ color: 'rgb(var(--brandy))' }}
        >
          <RefreshCw size={12} aria-hidden="true" />
          Another prompt
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-xs underline decoration-dotted underline-offset-2 transition-colors hover:text-[rgb(var(--heading))]"
          style={{ color: 'rgb(var(--text-muted))' }}
        >
          Write without a prompt
        </button>
      </div>
    </div>
  );
}
