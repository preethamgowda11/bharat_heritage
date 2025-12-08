'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from './use-toast';

interface SpeechToTextOptions {
  onTranscript: (transcript: string) => void;
  language: string;
}

export function useSpeechToText({ onTranscript, language }: SpeechToTextOptions) {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Speech Recognition Not Supported',
        description: 'Your browser does not support speech-to-text.',
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        variant: 'destructive',
        title: 'Speech Recognition Error',
        description: event.error === 'not-allowed' ? 'Permission denied. Please allow microphone access.' : 'An error occurred during speech recognition.',
      });
    };
  }, [language, onTranscript, toast]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  return {
    isListening,
    toggleListening,
  };
}
