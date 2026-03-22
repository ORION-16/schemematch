import { useTranslation } from 'react-i18next';

export default function FilterTabs({ categories, selected, onSelect }) {
  const { t } = useTranslation();
  
  return (
    <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 filter-tabs no-scrollbar w-full px-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          style={{
            background: selected === cat ? 'var(--navy)' : 'var(--white)',
            color: selected === cat ? 'var(--white)' : 'var(--navy)',
            borderColor: selected === cat ? 'var(--navy)' : 'var(--border)',
          }}
          className="px-6 py-2.5 md:py-3 rounded-full whitespace-nowrap text-sm md:text-base font-bold transition-colors border shadow-sm hover:shadow-md cursor-pointer"
        >
          {cat === 'All' ? t('results.all') : t(`categories.${cat}`)}
        </button>
      ))}
    </div>
  );
}
