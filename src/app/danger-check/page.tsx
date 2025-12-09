// src/app/danger-check/page.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { runDangerCheck } from '@/lib/danger-check';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Loader, TriangleAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export default function DangerCheckPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [result, setResult] = useState<{ score: number | null; label: string | null }>({ score: null, label: null });

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraSPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
      // Cleanup: stop video stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleDangerCheck = async () => {
    if (!videoRef.current) {
      toast({ variant: 'destructive', title: 'Camera not ready' });
      return;
    }
    setIsChecking(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        const res = await runDangerCheck(dataUrl);

        if (res && res.result && res.result.predictions && res.result.predictions.length > 0) {
            const topPrediction = res.result.predictions[0];
            setResult({ score: topPrediction.confidence, label: topPrediction.class });
            setShowResultDialog(true);
        } else {
            toast({ title: 'Analysis Complete', description: 'No specific threats were detected in the image.' });
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to run danger check. Please try again.',
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const getRiskLevel = (score: number | null) => {
    if (score === null) return { text: 'Unknown', color: 'text-gray-500' };
    if (score > 0.8) return { text: 'High Risk', color: 'text-red-500' };
    if (score > 0.5) return { text: 'Medium Risk', color: 'text-yellow-500' };
    return { text: 'Low Risk', color: 'text-green-500' };
  }
  const riskInfo = getRiskLevel(result.score);

  return (
    <div className="w-full h-screen relative bg-black flex items-center justify-center">
      {hasCameraPermission === null && (
         <div className="text-white flex flex-col items-center gap-2">
            <Loader className="h-8 w-8 animate-spin" />
            <p>Requesting Camera...</p>
        </div>
      )}
      
      {hasCameraPermission === false && (
        <Alert variant="destructive" className='max-w-md'>
          <AlertTitle>Camera Access Required</AlertTitle>
          <AlertDescription>
            Please allow camera access to use this feature. You may need to change permissions in your browser settings and refresh the page.
          </AlertDescription>
        </Alert>
      )}

      {hasCameraPermission && (
         <>
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            <div className="absolute top-4 left-4 z-10">
              <Button variant="secondary" onClick={() => router.back()}>
                Back
              </Button>
            </div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <Button size="lg" className="h-16 w-16 rounded-full" onClick={handleDangerCheck} disabled={isChecking}>
                    {isChecking ? <Loader className="animate-spin" /> : <Camera size={32}/>}
                    <span className="sr-only">Scan for Danger</span>
                </Button>
                <p className="text-center text-white/90 text-sm mt-2 font-semibold bg-black/30 rounded-md px-2 py-1">Tap to Scan</p>
            </div>
         </>
      )}
      
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <TriangleAlert className={`h-6 w-6 ${riskInfo.color}`} />
                Danger Detection Result
            </DialogTitle>
            <DialogDescription>
              Analysis of the captured image from your camera.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div className="text-center">
                <p className="text-sm text-muted-foreground">Detected Threat</p>
                <p className="text-2xl font-bold capitalize">{result.label || 'None'}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-muted-foreground">Confidence Score</p>
                <p className={`text-4xl font-bold ${riskInfo.color}`}>{result.score ? `${(result.score * 100).toFixed(1)}%` : 'N/A'}</p>
             </div>
             <div className="text-center">
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <p className={`text-lg font-semibold ${riskInfo.color}`}>{riskInfo.text}</p>
             </div>
             <Alert>
                <AlertTitle>What to do</AlertTitle>
                <AlertDescription>
                    If a high risk is detected, please maintain a safe distance and report your findings to local authorities. Do not attempt to interact with the structure.
                </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowResultDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
