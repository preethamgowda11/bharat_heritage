'use client';
import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

export default function QRScanner({ onResult, onError }: { onResult: (text: string) => void; onError?: (err: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const cooldownRef = useRef<number>(0);

  useEffect(() => {
    let rafId: number | null = null;
    let localStream: MediaStream | null = null;
    const videoElement = videoRef.current;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        localStream = stream; // Store stream locally for cleanup
        if (videoElement) {
          videoElement.srcObject = stream;
          await videoElement.play();
        }

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        const tick = () => {
          if (!scanning) return;
          if (!videoElement || !ctx || !canvas || !overlayRef.current) {
            if (scanning) rafId = requestAnimationFrame(tick);
            return;
          }

          const vw = videoElement.videoWidth;
          const vh = videoElement.videoHeight;
          if (vw === 0 || vh === 0) {
            if (scanning) rafId = requestAnimationFrame(tick);
            return;
          }

          // determine square scan area (centered, 60% of short side)
          const short = Math.min(vw, vh);
          const size = Math.floor(short * 0.6);
          const sx = Math.floor((vw - size) / 2);
          const sy = Math.floor((vh - size) / 2);

          canvas.width = size;
          canvas.height = size;

          // draw the video region for scan into the small canvas (faster)
          try {
            ctx.drawImage(videoElement, sx, sy, size, size, 0, 0, size, size);
            const imageData = ctx.getImageData(0, 0, size, size);
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
            if (code && code.data) {
              const now = Date.now();
              // cooldown: avoid multiple opens in quick succession
              if (now - cooldownRef.current > 2500) {
                cooldownRef.current = now;
                onResult(code.data.trim());
              }
            }
          } catch (e) {
            // ignore read errors
          }

          if (scanning) rafId = requestAnimationFrame(tick);
        };

        if (scanning) rafId = requestAnimationFrame(tick);
      } catch (err: any) {
        const msg = err?.message || String(err);
        setError(msg);
        onError && onError(msg);
      }
    };

    start();

    // The cleanup function now uses the variables from its own scope
    return () => {
      setScanning(false);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (videoElement) {
        videoElement.pause();
        videoElement.srcObject = null;
      }
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [onResult, onError]);

  // overlay is purely visual. It does not block the video; pointerEvents set to none.
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
      {error ? (
        <div style={{ padding: 16, color: '#fff' }}>Camera error: {error}</div>
      ) : (
        <>
          <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

          {/* small internal canvas used for fast scanning (hidden) */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* overlay */}
          <div ref={overlayRef} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ width: '66vw', maxWidth: '420px', aspectRatio: '1 / 1', border: '3px solid rgba(255,255,255,0.9)', borderRadius: 8, position: 'relative', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
              {/* animated scan line */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: 'rgba(0,200,255,0.9)', transform: 'translateY(0%)', animation: 'scanline 2s linear infinite' }} />
              {/* corners */}
              <div style={{ position: 'absolute', width: 18, height: 18, borderTop: '4px solid rgba(255,255,255,0.95)', borderLeft: '4px solid rgba(255,255,255,0.95)', left: -4, top: -4, borderRadius: 4 }} />
              <div style={{ position: 'absolute', width: 18, height: 18, borderTop: '4px solid rgba(255,255,255,0.95)', borderRight: '4px solid rgba(255,255,255,0.95)', right: -4, top: -4, borderRadius: 4 }} />
              <div style={{ position: 'absolute', width: 18, height: 18, borderBottom: '4px solid rgba(255,255,255,0.95)', borderLeft: '4px solid rgba(255,255,255,0.95)', left: -4, bottom: -4, borderRadius: 4 }} />
              <div style={{ position: 'absolute', width: 18, height: 18, borderBottom: '4px solid rgba(255,255,255,0.95)', borderRight: '4px solid rgba(255,255,255,0.95)', right: -4, bottom: -4, borderRadius: 4 }} />
            </div>
          </div>

          {/* scanline CSS */}
          <style>{`@keyframes scanline { 0% { transform: translateY(-2%); opacity: 0 } 10% { opacity: 1 } 50% { transform: translateY(98%); opacity: 1 } 90% { opacity: 1 } 100% { transform: translateY(200%); opacity: 0 } }`}</style>
        </>
      )}
    </div>
  );
}
