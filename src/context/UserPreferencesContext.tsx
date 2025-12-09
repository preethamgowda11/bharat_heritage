
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserPreferences, Language } from '@/types';
import { cn } from '@/lib/utils';


interface UserPreferencesContextType extends UserPreferences {
  setIsLowBandwidth: (value: boolean) => void;
  setIsAudioOn: (value: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFontSize: (size: number) => void;
  setLanguage: (language: Language) => void;
  setIsBionicReading: (value: boolean) => void;
  setIsDyslexiaFont: (value: boolean) => void;
  resetAccessibility: () => void;
}

const defaultPreferences: UserPreferences = {
  isLowBandwidth: false,
  isAudioOn: false,
  theme: 'system',
  fontSize: 16,
  language: 'en',
  isBionicReading: false,
  isDyslexiaFont: false,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);

  const applyPreferences = (p: UserPreferences) => {
    applyTheme(p.theme);
    applyFontSize(p.fontSize);
    applyDyslexiaFont(p.isDyslexiaFont);
  };
  
  useEffect(() => {
    try {
      const storedPrefs = localStorage.getItem('userPreferences');
      if (storedPrefs) {
        const parsedPrefs = { ...defaultPreferences, ...JSON.parse(storedPrefs) };
        setPrefs(parsedPrefs);
        applyPreferences(parsedPrefs);
      } else {
        applyPreferences(defaultPreferences);
      }
    } catch (error) {
      console.error("Failed to parse user preferences from localStorage", error);
      applyPreferences(defaultPreferences);
    }
    setIsInitialized(true);
  }, []);

  const savePreferences = (updatedPrefs: UserPreferences) => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
    } catch (error) {
      console.error("Failed to save user preferences to localStorage", error);
    }
    applyPreferences(updatedPrefs);
    setPrefs(updatedPrefs);
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      let effectiveTheme = theme;
      if (theme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      root.classList.add(effectiveTheme);
  };

  const applyFontSize = (size: number) => {
    window.document.documentElement.style.fontSize = `${size}px`;
  };

  const applyDyslexiaFont = (isDyslexiaFont?: boolean) => {
    document.body.classList.toggle('dyslexia-font', !!isDyslexiaFont);
  }

  const setTheme = (theme: 'light' | 'dark' | 'system') => savePreferences({ ...prefs, theme });
  const setFontSize = (size: number) => savePreferences({ ...prefs, fontSize: size });
  const setLanguage = (language: Language) => savePreferences({ ...prefs, language });
  const setIsLowBandwidth = (value: boolean) => savePreferences({ ...prefs, isLowBandwidth: value });
  const setIsAudioOn = (value: boolean) => savePreferences({ ...prefs, isAudioOn: value });
  const setIsBionicReading = (value: boolean) => savePreferences({ ...prefs, isBionicReading: value });
  const setIsDyslexiaFont = (value: boolean) => savePreferences({ ...prefs, isDyslexiaFont: value });

  const resetAccessibility = () => {
    const newPrefs = {
      ...prefs,
      isAudioOn: defaultPreferences.isAudioOn,
      theme: 'light', // Reset to light theme instead of system
      fontSize: defaultPreferences.fontSize,
      isBionicReading: defaultPreferences.isBionicReading,
      isDyslexiaFont: defaultPreferences.isDyslexiaFont,
    };
    savePreferences(newPrefs);
  };

  useEffect(() => {
    if(isInitialized) {
      document.body.className = cn(
        'min-h-screen bg-background font-body antialiased',
         prefs.isDyslexiaFont && 'dyslexia-font'
      );
    }
  }, [isInitialized, prefs.isDyslexiaFont]);


  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <UserPreferencesContext.Provider
      value={{
        ...prefs,
        setTheme,
        setFontSize,
        setLanguage,
        setIsLowBandwidth,
        setIsAudioOn,
        setIsBionicReading,
        setIsDyslexiaFont,
        resetAccessibility,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
