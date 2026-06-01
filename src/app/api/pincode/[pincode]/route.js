import { NextResponse } from 'next/server';
import https from 'https';

export async function GET(request, { params }) {
    const { pincode } = params;
    
    if (!pincode || pincode.length !== 6) {
        return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
    }

    try {
        const data = await new Promise((resolve, reject) => {
            const agent = new https.Agent({ rejectUnauthorized: false });
            https.get(`https://api.postalpincode.in/pincode/${pincode}`, { agent }, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', reject);
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error proxying pincode:', error);
        return NextResponse.json({ error: 'Failed to fetch pincode details' }, { status: 500 });
    }
}
