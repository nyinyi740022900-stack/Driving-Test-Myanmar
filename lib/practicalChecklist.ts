import checklistData from '@/content/checklists/sg-class3-practical.json';
import type { Locale, Localized } from '@/lib/types';

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

export function getAllCheckIds(data: PracticalChecklistData = SG_CLASS3_PRACTICAL): string[] {
  const ids: string[] = [];
  for (const section of data.sections) {
    for (const item of section.items) {
      if (item.variants?.length) {
        for (const v of item.variants) ids.push(v.id);
      } else {
        ids.push(item.id);
      }
    }
  }
  return ids;
}

export interface PracticalScore {
  demeritPoints: number;
  immediateFailures: number;
  checkedCount: number;
  passed: boolean;
}

export function scorePracticalChecklist(
  checked: ReadonlySet<string>,
  data: PracticalChecklistData = SG_CLASS3_PRACTICAL
): PracticalScore {
  let demeritPoints = 0;
  let immediateFailures = 0;

  for (const section of data.sections) {
    for (const item of section.items) {
      if (item.variants?.length) {
        for (const v of item.variants) {
          if (!checked.has(v.id)) continue;
          if (v.immediateFailure) immediateFailures += 1;
          if (!v.noDemerit) demeritPoints += v.demerits;
        }
      } else if (checked.has(item.id)) {
        if (item.immediateFailure) immediateFailures += 1;
        if (!item.noDemerit) demeritPoints += item.demerits ?? 0;
      }
    }
  }

  const passed = immediateFailures === 0 && demeritPoints < DEMERIT_FAIL_THRESHOLD;

  return {
    demeritPoints,
    immediateFailures,
    checkedCount: checked.size,
    passed,
  };
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

const STORAGE_KEY = 'roadready_sg_practical_checklist_v1';

export interface SavedChecklistState {
  checked: string[];
  remarks: string;
  showAtv: boolean;
  showAtm: boolean;
  openSections: string[];
}

export function loadChecklistState(): SavedChecklistState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedChecklistState;
  } catch {
    return null;
  }
}

export function saveChecklistState(state: SavedChecklistState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function clearChecklistState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
