
import { NextRequest, NextResponse } from 'next/server';
import * as googleTTS from 'google-tts-api';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text, lang } = body;

        if (!text || !lang) {
            return NextResponse.json({ error: 'Missing text or lang' }, { status: 400 });
        }

        // The google-tts-api library splits the text into chunks internally.
        const results = googleTTS.getAllAudioBase64(text, {
            lang: lang,
            slow: false,
        });

        const audioResults = results.map(result => ({
          url: `data:audio/mp3;base64,${result.base64}`,
          shortText: result.shortText,
        }));
        
        return NextResponse.json({ results: audioResults });

    } catch (error: any) {
        console.error('TTS API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate audio' }, { status: 500 });
    }
}
