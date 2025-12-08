'use client';
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDb, initFirebaseClient } from '@/lib/firebaseClient';

initFirebaseClient();

export default function PlaceSuggestionForm({ siteId, lat, lon, onAfterSubmit }: { siteId?: string; lat?: number; lon?: number; onAfterSubmit?: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'hotel'|'tourist'|'offbeat'>('offbeat');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reset = () => { setName(''); setCategory('offbeat'); setAddress(''); setPhone(''); setWebsite(''); setDescription(''); setError(''); };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter name'); return; }
    if (!description.trim()) { setError('Please enter a short description'); return; }
    setLoading(true);
    try {
      const db = getDb();
      const col = collection(db, 'suggested_places');
      await addDoc(col, {
        siteId: siteId || null,
        name: name.trim(),
        category,
        address: address.trim() || null,
        phone: phone.trim() || null,
        website: website.trim() || null,
        description: description.trim(),
        lat: lat || null,
        lon: lon || null,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccess('Thanks — suggestion submitted for review.');
      reset();
      onAfterSubmit && onAfterSubmit();
      setTimeout(() => { setOpen(false); setSuccess(''); }, 1400);
    } catch (err) {
      console.error(err);
      setError('Submission failed — try again later');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <button onClick={() => setOpen(true)} className="inline-flex items-center px-3 py-2 rounded bg-indigo-600 text-white">Suggest</button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
          <div style={{ width: 820, maxWidth: '96%', background: '#fff', borderRadius: 10, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Suggest a place</h3>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={submit} style={{ marginTop: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name (required)" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                <select value={category} onChange={(e:any)=>setCategory(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
                  <option value="hotel">Hotel / Homestay</option>
                  <option value="tourist">Tourist Place</option>
                  <option value="offbeat">Offbeat / Local Spot</option>
                </select>
                <input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Address (optional)" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone (optional)" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                <input value={website} onChange={(e)=>setWebsite(e.target.value)} placeholder="Website (optional)" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                <div></div>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Short description (required)" style={{ gridColumn: '1 / -1', padding: 8, minHeight: 120, borderRadius: 6, border: '1px solid #ddd' }} />
              </div>

              {error && <div style={{ color: 'crimson', marginTop: 10 }}>{error}</div>}
              {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" onClick={() => { setOpen(false); reset(); }} style={{ padding: '8px 12px', borderRadius: 6 }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '8px 14px', background: '#0b66ff', color: '#fff', borderRadius: 6 }}>{loading ? 'Submitting...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
