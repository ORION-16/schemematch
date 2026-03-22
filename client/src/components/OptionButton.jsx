export default function OptionButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer text-center transition-all duration-200"
      style={{
        border: `2px solid ${selected ? 'var(--saffron)' : 'var(--border)'}`,
        borderRadius: '12px',
        padding: '16px 24px',
        minHeight: '56px',
        background: selected ? 'rgba(245, 166, 35, 0.08)' : 'var(--white)',
        color: selected ? 'var(--navy)' : 'var(--navy)',
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: selected ? 600 : 500,
        fontSize: '1rem',
        boxShadow: selected ? '0 4px 12px rgba(245, 166, 35, 0.1)' : '0 2px 8px rgba(15, 31, 61, 0.04)',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--saffron)';
          e.currentTarget.style.background = 'rgba(245, 166, 35, 0.04)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--white)';
        }
      }}
    >
      {label}
    </button>
  );
}
