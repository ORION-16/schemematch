import FilterTabs from '../components/FilterTabs';
import SchemeCard from '../components/SchemeCard';
import HowToApplyPanel from '../components/HowToApplyPanel';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, matchedSchemes, resetProfile } = useProfile();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [visibleCount, setVisibleCount] = useState(20);

  // Determine if this is an AI flow
  const fromAI = location.state?.fromAI || false;
  const extractedProfile = location.state?.extractedProfile || null;

  // Use context schemes (works for both quiz flow and AI flow since AISearchBar stores in context)
  const schemes = matchedSchemes;

  // Reset pagination when category changes
  useEffect(() => {
    setVisibleCount(20);
  }, [selectedCategory]);

  const categories = useMemo(() => {
    if (!schemes) return [];
    const cats = new Set(schemes.map(s => s.category));
    return ['All', ...Array.from(cats)].sort();
  }, [schemes]);

  const filteredSchemes = useMemo(() => {
    if (!schemes) return [];
    if (selectedCategory === 'All') return schemes;
    return schemes.filter(s => s.category === selectedCategory);
  }, [schemes, selectedCategory]);

  // If someone navigates directly here without doing the quiz or AI search
  if (!schemes) {
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

  // Format extracted profile fields for the banner
  const profileSummary = extractedProfile ? Object.entries(extractedProfile)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join(' · ') : '';

  return (
    <div className="min-h-screen pt-28 pb-16 bg-[var(--off-white)] px-6 sm:px-12 lg:px-16">
      <div className="max-w-[90rem] mx-auto">
        
        {/* AI Extracted Profile Banner */}
        {fromAI && profileSummary && (
          <div className="mb-8 p-4 bg-gradient-to-r from-[var(--navy)]/5 to-[var(--saffron)]/5 border border-[var(--border)] rounded-2xl flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--navy)] text-white text-xs font-bold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                AI Matched
              </span>
            </div>
            <p className="text-sm text-[var(--navy-mid)]">
              <span className="font-semibold text-[var(--navy)]">We understood: </span>
              {profileSummary}
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 summary-bar">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--navy)] mb-2" style={{ fontFamily: 'var(--font-family-heading)' }}>
              {t('results.title1')}<span className="text-[var(--saffron)]">{schemes.length}</span>{t('results.title2')}
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

        {schemes.length > 0 ? (
          <>
            <div className="mb-8">
              <FilterTabs 
                categories={categories} 
                selected={selectedCategory} 
                onSelect={setSelectedCategory} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 results-grid">
              {filteredSchemes.slice(0, visibleCount).map(scheme => (
                <SchemeCard 
                  key={scheme._id || scheme.id} 
                  scheme={scheme} 
                  onLearnMore={setSelectedScheme} 
                />
              ))}
            </div>
            
            {visibleCount < filteredSchemes.length && (
              <div className="text-center mt-12">
                <button 
                  onClick={() => setVisibleCount(v => v + 20)}
                  className="px-8 py-3.5 bg-white border-2 border-[var(--saffron)] text-[var(--saffron)] font-bold rounded-xl shadow-md hover:bg-[var(--saffron)] hover:text-white transition-all cursor-pointer"
                >
                  Load More Schemes
                </button>
              </div>
            )}

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
