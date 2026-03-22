import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SchemeCard({ scheme, onLearnMore }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || 'en';
  const catColor = `var(--cat-${scheme.category.toLowerCase()})`;

  const localizedName = scheme.translations?.[currentLang]?.name || scheme.name;
  const localizedBenefit = scheme.translations?.[currentLang]?.benefit || scheme.benefit;
  const localizedDeadline = scheme.translations?.[currentLang]?.deadline || scheme.deadline;

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--border)] shadow-md hover:shadow-xl transition-all hover:-translate-y-1 scheme-card flex flex-col h-full items-start">
      <div className="flex items-center gap-3 mb-4 w-full justify-between">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
          style={{ backgroundColor: catColor, color: 'white' }}
        >
          {scheme.category}
        </span>
        {localizedDeadline && localizedDeadline !== 'Ongoing' && (
          <span className="text-[10px] text-[var(--muted)] font-medium bg-[var(--off-white)] px-2 py-1 rounded">
            Ends: {localizedDeadline}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-[var(--navy)] mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-family-heading)' }}>
        {localizedName}
      </h3>

      <p className="text-[var(--muted)] text-sm mb-4 line-clamp-3 flex-grow">
        {localizedBenefit}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {scheme.eligibility?.minAge !== undefined && scheme.eligibility?.minAge !== null && (
          <span className="bg-[var(--off-white)] text-[var(--navy)] text-xs px-2 py-1 rounded-md font-medium border border-[var(--border)]">
            Age: {scheme.eligibility.minAge}+
          </span>
        )}
        {(scheme.documents || []).length > 0 && (
          <span className="bg-[var(--off-white)] text-[var(--navy)] text-xs px-2 py-1 rounded-md font-medium border border-[var(--border)]">
            {scheme.documents.length} Docs
          </span>
        )}
      </div>

      <button
        onClick={() => onLearnMore(scheme)}
        className="w-full mt-auto cursor-pointer text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-80 shadow-sm"
        style={{
          background: 'rgba(245, 166, 35, 0.1)',
          color: 'var(--saffron)',
          border: '1px solid var(--saffron)'
        }}
      >
        {t('results.viewDetails')}
      </button>
    </div>
  );
}
