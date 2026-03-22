import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-5 md:px-8 shadow-sm"
      style={{
        height: '64px',
        background: 'var(--navy)',
      }}
    >
      <Link to="/" className="flex items-center gap-0 no-underline">
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '1.4rem',
            color: 'var(--white)',
          }}
        >
          Scheme
        </span>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '1.4rem',
            color: 'var(--saffron)',
          }}
        >
          Match
        </span>
      </Link>
      
      <div className="flex h-full items-center gap-4 sm:gap-8">
        <span
          className="hidden md:flex h-full items-center"
          style={{
            color: 'var(--muted)',
            fontSize: '0.8rem',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {t('nav.tagline')}
        </span>
        <div className="flex items-center gap-3 h-full">
          <label htmlFor="language-select" className="hidden lg:flex items-center text-[var(--white)] text-xs font-bold uppercase tracking-wider opacity-60">
            {t('nav.changeLanguage')}:
          </label>
          <select 
            id="language-select"
            onChange={changeLanguage} 
            value={i18n.resolvedLanguage || 'en'}
            className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] transition text-[var(--white)] text-sm font-bold py-1.5 px-4 rounded-xl outline-none cursor-pointer border border-transparent focus:border-[var(--saffron)] appearance-none"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23ffffff\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '16px',
              paddingRight: '32px'
            }}
          >
            <option value="en" className="text-black">English</option>
            <option value="hi" className="text-black">हिंदी (Hindi)</option>
            <option value="mr" className="text-black">मराठी (Marathi)</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
