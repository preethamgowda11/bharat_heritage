export type Language = 'en' | 'hi' | 'kn' | 'or';

export interface Site {
  id: string;
  title: Record<Language, string>;
  shortDescription: Record<Language, string>;
  longDescription: Record<Language, string>;
  thumbnailUrlId: string;
  coverImageUrlId: string;
  lowPolyModelUrl: string;
  highPolyModelUrl: string;
  fallback360UrlId: string;
  artifacts: Artifact[];
  arLink?: string;
}

export interface Artifact {
  id: string;
  siteId: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  imageUrlId: string;
  modelFileUrl: string;
  fallbackImageUrlId: string;
  arLink?: string;
}

export interface UserPreferences {
  isLowBandwidth: boolean;
  isAudioOn: boolean;
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  language: Language;
  isBionicReading?: boolean;
  isDyslexiaFont?: boolean;
}
