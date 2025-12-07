'use client';

import { useUserPreferences } from '@/context/UserPreferencesContext';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ModelViewerProps {
  src: string;
  iosSrc?: string;
  alt: string;
  posterId?: string;
  ar?: boolean;
}

export function ModelViewer({ src, iosSrc, alt, posterId, ar = false }: ModelViewerProps) {
  const { theme, isReduceMotion } = useUserPreferences();
  const posterImage = posterId ? PlaceHolderImages.find(p => p.id === posterId)?.imageUrl : undefined;

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border bg-gray-200 dark:bg-gray-800">
      <model-viewer
        id="model-viewer-instance"
        src={src}
        ios-src={iosSrc}
        alt={alt}
        ar={ar}
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate={!isReduceMotion}
        poster={posterImage}
        shadow-intensity="1"
        environment-image={theme === 'dark' ? 'neutral' : 'legacy'}
        style={{ width: '100%', height: '100%' }}
      ></model-viewer>
    </div>
  );
}
