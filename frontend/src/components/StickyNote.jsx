import { useEffect, useRef } from 'react';
import { Move, RotateCw, X, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { TinyFlowerCharm, WashiTapeCharm, PaperClipCharm, TinyBowCharm, StarCharm } from './Charms';
import {
  STICKY_NOTE_FONTS,
  STICKY_NOTE_SIZES,
  getNoteBackgroundStyle,
  getNoteShapeStyle,
} from '../utils/stickyNotes';

const WIDTH = 172;
const HEIGHT = 152;

/** The bit of illustrated stationery that makes each design read as physical, not a plain card. */
function DesignAccent({ design }) {
  if (design === 'floral') {
    return (
      <>
        <TinyFlowerCharm className="pointer-events-none absolute -right-3 -top-3 h-9 w-9" />
        <TinyFlowerCharm className="pointer-events-none absolute -right-1 top-4 h-5 w-5 rotate-12 opacity-90" />
      </>
    );
  }
  if (design === 'taped') {
    return (
      <span className="pointer-events-none absolute -top-3.5 left-1/2 -translate-x-1/2 -rotate-3">
        <WashiTapeCharm className="h-6 w-20" />
      </span>
    );
  }
  if (design === 'animal') {
    return (
      <>
        <span
          className="pointer-events-none absolute -top-3 left-5 h-7 w-7 rounded-full"
          style={{ backgroundColor: '#F5EFE1', boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.06)' }}
        />
        <span
          className="pointer-events-none absolute -top-3 right-5 h-7 w-7 rounded-full"
          style={{ backgroundColor: '#F5EFE1', boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.06)' }}
        />
        <span className="pointer-events-none absolute left-7 top-[-5px] h-3.5 w-3.5 rounded-full" style={{ backgroundColor: '#E3B7B0' }} />
        <span className="pointer-events-none absolute right-7 top-[-5px] h-3.5 w-3.5 rounded-full" style={{ backgroundColor: '#E3B7B0' }} />
        <span
          className="pointer-events-none absolute left-1/2 top-2.5 h-1.5 w-2 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: '#B98D7B' }}
        />
      </>
    );
  }
  if (design === 'scalloped') {
    return (
      <>
        <svg
          aria-hidden="true"
          viewBox="0 0 172 12"
          className="pointer-events-none absolute -top-[1px] left-0 h-3 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 12 a10.75 10.75 0 0 0 21.5 0 a10.75 10.75 0 0 1 21.5 0 a10.75 10.75 0 0 0 21.5 0 a10.75 10.75 0 0 1 21.5 0 a10.75 10.75 0 0 0 21.5 0 a10.75 10.75 0 0 1 21.5 0 a10.75 10.75 0 0 0 21.5 0 a10.75 10.75 0 0 1 21.5 0 V0H0Z"
            fill="#FBEFEF"
          />
        </svg>
        <TinyFlowerCharm className="pointer-events-none absolute -left-2 -top-2 h-7 w-7 -rotate-6" />
        <TinyFlowerCharm className="pointer-events-none absolute left-6 -top-1 h-4 w-4 rotate-6 opacity-90" />
      </>
    );
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
  if (design === 'heart') {
    return <TinyBowCharm className="pointer-events-none absolute -top-3 left-1/2 h-8 w-11 -translate-x-1/2 -rotate-3" />;
  }
  if (design === 'grid') {
    return <PaperClipCharm className="pointer-events-none absolute -top-4 left-4 h-9 w-7 -rotate-6" />;
  }
  if (design === 'lined') {
    return <StarCharm className="pointer-events-none absolute -right-2.5 -top-2.5 h-6 w-6 rotate-12" />;
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
        className="relative h-full w-full overflow-hidden shadow-paper-lg"
        style={{ ...getNoteBackgroundStyle(note.design, note.color), ...getNoteShapeStyle(note.design) }}
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
            style={{ fontSize: sizeMeta.px, color: '#4A3830', lineHeight: 1.35 }}
          />
        ) : (
          <p
            className={`h-full w-full overflow-hidden whitespace-pre-wrap p-3.5 pt-5 ${fontMeta.className} ${alignClass}`}
            style={{ fontSize: sizeMeta.px, color: '#4A3830', lineHeight: 1.35 }}
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
