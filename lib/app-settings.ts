import { createServiceClient } from '@/lib/supabase-server';

export interface PublicAppSettings {
  monthlyPrice: number;
  yearlyPrice: number;
  kbzpayNumber: string;
  wavepayNumber: string;
}

export const DEFAULT_MONTHLY_PRICE = 4900;
export const DEFAULT_YEARLY_PRICE = 39000;

function toPositiveNumber(raw: string | null | undefined, fallback: number): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function nonEmpty(raw: string | null | undefined, fallback = ''): string {
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : fallback;
}

export async function getPublicAppSettings(): Promise<PublicAppSettings> {
  const service = await createServiceClient();
  const { data } = await service
    .from('app_settings')
    .select('key, value');

  const map = new Map((data ?? []).map((row) => [row.key, row.value]));

  return {
    monthlyPrice: toPositiveNumber(map.get('monthly_price'), DEFAULT_MONTHLY_PRICE),
    yearlyPrice: toPositiveNumber(map.get('yearly_price'), DEFAULT_YEARLY_PRICE),
    kbzpayNumber: nonEmpty(map.get('kbzpay_number'), process.env.NEXT_PUBLIC_KBZPAY_NUMBER ?? '09 XXXX XXXX'),
    wavepayNumber: nonEmpty(map.get('wavepay_number'), process.env.NEXT_PUBLIC_WAVEPAY_NUMBER ?? '09 XXXX XXXX'),
  };
}
