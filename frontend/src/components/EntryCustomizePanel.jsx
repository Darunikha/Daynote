import { FONTS, LAYOUTS, HEADING_STYLES, DIVIDERS } from '../utils/entryStyle';

const Section = ({ label, children }) => (
  <div className="mb-4 last:mb-0">
    <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgb(var(--text-muted))' }}>
      {label}
    </h3>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);

const Pill = ({ active, onClick, children, className = '' }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${className}`}
    style={{
      backgroundColor: active ? 'rgb(var(--accent))' : 'transparent',
      color: active ? '#4A3038' : 'rgb(var(--text-muted))',
      borderColor: active ? 'transparent' : 'rgb(var(--border))',
    }}
  >
    {children}
  </button>
);

/**
 * Compact set of whole-entry style choices — font, layout, heading
 * treatment, and divider. Each is a single pick for the entry, so this
 * stays as simple as the paper-style picker rather than a design tool.
 */
export default function EntryCustomizePanel({ value, onChange }) {
  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <div>
      <Section label="Font">
        {FONTS.map((f) => (
          <Pill key={f.value} active={value.font === f.value} onClick={() => update({ font: f.value })} className={f.className}>
            {f.label}
          </Pill>
        ))}
      </Section>

      <Section label="Layout">
        {LAYOUTS.map((l) => (
          <Pill key={l.value} active={value.layout === l.value} onClick={() => update({ layout: l.value })}>
            {l.label}
          </Pill>
        ))}
      </Section>

      <Section label="Heading Style">
        {HEADING_STYLES.map((h) => (
          <Pill key={h.value} active={value.headingStyle === h.value} onClick={() => update({ headingStyle: h.value })}>
            {h.label}
          </Pill>
        ))}
      </Section>

      <Section label="Divider">
        {DIVIDERS.map((d) => (
          <Pill key={d.value} active={value.divider === d.value} onClick={() => update({ divider: d.value })}>
            {d.label}
          </Pill>
        ))}
      </Section>

      <p className="text-[11px] leading-relaxed" style={{ color: 'rgb(var(--text-muted))' }}>
        These shape how the entry reads back — you&apos;ll see them on the entry page.
      </p>
    </div>
  );
}
