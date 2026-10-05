import { useEffect, useRef } from 'react';
import { Maximize2, RotateCw, X } from 'lucide-react';
import { getDecoration } from '../utils/decorations';

/**
 * A single scrapbook charm placed freely on the page instead of pinned to a
 * fixed corner. In editable mode it can be dragged anywhere within the page,
 * rotated freely to any angle, and removed; in read-only mode it just
 * renders where it was left.
 */
export default function MovableCharm({ placement, editable, active, containerRef, registerRef, onActivate, onChange, onDelete }) {
  const wrapperRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    registerRef?.(wrapperRef.current);
    return () => registerRef?.(null);
  }, [registerRef]);

  useEffect(() => () => (dragRef.current = null), []);

  const decoration = getDecoration(placement.type);
  if (!decoration.Charm) return null;
  const { Charm } = decoration;
  const rotation = placement.rotation ?? decoration.rotate ?? 0;
  const scale = placement.scale ?? 1;
  const width = decoration.width * scale;
  const height = decoration.height * scale;

  const startDrag = (e) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    onActivate?.();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, startNx: placement.x, startNy: placement.y, rect };

    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const dxPct = ((ev.clientX - d.startX) / d.rect.width) * 100;
      const dyPct = ((ev.clientY - d.startY) / d.rect.height) * 100;
      onChange({
        x: Math.min(96, Math.max(4, d.startNx + dxPct)),
        y: Math.min(96, Math.max(4, d.startNy + dyPct)),
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

  /**
   * Drag the handle around the charm to rotate it to any angle — the angle
   * between the charm's own center and the pointer, measured from "up"
   * (0°) going clockwise, matching how `rotate()` turns things visually.
   */
  const startRotate = (e) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    onActivate?.();
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angleAt = (clientX, clientY) => (Math.atan2(clientX - cx, -(clientY - cy)) * 180) / Math.PI;
    const startAngle = angleAt(e.clientX, e.clientY);
    const startRotation = rotation;

    const onMove = (ev) => {
      const delta = angleAt(ev.clientX, ev.clientY) - startAngle;
      // Normalize into (-180, 180] so it matches the schema's range and
      // never reports something like 370deg.
      const next = (((startRotation + delta + 180) % 360) + 360) % 360 - 180;
      onChange({ rotation: Math.round(next) });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  /**
   * Drag the corner grip to scale the charm up or down. The new size tracks
   * how far the pointer is from the charm's center compared to where the
   * drag started, so it grows as you pull out and shrinks as you push in.
   */
  const startResize = (e) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const startDist = Math.hypot(e.clientX - cx, e.clientY - cy) || 1;
    const startScale = scale;

    const onMove = (ev) => {
      const dist = Math.hypot(ev.clientX - cx, ev.clientY - cy);
      const next = startScale * (dist / startDist);
      onChange({ scale: Math.round(Math.min(2.5, Math.max(0.5, next)) * 100) / 100 });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      ref={wrapperRef}
      aria-hidden={!editable || undefined}
      className="absolute select-none"
      style={{
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        width,
        height,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        zIndex: active ? 30 : 3,
        pointerEvents: editable ? 'auto' : 'none',
        cursor: editable ? 'grab' : 'default',
        touchAction: 'none',
      }}
      onPointerDown={startDrag}
    >
      <Charm className="h-full w-full drop-shadow-sm" />

      {editable && active && (
        <>
          {/* Delete pill — counter-rotated so it stays upright and
              readable regardless of the charm's own angle. */}
          <div
            className="absolute -top-9 left-1/2 flex -translate-x-1/2 items-center gap-0.5 whitespace-nowrap rounded-full border px-1 py-1 shadow-paper-lg"
            style={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))', transform: `translateX(-50%) rotate(${-rotation}deg)` }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Remove ${decoration.label}`}
              className="rounded-full p-1"
            >
              <X size={12} style={{ color: 'rgb(var(--brandy))' }} />
            </button>
          </div>

          {/* Rotate handle — a corner grip you drag around the charm to
              turn it to any angle, like a design tool's rotate handle,
              instead of snapping in fixed steps. Sits at the opposite
              corner from the delete pill so the two never overlap. */}
          <button
            type="button"
            onPointerDown={startResize}
            aria-label={`Resize ${decoration.label} — drag to make it bigger or smaller`}
            className="absolute -bottom-2.5 -left-2.5 flex h-6 w-6 items-center justify-center rounded-full border shadow-paper active:cursor-grabbing"
            style={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))', cursor: 'nwse-resize', touchAction: 'none' }}
          >
            <Maximize2 size={11} style={{ color: 'rgb(var(--text-muted))' }} />
          </button>
          <button
            type="button"
            onPointerDown={startRotate}
            aria-label={`Rotate ${decoration.label} — drag to any angle`}
            className="absolute -bottom-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full border shadow-paper active:cursor-grabbing"
            style={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))', cursor: 'grab', touchAction: 'none' }}
          >
            <RotateCw size={12} style={{ color: 'rgb(var(--text-muted))' }} />
          </button>
        </>
      )}
    </div>
  );
}
