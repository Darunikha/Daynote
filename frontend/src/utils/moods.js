/**
 * The nine Daynote moods. Colours are muted so a page full of entries still
 * reads as calm cream rather than a chart of bright dots.
 */
export const MOODS = [
  { value: 'happy',   label: 'Happy',   emoji: '🙂', color: '#EFC98C', soft: '#FAF0DF' },
  { value: 'calm',    label: 'Calm',    emoji: '😌', color: '#8A9A7B', soft: '#E9EEE4' },
  { value: 'loved',   label: 'Loved',   emoji: '🥰', color: '#E8B4B8', soft: '#FAEEEF' },
  { value: 'excited', label: 'Excited', emoji: '🤩', color: '#E7A79C', soft: '#FBEDEA' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: '#BCAFA6', soft: '#F2EEEA' },
  { value: 'sad',     label: 'Sad',     emoji: '🙁', color: '#9FB0C4', soft: '#ECF0F4' },
  { value: 'angry',   label: 'Angry',   emoji: '😤', color: '#C08277', soft: '#F6E9E6' },
  { value: 'anxious', label: 'Anxious', emoji: '😟', color: '#B3A2C0', soft: '#F1EDF4' },
  { value: 'tired',   label: 'Tired',   emoji: '🥱', color: '#A99BB0', soft: '#EFECF1' },
];

export const MOOD_MAP = Object.fromEntries(MOODS.map((m) => [m.value, m]));

export const getMood = (value) => MOOD_MAP[value] || MOOD_MAP.neutral;

/** A short, gentle line about the month's dominant mood. */
export const moodInsight = (mood) => {
  const lines = {
    happy: "You've been carrying a lot of light lately.",
    calm: 'Your days have felt steady and quiet.',
    loved: "There's been a lot of warmth around you.",
    excited: 'Something has clearly been keeping you buzzing.',
    neutral: 'Plenty of ordinary days — those matter too.',
    sad: "It's been a heavier stretch. Be gentle with yourself.",
    angry: 'Some days asked a lot of you. That is allowed.',
    anxious: 'Your mind has been busy. Rest is not a reward, it is a need.',
    tired: "You've been running low. Take the slow days.",
  };
  return lines[mood] || "You've had a mix of feelings, and that's okay.";
};
