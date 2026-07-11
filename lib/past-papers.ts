import type { Question } from './types';

/** Canonical order for SG BTT past papers from Practice and Test File. */
export const SG_BTT_PAST_PAPER_ORDER = [
  'btt-test-1',
  'btt-test-2',
  'btt-test-3',
  'btt-test-4',
  'btt-test-5',
  'btt-test-6',
  'driving-test-p1',
  'driving-test-p2',
  'driving-test-p3',
  'driving-test-p4',
  'driving-test-p5',
  'driving-test-p6',
] as const;

export type SgBttPastPaperId = (typeof SG_BTT_PAST_PAPER_ORDER)[number];

export interface PastPaperMeta {
  id: SgBttPastPaperId | string;
  number: number;
  title?: string;
  titleMy?: string;
}

export interface QuestionSetInfo {
  questions: Question[];
  labelKey: 'past_paper' | 'set_label';
  labelValues?: { title: string };
  isPastPaper: boolean;
}

/** Group questions into past-paper sets first, then supplementary 50-Q batches. */
export function buildQuestionSets(questions: Question[], batchSize = 50): QuestionSetInfo[] {
  const byPaper = new Map<string, Question[]>();

  for (const q of questions) {
    if (!q.pastPaper?.id) continue;
    const list = byPaper.get(q.pastPaper.id) ?? [];
    list.push(q);
    byPaper.set(q.pastPaper.id, list);
  }

  const sets: QuestionSetInfo[] = [];

  for (const paperId of SG_BTT_PAST_PAPER_ORDER) {
    const paperQs = byPaper.get(paperId);
    if (!paperQs?.length) continue;
    paperQs.sort((a, b) => (a.pastPaper?.number ?? 0) - (b.pastPaper?.number ?? 0));
    const title = paperQs[0]?.pastPaper?.title ?? paperId;
    sets.push({
      questions: paperQs,
      labelKey: 'past_paper',
      labelValues: { title },
      isPastPaper: true,
    });
  }

  const extras = questions.filter(q => !q.pastPaper?.id);
  for (let i = 0; i < extras.length; i += batchSize) {
    sets.push({
      questions: extras.slice(i, i + batchSize),
      labelKey: 'set_label',
      isPastPaper: false,
    });
  }

  return sets;
}

/** Past-paper questions only — used to bias mock tests. */
export function getPastPaperQuestions(questions: Question[]): Question[] {
  return questions.filter(q => q.pastPaper?.id);
}

/** Pick one full past paper for mock-style practice (falls back to random slice). */
export function pickPastPaperPool(questions: Question[], count: number): Question[] {
  const sets = buildQuestionSets(questions).filter(s => s.isPastPaper);
  if (!sets.length) return questions.slice(0, count);

  const idx = Math.floor(Math.random() * sets.length);
  const paper = sets[idx]!.questions;
  if (paper.length >= count) return paper.slice(0, count);
  return paper;
}

/** Sort bank: past papers first (canonical paper order, then Q number), then the rest. */
export function sortPastPaperFirst(questions: Question[]): Question[] {
  const paperIndex = new Map(SG_BTT_PAST_PAPER_ORDER.map((id, i) => [id, i]));

  return [...questions].sort((a, b) => {
    const aPaper = a.pastPaper?.id;
    const bPaper = b.pastPaper?.id;
    if (aPaper && bPaper) {
      const ai = paperIndex.get(aPaper as SgBttPastPaperId) ?? 999;
      const bi = paperIndex.get(bPaper as SgBttPastPaperId) ?? 999;
      if (ai !== bi) return ai - bi;
      return (a.pastPaper?.number ?? 0) - (b.pastPaper?.number ?? 0);
    }
    if (aPaper) return -1;
    if (bPaper) return 1;
    return 0;
  });
}
