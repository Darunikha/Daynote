import { useEffect, useRef, useState } from 'react';
import MovableCharm from './MovableCharm';

/**
 * Absolutely-positioned overlay holding every freely-placed charm on a
 * journal page — the movable counterpart to the old corner-fixed
 * `EntryCharm`. Mirrors StickyNotesLayer's editable/read-only split.
 */
export default function DecorationLayer({ placements = [], editable = false, onChange }) {
  const containerRef = useRef(null);
  const charmRefs = useRef({});
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!editable || !activeId) return undefined;
    const onDocPointerDown = (e) => {
      const el = charmRefs.current[activeId];
      if (el && !el.contains(e.target)) setActiveId(null);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [activeId, editable]);

  if (!editable && placements.length === 0) return null;

  const updatePlacement = (id, patch) => onChange(placements.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deletePlacement = (id) => {
    onChange(placements.filter((p) => p.id !== id));
    setActiveId((a) => (a === id ? null : a));
  };

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-[4]">
      {placements.map((placement) => (
        <MovableCharm
          key={placement.id}
          placement={placement}
          editable={editable}
          active={editable && activeId === placement.id}
          containerRef={containerRef}
          registerRef={(el) => {
            if (el) charmRefs.current[placement.id] = el;
            else delete charmRefs.current[placement.id];
          }}
          onActivate={() => setActiveId(placement.id)}
          onChange={(patch) => updatePlacement(placement.id, patch)}
          onDelete={() => deletePlacement(placement.id)}
        />
      ))}
    </div>
  );
}
