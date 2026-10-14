import { Droplet, CloudRain, CloudLightning, TrendingUp, Minus, TrendingDown } from 'lucide-react';

/** The three cry intensities — a gentle scale, not a clinical one. */
export const CRY_INTENSITY = [
  { value: 'teary', label: 'Teary', Icon: Droplet, color: '#9FB0C4', soft: '#ECF0F4' },
  { value: 'full-cry', label: 'Full Cry', Icon: CloudRain, color: '#8A9AC0', soft: '#EAEDF6' },
  { value: 'sobbing', label: 'Sobbing', Icon: CloudLightning, color: '#6B7BA6', soft: '#E4E8F2' },
];

const INTENSITY_MAP = Object.fromEntries(CRY_INTENSITY.map((i) => [i.value, i]));
export const getCryIntensity = (value) => INTENSITY_MAP[value] || INTENSITY_MAP.teary;

/** Quick-pick triggers — short enough to tap, "other" always available. */
export const CRY_TRIGGERS = [
  { value: 'overwhelmed', label: 'Overwhelmed' },
  { value: 'sad', label: 'Sad' },
  { value: 'frustrated', label: 'Frustrated' },
  { value: 'lonely', label: 'Lonely' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'grief', label: 'Grief' },
  { value: 'relief', label: 'Relief' },
  { value: 'happy-tears', label: 'Happy tears' },
  { value: 'other', label: 'Other' },
];

const TRIGGER_MAP = Object.fromEntries(CRY_TRIGGERS.map((t) => [t.value, t]));
export const getCryTrigger = (value) => TRIGGER_MAP[value] || TRIGGER_MAP.other;

/** How it felt afterward — crying isn't always bad, so this isn't a good/bad scale. */
export const CRY_FELT = [
  { value: 'better', label: 'Better after', Icon: TrendingUp, color: '#8A9A7B' },
  { value: 'same', label: 'About the same', Icon: Minus, color: '#BCAFA6' },
  { value: 'worse', label: 'Worse after', Icon: TrendingDown, color: '#C08277' },
];

const FELT_MAP = Object.fromEntries(CRY_FELT.map((f) => [f.value, f]));
export const getCryFelt = (value) => FELT_MAP[value] || FELT_MAP.same;
