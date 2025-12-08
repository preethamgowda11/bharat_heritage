'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Language } from '@/types';
import * as googleTTS from 'google-tts-api';

interface TTSResult {
  base64: string;
  shortText: string;
}

const UI_TEXT = {
  loading: 'Loading audio...',
  speaking: 'Playing audio...',
  error: 'Unable to play audio.',
  noText: 'No description available.',
};

export function useTts() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<string[]>([]);
  const currentTrackIndexRef = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      
      const handleEnded = () => {
        if (currentTrackIndexRef.current < playlistRef.current.length - 1) {
          currentTrackIndexRef.current++;
          if (audioRef.current) {
            audioRef.current.src = playlistRef.current[currentTrackIndexRef.current];
            audioRef.current.play().catch(e => {
              console.error("Playback error", e);
              setIsSpeaking(false);
              toast({ variant: 'destructive', title: UI_TEXT.error, description: "Could not play the next audio segment." });
            });
          }
        } else {
          setIsSpeaking(false);
        }
      };

      const handleError = (e: Event) => {
        console.error("Audio error", e);
        setIsSpeaking(false);
        toast({ variant: 'destructive', title: UI_TEXT.error });
      };

      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [toast]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    playlistRef.current = [];
    currentTrackIndexRef.current = 0;
  }, []);

  const speak = useCallback(async (text: string, lang: Language) => {
    if (!text) {
      toast({ variant: 'destructive', title: UI_TEXT.noText });
      return;
    }
    
    stop();
    setIsSpeaking(true);
    toast({ title: UI_TEXT.loading });

    try {
      const results: TTSResult[] = await googleTTS.getAllAudioBase64(text, {
        lang: lang,
        slow: false,
      });

      if (results && results.length > 0) {
        playlistRef.current = results.map(r => `data:audio/mp3;base64,${r.base64}`);
        currentTrackIndexRef.current = 0;
        
        if (audioRef.current) {
          audioRef.current.src = playlistRef.current[0];
          audioRef.current.play()
            .then(() => {
              toast({ title: UI_TEXT.speaking });
            })
            .catch(e => {
              console.error("Playback start error", e);
              setIsSpeaking(false);
              toast({ variant: 'destructive', title: UI_TEXT.error, description: "Could not start audio playback." });
            });
        }
      } else {
        throw new Error('No audio data returned from TTS service');
      }
    } catch (error: any) {
      console.error('TTS Client-side Error:', error);
      setIsSpeaking(false);
      toast({ variant: 'destructive', title: 'TTS Generation Failed', description: error.message || 'Please try again later.' });
    }
  }, [stop, toast]);

  return { speak, stop, isSpeaking };
}
