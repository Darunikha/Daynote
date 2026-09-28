import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getDecoration } from '../utils/decorations';

/**
 * A single scrapbook charm placed freely on the page instead of pinned to a
 * fixed corner. In editable mode it can be dragged anywhere within the page
 * and removed; in read-only mode it just renders where it was left.
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
  const { Charm, width, height } = decoration;
  const rotation = placement.rotation ?? decoration.rotate ?? 0;

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
        <button
          type="button"
          onClick={onDelete}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`Remove ${decoration.label}`}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border shadow-paper"
          style={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))', color: 'rgb(var(--brandy))' }}
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
}
