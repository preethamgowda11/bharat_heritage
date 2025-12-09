
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Language } from '@/types';
import querystring from 'querystring';

const MAX_CHUNK_LENGTH = 200; // Max characters per TTS chunk

// Splits text into sentences without removing delimiters.
const splitSentences = (text: string): string[] => {
  if (!text) return [];
  // Split by periods, exclamation marks, and question marks, keeping the delimiter
  return text.match(/[^.!?]+[.!?]*/g) || [text];
};

// Fetches audio from Google's unofficial TTS endpoint
async function getGoogleTtsAudio(text: string, lang: Language): Promise<string> {
    const query = {
        ie: 'UTF-8',
        q: text,
        tl: lang,
        total: 1,
        idx: 0,
        textlen: text.length,
        client: 'tw-ob',
    };
    
    const url = `https://translate.google.com/translate_tts?${querystring.stringify(query)}`;

    const response = await fetch(url, {
        headers: {
            'Referer': 'http://translate.google.com/',
            'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)',
        }
    });

    if (!response.ok) {
        throw new Error(`Google TTS request failed with status ${response.status}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.toString('base64');
}

// Fetches audio from the Anuvadini AI endpoint
async function getAnuvadiniTtsAudio(text: string): Promise<string> {
    const ANUVADINI_URL = 'https://pre-prod-api.anuvadini.gov.in/v2/master-pipeline';
    const payload = {
        "input": [ { "source": text } ],
        "config": {
            "serviceId": "ai4b-or-tts",
            "language": { "sourceLanguage": "or" }
        }
    };
    
    const response = await fetch(ANUVADINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Anuvadini TTS request failed: ${errorBody}`);
    }

    const result = await response.json();
    const audioContent = result?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;

    if (!audioContent) {
        throw new Error('Anuvadini TTS response did not contain audio content.');
    }
    
    return audioContent; // It's already base64
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
      const base64Audio = lang === 'or' 
        ? await getAnuvadiniTtsAudio(sentence)
        : await getGoogleTtsAudio(sentence, lang);

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
