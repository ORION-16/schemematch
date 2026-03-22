import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import { useTranslation } from 'react-i18next';
import ProgressBar from '../components/ProgressBar';
import QuizStep from '../components/QuizStep';
import OptionButton from '../components/OptionButton';
import RangeSlider from '../components/RangeSlider';
import YesNoToggle from '../components/YesNoToggle';

export default function Quiz() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile(); // Changed setProfile to updateProfile as per diff
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else navigate('/loading');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  // Removed local updateProfile function as it's now expected from useProfile()

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[var(--off-white)] px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-12">
        <div className="flex justify-between text-base font-bold text-[var(--muted)] mb-3">
          <span>{t('quiz.step', { step, total: totalSteps })}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <ProgressBar percent={(step / totalSteps) * 100} />
      </div>

      <div className="w-full max-w-3xl relative min-h-[440px]">
        {step === 1 && (
          <QuizStep key="step1">
            <h2 className="text-2xl font-bold text-[var(--navy)] mb-6 text-center font-heading" style={{ fontFamily: 'var(--font-family-heading)' }}>{t('quiz.basicInfo')}</h2>
            
            <div className="mb-10">
              <label className="block text-[var(--navy-mid)] font-semibold mb-4 text-lg">{t('quiz.genderTitle')}</label>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {['Male', 'Female', 'Other'].map(g => (
                  <OptionButton
                    key={g}
                    label={t(`quiz.genderOptions.${g}`)}
                    selected={profile.gender === g}
                    onClick={() => updateProfile('gender', g)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-[var(--navy-mid)] font-semibold text-lg">{t('quiz.ageTitle')}</label>
                <span className="text-xl font-bold text-[var(--navy)] bg-white px-4 py-2 rounded-xl shadow-sm border border-[var(--border)]">{t('quiz.ageText', { age: profile.age })}</span>
              </div>
              <RangeSlider
                min={18}
                max={100}
                value={profile.age}
                onChange={(v) => updateProfile('age', v)}
              />
            </div>
          </QuizStep>
        )}

        {step === 2 && (
          <QuizStep key="step2">
            <h2 className="text-2xl font-bold text-[var(--navy)] mb-6 text-center font-heading" style={{ fontFamily: 'var(--font-family-heading)' }}>{t('quiz.socioInfo')}</h2>
            
            <div className="mb-10">
              <label className="block text-[var(--navy-mid)] font-semibold mb-4 text-lg">{t('quiz.categoryTitle')}</label>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {['General', 'OBC', 'SC', 'ST'].map(c => (
                  <OptionButton
                    key={c}
                    label={c} // Label for category is not translated in the diff, keeping as is
                    selected={profile.category === c}
                    onClick={() => updateProfile('category', c)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-[var(--navy-mid)] font-semibold text-lg">{t('quiz.incomeTitle')}</label>
                <span className="text-xl font-bold text-[var(--navy)] bg-white px-4 py-2 rounded-xl shadow-sm border border-[var(--border)]">
                  {t('quiz.incomeText', { income: (profile.income / 100000).toFixed(1) })}
                </span>
              </div>
              <RangeSlider
                min={0}
                max={20}
                step={0.1}
                value={profile.income / 100000}
                onChange={(v) => updateProfile('income', Math.round(v * 100000))}
              />
            </div>
          </QuizStep>
        )}

        {step === 3 && (
          <QuizStep key="step3">
            <h2 className="text-2xl font-bold text-[var(--navy)] mb-6 text-center font-heading" style={{ fontFamily: 'var(--font-family-heading)' }}>{t('quiz.occInfo')}</h2>
            
            <div className="mb-10">
              <label className="block text-[var(--navy-mid)] font-semibold mb-4 text-lg">{t('quiz.occTitle')}</label>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                {['Student', 'Farmer', 'Unemployed', 'Employed', 'Business', 'Homemaker'].map(occ => (
                  <OptionButton
                    key={occ}
                    label={t(`quiz.occOptions.${occ}`)}
                    selected={profile.occupation === occ}
                    onClick={() => updateProfile('occupation', occ)}
                  />
                ))}
              </div>
            </div>
          </QuizStep>
        )}

        {step === 4 && (
          <QuizStep key="step4">
            <h2 className="text-3xl font-bold text-[var(--navy)] mb-8 text-center font-heading" style={{ fontFamily: 'var(--font-family-heading)' }}>{t('quiz.addInfo')}</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[var(--off-white)] p-4 rounded-xl border border-[var(--border)]">
                <span className="font-semibold text-[var(--navy)] text-sm md:text-base">{t('quiz.bplTitle')}</span>
                <YesNoToggle value={profile.hasBPL} onChange={(v) => updateProfile('hasBPL', v)} />
              </div>
              
              <div className="flex justify-between items-center bg-[var(--off-white)] p-4 rounded-xl border border-[var(--border)]">
                <span className="font-semibold text-[var(--navy)] text-sm md:text-base">{t('quiz.disabledTitle')}</span>
                <YesNoToggle value={profile.isDisabled} onChange={(v) => updateProfile('isDisabled', v)} />
              </div>

              <div className="flex justify-between items-center bg-[var(--off-white)] p-4 rounded-xl border border-[var(--border)]">
                <span className="font-semibold text-[var(--navy)] text-sm md:text-base">{t('quiz.minorityTitle')}</span>
                <YesNoToggle value={profile.isMinority} onChange={(v) => updateProfile('isMinority', v)} />
              </div>

              {profile.gender === 'Female' && (
                <div className="flex justify-between items-center bg-[var(--off-white)] p-4 rounded-xl border border-[var(--border)]">
                  <span className="font-semibold text-[var(--navy)] text-sm md:text-base">{t('quiz.isPregnantTitle')}</span>
                  <YesNoToggle value={profile.isPregnant} onChange={(v) => updateProfile('isPregnant', v)} />
                </div>
              )}
            </div>
          </QuizStep>
        )}

        <div className="mt-12 flex justify-between w-full">
          <button
            onClick={handleBack}
            className="px-8 py-4 text-lg font-bold text-[var(--muted)] hover:text-[var(--navy)] transition-colors cursor-pointer"
          >
            {t('quiz.back')}
          </button>
          <button
            onClick={handleNext}
            className="px-10 py-4 text-lg bg-[var(--navy)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--navy-mid)] hover:-translate-y-1 transition-all cursor-pointer"
          >
            {step === totalSteps ? t('quiz.find') : t('quiz.continue')}
          </button>
        </div>
      </div>
    </div>
  );
}
