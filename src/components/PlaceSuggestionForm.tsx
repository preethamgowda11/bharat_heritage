'use client';
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function PlaceSuggestionForm({ siteId, lat, lon, onAfterSubmit }: { siteId?: string; lat?: number; lon?: number; onAfterSubmit?: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'hotel'|'tourist'|'offbeat'>('offbeat');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const reset = () => { setName(''); setCategory('offbeat'); setAddress(''); setPhone(''); setWebsite(''); setDescription(''); };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) { 
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a name for the place.' });
      return; 
    }
    if (!address.trim()) { 
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter an address for the place.' });
      return; 
    }
    if (!description.trim()) { 
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a short description.' });
      return; 
    }
    setLoading(true);
    try {
      const col = collection(firestore, 'suggested_places');
      await addDoc(col, {
        siteId: siteId || null,
        name: name.trim(),
        category,
        address: address.trim(),
        phone: phone.trim() || null,
        website: website.trim() || null,
        description: description.trim(),
        lat: lat || null,
        lon: lon || null,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      toast({ title: 'Success', description: 'Thanks — suggestion submitted for review.'});
      reset();
      onAfterSubmit && onAfterSubmit();
      setTimeout(() => { setOpen(false); }, 1400);
    } catch (err: any) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Submission failed', description: err.message || 'Could not submit suggestion. Please try again later.' });
    } finally { setLoading(false); }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="secondary" className="w-full">Suggest a Place</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Suggest a Place</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (required)</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., The Heritage Cafe" />
              </div>
              <div className="space-y-2">
                 <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hotel">Hotel / Homestay</SelectItem>
                        <SelectItem value="tourist">Tourist Place</SelectItem>
                        <SelectItem value="offbeat">Offbeat / Local Spot</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="address">Address (required)</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contact number" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="description">Short description (required)</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What makes this place special?" />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
