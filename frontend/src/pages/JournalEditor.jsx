import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Star, X, Plus, Save, Lock, KeyRound, Hourglass, Mic, Ban } from 'lucide-react';
import PaperStylePicker from '../components/PaperStylePicker';
import DecorationPicker from '../components/DecorationPicker';
import PopoverPanel from '../components/PopoverPanel';
import EntryCharm from '../components/EntryCharm';
import JournalPrompt from '../components/JournalPrompt';
import EntryCustomizePanel from '../components/EntryCustomizePanel';
import PhotoFrame from '../components/PhotoFrame';
import StickyNotesLayer from '../components/StickyNotesLayer';
import StickyNotePicker from '../components/StickyNotePicker';
import { getPaperBackground, getPaperStyleMeta } from '../utils/paperStyles';
import { getDecoration } from '../utils/decorations';
import { getFont, getLayout, PHOTO_STYLES } from '../utils/entryStyle';
import { createStickyNote, getNoteBackgroundStyle } from '../utils/stickyNotes';
import VoiceRecorder from '../components/VoiceRecorder';
import { Spinner, SkeletonLines } from '../components/Loading';
import { SprigLeft, TapedNote } from '../components/Botanical';
import EmojiPicker from '../components/EmojiPicker';
import journalService from '../services/journalService';
import uploadService from '../services/uploadService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { toDateInput } from '../utils/format';

const SUGGESTED_TAGS = ['personal', 'work', 'college', 'memories', 'travel', 'ideas'];

const EMPTY = {
  title: '',
  content: '',
  paperStyle: 'plain',
  decorations: [],
  font: 'clean',
  layout: 'classic',
  photoStyle: 'plain',
  headingStyle: 'classic',
  divider: 'none',
  stickyNotes: [],
  tags: [],
  date: toDateInput(),
  isFavorite: false,
  imageUrl: '',
  isTimeCapsule: false,
  unlockDate: '',
  audioUrl: '',
  audioTranscript: '',
};

/** Create and edit share this page: an /:id param switches it to edit mode. */
export default function JournalEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  // A new entry can be pre-filled from a date clicked in the calendar.
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    date: params.get('date') || EMPTY.date,
  }));
  const [lockPassword, setLockPassword] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const [error, setError] = useState('');

  const fileRef = useRef(null);
  const contentRef = useRef(null);

  /** Insert an emoji at the current cursor position inside the textarea. */
  const insertEmoji = (emoji) => {
    const el = contentRef.current;
    if (!el) {
      update({ content: form.content + emoji });
      return;
    }
    const start = el.selectionStart ?? form.content.length;
    const end = el.selectionEnd ?? form.content.length;
    const next = form.content.slice(0, start) + emoji + form.content.slice(end);
    update({ content: next });
    // Restore focus + move caret after the inserted emoji
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  // Image upload is only offered when the server has Cloudinary configured.
  useEffect(() => {
    uploadService
      .status()
      .then((res) => setUploadEnabled(res.data.enabled))
      .catch(() => setUploadEnabled(false));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;

    journalService
      .get(id)
      .then((res) => {
        if (!active) return;
        const e = res.data.entry;
        setForm({
          title: e.title === 'Untitled entry' ? '' : e.title,
          content: e.content,
          paperStyle: e.paperStyle || 'plain',
          decorations: e.decorations || [],
          font: e.font || 'clean',
          layout: e.layout || 'classic',
          photoStyle: e.photoStyle || 'plain',
          headingStyle: e.headingStyle || 'classic',
          divider: e.divider || 'none',
          stickyNotes: e.stickyNotes || [],
          tags: e.tags || [],
          date: toDateInput(e.date),
          isFavorite: e.isFavorite,
          imageUrl: e.imageUrl || '',
          isTimeCapsule: Boolean(e.isTimeCapsule),
          unlockDate: e.unlockDate ? toDateInput(e.unlockDate) : '',
          audioUrl: e.audioUrl || '',
          audioTranscript: e.audioTranscript || '',
        });
        setIsLocked(Boolean(e.isLocked));
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase();
    if (!tag || form.tags.includes(tag) || form.tags.length >= 12) return;
    update({ tags: [...form.tags, tag] });
    setTagInput('');
  };

  const removeTag = (tag) => update({ tags: form.tags.filter((t) => t !== tag) });

  const onTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && form.tags.length) {
      removeTag(form.tags[form.tags.length - 1]);
    }
  };

  const pickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.upload(file);
      update({ imageUrl: res.data.imageUrl });
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const save = async (asDraft = false) => {
    if (!form.content.trim()) {
      toast.error('Write something before saving this entry');
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      isDraft: asDraft,
      title: form.title.trim() || 'Untitled entry',
    };
    if (lockPassword.trim()) {
      payload.lockPassword = lockPassword.trim();
    }

    try {
      const res = isEdit
        ? await journalService.update(id, payload)
        : await journalService.create(payload);
      toast.success(res.message);
      navigate(`/journal/${res.data.entry._id}`, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card space-y-4 p-6">
        <SkeletonLines lines={2} />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-10 text-center">
        <h1 className="mb-2 font-serif text-xl">We could not open that entry</h1>
        <p className="muted mb-6 text-sm">{error}</p>
        <Link to="/journal" className="btn btn-primary">
          Back to my journal
        </Link>
      </div>
    );
  }

  const decorationLabel =
    form.decorations.length === 0
      ? 'None'
      : form.decorations.length === 1
      ? getDecoration(form.decorations[0]).label
      : `${form.decorations.length} charms`;
  const firstDecoration = form.decorations[0] ? getDecoration(form.decorations[0]) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="muted rounded-full border p-2 transition-colors hover:text-[rgb(var(--heading))]"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="truncate font-serif text-2xl sm:text-3xl">
            {isEdit ? 'Edit Entry' : 'New Entry'}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => update({ isFavorite: !form.isFavorite })}
            aria-label={form.isFavorite ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={form.isFavorite}
            className="rounded-full border p-2 transition-colors hover:bg-[rgb(var(--accent-soft))]"
          >
            <Star
              size={16}
              style={{ color: form.isFavorite ? '#E0A94E' : 'rgb(var(--text-muted))' }}
              fill={form.isFavorite ? '#E8C87C' : 'none'}
            />
          </button>

          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? <Spinner size={15} /> : <Save size={15} aria-hidden="true" />}
            Save
          </button>
        </div>
      </header>

      {/* Compact customization toolbar: paper style + decoration, kept out of
          the way so the writing card stays the focal point. Mood is recorded
          separately, from the Mood Tracker page only. */}
      <div className="card flex flex-wrap items-center gap-x-4 gap-y-3 p-3 sm:px-4">
        <PopoverPanel
          label="Entry Style"
          valueLabel={getPaperStyleMeta(form.paperStyle).label}
          preview={
            <span
              className="h-6 w-6 shrink-0 rounded-md border"
              style={{ borderColor: 'rgb(var(--border))', ...getPaperBackground(form.paperStyle) }}
              aria-hidden="true"
            />
          }
        >
          <PaperStylePicker value={form.paperStyle} onChange={(style) => update({ paperStyle: style })} />
        </PopoverPanel>

        <PopoverPanel
          label="Decoration"
          valueLabel={decorationLabel}
          preview={
            <span
              className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgb(var(--surface-alt))' }}
              aria-hidden="true"
            >
              {firstDecoration?.Charm ? (
                <firstDecoration.Charm className="h-3.5 w-3.5" />
              ) : (
                <Ban size={13} style={{ color: 'rgb(var(--text-muted))' }} />
              )}
              {form.decorations.length > 1 && (
                <span
                  className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold"
                  style={{ backgroundColor: 'rgb(var(--accent))', color: '#4A3038' }}
                >
                  +{form.decorations.length - 1}
                </span>
              )}
            </span>
          }
        >
          <DecorationPicker values={form.decorations} onChange={(decorations) => update({ decorations })} />
        </PopoverPanel>

        <PopoverPanel
          label="Customize"
          valueLabel={getLayout(form.layout).label}
          preview={
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold ${getFont(form.font).className}`}
              style={{ backgroundColor: 'rgb(var(--surface-alt))', color: 'rgb(var(--heading))' }}
              aria-hidden="true"
            >
              Aa
            </span>
          }
        >
          <EntryCustomizePanel
            value={{ font: form.font, layout: form.layout, headingStyle: form.headingStyle, divider: form.divider }}
            onChange={(next) => update(next)}
          />
        </PopoverPanel>

        <PopoverPanel
          label="Sticky Notes"
          valueLabel={form.stickyNotes.length ? `${form.stickyNotes.length} on page` : 'None'}
          preview={
            <span
              className="h-6 w-6 shrink-0 rotate-[-6deg] rounded-sm border shadow-sm"
              style={{ borderColor: 'rgb(var(--border))', ...getNoteBackgroundStyle('pastel') }}
              aria-hidden="true"
            />
          }
        >
          <StickyNotePicker
            count={form.stickyNotes.length}
            onAdd={(design) =>
              update({ stickyNotes: [...form.stickyNotes, createStickyNote(design, form.stickyNotes.length)] })
            }
          />
        </PopoverPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        {/* Writing area — the focal point of the page */}
        <div
          className="card relative flex flex-col p-6 sm:p-10 lg:min-h-[78vh]"
          style={getPaperBackground(form.paperStyle)}
        >
          <EntryCharm values={form.decorations} />
          <label htmlFor="title" className="sr-only">
            Title
          </label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Title (optional)"
            maxLength={140}
            className="input mb-4 shrink-0 !border-transparent !bg-transparent !px-0 font-serif !text-2xl focus:!shadow-none sm:!text-3xl"
            style={{ color: 'rgb(var(--heading))' }}
          />

          {!isEdit && <JournalPrompt />}

          <label htmlFor="content" className="sr-only">
            Your entry
          </label>
          <textarea
            id="content"
            ref={contentRef}
            value={form.content}
            onChange={(e) => update({ content: e.target.value })}
            placeholder={'Start writing whatever comes to mind…\nIt can be big or small, happy or sad.'}
            className={`paper-lines w-full min-h-[360px] flex-1 resize-y bg-transparent text-lg leading-8 outline-none placeholder:opacity-60 ${getFont(form.font).className}`}
            style={{ color: 'rgb(var(--text))' }}
          />

          {/* Toolbar row: emoji picker + word/character count */}
          <div className="mt-3 flex shrink-0 items-center justify-between gap-2 mb-4">
            <EmojiPicker onEmojiSelect={insertEmoji} />
            <p className="muted text-xs tabular-nums">
              {form.content.trim() ? form.content.trim().split(/\s+/).length : 0} words
              <span aria-hidden="true"> · </span>
              {form.content.length} characters
            </p>
          </div>

          {/* Voice Note Recorder */}
          <div className="mt-6 shrink-0 border-t border-stone-200 dark:border-stone-800 pt-5">
            <VoiceRecorder
              audioUrl={form.audioUrl}
              audioTranscript={form.audioTranscript}
              onAudioChange={(url) => update({ audioUrl: url })}
              onTranscriptChange={(txt) => update({ audioTranscript: txt })}
            />
          </div>

          <StickyNotesLayer
            notes={form.stickyNotes}
            editable
            onChange={(stickyNotes) => update({ stickyNotes })}
          />
        </div>

        {/* Side panel — the remaining, less-frequently-touched settings */}
        <div className="space-y-3">
          <section className="card p-4">
            <label htmlFor="date" className="label !mb-1 !text-[11px]">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={form.date}
              max={toDateInput()}
              onChange={(e) => update({ date: e.target.value })}
              className="input !py-2 !text-sm"
            />
          </section>

          {/* Time Capsule section */}
          <section className="card p-4">
            <h2 className="mb-2 font-serif text-sm flex items-center gap-1.5">
              <Hourglass size={14} className="text-amber-600 dark:text-amber-400" />
              Time Capsule
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[rgb(var(--heading))]">
                <input
                  type="checkbox"
                  checked={form.isTimeCapsule}
                  onChange={(e) =>
                    update({
                      isTimeCapsule: e.target.checked,
                      unlockDate:
                        e.target.checked && !form.unlockDate
                          ? toDateInput(new Date(Date.now() + 86400000))
                          : form.unlockDate,
                    })
                  }
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                Seal as Time Capsule
              </label>
              {form.isTimeCapsule && (
                <div className="space-y-1 pl-5">
                  <label htmlFor="unlockDate" className="label text-[11px]">
                    Unlock Date
                  </label>
                  <input
                    id="unlockDate"
                    type="date"
                    value={form.unlockDate}
                    min={toDateInput(new Date(Date.now() + 86400000))}
                    onChange={(e) => update({ unlockDate: e.target.value })}
                    className="input text-xs"
                  />
                  <p className="muted text-[11px] leading-tight mt-1">
                    Entry content & audio will stay sealed until this date.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Password Protection section */}
          <section className="card p-4">
            <h2 className="mb-2 font-serif text-sm flex items-center gap-1.5">
              <KeyRound size={14} className="text-[rgb(var(--brandy))]" />
              Password Lock
            </h2>
            {isLocked ? (
              <div className="text-xs space-y-2">
                <p className="text-[rgb(var(--brandy))] font-medium flex items-center gap-1">
                  <Lock size={12} /> Entry is password protected.
                </p>
                <input
                  type="password"
                  value={lockPassword}
                  onChange={(e) => setLockPassword(e.target.value)}
                  placeholder="Set new password (optional)"
                  className="input text-xs"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="muted text-xs">
                  Set a password to lock this entry from prying eyes.
                </p>
                <input
                  type="password"
                  value={lockPassword}
                  onChange={(e) => setLockPassword(e.target.value)}
                  placeholder="Set lock password (optional)"
                  className="input text-xs"
                />
              </div>
            )}
          </section>

          <section className="card p-4">
            <h2 className="mb-2 font-serif text-sm">Tags</h2>

            {form.tags.length > 0 && (
              <ul className="mb-3 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <li key={tag}>
                    <span
                      className="chip"
                      style={{ backgroundColor: 'rgb(var(--olive) / 0.16)', color: 'rgb(var(--text))' }}
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove tag ${tag}`}
                        className="ml-0.5 rounded-full transition-opacity hover:opacity-60"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <label htmlFor="tag-input" className="sr-only">
                Add a tag
              </label>
              <input
                id="tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={onTagKeyDown}
                placeholder="Add a tag"
                maxLength={24}
                className="input flex-1"
              />
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                aria-label="Add tag"
                className="btn btn-ghost !rounded-xl !px-3"
              >
                <Plus size={15} />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.filter((t) => !form.tags.includes(t)).map((t) => (
                <button key={t} type="button" onClick={() => addTag(t)} className="chip hover:opacity-70">
                  + {t}
                </button>
              ))}
            </div>
          </section>

          {/* Image upload — only shown when the server supports it */}
          <section className="card p-4">
            <h2 className="mb-2 font-serif text-sm">Photo</h2>

            {form.imageUrl ? (
              <div className="space-y-3">
                <div className="relative">
                  <PhotoFrame
                    src={form.imageUrl}
                    alt="Attached to this entry"
                    style={form.photoStyle}
                    imgClassName="h-40"
                  />
                  <button
                    type="button"
                    onClick={() => update({ imageUrl: '' })}
                    aria-label="Remove image"
                    className="absolute right-2 top-2 rounded-full p-1.5 shadow-paper"
                    style={{ backgroundColor: 'rgb(var(--surface))' }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PHOTO_STYLES.map((p) => {
                    const active = form.photoStyle === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => update({ photoStyle: p.value })}
                        className="rounded-full border px-2.5 py-1 text-[11px] transition-colors"
                        style={{
                          backgroundColor: active ? 'rgb(var(--accent))' : 'transparent',
                          color: active ? '#4A3038' : 'rgb(var(--text-muted))',
                          borderColor: active ? 'transparent' : 'rgb(var(--border))',
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : uploadEnabled ? (
              <>
                <input
                  ref={fileRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={pickImage}
                  className="sr-only"
                />
                <label
                  htmlFor="image"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors hover:border-[rgb(var(--accent))]"
                >
                  {uploading ? (
                    <Spinner size={20} className="text-[rgb(var(--accent))]" />
                  ) : (
                    <ImagePlus size={20} style={{ color: 'rgb(var(--text-muted))' }} aria-hidden="true" />
                  )}
                  <span className="muted text-xs">
                    {uploading ? 'Uploading…' : 'Click to upload a photo'}
                  </span>
                </label>
              </>
            ) : (
              <p className="muted text-xs leading-relaxed">
                Photo uploads are not set up on this server. Everything else works exactly the same —
                add your Cloudinary keys to the backend .env to turn this on.
              </p>
            )}
          </section>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => save(true)}
              disabled={saving}
              className="btn btn-ghost flex-1"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
          </div>

          <div className="relative hidden justify-center pt-2 lg:flex">
            <SprigLeft className="h-28 w-16 text-[rgb(var(--olive))] opacity-40" />
          </div>

          <div className="hidden lg:block">
            <TapedNote rotate="-2deg">
              Same girl,
              <br />
              new chapter.
            </TapedNote>
          </div>
        </div>
      </div>
    </div>
  );
}

