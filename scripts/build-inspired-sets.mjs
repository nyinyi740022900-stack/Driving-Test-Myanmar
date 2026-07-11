#!/usr/bin/env node
/**
 * Build 12 copyright-safe exam-style sets (500 Q) from original question banks.
 * Usage: node scripts/build-inspired-sets.mjs [sg_btt|sg_ftt]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { INSPIRED_SET_CONFIGS } from './inspired-set-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const MAX_BANK = 500;
const SET_COUNT = 12;

function stripInspired(q) {
  const { inspiredSet, pastPaper, ...rest } = q;
  return rest;
}

function createEngine(config) {
  const { topicPriority, topicTargets, defaultTopicTarget, syllabusPrefix, deprioritizedTopics, sets: SETS } = config;

  function scoreQuestion(q) {
    let score = topicPriority[q.topic] ?? 40;
    const src = q.media?.src ?? '';
    if (src.includes('/signs/')) score += 18;
    else if (src) score += 8;
    const ref = q.syllabusRef ?? '';
    if (ref.includes(syllabusPrefix)) score += 8;
    if (q.difficulty === 'hard') score += 4;
    else if (q.difficulty === 'medium') score += 2;
    if (deprioritizedTopics.includes(q.topic)) score -= 25;
    return score;
  }

  function topicMatchesSet(q, set) {
    if (set.topics.includes(q.topic)) return true;
    const ref = q.syllabusRef ?? '';
    if (set.syllabusHints?.some(h => ref.includes(h))) return true;
    return set.topics.some(t => ref.includes(t.replace(/_/g, '.')) || ref.includes(t));
  }

  function setQuota(index) {
    const base = Math.floor(MAX_BANK / SET_COUNT);
    const extra = MAX_BANK % SET_COUNT;
    return base + (index < extra ? 1 : 0);
  }

  function topicTarget(q) {
    return topicTargets[q.topic] ?? defaultTopicTarget;
  }

  function selectBank(clean) {
    const ranked = [...clean]
      .map(q => ({ q, score: scoreQuestion(q) }))
      .sort((a, b) => b.score - a.score);

    const picked = new Set();
    const selected = [];
    const topicCount = {};

    const canTake = (q) => {
      if (picked.has(q.id)) return false;
      const cap = topicTarget(q);
      if ((topicCount[q.topic] ?? 0) >= cap) return false;
      return true;
    };

    const add = (q) => {
      if (!canTake(q)) return false;
      picked.add(q.id);
      selected.push(q);
      topicCount[q.topic] = (topicCount[q.topic] || 0) + 1;
      return true;
    };

    for (const { q } of ranked) {
      if (!add(q)) continue;
      if (selected.length >= MAX_BANK) break;
    }

    return selected.slice(0, MAX_BANK);
  }

  function assignSets(pool) {
    const used = new Set();
    const byScore = [...pool]
      .map(q => ({ q, score: scoreQuestion(q) }))
      .sort((a, b) => b.score - a.score);

    const tagById = new Map();

    const pickForSet = (set, quota) => {
      const picked = [];
      const scored = byScore
        .filter(({ q }) => !used.has(q.id))
        .map(({ q, score }) => ({
          q,
          score: score + (topicMatchesSet(q, set) ? 1000 : 0),
        }))
        .sort((a, b) => b.score - a.score);

      for (const { q } of scored) {
        if (picked.length >= quota) break;
        picked.push(q);
      }
      return picked;
    };

    for (let setIndex = 0; setIndex < SETS.length; setIndex++) {
      const set = SETS[setIndex];
      const quota = setQuota(setIndex);
      const picked = pickForSet(set, quota);

      let num = 1;
      for (const q of picked) {
        used.add(q.id);
        tagById.set(q.id, {
          id: set.id,
          number: num++,
          title: set.title,
          titleMy: set.titleMy,
          refPaper: set.refPaper,
        });
      }
    }

    for (let setIndex = 0; setIndex < SETS.length && used.size < pool.length; setIndex++) {
      const set = SETS[setIndex];
      const quota = setQuota(setIndex);
      const current = [...tagById.values()].filter(t => t.id === set.id).length;
      if (current >= quota) continue;

      let num = current + 1;
      for (const { q } of byScore) {
        if (used.has(q.id)) continue;
        used.add(q.id);
        tagById.set(q.id, {
          id: set.id,
          number: num++,
          title: set.title,
          titleMy: set.titleMy,
          refPaper: set.refPaper,
        });
        if (num > quota) break;
      }
    }

    if (tagById.size !== pool.length) {
      throw new Error(`Assign failed: ${tagById.size}/${pool.length} tagged`);
    }

    const manifestSets = SETS.map(set => {
      const ids = pool.filter(q => tagById.get(q.id)?.id === set.id).map(q => q.id);
      ids.sort((a, b) => (tagById.get(a)?.number ?? 0) - (tagById.get(b)?.number ?? 0));
      return {
        id: set.id,
        refPaper: set.refPaper,
        title: set.title,
        titleMy: set.titleMy,
        questionCount: ids.length,
        questionIds: ids,
      };
    });

    return {
      manifest: { category: config.category, maxQuestions: MAX_BANK, sets: manifestSets, questionIds: [] },
      tagById,
    };
  }

  function build(clean) {
    const selected = selectBank(clean);
    const { manifest, tagById } = assignSets(selected);

    const merged = selected.map(q => {
      const tag = tagById.get(q.id);
      return tag ? { ...q, inspiredSet: tag } : q;
    });

    const order = new Map(SETS.map((s, i) => [s.id, i]));
    merged.sort((a, b) => {
      const ai = a.inspiredSet ? order.get(a.inspiredSet.id) ?? 99 : 100;
      const bi = b.inspiredSet ? order.get(b.inspiredSet.id) ?? 99 : 100;
      if (ai !== bi) return ai - bi;
      if (a.inspiredSet && b.inspiredSet) return a.inspiredSet.number - b.inspiredSet.number;
      return 0;
    });

    manifest.questionIds = merged.map(q => q.id);

    const topicCounts = {};
    for (const q of merged) topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;

    return { merged, manifest, topicCounts };
  }

  return { build };
}

function main() {
  const category = process.argv[2] ?? 'sg_btt';
  const config = INSPIRED_SET_CONFIGS[category];
  if (!config) {
    console.error(`Unknown category: ${category}. Use sg_btt or sg_ftt.`);
    process.exit(1);
  }

  const bankPath = path.join(ROOT, 'content/questions', `${category}.json`);
  const manifestPath = path.join(ROOT, 'content/past-papers', `${category}-inspired-sets.json`);
  const pastPrefix = `${category}_past_`;

  const raw = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  const clean = raw.filter(q => !q.id.startsWith(pastPrefix)).map(stripInspired);

  const { build } = createEngine(config);
  const { merged, manifest, topicCounts } = build(clean);

  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify({ ...manifest, topicCounts }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(bankPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');

  console.log(`[${category}] Bank: ${merged.length} questions (max ${MAX_BANK})`);
  console.log(`Inspired sets: ${manifest.sets.length}, per-set: ${manifest.sets.map(s => s.questionCount).join(', ')}`);
  console.log('Top topics:', Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${v} ${k}`).join(', '));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
