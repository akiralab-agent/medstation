import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { BR, ES, US } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSelector.module.css';

interface LanguageOption {
  code: 'en' | 'pt-BR' | 'es';
  Flag: typeof US;
  label: string;
}

const languages: LanguageOption[] = [
  { code: 'en', Flag: US, label: 'English' },
  { code: 'pt-BR', Flag: BR, label: 'Portugu\u00EAs' },
  { code: 'es', Flag: ES, label: 'Espa\u00F1ol' },
];

const getCurrentLanguage = (language?: string) => {
  if (!language) {
    return 'en';
  }

  if (language.toLowerCase().startsWith('pt')) {
    return 'pt-BR';
  }

  if (language.toLowerCase().startsWith('es')) {
    return 'es';
  }

  return 'en';
};

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentLanguage = getCurrentLanguage(i18n.resolvedLanguage ?? i18n.language);
  const selectedLanguage = languages.find((language) => language.code === currentLanguage) ?? languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (code: LanguageOption['code']) => {
    void i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t('common.language')}
        aria-expanded={isOpen}
      >
        <selectedLanguage.Flag className={styles.flagIcon} />
      </button>

      <div className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
        {languages.map((language) => (
          <button
            key={language.code}
            className={`${styles.option} ${currentLanguage === language.code ? styles.active : ''}`}
            onClick={() => handleLanguageChange(language.code)}
          >
            <language.Flag className={styles.optionFlagIcon} />
            <span className={styles.optionLabel}>{language.label}</span>
            {currentLanguage === language.code && <Check size={16} />}
          </button>
        ))}
      </div>
    </div>
  );
}
