'use client';

import { CloudOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUserPreferences } from '@/context/UserPreferencesContext';

export function LowBandwidthIndicator() {
  const { isLowBandwidth } = useUserPreferences();

  if (!isLowBandwidth) {
    return null;
  }

  return (
    <div className='fixed top-20 left-1/2 transform -translate-x-1/2 z-50'>
      <Badge variant="destructive" className='shadow-lg text-sm'>
        <CloudOff className='h-4 w-4 mr-2' />
        Low Bandwidth Mode Active
      </Badge>
    </div>
  );
}
