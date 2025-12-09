
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Language } from '@/types';

const MAX_CHUNK_LENGTH = 200; // Max characters per TTS chunk

// Splits text into sentences without removing delimiters.
const splitSentences = (text: string): string[] => {
  if (!text) return [];
  // Split by periods, exclamation marks, and question marks, keeping the delimiter
  return text.match(/[^.!?]+[.!?]*/g) || [text];
};

async function getAudio(text: string, lang: Language): Promise<string> {
    const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || `TTS proxy request failed with status ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.toString('base64');
}


export function useTts() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sentencesQueueRef = useRef<string[]>([]);
  const currentLangRef = useRef<Language>('en');
  const isStoppingRef = useRef(false);

  const playNextSentence = useCallback(async () => {
    if (isStoppingRef.current) {
        setIsSpeaking(false);
        return;
    }
    if (sentencesQueueRef.current.length === 0) {
      setIsSpeaking(false);
      return;
    }

    const sentence = sentencesQueueRef.current.shift();
    if (!sentence) {
      setIsSpeaking(false);
      return;
    }

    try {
      const lang = currentLangRef.current;
      const base64Audio = await getAudio(sentence, lang);

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

  const stop = useCallback(() => {
    isStoppingRef.current = true;
    sentencesQueueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; // Clear the audio source
    }
    setIsSpeaking(false);
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
              for (let i = 0; i < sentence.length; i += MAX_CHUNK_LENGTH) {
                  processedChunks.push(sentence.substring(i, i + MAX_CHUNK_LENGTH));
              }
          } else {
              processedChunks.push(sentence);
          }
      });
      
      sentencesQueueRef.current = processedChunks;
      playNextSentence();
    }, [isSpeaking, playNextSentence, stop]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { speak, stop, isSpeaking };
}
