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

  const handleCheckDanger = async () => {
    if (!videoRef.current) return;
    setIsChecking(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not get canvas context' });
      setIsChecking(false);
      return;
    }

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
    
    try {
      const apiResult = await runDangerCheck(imageBase64);

      if (apiResult.ok && apiResult.result) {
        const firstPrediction = apiResult.result.predictions?.[0];
        setResult({
          score: firstPrediction?.confidence || 0,
          label: firstPrediction?.class || 'No danger detected',
        });
      } else {
         setResult({ score: 0, label: 'Analysis inconclusive' });
      }
      setShowResultDialog(true);
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: e.message || 'The danger check could not be completed.',
      });
       setResult({ score: null, label: 'Error' });
       setShowResultDialog(true);
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
              <Button onClick={handleCheckDanger} size="lg" className="h-16 w-16 rounded-full" disabled={isChecking}>
                {isChecking ? <Loader className="h-8 w-8 animate-spin" /> : <Camera className="h-8 w-8" />}
              </Button>
              <p className="text-white text-center mt-2 text-sm font-semibold bg-black/50 rounded-md px-2 py-1">
                {isChecking ? 'Analyzing...' : 'Scan for Danger'}
              </p>
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