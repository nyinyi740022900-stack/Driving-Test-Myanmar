import { NextResponse } from 'next/server';
import { getPublicAppSettings } from '@/lib/app-settings';

export async function GET() {
  const settings = await getPublicAppSettings();
  return NextResponse.json(settings, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
