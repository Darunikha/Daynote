import { MOODS } from '../utils/moods';

// A little hand-placed imperfection per tile, not a perfectly even grid.
const TILT = [-3, 2, -1.5, 3, -2.5, 1.5, -2, 2.5, -1];

/**
 * A cute journal check-in — small illustrated mood "stickers" laid out with
 * a gentle scatter of rotation, rather than a rigid row of emoji buttons.
 * Picking one straightens it and lifts it slightly, like pressing a sticker
 * flat onto the page.
 */
export default function MoodSelector({ value, onChange, className = '' }) {
  return (
    <div
      role="radiogroup"
      aria-label="How are you feeling?"
      className={`flex flex-wrap gap-2 sm:gap-3 ${className}`}
    >
      {MOODS.map((mood, i) => {
        const active = value === mood.value;
        const tilt = TILT[i % TILT.length];

        return (
          <button
            key={mood.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(active ? '' : mood.value)}
            className="relative group flex w-[72px] flex-col items-center gap-1.5 rounded-2xl px-2 py-2.5 transition-all duration-200 sm:w-[80px]"
            style={{
              backgroundColor: active ? 'rgb(var(--surface))' : 'transparent',
              boxShadow: active ? `0 8px 16px -10px rgba(107,75,90,0.35), inset 0 0 0 1px ${mood.color}88` : 'none',
              transform: `rotate(${active ? 0 : tilt}deg) translateY(${active ? -2 : 0}px)`,
            }}
          >
            {/* Washi tape across the top of the selected sticker — the
                "pressed into the journal" cue, kept pale so it stays calm. */}
            {active && (
              <span
                aria-hidden="true"
                className="absolute -top-2 left-1/2 h-3 w-10 -translate-x-1/2 -rotate-3 rounded-sm opacity-80"
                style={{ backgroundColor: mood.soft, boxShadow: `inset 0 0 0 1px ${mood.color}55` }}
              />
            )}
            <span
              className="flex h-12 w-12 items-center justify-center transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-14 sm:w-14"
              aria-hidden="true"
            >
              <mood.Icon className="h-full w-full" />
            </span>
            <span
              className="text-[11px] font-medium leading-none"
              style={{ color: active ? 'rgb(var(--heading))' : 'rgb(var(--text-muted))' }}
            >
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
