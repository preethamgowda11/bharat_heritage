
// src/app/api/tts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import querystring from 'querystring';

// Fetches audio from Google's unofficial TTS endpoint
async function getGoogleTtsAudio(text: string, lang: string) {
  const query = {
    ie: 'UTF-8',
    q: text,
    tl: lang,
    total: 1,
    idx: 0,
    textlen: text.length,
    client: 'tw-ob',
  };
  const url = `https://translate.google.com/translate_tts?${querystring.stringify(query)}`;

  const response = await fetch(url, {
    headers: {
      Referer: 'http://translate.google.com/',
      'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`Google TTS request failed with status ${response.status}`);
  }

  return response.arrayBuffer();
}

export async function POST(req: NextRequest) {
  try {
    const { text, lang } = await req.json();

    if (!text || !lang) {
      return NextResponse.json({ error: 'Text and language are required' }, { status: 400 });
    }

    const audioArrayBuffer = await getGoogleTtsAudio(text, lang);
    const audioBuffer = Buffer.from(audioArrayBuffer);
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.length),
      },
    });

  } catch (error: any) {
    console.error('TTS API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate audio' }, { status: 500 });
  }
}
