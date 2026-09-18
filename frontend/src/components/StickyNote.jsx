import { useEffect, useRef } from 'react';
import { Move, RotateCw, X, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { TinyFlowerCharm, WashiTapeCharm, TinyBowCharm, StarCharm } from './Charms';
import {
  STICKY_NOTE_FONTS,
  STICKY_NOTE_SIZES,
  getNoteBackgroundStyle,
  getNoteShapeStyle,
  getNoteInkColor,
  noteOverflowsBox,
} from '../utils/stickyNotes';

const WIDTH = 172;
const HEIGHT = 152;

/** The bit of illustrated stationery that makes each design read as physical, not a plain card. */
function DesignAccent({ design }) {
  if (design === 'scallop-floral') {
    return (
      <>
        <TinyFlowerCharm className="pointer-events-none absolute left-2 top-1 h-8 w-8 -rotate-6" />
        <TinyFlowerCharm className="pointer-events-none absolute left-9 top-7 h-4 w-4 rotate-12 opacity-90" />
        <TinyFlowerCharm className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 rotate-6" />
      </>
    );
  }
  if (design === 'taped-note') {
    return (
      <>
        <span className="pointer-events-none absolute -top-3.5 left-1/2 -translate-x-1/2 -rotate-3">
          <WashiTapeCharm className="h-6 w-20" />
        </span>
        <TinyFlowerCharm className="pointer-events-none absolute bottom-2 right-2 h-6 w-6 rotate-6 opacity-90" />
      </>
    );
  }
  if (design === 'bear') {
    return (
      <>
        {/* Ears: an outer circle with a smaller, centered inner-ear circle nested inside it. */}
        <span className="pointer-events-none absolute -top-5 left-5 flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: '#C9A074' }}>
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: '#F0D8B8' }} />
        </span>
        <span className="pointer-events-none absolute -top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: '#C9A074' }}>
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: '#F0D8B8' }} />
        </span>
        {/* Face: two eyes, a muzzle, and a nose. */}
        <span className="pointer-events-none absolute left-[32%] top-[42%] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#4A3830' }} />
        <span className="pointer-events-none absolute right-[32%] top-[42%] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#4A3830' }} />
        <span
          className="pointer-events-none absolute left-1/2 top-[56%] h-8 w-10 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: '#F0D8B8' }}
        />
        <span
          className="pointer-events-none absolute left-1/2 top-[58%] h-2 w-2.5 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: '#7A5B45' }}
        />
      </>
    );
  }
  if (design === 'lined-floral') {
    return <TinyFlowerCharm className="pointer-events-none absolute -right-2 -top-2 h-7 w-7 rotate-12" />;
  }
  if (design === 'penguin') {
    return (
      <>
        <span
          className="pointer-events-none absolute left-1/2 top-[46%] h-16 w-11 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: '#EDEAE2' }}
        />
        <span className="pointer-events-none absolute left-3.5 top-[40%] h-14 w-6 rounded-full" style={{ backgroundColor: '#3A3A40' }} />
        <span className="pointer-events-none absolute right-3.5 top-[40%] h-14 w-6 rounded-full" style={{ backgroundColor: '#3A3A40' }} />
        <span className="pointer-events-none absolute left-[41%] top-[26%] h-2 w-2 rounded-full bg-white" />
        <span className="pointer-events-none absolute right-[41%] top-[26%] h-2 w-2 rounded-full bg-white" />
        <span
          className="pointer-events-none absolute left-1/2 top-[32%] h-0 w-0 -translate-x-1/2"
          style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid #E8A34D' }}
        />
      </>
    );
  }
  if (design === 'heart-floral') {
    return <TinyFlowerCharm className="pointer-events-none absolute -top-2 left-1/2 h-9 w-9 -translate-x-1/2 rotate-3" />;
  }
  if (design === 'heart-bouquet') {
    return (
      <>
        <TinyFlowerCharm className="pointer-events-none absolute top-1 left-4 h-7 w-7 -rotate-12" />
        <TinyFlowerCharm className="pointer-events-none absolute -top-2 left-1/2 h-8 w-8 -translate-x-1/2" />
        <TinyFlowerCharm className="pointer-events-none absolute top-1 right-4 h-7 w-7 rotate-12 opacity-90" />
      </>
    );
  }
  if (design === 'dotted-lavender') {
    return <TinyFlowerCharm className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 rotate-6 opacity-90" />;
  }
  if (design === 'grid-floral') {
    return <TinyFlowerCharm className="pointer-events-none absolute -right-3 -top-3 h-8 w-8 -rotate-6" />;
  }
  if (design === 'night-dot') {
    return <StarCharm className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 rotate-6" />;
  }
  if (design === 'cloud') {
    return (
      <>
        <span className="pointer-events-none absolute left-[38%] top-[38%] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#5C6B7A' }} />
        <span className="pointer-events-none absolute left-[54%] top-[38%] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#5C6B7A' }} />
        <span className="pointer-events-none absolute left-[46%] top-[45%] h-1 w-1.5 rounded-full" style={{ backgroundColor: '#D89AA5' }} />
      </>
    );
  }
  if (design === 'gingham-bow') {
    return <TinyBowCharm className="pointer-events-none absolute -top-3 left-1/2 h-8 w-11 -translate-x-1/2 -rotate-3" />;
  }
  if (design === 'lined-star') {
    return <StarCharm className="pointer-events-none absolute -right-2.5 -top-2.5 h-7 w-7 rotate-12" />;
  }
  if (design === 'scallop-tulip') {
    return (
      <>
        <TinyFlowerCharm className="pointer-events-none absolute left-4 top-2 h-7 w-7 -rotate-6" />
        <TinyFlowerCharm className="pointer-events-none absolute left-1/2 top-0 h-8 w-8 -translate-x-1/2" />
        <TinyFlowerCharm className="pointer-events-none absolute right-4 top-2 h-7 w-7 rotate-6 opacity-90" />
      </>
    );
  }
  return null;
}

export default function StickyNote({ note, editable, active, containerRef, registerRef, onActivate, onChange, onDelete }) {
  const wrapperRef = useRef(null);
  const textareaRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    registerRef?.(wrapperRef.current);
    return () => registerRef?.(null);
  }, [registerRef]);

  useEffect(() => {
    if (active && editable) {
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [active, editable]);

  const startDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, startNx: note.x, startNy: note.y, rect };

    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const dxPct = ((ev.clientX - d.startX) / d.rect.width) * 100;
      const dyPct = ((ev.clientY - d.startY) / d.rect.height) * 100;
      onChange({
        x: Math.min(94, Math.max(6, d.startNx + dxPct)),
        y: Math.min(94, Math.max(6, d.startNy + dyPct)),
      });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  useEffect(() => () => (dragRef.current = null), []);

  const rotateNote = () => {
    const next = note.rotation + 15;
    onChange({ rotation: next > 45 ? next - 90 : next });
  };

  const fontMeta = STICKY_NOTE_FONTS.find((f) => f.value === note.font) || STICKY_NOTE_FONTS[0];
  const sizeMeta = STICKY_NOTE_SIZES.find((s) => s.value === note.fontSize) || STICKY_NOTE_SIZES[1];
  const alignClass = note.align === 'center' ? 'text-center' : note.align === 'right' ? 'text-right' : 'text-left';

  return (
    <div
      ref={wrapperRef}
      className="absolute"
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
        width: WIDTH,
        height: HEIGHT,
        transform: `translate(-50%, -50%) rotate(${note.rotation}deg)`,
        zIndex: active ? 30 : 10,
        pointerEvents: 'auto',
      }}
    >
      <div
        className={`relative h-full w-full shadow-paper-lg ${noteOverflowsBox(note.design) ? 'overflow-visible' : 'overflow-hidden'}`}
        style={{ ...getNoteBackgroundStyle(note.design), ...getNoteShapeStyle(note.design) }}
        onPointerDown={() => editable && onActivate?.()}
      >
        <DesignAccent design={note.design} />

        {editable ? (
          <textarea
            ref={textareaRef}
            value={note.text}
            onChange={(e) => onChange({ text: e.target.value })}
            onFocus={() => onActivate?.()}
            placeholder="Write a little note…"
            className={`h-full w-full resize-none bg-transparent p-3.5 pt-5 outline-none placeholder:opacity-50 ${fontMeta.className} ${alignClass}`}
            style={{ fontSize: sizeMeta.px, color: getNoteInkColor(note.design), lineHeight: 1.35 }}
          />
        ) : (
          <p
            className={`h-full w-full overflow-hidden whitespace-pre-wrap p-3.5 pt-5 ${fontMeta.className} ${alignClass}`}
            style={{ fontSize: sizeMeta.px, color: getNoteInkColor(note.design), lineHeight: 1.35 }}
          >
            {note.text}
          </p>
        )}
      </div>

      {active && editable && (
        <>
          <div
            className="absolute -top-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 whitespace-nowrap rounded-full border px-1.5 py-1 shadow-paper-lg"
            style={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))' }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {STICKY_NOTE_FONTS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => onChange({ font: f.value })}
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${f.className}`}
                style={{ backgroundColor: note.font === f.value ? 'rgb(var(--accent-soft))' : 'transparent' }}
                aria-label={`${f.label} font`}
                title={f.label}
              >
                Aa
              </button>
            ))}
            <span className="mx-0.5 h-4 w-px shrink-0" style={{ backgroundColor: 'rgb(var(--border))' }} />
            {STICKY_NOTE_SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => onChange({ fontSize: s.value })}
                className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: note.fontSize === s.value ? 'rgb(var(--accent-soft))' : 'transparent' }}
                aria-label={`Size ${s.label}`}
              >
                {s.label}
              </button>
            ))}
            <span className="mx-0.5 h-4 w-px shrink-0" style={{ backgroundColor: 'rgb(var(--border))' }} />
            {[
              ['left', AlignLeft],
              ['center', AlignCenter],
              ['right', AlignRight],
            ].map(([val, Icon]) => (
              <button
                key={val}
                type="button"
                onClick={() => onChange({ align: val })}
                className="rounded-full p-1"
                style={{ backgroundColor: note.align === val ? 'rgb(var(--accent-soft))' : 'transparent' }}
                aria-label={`Align ${val}`}
              >
                <Icon size={11} />
              </button>
            ))}
            <span className="mx-0.5 h-4 w-px shrink-0" style={{ backgroundColor: 'rgb(var(--border))' }} />
            <button type="button" onClick={rotateNote} className="rounded-full p-1" aria-label="Rotate note">
              <RotateCw size={11} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full p-1"
              style={{ color: 'rgb(var(--brandy))' }}
              aria-label="Delete note"
            >
              <X size={12} />
            </button>
          </div>

          <span
            onPointerDown={startDrag}
            className="absolute -bottom-3 left-1/2 flex h-6 w-6 -translate-x-1/2 cursor-grab items-center justify-center rounded-full border shadow-paper active:cursor-grabbing"
            style={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))' }}
            aria-hidden="true"
          >
            <Move size={12} style={{ color: 'rgb(var(--text-muted))' }} />
          </span>
        </>
      )}
    </div>
  );
}
