import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Language = 'sr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  isEnglish: boolean;
  text: (sr: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function getDefaultLanguage(): Language {
  const stored = localStorage.getItem('capanna-language');
  return stored === 'en' ? 'en' : 'sr';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getDefaultLanguage);

  useEffect(() => {
    localStorage.setItem('capanna-language', language);
    document.documentElement.lang = language === 'en' ? 'en' : 'sr';
  }, [language]);

  const setLanguage = (nextLanguage: Language) => setLanguageState(nextLanguage);
  const toggleLanguage = () => setLanguageState(current => current === 'sr' ? 'en' : 'sr');
  const text = (sr: string, en: string) => language === 'en' ? en : sr;

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      isEnglish: language === 'en',
      text,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
