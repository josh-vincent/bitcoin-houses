import { NextResponse } from 'next/server';
import { getCurrentHousePrices, getHousePriceHistory } from '@/lib/api';
import type { City } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') as City;
    const days = searchParams.get('days');

    if (city) {
      const history = getHousePriceHistory(city, days ? parseInt(days) : 365);
      return NextResponse.json({ history });
    }

    const currentPrices = getCurrentHousePrices();
    return NextResponse.json({ prices: currentPrices });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}