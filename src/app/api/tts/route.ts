
// src/app/api/tts/route.ts
import { NextResponse } from 'next/server';
import { getAudioBase64 } from 'google-tts-api';

export async function POST(request: Request) {
  try {
    const { text, lang } = await request.json();

    if (!text || !lang) {
      return NextResponse.json({ error: 'Text and language are required' }, { status: 400 });
    }

    const base64Audio = await getAudioBase64(text, {
      lang: lang,
      slow: false,
    });

    return NextResponse.json({ audioData: base64Audio });

  } catch (error: any) {
    console.error('TTS API route error:', error);
    return NextResponse.json(
        { error: 'Failed to generate TTS audio', details: error.message }, 
        { status: 500 }
    );
  }
}
