import { useEffect, useRef, useState } from 'react';
import StickyNote from './StickyNote';

/**
 * Absolutely-positioned overlay holding every sticky note on a journal page.
 * In editable mode, notes can be dragged, retyped, restyled, rotated and
 * deleted; in read-only mode (the entry view) they just render where they
 * were left. Empty space passes clicks through to whatever is underneath.
 */
export default function StickyNotesLayer({ notes = [], editable = false, onChange }) {
  const containerRef = useRef(null);
  const noteRefs = useRef({});
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!editable || !activeId) return undefined;
    const onDocPointerDown = (e) => {
      const el = noteRefs.current[activeId];
      if (el && !el.contains(e.target)) setActiveId(null);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [activeId, editable]);

  if (!editable && notes.length === 0) return null;

  const updateNote = (id, patch) => onChange(notes.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  const deleteNote = (id) => {
    onChange(notes.filter((n) => n.id !== id));
    setActiveId((a) => (a === id ? null : a));
  };

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-[5]">
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          editable={editable}
          active={editable && activeId === note.id}
          containerRef={containerRef}
          registerRef={(el) => {
            if (el) noteRefs.current[note.id] = el;
            else delete noteRefs.current[note.id];
          }}
          onActivate={() => setActiveId(note.id)}
          onChange={(patch) => updateNote(note.id, patch)}
          onDelete={() => deleteNote(note.id)}
        />
      ))}
    </div>
  );
}
