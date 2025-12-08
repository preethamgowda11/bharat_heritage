
'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

function FeedbackForm() {
  const search = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const itemTitle = search.get('item_title') || 'the experience';
  const itemId = search.get('item_id');
  const itemType = search.get('item_type');

  const decodedTitle = decodeURIComponent(itemTitle);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    // IMPORTANT: Replace with your own Formspree endpoint
    const formspreeEndpoint = 'https://formspree.io/f/xgvglagw';

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: "Could not submit your feedback. Please try again.",
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Network error",
        description: "Could not connect to the feedback service.",
      });
    }
  };

  if (submitted) {
    return (
      <div className='container max-w-xl mx-auto p-4 md:p-6'>
          <Alert variant="default" className="border-green-500">
            <CheckCircle className="h-4 w-4 !text-green-500"/>
            <AlertTitle className="text-green-600">Feedback Submitted!</AlertTitle>
            <AlertDescription>
              Thank you for sharing your thoughts on <strong>{decodedTitle}</strong>. We appreciate your input.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.back()} variant="outline" className="mt-6">
            Go Back
          </Button>
      </div>
    )
  }

  return (
    <div className='container max-w-xl mx-auto p-4 md:p-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Provide Feedback</CardTitle>
          <CardDescription>
            Share your opinion about <strong>{decodedTitle}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <Label htmlFor="feedback-textarea">Your Feedback</Label>
                <Textarea
                  id="feedback-textarea"
                  name='feedback'
                  required
                  rows={5}
                  placeholder='What did you like or dislike? How could we improve?'
                />
            </div>

            <input type='hidden' name='item_id' value={itemId || ''} />
            <input type='hidden' name='item_title' value={decodedTitle} />
            <input type='hidden' name='item_type' value={itemType || ''} />
            
            <div className="flex justify-between items-center">
              <Button type='submit'>Submit Feedback</Button>
              <Button type='button' variant="ghost" onClick={() => router.back()}>Cancel</Button>
            </div>
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
