import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Star, X, Plus, Save } from 'lucide-react';
import MoodSelector from '../components/MoodSelector';
import { Spinner, SkeletonLines } from '../components/Loading';
import { SprigLeft, TapedNote } from '../components/Botanical';
import journalService from '../services/journalService';
import uploadService from '../services/uploadService';
import { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { toDateInput } from '../utils/format';

const SUGGESTED_TAGS = ['gratitude', 'self care', 'study', 'friends', 'work', 'family'];

const EMPTY = {
  title: '',
  content: '',
  mood: 'neutral',
  tags: [],
  date: toDateInput(),
  isFavorite: false,
  imageUrl: '',
};

/** Create and edit share this page: an /:id param switches it to edit mode. */
export default function JournalEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  // A new entry can be pre-filled from the dashboard mood picker or from a
  // date clicked in the calendar.
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    mood: params.get('mood') || EMPTY.mood,
    date: params.get('date') || EMPTY.date,
  }));
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const [error, setError] = useState('');

  const fileRef = useRef(null);

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
          mood: e.mood,
          tags: e.tags || [],
          date: toDateInput(e.date),
          isFavorite: e.isFavorite,
          imageUrl: e.imageUrl || '',
        });
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
    const payload = { ...form, isDraft: asDraft, title: form.title.trim() || 'Untitled entry' };

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

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Writing area */}
        <div className="card p-5 sm:p-6">
          <label htmlFor="title" className="sr-only">
            Title
          </label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Title (optional)"
            maxLength={140}
            className="input mb-4 !border-transparent !bg-transparent !px-0 font-serif !text-2xl focus:!shadow-none"
            style={{ color: 'rgb(var(--heading))' }}
          />

          <label htmlFor="content" className="sr-only">
            Your entry
          </label>
          <textarea
            id="content"
            value={form.content}
            onChange={(e) => update({ content: e.target.value })}
            placeholder={'How are you feeling today? Write anything…\nIt can be big or small, happy or sad.'}
            rows={16}
            className="paper-lines w-full resize-y bg-transparent text-[15px] leading-8 outline-none placeholder:opacity-60"
            style={{ color: 'rgb(var(--text))' }}
          />

          <p className="muted mt-3 text-right text-xs tabular-nums">
            {form.content.trim() ? form.content.trim().split(/\s+/).length : 0} words
          </p>
        </div>

        {/* Side panel */}
        <div className="space-y-5">
          <section className="card p-5">
            <h2 className="mb-3 font-serif text-base">Today&apos;s Mood</h2>
            <MoodSelector value={form.mood} onChange={(m) => update({ mood: m || 'neutral' })} size="sm" />
          </section>

          <section className="card p-5">
            <label htmlFor="date" className="label">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={form.date}
              max={toDateInput()}
              onChange={(e) => update({ date: e.target.value })}
              className="input"
            />
          </section>

          <section className="card p-5">
            <h2 className="mb-3 font-serif text-base">Tags</h2>

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
          <section className="card p-5">
            <h2 className="mb-3 font-serif text-base">Photo</h2>

            {form.imageUrl ? (
              <div className="relative">
                <img
                  src={form.imageUrl}
                  alt="Attached to this entry"
                  className="h-40 w-full rounded-xl object-cover"
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
