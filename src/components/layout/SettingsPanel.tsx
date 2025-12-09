
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { useTranslation } from '@/hooks/use-translation';
import type { Language } from '@/types';


interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const { isLowBandwidth, setIsLowBandwidth, language, setLanguage, theme, setTheme } = useUserPreferences();
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('settings')}</SheetTitle>
          <SheetDescription>
            {t('adjust_preferences')}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="low-bandwidth-mode" className="text-base">
              {t('low_bandwidth_mode')}
            </Label>
            <Switch
              id="low-bandwidth-mode"
              checked={isLowBandwidth}
              onCheckedChange={setIsLowBandwidth}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language" className="text-base">
              {t('language')}
            </Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder={t('select_language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="hi">{t('hindi')}</SelectItem>
                <SelectItem value="kn">{t('kannada')}</SelectItem>
                <SelectItem value="or">{t('odia')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-base">
              {t('theme')}
            </Label>
            <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
              <SelectTrigger id="theme" className="w-full">
                <SelectValue placeholder={t('select_theme')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
