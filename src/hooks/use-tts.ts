
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Language } from '@/types';

const TTS_CONFIG = {
  autoDetectLanguage: true,
  languages: {
    kn: { code: 'kn-IN', name: 'Kannada', unicodeRange: /[\u0C80-\u0CFF]/ },
    hi: { code: 'hi-IN', name: 'Hindi', unicodeRange: /[\u0900-\u097F]/ },
    en: { code: 'en-US', name: 'English', unicodeRange: /[A-Za-z]/ },
    or: { code: 'or-IN', name: 'Odia', unicodeRange: /[\u0B00-\u0B7F]/ },
  },
  defaults: {
    rate: 1,
    pitch: 1,
    volume: 1,
    fallbackLanguage: 'en-US',
  },
  behavior: {
    stopPreviousSpeech: true,
    trimText: true,
  },
  uiText: {
    loadingVoices: 'Loading voices...',
    speaking: 'Reading description...',
    paused: 'Paused.',
    resumed: 'Resumed.',
    stopped: 'Stopped.',
    noTextFound: 'No description available.',
    noVoice: 'No suitable voice installed for this language.',
    error: 'Unable to read text.',
  },
};

export function useTts() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const populateVoiceList = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const newVoices = window.speechSynthesis.getVoices();
      setVoices(newVoices);
    }
  }, []);

  useEffect(() => {
    populateVoiceList();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  }, [populateVoiceList]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string, lang: Language) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        toast({ variant: 'destructive', title: 'TTS Not Supported', description: 'Your browser does not support text-to-speech.' });
        return;
      }
      
      if (TTS_CONFIG.behavior.stopPreviousSpeech) {
        stop();
      }

      const processedText = TTS_CONFIG.behavior.trimText ? text.trim() : text;
      if (!processedText) {
        toast({ variant: 'destructive', title: TTS_CONFIG.uiText.noTextFound });
        return;
      }

      const utterance = new SpeechSynthesisUtterance(processedText);

      let targetLangCode = TTS_CONFIG.languages[lang].code;
      
      if (TTS_CONFIG.autoDetectLanguage) {
        if (TTS_CONFIG.languages.kn.unicodeRange.test(processedText)) {
            targetLangCode = TTS_CONFIG.languages.kn.code;
        } else if (TTS_CONFIG.languages.hi.unicodeRange.test(processedText)) {
            targetLangCode = TTS_CONFIG.languages.hi.code;
        } else if (TTS_CONFIG.languages.or.unicodeRange.test(processedText)) {
            targetLangCode = TTS_CONFIG.languages.or.code;
        } else {
            targetLangCode = TTS_CONFIG.languages.en.code;
        }
      }

      const voice = voices.find((v) => v.lang === targetLangCode && v.localService) || voices.find((v) => v.lang === targetLangCode);
      
      if (!voice) {
        const fallbackVoice = voices.find(v => v.lang === TTS_CONFIG.defaults.fallbackLanguage);
        if(fallbackVoice) {
            utterance.voice = fallbackVoice;
        } else {
            toast({ variant: 'destructive', title: TTS_CONFIG.uiText.noVoice });
            return;
        }
      } else {
        utterance.voice = voice;
      }
      
      utterance.pitch = TTS_CONFIG.defaults.pitch;
      utterance.rate = TTS_CONFIG.defaults.rate;
      utterance.volume = TTS_CONFIG.defaults.volume;

      utterance.onstart = () => {
        setIsSpeaking(true);
        toast({ title: TTS_CONFIG.uiText.speaking });
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        console.error('SpeechSynthesis Error', event);
        toast({ variant: 'destructive', title: TTS_CONFIG.uiText.error, description: event.error });
      };
      
      window.speechSynthesis.speak(utterance);
    },
    [voices, stop, toast]
  );
  
  return { speak, stop, isSpeaking };
}
