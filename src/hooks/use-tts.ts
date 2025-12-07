'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Language } from '@/types';

interface TTSResult {
  url: string;
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

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      
      const handleEnded = () => {
        // Play next track if available
        if (currentTrackIndexRef.current < playlistRef.current.length - 1) {
          currentTrackIndexRef.current++;
          if (audioRef.current) {
            audioRef.current.src = playlistRef.current[currentTrackIndexRef.current];
            audioRef.current.play().catch(e => console.error("Playback error", e));
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
    
    stop(); // Stop any current playback
    setIsSpeaking(true);
    toast({ title: UI_TEXT.loading });

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio');
      }

      const data = await response.json();
      const results: TTSResult[] = data.results;

      if (results && results.length > 0) {
        playlistRef.current = results.map(r => r.url);
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
              toast({ variant: 'destructive', title: UI_TEXT.error });
            });
        }
      } else {
        throw new Error('No audio URLs returned');
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
      toast({ variant: 'destructive', title: UI_TEXT.error });
    }
  }, [stop, toast]);

  return { speak, stop, isSpeaking };
}
