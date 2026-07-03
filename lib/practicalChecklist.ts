import checklistData from '@/content/checklists/sg-class3-practical.json';
import type { Locale, Localized } from '@/lib/types';

/** Total demerits at or above this value = fail (Traffic Police form). */
export const DEMERIT_FAIL_THRESHOLD = 20;

export interface PracticalCheckVariant {
  id: string;
  label: Localized;
  demerits: number;
  immediateFailure?: boolean;
  noDemerit?: boolean;
}

export interface PracticalCheckItem {
  id: string;
  num: number;
  label: Localized;
  tag?: 'atv' | 'atm';
  variants?: PracticalCheckVariant[];
  demerits?: number;
  immediateFailure?: boolean;
  noDemerit?: boolean;
}

export interface PracticalCheckSection {
  id: string;
  title: Localized;
  subtitle?: Localized;
  items: PracticalCheckItem[];
}

export interface PracticalChecklistMeta {
  id: string;
  title: Localized;
  subtitle: Localized;
  rules: Localized;
}

export interface PracticalChecklistData {
  meta: PracticalChecklistMeta;
  sections: PracticalCheckSection[];
}

export const SG_CLASS3_PRACTICAL = checklistData as PracticalChecklistData;

export function pickChecklistText(text: Localized, locale: Locale): string {
  return text[locale] ?? text.en ?? '';
}

export function filterChecklistByTags(
  data: PracticalChecklistData,
  showAtv: boolean,
  showAtm: boolean
): PracticalChecklistData {
  return {
    ...data,
    sections: data.sections
      .map(section => ({
        ...section,
        items: section.items.filter(item => {
          if (item.tag === 'atv' && !showAtv) return false;
          if (item.tag === 'atm' && !showAtm) return false;
          return true;
        }),
      }))
      .filter(section => section.items.length > 0),
  };
}
