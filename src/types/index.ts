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
  lat?: number;
  lon?: number;
}

export interface Artifact {
  id: string;
  siteId: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  imageUrlId: string;
  modelFileUrl: string;
  lowPolyModelUrl?: string;
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

export interface LostSite {
    id: string;
    title: Record<Language, string>;
    category: 'endangered' | 'exaggerated_mythology' | 'forgotten_heritage' | 'hidden_heritage';
    threat_level: 'red' | 'yellow' | 'green';
    description: Record<Language, string>;
    issues?: Record<Language, string>;
    myth_vs_fact?: {
        myth: Record<Language, string>;
        fact: Record<Language, string>;
    };
    tts_text: Record<Language, string>;
    image: string;
}
