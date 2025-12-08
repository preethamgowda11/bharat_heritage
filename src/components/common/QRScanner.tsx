'use client';
import { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

type QRScannerProps = {
  onResult: (text: string) => void;
  onError: (error: string) => void;
};

const QRScanner = ({ onResult, onError }: QRScannerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(videoRef.current.id);
      }
      
      const scanner = scannerRef.current;

      if (scanner && scanner.getState() !== Html5QrcodeScannerState.SCANNING) {
        scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          onResult,
          (errorMessage) => {
            // This is called frequently, only log if needed for debugging
            // console.warn(`QR Code no longer in front of camera: ${errorMessage}`);
          }
        ).catch(err => {
            onError('Failed to start QR scanner. Please grant camera permissions.');
            console.error('Scanner start error:', err);
        });
      }
    }

    return () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(err => {
                console.error('Failed to stop QR scanner:', err);
            });
        }
    };
  }, [onResult, onError]);

  return <div id="reader" ref={videoRef} style={{ width: '100%', height: '100%' }} />;
};

export default QRScanner;
