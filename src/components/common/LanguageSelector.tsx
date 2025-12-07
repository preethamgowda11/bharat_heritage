'use client';

import { useUserPreferences } from '@/context/UserPreferencesContext';
import type { Language } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { t as translate } from '@/lib/i18n';

interface LanguageSelectorProps {
  onSelect: () => void;
  onSkip: () => void;
}

const languageOptions: { code: Language; label: Record<Language, string> }[] = [
    { code: 'kn', label: { en: "Kannada", hi: "कन्नड़", kn: "ಕನ್ನಡ", or: "କନ୍ନଡ଼" } },
    { code: 'hi', label: { en: "Hindi", hi: "हिन्दी", kn: "ಹಿಂದಿ", or: "ହିନ୍ଦୀ" } },
    { code: 'en', label: { en: "English", hi: "English", kn: "ಇಂಗ್ಲಿಷ್", or: "ଇଙ୍ଗ୍ଲିଶ୍" } },
    { code: 'or', label: { en: "Odia", hi: "ओड़िया", kn: "ಒಡಿಯಾ", or: "ଓଡ଼ିଆ" } },
];


export function LanguageSelector({ onSelect, onSkip }: LanguageSelectorProps) {
  const { language, setLanguage, setIsAudioOn } = useUserPreferences();

  const handleSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsAudioOn(true); // As per JSON spec `enableTTSForLocale`
    onSelect();
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <DialogTitle className="font-headline text-2xl">
            {translate('choose_language_title', language)}
          </DialogTitle>
          <DialogDescription>
            {translate('choose_language_subtitle', language)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {languageOptions.map((opt) => (
            <Button
              key={opt.code}
              onClick={() => handleSelect(opt.code)}
              size="lg"
              className="w-full"
              style={{ 
                // Custom styling from JSON spec. Using style prop to avoid complex theme changes.
                backgroundColor: '#b7410e', 
                color: '#ffffff',
              }}
            >
              {opt.label[language] || opt.label.en}
            </Button>
          ))}
        </div>
        <DialogFooter className="sm:justify-center">
            <Button variant="link" onClick={onSkip}>
              {translate('skip_use_english', language)}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
