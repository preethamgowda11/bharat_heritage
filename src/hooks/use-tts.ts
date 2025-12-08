'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Language } from '@/types';

export function useTts() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);
  
  useEffect(() => {
    const handleEnd = () => {
      setIsSpeaking(false);
    };

    if (utteranceRef.current) {
        utteranceRef.current.addEventListener('end', handleEnd);
    }
    
    // Cleanup when component unmounts
    return () => {
      if (utteranceRef.current) {
        utteranceRef.current.removeEventListener('end', handleEnd);
      }
      stop();
    };
  }, [stop]);

  const speak = useCallback((text: string, lang: Language) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('Speech Synthesis not supported');
      return;
    }

    if (isSpeaking) {
      stop();
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utteranceRef.current = utterance;

    // The 'end' event is now handled by the useEffect
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, stop]);

  return { speak, stop, isSpeaking };
}
