
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { useTranslation } from '@/hooks/use-translation';

interface AccessibilityPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccessibilityPanel({ open, onOpenChange }: AccessibilityPanelProps) {
  const {
    isAudioOn,
    setIsAudioOn,
    fontSize,
    setFontSize,
    theme,
    setTheme,
    isBionicReading,
    setIsBionicReading,
    isDyslexiaFont,
    setIsDyslexiaFont,
    resetAccessibility,
  } = useUserPreferences();
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('accessibility')}</SheetTitle>
          <SheetDescription>
            {t('customize_experience')}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="audio-narration" className="text-base">
              {t('audio_narration')}
            </Label>
            <Switch
              id="audio-narration"
              checked={isAudioOn}
              onCheckedChange={setIsAudioOn}
            />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="bionic-reading" className="text-base">
              {t('bionic_reading')}
            </Label>
            <Switch
              id="bionic-reading"
              checked={isBionicReading}
              onCheckedChange={setIsBionicReading}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="dyslexia-font" className="text-base">
              {t('dyslexia_font')}
            </Label>
            <Switch
              id="dyslexia-font"
              checked={isDyslexiaFont}
              onCheckedChange={setIsDyslexiaFont}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="font-size" className="text-base">
              {t('font_size')}: {Math.round((fontSize / 16) * 100)}%
            </Label>
            <Slider
              id="font-size"
              min={14}
              max={28}
              step={1}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle" className="text-base">
              {t('high_contrast')}
            </Label>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            />
          </div>
        </div>
        <SheetFooter className="mt-auto">
            <Button variant="outline" onClick={resetAccessibility}>
              {t('reset')}
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
