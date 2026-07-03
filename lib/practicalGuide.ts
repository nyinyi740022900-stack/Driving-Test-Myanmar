import guideData from '@/content/checklists/sg-class3-practical-guide.json';
import type { Locale, Localized } from '@/lib/types';

export interface GuideStep {
  title: Localized;
  body: Localized;
}

export interface CriticalMoment {
  id: string;
  title: Localized;
  lead: Localized;
  steps: GuideStep[];
  warnings: Localized[];
  relatedSection?: string;
}

export interface SectionGuide {
  overview: Localized;
  tips: Localized[];
  warnings: Localized[];
  examinerFocus: Localized;
}

export interface ItemGuide {
  explain: Localized;
  avoid: Localized[];
  mistakes: Localized[];
  procedure?: GuideStep[];
}

export interface PracticalGuideData {
  criticalMoments: CriticalMoment[];
  sections: Record<string, SectionGuide>;
  items: Record<string, ItemGuide>;
}

export const SG_PRACTICAL_GUIDE = guideData as PracticalGuideData;

export function pickGuideText(text: Localized, locale: Locale): string {
  return text[locale] ?? text.en ?? '';
}

export function getSectionGuide(sectionId: string): SectionGuide | undefined {
  return SG_PRACTICAL_GUIDE.sections[sectionId];
}

export function getItemGuide(itemId: string): ItemGuide | undefined {
  return SG_PRACTICAL_GUIDE.items[itemId];
}

/** Resolve guide by item number prefix (e.g. es20 from emergency item 20). */
export function getItemGuideByNum(num: number, sectionId: string): ItemGuide | undefined {
  const prefixMap: Record<string, string> = {
    narrow: 'nc',
    parking: 'pk',
    slope: 'sl',
    atv_ramp: 'atv',
    emergency: 'es',
    moving: 'mv',
    atm: 'atm',
    forward: 'fd',
    junction: 'jn',
    safety: 'sf',
    braking: 'br',
    signals: 'sg',
    traffic: 'ts',
    general: 'gn',
  };
  const prefix = prefixMap[sectionId];
  if (!prefix) return undefined;
  const keys = Object.keys(SG_PRACTICAL_GUIDE.items).filter(k => k.startsWith(prefix) && k.includes(String(num)));
  if (keys.length === 0) {
    const altKey = `${prefix}${num}`;
    return SG_PRACTICAL_GUIDE.items[altKey];
  }
  return SG_PRACTICAL_GUIDE.items[keys[0]];
}

export function getItemGuideForItem(itemId: string, num: number, sectionId: string): ItemGuide | undefined {
  return getItemGuide(itemId) ?? getItemGuideByNum(num, sectionId);
}
