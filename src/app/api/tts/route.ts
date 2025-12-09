
// src/app/api/tts/route.ts

import { NextRequest, NextResponse } from 'next/server';

async function getAnuvadiniTtsAudio(text: string): Promise<string> {
    const ANUVADINI_URL = 'https://pre-prod-api.anuvadini.gov.in/v2/master-pipeline';
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
    const audioContent = result?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;

    if (!audioContent) {
        throw new Error('Anuvadini TTS response did not contain audio content.');
    }
    
    return audioContent; // It's already base64
}


export async function POST(req: NextRequest) {
  try {
    const { text, lang } = await req.json();

    if (!text || !lang) {
      return NextResponse.json({ error: 'Text and language are required' }, { status: 400 });
    }

    let base64Audio: string;

    if (lang === 'or') {
        base64Audio = await getAnuvadiniTtsAudio(text);
    } else {
        return NextResponse.json({ error: 'This endpoint is for Odia (or) language only.'}, { status: 400 });
    }
    
    const audioBuffer = Buffer.from(base64Audio, 'base64');

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
