'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Language } from '@/types';
import * as googleTTS from 'google-tts-api';

const MAX_CHUNK_LENGTH = 200; // Max characters per TTS chunk

// Splits text into sentences without removing delimiters.
const splitSentences = (text: string): string[] => {
  if (!text) return [];
  // Split by periods, exclamation marks, and question marks, keeping the delimiter
  return text.match(/[^.!?]+[.!?]*/g) || [text];
};

export function useTts() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sentencesQueueRef = useRef<string[]>([]);
  const currentLangRef = useRef<Language>('en');
  const isStoppingRef = useRef(false);

  const playNextSentence = useCallback(async () => {
    if (sentencesQueueRef.current.length === 0) {
      setIsSpeaking(false);
      return;
    }

    const sentence = sentencesQueueRef.current.shift();
    if (!sentence || isStoppingRef.current) {
      setIsSpeaking(false);
      return;
    }

    try {
      const base64Audio = await googleTTS.getAudioBase64(sentence, {
        lang: currentLangRef.current,
        slow: false,
      });

      if (isStoppingRef.current) return;

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = playNextSentence;
      }
      
      audioRef.current.src = `data:audio/mp3;base64,${base64Audio}`;
      await audioRef.current.play();
      setIsSpeaking(true);

    } catch (error) {
      console.error('TTS generation failed for sentence:', sentence, error);
      // Try to play the next sentence even if one fails
      playNextSentence();
    }
  }, []);

  const speak = useCallback((text: string, lang: Language) => {
      if (isSpeaking) {
        stop();
        return;
      }

      isStoppingRef.current = false;
      currentLangRef.current = lang;

      const rawSentences = splitSentences(text);
      const processedChunks: string[] = [];

      rawSentences.forEach(sentence => {
          if (sentence.length > MAX_CHUNK_LENGTH) {
              // Further split long sentences into smaller chunks
              for (let i = 0; i < sentence.length; i += MAX_CHUNK_LENGTH) {
                  processedChunks.push(sentence.substring(i, i + MAX_CHUNK_LENGTH));
              }
          } else {
              processedChunks.push(sentence);
          }
      });
      
      sentencesQueueRef.current = processedChunks;
      playNextSentence();
    }, [isSpeaking, playNextSentence]);

  const stop = useCallback(() => {
    isStoppingRef.current = true;
    sentencesQueueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; // Clear the audio source
    }
    setIsSpeaking(false);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { speak, stop, isSpeaking };
}
