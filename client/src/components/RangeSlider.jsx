export default function RangeSlider({ label, min, max, step, value, onChange, format }) {
  const displayValue = format ? format(value) : value;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: '0.85rem',
            color: 'var(--navy)',
          }}
        >
          {label}
        </label>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--saffron)',
          }}
        >
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div
        className="flex justify-between"
        style={{ fontSize: '0.75rem', color: 'var(--muted)' }}
      >
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}
