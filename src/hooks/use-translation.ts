import { useUserPreferences } from '@/context/UserPreferencesContext';
import { t as translateFunction } from '@/lib/i18n';

export function useTranslation() {
  const { language } = useUserPreferences();

  const t = (key: string) => {
    return translateFunction(key, language);
  };

  return { t, language };
}
