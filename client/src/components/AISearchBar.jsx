import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { aiMatchProfile } from '../utils/api';
import { useProfile } from '../context/ProfileContext';

export default function AISearchBar() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setMatchedSchemes } = useProfile();
  const { t } = useTranslation();

  const handleSubmit = async () => {
    if (message.trim().length < 10) {
      setError('Please describe yourself in a bit more detail');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await aiMatchProfile(message);
      // Store schemes in context so Results page can read them
      setMatchedSchemes(data.schemes);
      // Pass extracted profile info via navigation state
      navigate('/results', {
        state: {
          extractedProfile: data.extractedProfile,
          fromAI: true
        }
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder={t('ai.placeholder', 'e.g. I am a 24 year old SC student from Maharashtra with family income under 2 lakhs')}
            className="w-full p-5 pr-14 rounded-2xl border-2 border-[var(--border)] bg-white resize-none h-28 text-base text-[var(--navy)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--saffron)] focus:ring-2 focus:ring-[var(--saffron-light)] transition-all shadow-sm"
            style={{ fontFamily: 'var(--font-family-body)' }}
            disabled={loading}
          />
          <div className="absolute top-4 right-4 text-[var(--saffron)] opacity-60">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading || message.trim().length < 10}
          className="w-full py-4 rounded-xl bg-[var(--navy)] text-white font-bold text-lg shadow-lg hover:bg-[var(--navy-mid)] hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
          style={{ fontFamily: 'var(--font-family-heading)' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              {t('ai.loading', 'Finding schemes with AI...')}
            </span>
          ) : (
            t('ai.submit', 'Find Schemes with AI ✨')
          )}
        </button>
      </div>
    </div>
  );
}
