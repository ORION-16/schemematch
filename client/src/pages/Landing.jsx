import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-20 bg-[var(--off-white)] flex flex-col items-center justify-center p-8 md:p-12 text-center overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-15" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 40%, var(--saffron) 0%, transparent 70%)' }} />
      
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl z-10"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--navy)] mb-8 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-family-heading)' }}>
          {t('landing.title1')}<span className="text-[var(--saffron)]">{t('landing.title2')}</span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--muted)] mb-12 max-w-3xl mx-auto leading-relaxed">
          {t('landing.subtitle')}
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/quiz')}
          className="bg-[var(--saffron)] text-white font-bold py-5 px-12 rounded-full text-2xl shadow-2xl transition-all hover:shadow-[var(--saffron-light)] cursor-pointer border-4 border-white"
          style={{ fontFamily: 'var(--font-family-heading)' }}
        >
          {t('landing.cta')}
        </motion.button>
        
        <div className="mt-16 flex items-center justify-center gap-10 md:gap-16 text-base md:text-lg text-[var(--muted)] font-medium">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[var(--navy)]">200+</span>
            {t('landing.stats_schemes')}
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[var(--navy)]">All</span>
            {t('landing.stats_categories')}
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[var(--navy)]">2 Min</span>
            {t('landing.stats_time')}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
