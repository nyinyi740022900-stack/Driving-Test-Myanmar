import { createServiceClient } from './supabase-server';
import { extractYouTubeId } from './youtube';
import type { Country } from './types';

export interface DbTutorial {
  id: string;
  title_en: string; title_my: string; title_ja: string;
  description_en: string; description_my: string; description_ja: string;
  youtube_url: string;
}

export type TutorialWithVideo = DbTutorial & { videoId: string };

export function pickTutorialText(
  row: DbTutorial,
  field: 'title' | 'description',
  locale: string,
): string {
  const map = row as unknown as Record<string, string>;
  return map[`${field}_${locale}`] || map[`${field}_en`] || map[`${field}_my`] || map[`${field}_ja`] || '';
}

export async function getPublishedTutorials(country: Country): Promise<TutorialWithVideo[]> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('video_tutorials')
      .select('id, title_en, title_my, title_ja, description_en, description_my, description_ja, youtube_url')
      .eq('country', country)
      .eq('published', true)
      .order('sort_order', { ascending: true });

    if (error) return [];
    return (data ?? [])
      .map(row => ({ ...row, videoId: extractYouTubeId(row.youtube_url) }))
      .filter((v): v is TutorialWithVideo => v.videoId !== null);
  } catch {
    return [];
  }
}
