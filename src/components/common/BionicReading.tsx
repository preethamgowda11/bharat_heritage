'use client';

import React from 'react';
import { useUserPreferences } from '@/context/UserPreferencesContext';

interface BionicReadingProps {
  text: string;
  as?: React.ElementType;
  className?: string;
}

const bionicChunk = (word: string) => {
  if (word.length <= 1) {
    return <b>{word}</b>;
  }
  const mid = Math.ceil(word.length / 2);
  const boldPart = word.substring(0, mid);
  const normalPart = word.substring(mid);
  return (
    <>
      <b>{boldPart}</b>
      {normalPart}
    </>
  );
};

export function BionicReading({ text, as: Component = 'p', className }: BionicReadingProps) {
  const { isBionicReading } = useUserPreferences();

  if (!isBionicReading) {
    return <Component className={className}>{text}</Component>;
  }

  const words = text.split(/(\s+)/); // Split by spaces, keeping them

  return (
    <Component className={className}>
      {words.map((word, index) =>
        word.trim().length > 0 ? (
          <React.Fragment key={index}>{bionicChunk(word)}</React.Fragment>
        ) : (
          <React.Fragment key={index}>{word}</React.Fragment>
        )
      )}
    </Component>
  );
}
