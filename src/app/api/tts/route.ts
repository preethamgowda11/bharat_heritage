
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import anuvadiniConfig from '../../../config/anuvadini-config.json';

// Helper to fetch audio using native https module to bypass Next.js fetch patches
function fetchAudioWithHttps(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'curl/7.64.1', // Mimic curl to avoid blocks
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Failed to fetch audio: Status ${res.statusCode}`));
                return;
            }
            const chunks: Buffer[] = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64 = buffer.toString('base64');
                resolve(`data:audio/mp3;base64,${base64}`);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Function to split text into manageable chunks for TTS APIs
function splitText(text: string, maxLength: number = 100): string[] {
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxLength) {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
        } else {
            currentChunk += sentence;
        }
    }
    if (currentChunk) chunks.push(currentChunk);

    return chunks;
}


export async function POST(req: NextRequest) {
    let text = '';
    let lang = 'en';

    try {
        const body = await req.json();
        text = body.text;
        lang = body.lang;

        if (!text || !lang) {
            return NextResponse.json({ error: 'Missing text or lang' }, { status: 400 });
        }
        
        const chunks = splitText(text);

        const audioResults = await Promise.all(
            chunks.map(async (chunk) => {
                // Consistent client parameter that is known to be reliable
                const client = 'tw-ob';
                const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=${client}`;
                
                try {
                    const dataUri = await fetchAudioWithHttps(url);
                    return { url: dataUri, shortText: chunk };
                } catch (error: any) {
                    console.error(`Google TTS Fetch Error for lang '${lang}':`, error.message);
                    // Throw to be caught by the outer catch block
                    throw new Error(`Failed to fetch audio for chunk: "${chunk.substring(0, 20)}..."`);
                }
            })
        );

        return NextResponse.json({ results: audioResults });

    } catch (error: any) {
        console.error('TTS API Error Details:', {
            message: error.message,
            stack: error.stack,
            lang: lang,
            textLength: text?.length
        });

        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
