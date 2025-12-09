
// src/app/api/tts/route.ts
import { NextResponse } from 'next/server';
import querystring from 'querystring';

async function fetchTts(text: string, lang: string) {
    const textParts = text.match(/.{1,200}/g) || [];
    const audioBuffers: Buffer[] = [];

    for (const part of textParts) {
        const query = {
            ie: 'UTF-8',
            q: part,
            tl: lang,
            total: 1,
            idx: 0,
            textlen: part.length,
            client: 'tw-ob',
        };
        
        const url = `https://translate.google.com/translate_tts?${querystring.stringify(query)}`;

        const response = await fetch(url, {
            headers: {
                'Referer': 'http://translate.google.com/',
                'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch TTS audio for part: ${part}`);
        }
        
        const buffer = Buffer.from(await response.arrayBuffer());
        audioBuffers.push(buffer);
    }
    
    return Buffer.concat(audioBuffers).toString('base64');
}


export async function POST(request: Request) {
  try {
    const { text, lang } = await request.json();

    if (!text || !lang) {
      return NextResponse.json({ error: 'Text and language are required' }, { status: 400 });
    }

    const base64Audio = await fetchTts(text, lang);

    return NextResponse.json({ audioData: base64Audio });

  } catch (error: any) {
    console.error('TTS API route error:', error);
    return NextResponse.json(
        { error: 'Failed to generate TTS audio', details: error.message }, 
        { status: 500 }
    );
  }
}
