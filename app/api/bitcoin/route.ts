import { getBitcoinPriceServer, getBitcoinHistoryServer } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days');

    const [price, history] = await Promise.all([
      getBitcoinPriceServer(),
      getBitcoinHistoryServer(days ? parseInt(days) : 365)
    ]);

    if (!price || !history) {
      return NextResponse.json(
        { error: 'Failed to fetch Bitcoin data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ price, history });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}