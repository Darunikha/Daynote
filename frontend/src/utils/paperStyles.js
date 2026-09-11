/**
 * Journal paper styles: a small set of tileable, CSS-only background
 * generators (gingham, check, grid, dots, ruled, stripes, floral, scatter,
 * mottled texture) parameterised by soft, muted colours so every one of the
 * 40 named styles below stays subtle, paper-like, and easy to read text on —
 * rather than 40 bespoke background images to maintain.
 *
 * Keep the `value` list in sync with backend/models/Journal.js PAPER_STYLES.
 */

const patterns = {
  plain: (base) => ({
    backgroundColor: base,
  }),

  gingham: (base, line) => ({
    backgroundColor: base,
    backgroundImage: `repeating-linear-gradient(0deg, ${line} 0, ${line} 6px, transparent 6px, transparent 16px),
      repeating-linear-gradient(90deg, ${line} 0, ${line} 6px, transparent 6px, transparent 16px)`,
    backgroundBlendMode: 'multiply',
  }),

  check: (base, alt) => ({
    backgroundColor: base,
    backgroundImage: `linear-gradient(45deg, ${alt} 25%, transparent 25%),
      linear-gradient(-45deg, ${alt} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${alt} 75%),
      linear-gradient(-45deg, transparent 75%, ${alt} 75%)`,
    backgroundSize: '30px 30px',
    backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
  }),

  grid: (base, line, size = 22) => ({
    backgroundColor: base,
    backgroundImage: `linear-gradient(${line} 1px, transparent 1px),
      linear-gradient(90deg, ${line} 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
  }),

  dotGrid: (base, dot, size = 18) => ({
    backgroundColor: base,
    backgroundImage: `radial-gradient(${dot} 1px, transparent 1.6px)`,
    backgroundSize: `${size}px ${size}px`,
  }),

  ruled: (base, line, spacing = 28) => ({
    backgroundColor: base,
    backgroundImage: `linear-gradient(${line} 1px, transparent 1px)`,
    backgroundSize: `100% ${spacing}px`,
  }),

  stripe: (base, stripe, width = 30) => ({
    backgroundColor: base,
    backgroundImage: `repeating-linear-gradient(180deg, ${stripe} 0, ${stripe} ${width / 2}px, transparent ${
      width / 2
    }px, transparent ${width}px)`,
  }),

  floral: (base, bloom, leaf) => ({
    backgroundColor: base,
    backgroundImage: `radial-gradient(circle at 22% 24%, ${bloom} 0 2.5px, transparent 3.5px),
      radial-gradient(circle at 28% 30%, ${bloom} 0 2.5px, transparent 3.5px),
      radial-gradient(circle at 16% 30%, ${bloom} 0 2.5px, transparent 3.5px),
      radial-gradient(circle at 22% 36%, ${bloom} 0 2.5px, transparent 3.5px),
      radial-gradient(circle at 22% 30%, ${leaf} 0 2px, transparent 3px),
      radial-gradient(circle at 68% 68%, ${bloom} 0 2px, transparent 3px),
      radial-gradient(circle at 74% 62%, ${leaf} 0 1.6px, transparent 2.6px)`,
    backgroundSize: '84px 84px',
  }),

  scatter: (base, mark, size = 48) => ({
    backgroundColor: base,
    backgroundImage: `radial-gradient(circle at 18% 22%, ${mark} 0 2px, transparent 3px),
      radial-gradient(circle at 62% 58%, ${mark} 0 2px, transparent 3px),
      radial-gradient(circle at 40% 82%, ${mark} 0 1.6px, transparent 2.6px)`,
    backgroundSize: `${size}px ${size}px`,
  }),

  texture: (base, fiber, blotch) => ({
    backgroundColor: base,
    backgroundImage: `radial-gradient(ellipse 60% 40% at 18% 25%, ${blotch}, transparent 60%),
      radial-gradient(ellipse 55% 45% at 82% 70%, ${blotch}, transparent 60%),
      radial-gradient(ellipse 50% 35% at 50% 95%, ${blotch}, transparent 60%),
      repeating-linear-gradient(115deg, ${fiber} 0, ${fiber} 1px, transparent 1px, transparent 4px)`,
  }),
};

/**
 * name -> [patternKey, ...colorArgs] passed to the generator above.
 * Colours are soft/muted so they sit quietly behind journal text.
 */
const DEFS = {
  'pink-gingham': ['gingham', '#FBF1F0', 'rgba(198,120,130,0.09)'],
  'lavender-gingham': ['gingham', '#F5F1F8', 'rgba(150,130,180,0.09)'],
  'soft-pink-check': ['check', '#FCF3F1', 'rgba(210,150,155,0.08)'],
  'blue-gingham': ['gingham', '#F1F5F8', 'rgba(120,150,180,0.08)'],
  'brown-check': ['check', '#F6EFE7', 'rgba(139,90,60,0.08)'],
  'sage-green-check': ['check', '#F1F4EE', 'rgba(120,140,100,0.08)'],
  'cream-beige-check': ['check', '#FBF7EF', 'rgba(190,165,130,0.09)'],

  'vintage-beige-paper': ['texture', '#F4EBDD', 'rgba(150,120,80,0.06)', 'rgba(180,150,110,0.10)'],
  'old-book-paper': ['texture', '#EFE3CB', 'rgba(130,100,60,0.08)', 'rgba(160,120,70,0.12)'],
  'vintage-handwritten-paper': ['ruled', '#F7EFDD', 'rgba(150,120,80,0.14)', 30],
  'kraft-paper': ['texture', '#E9D9BE', 'rgba(110,80,40,0.08)', 'rgba(140,100,55,0.10)'],
  'aged-notebook-paper': ['ruled', '#F1E7D2', 'rgba(140,110,70,0.16)', 28],
  'soft-parchment': ['texture', '#F6EEDF', 'rgba(160,140,100,0.05)', 'rgba(190,170,130,0.08)'],

  'cream-grid': ['grid', '#FBF8F0', 'rgba(180,160,120,0.14)', 22],
  'beige-grid': ['grid', '#F7F1E6', 'rgba(160,130,90,0.15)', 22],
  'fine-graph-paper': ['grid', '#F3F6F1', 'rgba(120,150,130,0.16)', 14],
  'dot-grid': ['dotGrid', '#F8F6F1', 'rgba(150,130,110,0.18)', 18],
  'ruled-notebook': ['ruled', '#FAF7F0', 'rgba(150,130,110,0.16)', 26],
  'handwritten-notebook': ['ruled', '#F7F2EA', 'rgba(160,110,120,0.12)', 32],

  'tiny-pink-floral': ['floral', '#FCF4F3', 'rgba(220,150,160,0.16)', 'rgba(150,170,130,0.13)'],
  'vintage-floral': ['floral', '#F3ECDD', 'rgba(190,130,110,0.15)', 'rgba(140,140,90,0.12)'],
  'dainty-flowers': ['floral', '#FBF3F6', 'rgba(210,160,190,0.15)', 'rgba(160,180,140,0.12)'],
  'botanical-leaves': ['scatter', '#F1F5EC', 'rgba(120,150,110,0.16)', 50],
  'pressed-flowers': ['floral', '#F6EEE6', 'rgba(190,140,130,0.14)', 'rgba(150,160,120,0.12)'],
  'wildflower-paper': ['floral', '#F7F2E3', 'rgba(200,150,90,0.14)', 'rgba(140,150,90,0.12)'],
  'soft-green-botanical': ['scatter', '#EFF4EC', 'rgba(110,140,100,0.16)', 46],

  'blush-stripes': ['stripe', '#FCF3F2', 'rgba(220,160,165,0.10)', 30],
  'cream-stripes': ['stripe', '#FBF7EE', 'rgba(200,175,140,0.10)', 30],
  'soft-lavender-stripes': ['stripe', '#F4F0F7', 'rgba(160,140,185,0.10)', 30],
  'tiny-dots': ['dotGrid', '#F8F6F2', 'rgba(150,140,130,0.16)', 20],
  'subtle-hearts': ['scatter', '#FCF2F3', 'rgba(215,140,150,0.16)', 44],
  'little-stars': ['scatter', '#F6F3F8', 'rgba(160,150,190,0.16)', 42],
  'soft-clouds': ['scatter', '#F1F4F8', 'rgba(150,170,190,0.14)', 60],
  'scattered-doodles': ['scatter', '#F8F5EE', 'rgba(170,150,120,0.16)', 38],

  linen: ['texture', '#F3EFE7', 'rgba(140,125,105,0.07)', 'rgba(160,145,120,0.06)'],
  'warm-cream': ['plain', '#FBF6EC'],
  'soft-beige': ['plain', '#F5EEE2'],
  'cocoa-paper': ['texture', '#E8DCCB', 'rgba(90,60,40,0.08)', 'rgba(110,75,50,0.10)'],
  'muted-brown': ['plain', '#E9DECE'],
  'minimal-paper': ['plain', '#F8F6F2'],
};

/** Category grouping + display labels, in the order they should appear in the picker. */
export const PAPER_CATEGORIES = [
  {
    id: 'gingham',
    label: 'Gingham & Checks',
    styles: [
      'pink-gingham',
      'lavender-gingham',
      'soft-pink-check',
      'blue-gingham',
      'brown-check',
      'sage-green-check',
      'cream-beige-check',
    ],
  },
  {
    id: 'vintage',
    label: 'Vintage & Paper',
    styles: [
      'vintage-beige-paper',
      'old-book-paper',
      'vintage-handwritten-paper',
      'kraft-paper',
      'aged-notebook-paper',
      'soft-parchment',
    ],
  },
  {
    id: 'stationery',
    label: 'Stationery',
    styles: ['cream-grid', 'beige-grid', 'fine-graph-paper', 'dot-grid', 'ruled-notebook', 'handwritten-notebook'],
  },
  {
    id: 'floral',
    label: 'Floral & Nature',
    styles: [
      'tiny-pink-floral',
      'vintage-floral',
      'dainty-flowers',
      'botanical-leaves',
      'pressed-flowers',
      'wildflower-paper',
      'soft-green-botanical',
    ],
  },
  {
    id: 'soft-patterns',
    label: 'Soft Patterns',
    styles: [
      'blush-stripes',
      'cream-stripes',
      'soft-lavender-stripes',
      'tiny-dots',
      'subtle-hearts',
      'little-stars',
      'soft-clouds',
      'scattered-doodles',
    ],
  },
  {
    id: 'neutral',
    label: 'Neutral & Cozy',
    styles: ['linen', 'warm-cream', 'soft-beige', 'cocoa-paper', 'muted-brown', 'minimal-paper'],
  },
];

const toLabel = (id) =>
  id
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

/** Full flat list of styles, `plain` (None / Plain Paper) first. */
export const PAPER_STYLES = [
  { value: 'plain', label: 'None / Plain Paper', category: null },
  ...PAPER_CATEGORIES.flatMap((cat) =>
    cat.styles.map((id) => ({ value: id, label: toLabel(id), category: cat.id }))
  ),
];

export const PAPER_STYLE_VALUES = PAPER_STYLES.map((s) => s.value);

const STYLE_MAP = Object.fromEntries(PAPER_STYLES.map((s) => [s.value, s]));

export const getPaperStyleMeta = (value) => STYLE_MAP[value] || STYLE_MAP.plain;

/** Returns a React style object (backgroundColor/backgroundImage/…) for a paper style id. */
export const getPaperBackground = (value) => {
  const def = DEFS[value];
  if (!def) return patterns.plain('rgb(var(--surface))');
  const [pattern, ...args] = def;
  return patterns[pattern](...args);
};
