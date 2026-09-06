/** Date, text and greeting helpers shared across the app. */

export const formatDate = (value, opts = {}) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  });

export const formatLongDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/** "Today", "Yesterday", or a normal date. */
export const relativeDay = (value) => {
  const d = new Date(value);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);

  const same = (a, b) => a.toDateString() === b.toDateString();
  if (same(d, today)) return 'Today';
  if (same(d, yest)) return 'Yesterday';
  return formatDate(d);
};

export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const firstName = (name = '') => name.trim().split(' ')[0] || 'friend';

/** Turns stored newline text into paragraphs for reading views. */
export const toParagraphs = (text = '') =>
  text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

export const excerpt = (text = '', length = 140) => {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > length ? `${flat.slice(0, length).trimEnd()}…` : flat;
};

export const readingTime = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/** Local YYYY-MM-DD (avoids the timezone shift toISOString() introduces). */
export const toDateInput = (value = new Date()) => {
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
export const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Weeks (Mon-Sun) covering the given month, padded with nulls. */
export const monthGrid = (year, month) => {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7; // Monday-first

  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
};

export const isSameDay = (a, b) =>
  a && b && new Date(a).toDateString() === new Date(b).toDateString();
