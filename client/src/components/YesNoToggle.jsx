import { useTranslation } from 'react-i18next';

export default function YesNoToggle({ label, value, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: '1rem',
            color: 'var(--navy)',
            marginBottom: '8px'
          }}
        >
          {label}
        </label>
      )}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onChange('yes')}
          className="flex-1 cursor-pointer transition-all duration-200"
          style={{
            border: `2px solid ${value === 'yes' ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: '12px',
            padding: '16px 24px',
            minHeight: '56px',
            background: value === 'yes' ? 'var(--green-light)' : 'var(--white)',
            color: value === 'yes' ? 'var(--green)' : 'var(--navy)',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: value === 'yes' ? 600 : 500,
            fontSize: '1rem',
            boxShadow: value === 'yes' ? '0 4px 12px rgba(19, 136, 8, 0.1)' : '0 2px 8px rgba(15, 31, 61, 0.04)',
          }}
          onMouseEnter={(e) => {
            if (value !== 'yes') e.currentTarget.style.borderColor = 'var(--saffron)';
          }}
          onMouseLeave={(e) => {
            if (value !== 'yes') e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          {t('quiz.yes')}
        </button>
        <button
          type="button"
          onClick={() => onChange('no')}
          className="flex-1 cursor-pointer transition-all duration-200"
          style={{
            border: `2px solid ${value === 'no' ? '#c0392b' : 'var(--border)'}`,
            borderRadius: '12px',
            padding: '16px 24px',
            minHeight: '56px',
            background: value === 'no' ? '#fdecea' : 'var(--white)',
            color: value === 'no' ? '#c0392b' : 'var(--navy)',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: value === 'no' ? 600 : 500,
            fontSize: '1rem',
            boxShadow: value === 'no' ? '0 4px 12px rgba(192, 57, 43, 0.1)' : '0 2px 8px rgba(15, 31, 61, 0.04)',
          }}
          onMouseEnter={(e) => {
            if (value !== 'no') e.currentTarget.style.borderColor = 'var(--saffron)';
          }}
          onMouseLeave={(e) => {
            if (value !== 'no') e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          {t('quiz.no')}
        </button>
      </div>
    </div>
  );
}
