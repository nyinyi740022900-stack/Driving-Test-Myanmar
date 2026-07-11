import type { Question } from './types';

/** Twelve exam-style practice sets built from original TheoryLane questions (not copied papers). */
export const SG_BTT_INSPIRED_SET_ORDER = [
  'inspired-01',
  'inspired-02',
  'inspired-03',
  'inspired-04',
  'inspired-05',
  'inspired-06',
  'inspired-07',
  'inspired-08',
  'inspired-09',
  'inspired-10',
  'inspired-11',
  'inspired-12',
] as const;

export type SgBttInspiredSetId = (typeof SG_BTT_INSPIRED_SET_ORDER)[number];

export interface QuestionSetInfo {
  questions: Question[];
  labelKey: 'inspired_set' | 'set_label';
  labelValues?: { title: string };
  isInspiredSet: boolean;
}

/** Group questions into inspired practice sets first, then supplementary batches. */
export function buildQuestionSets(questions: Question[], batchSize = 50): QuestionSetInfo[] {
  const bySet = new Map<string, Question[]>();

  for (const q of questions) {
    if (!q.inspiredSet?.id) continue;
    const list = bySet.get(q.inspiredSet.id) ?? [];
    list.push(q);
    bySet.set(q.inspiredSet.id, list);
  }

  const sets: QuestionSetInfo[] = [];

  for (const setId of SG_BTT_INSPIRED_SET_ORDER) {
    const setQs = bySet.get(setId);
    if (!setQs?.length) continue;
    setQs.sort((a, b) => (a.inspiredSet?.number ?? 0) - (b.inspiredSet?.number ?? 0));
    const title = setQs[0]?.inspiredSet?.title ?? setId;
    sets.push({
      questions: setQs,
      labelKey: 'inspired_set',
      labelValues: { title },
      isInspiredSet: true,
    });
  }

  const extras = questions.filter(q => !q.inspiredSet?.id);
  for (let i = 0; i < extras.length; i += batchSize) {
    sets.push({
      questions: extras.slice(i, i + batchSize),
      labelKey: 'set_label',
      isInspiredSet: false,
    });
  }

  return sets;
}

export function getInspiredSetQuestions(questions: Question[]): Question[] {
  return questions.filter(q => q.inspiredSet?.id);
}

/** Pick one full inspired set for mock-style practice. */
export function pickInspiredSetPool(questions: Question[], count: number): Question[] {
  const sets = buildQuestionSets(questions).filter(s => s.isInspiredSet);
  if (!sets.length) return questions.slice(0, count);

  const idx = Math.floor(Math.random() * sets.length);
  const paper = sets[idx]!.questions;
  if (paper.length >= count) return paper.slice(0, count);
  return paper;
}

export function sortInspiredSetsFirst(questions: Question[]): Question[] {
  const order = new Map(SG_BTT_INSPIRED_SET_ORDER.map((id, i) => [id, i]));

  return [...questions].sort((a, b) => {
    const aSet = a.inspiredSet?.id;
    const bSet = b.inspiredSet?.id;
    if (aSet && bSet) {
      const ai = order.get(aSet as SgBttInspiredSetId) ?? 999;
      const bi = order.get(bSet as SgBttInspiredSetId) ?? 999;
      if (ai !== bi) return ai - bi;
      return (a.inspiredSet?.number ?? 0) - (b.inspiredSet?.number ?? 0);
    }
    if (aSet) return -1;
    if (bSet) return 1;
    return 0;
  });
}
