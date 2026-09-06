import { Search, X } from 'lucide-react';

/** Controlled search input. Debouncing happens in the page via useDebounce. */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search your notes...',
  id = 'search',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Search
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
        style={{ color: 'rgb(var(--text-muted))' }}
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-10 pr-10"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="muted absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:text-[rgb(var(--heading))]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
