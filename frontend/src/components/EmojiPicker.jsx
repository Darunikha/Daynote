import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

/* ─── Emoji data ─────────────────────────────────────────────────────────── */

const CATEGORIES = [
  {
    id: 'recent',
    label: 'Recent',
    icon: '🕐',
    emojis: [], // populated dynamically from localStorage
  },
  {
    id: 'smileys',
    label: 'Smileys',
    icon: '😊',
    emojis: [
      '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩',
      '😘','😗','😚','😙','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🫢','🫣','🤫','🤔',
      '🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤',
      '😴','😷','🤒','🤕','🤢','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓',
      '🧐','😕','🫤','😟','🙁','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥',
      '😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿',
      '💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖',
    ],
  },
  {
    id: 'people',
    label: 'People',
    icon: '👋',
    emojis: [
      '👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌','🤌','🤏','✌️','🤞','🫰','🤟',
      '🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏',
      '🙌','🫶','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦿','🦶','👂','🦻',
      '👃','🫀','🫁','🧠','🦷','🦴','👀','👁️','👅','👄','🫦','🤰','🫃','🫄','🧑','👦',
      '👧','🧔','👱','👩','🧓','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦',
      '🤷','👮','🕵️','💂','🥷','👷','🤴','👸','👳','👲','🧕','🤵','👰','🤶','🎅','🦸',
      '🦹','🧙','🧝','🧛','🧟','🧌','🧞','🧜','🧚','💏','💑','👪',
    ],
  },
  {
    id: 'nature',
    label: 'Nature',
    icon: '🌿',
    emojis: [
      '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔',
      '🐧','🐦','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞',
      '🐜','🪲','🦟','🦗','🕷️','🦂','🐢','🦎','🐍','🐲','🦕','🦖','🦈','🐬','🐳','🐋',
      '🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃',
      '🌸','🌺','🌻','🌹','🌷','🌼','💐','🌱','🌿','🍀','🌾','🍁','🍂','🍃','🌴','🌵',
      '🌲','🌳','🌊','🌬','🌀','🌈','⛅','🌤','☀️','🌙','⭐','🌟','✨','⚡','🔥','💧',
    ],
  },
  {
    id: 'food',
    label: 'Food',
    icon: '🍕',
    emojis: [
      '🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝',
      '🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🧄','🧅','🥔','🍠','🥜','🌰','🍞',
      '🥐','🥖','🫓','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥚','🍳','🧈','🥓','🍔',
      '🍟','🌭','🍕','🌮','🌯','🫔','🥙','🧆','🍣','🍤','🍙','🍚','🍜','🍝','🍛',
      '🍲','🫕','🍥','🥮','🍡','🍢','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬',
      '🍫','🍿','🍩','🍪','☕','🍵','🧃','🥤','🧋','🍺','🍻','🥂','🍷','🥃','🍸','🍹',
    ],
  },
  {
    id: 'activities',
    label: 'Activities',
    icon: '⚽',
    emojis: [
      '⚽','🏀','🏈','⚾','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🥍','🏏','🪃',
      '🥅','⛳','🪁','🎣','🤿','🎽','🎿','🛷','🥌','🎯','🎮','🕹️','🎲','🧩',
      '♟️','🎭','🎨','🖼️','🎪','🎤','🎧','🎼','🎹','🥁','🪘','🎷','🎺','🎸','🪕','🎻',
      '🎬','🏆','🥇','🥈','🥉','🏅','🎖️','🏵️','🎗️','🎫','🎟️','🎠','🎡','🎢',
      '🏋️','🤸','⛹️','🤺','🤼','🤾','🏌️','🏇','🧘','🏄','🚵','🚴','🤽','🧗','🚣','🛶',
    ],
  },
  {
    id: 'travel',
    label: 'Travel',
    icon: '✈️',
    emojis: [
      '🚗','🚕','🚙','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🛵','🏍️','🚲','🛴',
      '🛹','🛼','🚨','🚔','🚍','🚘','🚖','🚡','🚠','🚟','🚃','🚋','🚝','🚄','🚅','🚈',
      '🚂','🚆','🚇','🚊','🚞','🚉','✈️','🛩️','🛫','🛬','🪂','💺','🚁','🛸','🛥️',
      '⛵','🚤','🛳️','🚢','⚓','🗺️','🗿','🗽','🗼','🏰','🏯','⛪','🕌','⛩️','🕍','🏛️',
      '⛲','⛺','🌁','🏔️','⛰️','🗻','🏕️','🏖️','🏜️','🏝️','🏞️','🏟️','🏗️','🏘️','🏚️','🏠',
      '🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🌃','🏙️','🌄','🌅','🌆',
    ],
  },
  {
    id: 'objects',
    label: 'Objects',
    icon: '💡',
    emojis: [
      '⌚','📱','📲','💻','⌨️','🖥️','🖨️','🖱️','🖲️','💾','💿','📀','📷','📸','📹','🎥',
      '📽️','🎞️','📞','☎️','📟','📠','📺','📻','🧭','⏰','⏱️','⏲️','🕰️','⌛','⏳','📡',
      '🔋','🪫','🔌','💡','🔦','🕯️','🪔','🧯','💰','💳','🪙','💎','⚖️','🪜','🧲',
      '🔧','🪛','🔩','⚙️','🗜️','🔗','⛓️','🪝','🧰','🪤','🗡️','⚔️','🛡️','🪚','🔨',
      '📦','📪','📫','📬','📭','📮','📯','📜','📃','📑','🗒️','🗓️','📆','📅','📁','📂',
      '🗂️','📊','📈','📉','📋','📌','📍','📎','🖇️','📏','📐','✂️','🗃️','🗄️','🗑️',
      '🔏','🔐','🔒','🔓','🔑','🗝️','🔮','🧿','🧸','🪆','🖼️','🪞','🪟',
      '📚','📖','📝','✏️','🖊️','🖋️','🖌️','🔖','🏷️',
    ],
  },
  {
    id: 'symbols',
    label: 'Symbols',
    icon: '❤️',
    emojis: [
      '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','💕','💞','💓','💗',
      '💖','💘','💝','💟','☮️','✝️','☪️','🕉️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈',
      '♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','☢️','☣️',
      '🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲',
      '🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️',
      '✅','☑️','✔️','❎','🔰','♻️','🔱','⚜️','🔴','🟠','🟡','🟢','🔵','🟣',
      '⬛','⬜','◼️','◻️','◾','◽','▪️','▫️','🔶','🔷','🔸','🔹','🔺','🔻','💠','🔘',
      '🔳','🔲','🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️',
    ],
  },
];

const RECENT_KEY = 'daynote_recent_emojis';
const MAX_RECENT = 32;

function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function addToRecent(emoji) {
  const list = [emoji, ...getRecent().filter((e) => e !== emoji)].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

/* ─── Sub-component: one emoji button ───────────────────────────────────── */
function EmojiBtn({ emoji, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(emoji)}
      className="emoji-btn"
      title={emoji}
      aria-label={emoji}
    >
      {emoji}
    </button>
  );
}

/* ─── Main picker panel ──────────────────────────────────────────────────── */
function EmojiPanel({ onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('smileys');
  const [recentEmojis, setRecentEmojis] = useState(getRecent);
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (emoji) => {
      addToRecent(emoji);
      setRecentEmojis(getRecent());
      onSelect(emoji);
    },
    [onSelect],
  );

  // Build the category list with recent dynamically injected
  const categories = CATEGORIES.map((c) =>
    c.id === 'recent' ? { ...c, emojis: recentEmojis } : c,
  ).filter((c) => !(c.id === 'recent' && c.emojis.length === 0));

  // Search across all emojis (deduped)
  const allEmojis = CATEGORIES.flatMap((c) => c.emojis).filter(
    (e, i, arr) => arr.indexOf(e) === i,
  );

  const searchResults = search.trim()
    ? allEmojis.filter((e) => e.includes(search.trim()))
    : null;

  const activeCatData = categories.find((c) => c.id === activeCat);

  return (
    <div className="emoji-panel" role="dialog" aria-label="Emoji picker" aria-modal="true">
      {/* Header */}
      <div className="emoji-panel__header">
        <span className="emoji-panel__title">Pick an emoji</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close emoji picker"
          className="emoji-panel__close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="emoji-panel__search-wrap">
        <Search size={13} className="emoji-panel__search-icon" aria-hidden="true" />
        <input
          ref={searchRef}
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emojis…"
          className="emoji-panel__search"
          aria-label="Search emojis"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="emoji-panel__search-clear"
            aria-label="Clear search"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="emoji-panel__tabs" role="tablist" aria-label="Emoji categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCat === cat.id}
              aria-controls={`emoji-cat-${cat.id}`}
              onClick={() => setActiveCat(cat.id)}
              className={`emoji-panel__tab${activeCat === cat.id ? ' emoji-panel__tab--active' : ''}`}
              title={cat.label}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div
        className="emoji-panel__grid-wrap"
        id={activeCatData ? `emoji-cat-${activeCatData.id}` : undefined}
        role="region"
        aria-label={search ? 'Search results' : activeCatData?.label}
      >
        {search ? (
          searchResults && searchResults.length > 0 ? (
            <div className="emoji-panel__grid">
              {searchResults.map((e) => (
                <EmojiBtn key={e} emoji={e} onSelect={handleSelect} />
              ))}
            </div>
          ) : (
            <p className="emoji-panel__empty">No results — try a different term</p>
          )
        ) : activeCatData ? (
          <div className="emoji-panel__grid">
            {activeCatData.emojis.map((e) => (
              <EmojiBtn key={e} emoji={e} onSelect={handleSelect} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ─── Trigger + popover wrapper ──────────────────────────────────────────── */
export default function EmojiPicker({ onEmojiSelect }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click / Escape key
  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick, { passive: true });
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleSelect = (emoji) => {
    onEmojiSelect(emoji);
    // Intentionally keep picker open for chaining multiple emojis
  };

  return (
    <div ref={containerRef} className="emoji-picker-root">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open emoji picker"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`emoji-trigger${open ? ' emoji-trigger--active' : ''}`}
        title="Insert emoji"
      >
        😊
      </button>

      {open && (
        <EmojiPanel
          onSelect={handleSelect}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
