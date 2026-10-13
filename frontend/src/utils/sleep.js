import { CloudMoon, Moon, MoonStar, Stars } from 'lucide-react';

/**
 * The four sleep-quality levels. Colours and icons follow the same muted,
 * soft-glow language as moods/paper styles — a quiet night scale, not a
 * harsh 1-5 rating widget.
 */
export const SLEEP_QUALITY = [
  { value: 'poor', label: 'Poor', Icon: CloudMoon, color: '#9FB0C4', soft: '#ECF0F4' },
  { value: 'fair', label: 'Fair', Icon: Moon, color: '#B3A2C0', soft: '#F1EDF4' },
  { value: 'good', label: 'Good', Icon: MoonStar, color: '#8A9A7B', soft: '#E9EEE4' },
  { value: 'great', label: 'Great', Icon: Stars, color: '#EFC98C', soft: '#FAF0DF' },
];

const QUALITY_MAP = Object.fromEntries(SLEEP_QUALITY.map((q) => [q.value, q]));

export const getSleepQuality = (value) => QUALITY_MAP[value] || QUALITY_MAP.fair;

/** "7h 30m" from a minute count. */
export const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/** "11:30 PM" from a stored "HH:MM" 24-hour string. */
export const formatTime12h = (hhmm) => {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
};
