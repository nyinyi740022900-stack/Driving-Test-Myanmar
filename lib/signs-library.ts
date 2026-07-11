import type { Locale } from '@/lib/types';

export interface SignLibraryEntry {
  file: string;
  title: Partial<Record<Locale, string>>;
  desc: Partial<Record<Locale, string>>;
}

export interface SignLibrarySection {
  category: Partial<Record<Locale, string>>;
  signs: SignLibraryEntry[];
}

export interface SignLibraryData {
  sections: SignLibrarySection[];
}

export function pickSignText(
  loc: Partial<Record<string, string>>,
  locale: string,
): string {
  if (locale === 'my') return loc.my ?? loc.en ?? loc.ja ?? '';
  if (locale === 'ja') return loc.ja ?? loc.en ?? loc.my ?? '';
  return loc.en ?? loc.my ?? loc.ja ?? '';
}

export async function getSgSignLibrary(): Promise<SignLibraryData> {
  const data = await import('../content/signs-library/sg.json');
  return data.default as SignLibraryData;
}
