
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Language } from '@/types';
import { useToast } from './use-toast';

// Splits text into chunks. A simple split by sentence is often good,
// but for very long texts, we might need a character limit.
// This implementation splits by sentences for natural pauses.
const splitIntoChunks = (text: string): string[] => {
  if (!text) return [];
  // Split by sentence-ending punctuation. The regex keeps the delimiters.
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  return sentences.map(s => s.trim()).filter(s => s.length > 0);
};

export function useTts() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sentencesQueueRef = useRef<string[]>([]);
  const currentLangRef = useRef<Language>('en');
  const isStoppingRef = useRef(false);

  const stop = useCallback(() => {
    isStoppingRef.current = true;
    sentencesQueueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; // Clear the audio source
    }
    setIsSpeaking(false);
  }, []);

  const playNextSentence = useCallback(async () => {
    if (isStoppingRef.current) {
        setIsSpeaking(false);
        isStoppingRef.current = false;
        return;
    }
    if (sentencesQueueRef.current.length === 0) {
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const sentence = sentencesQueueRef.current.shift();
    if (!sentence) {
      setIsSpeaking(false);
      return;
    }

    try {
      // Always call our internal API route
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sentence, lang: currentLangRef.current }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'TTS service failed');
      }

      const { audioDataUrl } = await response.json();

      if (isStoppingRef.current) {
          setIsSpeaking(false);
          isStoppingRef.current = false;
          return;
      };

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = playNextSentence;
        audioRef.current.onerror = () => {
            console.error('Audio playback error');
            toast({
                variant: 'destructive',
                title: 'Playback Error',
                description: 'Could not play the generated audio.',
            });
            playNextSentence(); // Try next sentence
        }
      }

      audioRef.current.src = audioDataUrl;
      await audioRef.current.play();

    } catch (error: any) {
      console.error('TTS generation failed for sentence:', sentence, error);
       toast({
        variant: 'destructive',
        title: 'TTS Error',
        description: error.message || 'Could not generate audio for the selected text.',
      });
      // Try to play the next sentence even if one fails
      playNextSentence();
    }
  }, [toast]);
  
  const speak = useCallback((text: string, lang: Language) => {
      if (isSpeaking) {
        stop();
        return;
      }

      isStoppingRef.current = false;
      currentLangRef.current = lang;
      
      const chunks = splitIntoChunks(text);
      sentencesQueueRef.current = chunks;

      if (sentencesQueueRef.current.length > 0) {
        playNextSentence();
      }
    }, [isSpeaking, playNextSentence, stop]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { speak, stop, isSpeaking };
}
