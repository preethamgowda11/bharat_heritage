'use client';
import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import config from '../../config/qr-config.json';

// dynamic import (avoid SSR)
const QRScanner = dynamic(() => import('../../components/common/QRScanner'), { ssr: false });

export default function QRScannerPage() {
  const router = useRouter();
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const openUrl = (url: string) => {
    try {
      const u = new URL(url, window.location.href);
      const host = u.hostname;
      if (Array.isArray(config.whitelistDomains) && config.whitelistDomains.length > 0) {
        const allowed = config.whitelistDomains.some(d => host === d || host.endsWith('.' + d));
        if (!allowed) {
          setMessage('Scanned URL is not on the allowed list.');
          return;
        }
      }
    } catch (e) {
      setMessage('Invalid URL scanned.');
      return;
    }

    // open in new tab and focus it if possible
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (win) win.focus();
    } catch (e) {
      // fallback to same tab (rare)
      window.location.href = url;
    }
  };

  const handleResult = useCallback((text: string) => {
    setLastScanned(text);
    setMessage(null);

    const t = text.trim();
    if (/^https?:\/\//i.test(t)) {
      openUrl(t);
      return;
    }

    // if ends with .glb, open as model filename
    if (/\.glb$/i.test(t)) {
      openUrl(`/ar-viewer?model=${encodeURIComponent(t)}`);
      return;
    }

    // treat as slug; optionally append .glb
    const file = config.autoAppendGlbIfMissing ? `${t}.glb` : t;
    openUrl(`/ar-viewer?model=${encodeURIComponent(file)}`);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#000' }}>
      <QRScanner onResult={handleResult} onError={(e) => setMessage(e)} />

      <div style={{ position: 'absolute', top: 12, left: 12 }}>
        <button onClick={() => router.back()} style={{ padding: '8px 10px', borderRadius: 8, background: '#fff' }}>Back</button>
      </div>

      {lastScanned && (
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <div style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 14 }}>Scanned: {lastScanned}</div>
            {message && <div style={{ marginTop: 6 }}>{message}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
