import { NextResponse } from 'next/server';
import packageInfo from '../../../../package.json';

export async function GET() {
    // Add cache control headers to ensure we always get the latest version from the server
    return NextResponse.json(
        { version: packageInfo.version },
        { 
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            } 
        }
    );
}
