'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ARViewer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelUrl = searchParams.get('model');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera API not supported',
          description: 'Your browser does not support the necessary camera APIs for AR.',
        });
        setHasCameraPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions to use the AR feature.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

  const handleFinishARExperience = () => {
    const modelName = modelUrl || 'unknown_model';
    router.push(`/feedback?model=${encodeURIComponent(modelName)}`);
  };

  if (hasCameraPermission === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <Loader className="h-8 w-8 animate-spin mr-2" />
        Checking for camera permission...
      </div>
    );
  }

  return (
    <>
      <Script src="https://aframe.io/releases/1.5.0/aframe.min.js" />
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -2,
          }}
        />

        {hasCameraPermission && modelUrl && (
          <a-scene embedded vr-mode-ui="enabled: false" style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
            <a-entity gltf-model={modelUrl} position="0 1.2 -2" scale="0.5 0.5 0.5"></a-entity>
            <a-camera gps-new-camera="gpsMinDistance: 5"></a-camera>
          </a-scene>
        )}

        {!hasCameraPermission && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Alert variant="destructive" className="max-w-md">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Camera access was denied or is not available. Please enable camera permissions in your browser settings to use the AR viewer.
              </AlertDescription>
            </Alert>
          </div>
        )}
         {!modelUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Alert variant="destructive" className="max-w-md">
              <AlertTitle>Model Not Found</AlertTitle>
              <AlertDescription>
                The 3D model URL was not provided. Please go back and try again.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Button
          id="finishARBtn"
          onClick={handleFinishARExperience}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-black/75 hover:bg-black/90 text-white text-lg px-6 py-4 rounded-xl"
        >
          Finish AR Experience
        </Button>
      </div>
    </>
  );
}

export default function ARViewerPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
            <ARViewer />
        </Suspense>
    )
}
