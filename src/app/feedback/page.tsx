'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function FeedbackForm() {
  const search = useSearchParams();
  const model = search.get('model') || 'Unknown';

  const decodedModel = decodeURIComponent(model).split('/').pop()?.replace(/_/g, ' ').replace('.glb', '') || 'Unknown Model';

  return (
    <div className='container max-w-xl mx-auto p-4 md:p-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>AR Feedback</CardTitle>
          <CardDescription>
            You viewed: <strong>{decodedModel}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action='https://formspree.io/f/your-id' method='POST' className='space-y-4'>
            <div>
                <Label htmlFor="feedback-textarea">Your Feedback</Label>
                <Textarea
                  id="feedback-textarea"
                  name='feedback'
                  required
                  rows={4}
                  placeholder='Tell us about your AR experience...'
                />
            </div>

            <input type='hidden' name='model' value={model} />
            
            <Button type='submit'>Submit Feedback</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading form...</div>}>
      <FeedbackForm />
    </Suspense>
  )
}
