
const https = require('https');

// Custom text splitter
function splitText(text, maxLength = 100) {
    if (!text) return [];
    const parts = text.split(/([.?!।\n])/);
    const chunks = [];
    let currentChunk = '';

    for (const part of parts) {
        if (currentChunk.length + part.length > maxLength) {
            if (currentChunk.trim()) chunks.push(currentChunk.trim());
            currentChunk = part;
        } else {
            currentChunk += part;
        }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());

    const finalChunks = [];
    for (const chunk of chunks) {
        if (chunk.length > maxLength) {
            for (let i = 0; i < chunk.length; i += maxLength) {
                finalChunks.push(chunk.slice(i, i + maxLength));
            }
        } else {
            finalChunks.push(chunk);
        }
    }
    return finalChunks;
}

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
          }
        }, (res) => {
            if (res.statusCode !== 200) {
                res.resume(); // Consume response data to free up memory
                return reject(new Error(`Status Code: ${res.statusCode}`));
            }
            const data = [];
            res.on('data', (chunk) => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
        });

        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function fetchTTS() {
    const text = process.argv[2];
    const lang = process.argv[3] || 'en';

    if (!text) {
        console.error("No text provided");
        process.exit(1);
    }

    try {
        const chunks = splitText(text, 180); 
        
        if (chunks.length === 0) {
            console.log('');
            return;
        }

        const buffers = [];
        
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (!chunk.trim()) continue;
            
            const encoded = encodeURIComponent(chunk);
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob`;
            
            try {
                const buffer = await fetchUrl(url);
                buffers.push(buffer);
            } catch (err) {
                console.error(`Failed Chunk ${i}:`, err.message);
                // Don't retry, just fail fast if the service is down.
                throw err;
            }
            
            // Avoid being too aggressive
            const randomDelay = Math.floor(Math.random() * 300) + 150;
            await new Promise(r => setTimeout(r, randomDelay));
        }

        const finalBuffer = Buffer.concat(buffers);
        // Write base64 to stdout for the parent process
        process.stdout.write(finalBuffer.toString('base64'));

    } catch (error) {
        console.error('TTS Script Error:', error.message);
        process.exit(1);
    }
}

fetchTTS();
