
// src/app/api/tts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import querystring from 'querystring';

// Fetches audio from our internal Anuvadini proxy
async function getAnuvadiniTtsAudio(text: string): Promise<string> {
    const ANUVADINI_URL = 'https://pre-prod-api.anuvadini.gov.in/v2/master-pipeline';
    
    // This payload is structured based on Anuvadini's requirements.
    const payload = {
        "input": [ { "source": text } ],
        "config": {
            "serviceId": "ai4b-or-tts",
            "language": { "sourceLanguage": "or" }
        }
    };
    
    const response = await fetch(ANUVADINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Anuvadini TTS Error:", errorBody);
        throw new Error(`Anuvadini TTS request failed: ${response.statusText}`);
    }

    const result = await response.json();
    // The actual audio data is nested within the response.
    const audioContent = result?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;

    if (!audioContent) {
        throw new Error('Anuvadini TTS response did not contain audio content.');
    }
    
    return audioContent; // It's already base64 encoded
}

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

    let audioBuffer: Buffer;
    let contentType = 'audio/mpeg';

    if (lang === 'or') {
        const base64Audio = await getAnuvadiniTtsAudio(text);
        audioBuffer = Buffer.from(base64Audio, 'base64');
    } else {
        const audioArrayBuffer = await getGoogleTtsAudio(text, lang);
        audioBuffer = Buffer.from(audioArrayBuffer);
    }
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(audioBuffer.length),
      },
    });

  } catch (error: any) {
    console.error('TTS API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate audio' }, { status: 500 });
  }
}
