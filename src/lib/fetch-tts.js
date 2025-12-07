console.error("Script started");
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
        const req = https.get(url, (res) => {
            if (res.statusCode !== 200) {
                res.resume(); // Consume response data to free up memory
                return reject(new Error(`Status Code: ${'res.statusCode'}`));
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
        console.error("Warming up connection...");
        try {
            await fetchUrl('https://translate.google.com/translate_tts?ie=UTF-8&q=a&tl=en&client=gtx');
        } catch (e) {
            console.error("Warm-up failed (ignoring):", e.message);
        }
        
        await new Promise(r => setTimeout(r, 500));

        console.error("Splitting text...");
        const chunks = splitText(text, 30); 
        console.error(`Text split into ${chunks.length} chunks.`);

        const buffers = [];
        
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (!chunk.trim()) continue;
            
            const encoded = encodeURIComponent(chunk);
            // client=webapp seems to work for Odia where gtx/tw-ob fail
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=webapp`;
            
            console.error(`Fetching chunk ${i+1}/${chunks.length}: "${chunk.substring(0, 10)}...`);
            
            try {
                const buffer = await fetchUrl(url);
                buffers.push(buffer);
            } catch (err) {
                console.error(`Failed Chunk ${i}:`, err.message);
                // Retry once
                await new Promise(r => setTimeout(r, 2000));
                try {
                    const buffer = await fetchUrl(url);
                    buffers.push(buffer);
                } catch (retryErr) {
                    console.error(`Retry failed for chunk ${i}:`, retryErr.message);
                    throw retryErr;
                }
            }
            
            const randomDelay = Math.floor(Math.random() * 500) + 200;
            await new Promise(r => setTimeout(r, randomDelay));
        }

        const finalBuffer = Buffer.concat(buffers);
        console.log(finalBuffer.toString('base64'));

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

fetchTTS();
