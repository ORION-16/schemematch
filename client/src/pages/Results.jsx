import FilterTabs from '../components/FilterTabs';
import SchemeCard from '../components/SchemeCard';
import HowToApplyPanel from '../components/HowToApplyPanel';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Added missing import
import { useState, useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';

export default function Results() {
  const navigate = useNavigate();
  const { profile, matchedSchemes, resetProfile } = useProfile();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState(null);

  const categories = useMemo(() => {
    if (!matchedSchemes) return [];
    const cats = new Set(matchedSchemes.map(s => s.category));
    return ['All', ...Array.from(cats)].sort();
  }, [matchedSchemes]);

  const filteredSchemes = useMemo(() => {
    if (!matchedSchemes) return [];
    if (selectedCategory === 'All') return matchedSchemes;
    return matchedSchemes.filter(s => s.category === selectedCategory);
  }, [matchedSchemes, selectedCategory]);

  // If someone navigates directly here without doing the quiz
  if (!matchedSchemes) {
    // Cannot navigate safely during render in React 18/19 easily, but returning null is fine.
    // We should ideally use useEffect to navigate, or just return a message.
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--off-white)]">
         <h2 className="text-2xl font-bold text-[var(--navy)] mb-4">{t('results.noResults')}</h2>
         <button onClick={() => navigate('/')} className="px-6 py-3 bg-[var(--saffron)] rounded-lg font-bold text-white">{t('results.returnHome')}</button>
      </div>
    );
  }

  const handleRetake = () => {
    resetProfile();
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-[var(--off-white)] px-6 sm:px-12 lg:px-16">
      <div className="max-w-[90rem] mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 summary-bar">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--navy)] mb-2" style={{ fontFamily: 'var(--font-family-heading)' }}>
              {t('results.title1')}<span className="text-[var(--saffron)]">{matchedSchemes.length}</span>{t('results.title2')}
            </h1>
            <p className="text-[var(--navy-mid)]">
              {t('results.subtitle')}
            </p>
          </div>
          <div className="flex gap-3 no-print">
            <button 
              onClick={() => window.print()} 
              className="px-5 py-2.5 border-2 border-[var(--border)] bg-white text-[var(--navy)] font-bold rounded-xl shadow-sm hover:bg-[var(--off-white)] transition-colors cursor-pointer"
            >
              {t('results.printList')}
            </button>
            <button 
              onClick={handleRetake} 
              className="px-5 py-2.5 bg-[var(--navy)] text-white font-bold rounded-xl shadow-md hover:bg-[var(--navy-mid)] transition-colors cursor-pointer"
            >
              {t('results.retake')}
            </button>
          </div>
        </div>

        {matchedSchemes.length > 0 ? (
          <>
            <div className="mb-8">
              <FilterTabs 
                categories={categories} 
                selected={selectedCategory} 
                onSelect={setSelectedCategory} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 results-grid">
              {filteredSchemes.map(scheme => (
                <SchemeCard 
                  key={scheme._id || scheme.id} 
                  scheme={scheme} 
                  onLearnMore={setSelectedScheme} 
                />
              ))}
            </div>
            {filteredSchemes.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[var(--muted)] text-lg">No schemes found in the "{selectedCategory}" category.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-[var(--border)] max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--navy)] mb-4" style={{ fontFamily: 'var(--font-family-heading)' }}>No perfect matches found</h2>
            <p className="text-[var(--muted)] max-w-md mx-auto mb-8 text-lg">
              Currently, there are no specific schemes returning an exact match for your profile parameters. You may try adjusting the details.
            </p>
            <button 
              onClick={handleRetake} 
              className="px-8 py-3.5 bg-[var(--saffron)] text-white font-bold rounded-full shadow-lg hover:shadow-[var(--saffron-light)] transition-all cursor-pointer text-lg"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>

      <HowToApplyPanel scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />
    </div>
  );
}
