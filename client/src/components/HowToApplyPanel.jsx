import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function HowToApplyPanel({ scheme, onClose }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || 'en';

  if (!scheme) return null;

  const localizedName = scheme.translations?.[currentLang]?.name || scheme.name;
  const localizedBenefit = scheme.translations?.[currentLang]?.benefit || scheme.benefit;
  const localizedHowTo = scheme.translations?.[currentLang]?.offlineGuidance?.whereTo || scheme.offlineGuidance?.whereTo;
  const localizedWhatToSay = scheme.translations?.[currentLang]?.offlineGuidance?.whatToSay || scheme.offlineGuidance?.whatToSay;
  const localizedWhatToBring = scheme.translations?.[currentLang]?.offlineGuidance?.whatToBring || scheme.offlineGuidance?.whatToBring;

  return (
    <AnimatePresence>
      {scheme && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-[var(--border)] max-h-[85vh] overflow-y-auto flex flex-col how-to-apply-panel max-w-2xl mx-auto"
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-[var(--border)] px-8 py-6 flex justify-between items-center z-10 rounded-t-3xl">
              <h2 className="text-xl font-bold text-[var(--navy)] font-heading" style={{ fontFamily: 'var(--font-family-heading)' }}>{t('panel.appDetails')}</h2>
              <button
                onClick={onClose}
                className="p-3 rounded-full bg-[var(--off-white)] hover:bg-[var(--border)] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-[var(--navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 md:p-10 space-y-10">
              <div>
                <h3 className="text-3xl font-bold font-heading text-[var(--navy)] mb-4" style={{ fontFamily: 'var(--font-family-heading)' }}>
                  {localizedName}
                </h3>
                <p className="text-lg text-[var(--navy-mid)] leading-relaxed">{localizedBenefit}</p>
              </div>

              <div>
                <h4 className="font-bold text-[var(--navy)] mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[var(--saffron)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  {t('panel.reqDocs')}
                </h4>
                {scheme.documents && scheme.documents.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--muted)]">
                    {scheme.documents.map((doc, idx) => (
                      <li key={idx} className="pl-1">{doc}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--muted)]">{t('panel.noDocs')}</p>
                )}
              </div>

              {scheme.linkType === 'URL' && scheme.link ? (
                <div>
                  <h4 className="font-bold text-[var(--navy)] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--saffron)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    {t('panel.howToApply')}
                  </h4>
                  <p className="text-sm text-[var(--muted)] mb-4">
                    {t('panel.onlineText')}
                  </p>
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center py-3.5 rounded-xl font-bold text-white transition-opacity hover:opacity-90 shadow-lg"
                    style={{ backgroundColor: 'var(--green)' }}
                  >
                    {t('panel.onlineBtn')}
                  </a>
                </div>
              ) : scheme.offlineGuidance ? (
                <div className="bg-[var(--off-white)] p-6 md:p-8 rounded-2xl border border-[var(--border)]">
                  <h4 className="text-lg font-bold text-[var(--navy)] mb-5 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[var(--saffron)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    {t('panel.offlineTitle')}
                  </h4>
                  <div className="space-y-5 text-base">
                    {localizedHowTo && (
                      <p><span className="font-bold text-[var(--navy-mid)] block mb-1">{t('panel.whereTo')}:</span> {localizedHowTo}</p>
                    )}
                    {localizedWhatToSay && (
                      <p><span className="font-bold text-[var(--navy-mid)] block mb-1">{t('panel.whatToSay')}:</span> {localizedWhatToSay}</p>
                    )}
                    {scheme.offlineGuidance.helpline && (
                      <p><span className="font-bold text-[var(--navy-mid)] block mb-1">{t('panel.helpline')}:</span> {scheme.offlineGuidance.helpline}</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            
            <div className="p-4 mt-auto">
                <button
                onClick={onClose}
                className="w-full text-center py-3 rounded-xl font-bold text-[var(--navy)] transition-colors border-2 border-[var(--border)] hover:bg-[var(--off-white)] cursor-pointer"
                >
                {t('panel.close')}
                </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
