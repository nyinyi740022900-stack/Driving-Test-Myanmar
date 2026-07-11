'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import BackButton from './BackButton';
import type { Category, Question } from '@/lib/types';
import { TEST_META } from '@/lib/types';
import { shuffleArray, pickLocalized, isJpTrueFalseChoice } from '@/lib/questions';
import { buildQuestionSets, getInspiredSetQuestions, pickInspiredSetPool } from '@/lib/inspired-sets';
import type { QuizAnswer } from '@/lib/quiz-answers';
import {
  emptyAnswerFor,
  isAnswerComplete,
  isHazardQuestion,
  isQuestionCorrect,
  partLabel,
  scorePool,
} from '@/lib/quiz-answers';
import { MediaPlaceholder } from './Signs';
import { useAuth } from './AuthProvider';
import ReminderBell from './ReminderBell';
import AdBanner from './AdBanner';
import RewardedAdButton from './RewardedAdButton';
import { createClient } from '@/lib/supabase';
import { isPremium } from '@/lib/subscription';
import { saveQuizResult, getBestScore, getAttemptCount, saveQuizResultCloud } from '@/lib/progress';
import { addWrongAnswer } from '@/lib/wrong-answers';
import { recordPracticeDay } from '@/lib/streak';
import { AnalyticsEvents } from '@/lib/analytics';
import { AD_SLOTS } from '@/lib/ad-strategy';
import {
  bumpQuestionProgress,
  shouldShowQuizInterstitial,
} from '@/lib/quiz-ads';
import { hasAdConsent } from '@/lib/cookie-consent';
import QuizInterstitialAd from './QuizInterstitialAd';

type Mode = 'lesson' | 'practice' | 'test';
type GateState = 'checking' | 'allowed' | 'need_login' | 'limit_reached';

interface Props { category: Category; mode: Mode; questions: Question[] }

const BATCH_SIZE = 50;
const PRACTICE_MINUTES = 45;

function shuffleChoices(q: Question): Question {
  if (isHazardQuestion(q)) return q;
  const indices = q.choices.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return { ...q, choices: indices.map(i => q.choices[i]), answer: indices.indexOf(q.answer) };
}

function getTodayKey(category: Category) {
  const today = new Date().toISOString().split('T')[0];
  return `rr_mock_unlock_${category}_${today}`;
}

function getUnlockStatus(category: Category): 'granted' | 'used' | null {
  if (typeof window === 'undefined') return null;
  return (localStorage.getItem(getTodayKey(category)) as 'granted' | 'used' | null) ?? null;
}

function setUnlockStatus(category: Category, status: 'granted' | 'used') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getTodayKey(category), status);
}

function trackWrongIfNeeded(question: Question, answer: QuizAnswer, category: Category) {
  recordPracticeDay();
  if (!isQuestionCorrect(question, answer)) {
    const picked = typeof answer === 'number' ? answer : 0;
    addWrongAnswer({ questionId: question.id, category, picked });
  }
}

export default function QuizSession({ category, mode, questions }: Props) {
  const t = useTranslations('quiz');
  const locale = useLocale() as 'en' | 'my' | 'ja';
  const meta = TEST_META.find(m => m.category === category)!;
  const { user, loading: authLoading } = useAuth();

  const [gate, setGate]           = useState<GateState>(mode === 'test' ? 'checking' : 'allowed');
  const [shuffleKey, setShuffleKey] = useState(0);
  const [retryPool, setRetryPool]  = useState<Question[] | null>(null);
  // set picker: null = show picker; number = selected set index (lesson + practice)
  const [selectedSet, setSelectedSet] = useState<number | null>(mode === 'test' ? 0 : null);

  const [idx, setIdx]           = useState(0);
  const [picked, setPicked]     = useState<number | null>(null);
  const [answers, setAnswers]   = useState<QuizAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [pendingPick, setPendingPick] = useState<number | null>(null);
  const [partPicks, setPartPicks] = useState<(number | null)[]>([]);
  const [showMyanmar, setShowMyanmar] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mode === 'practice' ? PRACTICE_MINUTES * 60 : meta.timeLimitMinutes * 60);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const pendingAfterAdRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Sets (lesson + practice) — inspired sets first, then supplementary batches ──
  const setInfos = useMemo(() => {
    if (mode === 'test') return [];
    return buildQuestionSets(questions, BATCH_SIZE);
  }, [questions, mode]);

  const lessonSets = useMemo<Question[][]>(() => {
    if (mode !== 'lesson') return [];
    return setInfos.map(s => s.questions);
  }, [setInfos, mode]);

  const practiceSets = useMemo<Question[][]>(() => {
    if (mode !== 'practice') return [];
    return setInfos.map(s => s.questions);
  }, [setInfos, mode]);

  // ── Active pool ───────────────────────────────────────────────────
  const pool = useMemo<Question[]>(() => {
    if (retryPool) return retryPool; // already shuffled on creation
    if (mode === 'test') {
      const inspired = getInspiredSetQuestions(questions);
      if (
        ['sg_btt', 'sg_ftt', 'sg_rtt', 'jp_car', 'jp_moto'].includes(category) &&
        inspired.length >= meta.questionCount
      ) {
        const useFullSet = Math.random() < 0.75;
        const pickedSet = useFullSet ? pickInspiredSetPool(questions, meta.questionCount) : [];
        const source =
          pickedSet.length >= meta.questionCount
            ? pickedSet
            : shuffleArray([...inspired]).slice(0, meta.questionCount);
        return shuffleArray([...source]).map(shuffleChoices);
      }
      return shuffleArray([...questions]).slice(0, meta.questionCount).map(shuffleChoices);
    }
    if (mode === 'practice' && selectedSet !== null) return shuffleArray([...practiceSets[selectedSet]]).map(shuffleChoices);
    if (mode === 'lesson' && selectedSet !== null) return lessonSets[selectedSet];
    return questions; // fallback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryPool, mode, selectedSet, practiceSets, lessonSets, questions, meta.questionCount, shuffleKey]);

  const q = pool[idx];
  const L = (obj: Partial<Record<string, string>>) => pickLocalized(obj, locale, category);
  const choiceLabel = (text: Partial<Record<string, string>>) => {
    if (locale === 'en' && isJpTrueFalseChoice(text)) {
      return text.ja === '正しい' ? t('tf_true') : t('tf_false');
    }
    return L(text);
  };

  // Reset answers when pool changes
  useEffect(() => {
    setAnswers(pool.map(q => emptyAnswerFor(q)));
  }, [pool]);

  // Sync picked / part picks with answer for current question
  useEffect(() => {
    const current = answers[idx];
    if (q && isHazardQuestion(q)) {
      setPicked(null);
      setPendingPick(null);
      if (Array.isArray(current)) setPartPicks([...current]);
      else setPartPicks(q.parts!.map(() => null));
      return;
    }
    setPartPicks([]);
    setPicked(typeof current === 'number' ? current : null);
    setPendingPick(null);
  }, [idx, answers, q]);

  // ── Freemium gate (server-side mock test start) ───────────────────
  useEffect(() => {
    if (mode !== 'test') return;
    if (authLoading) return;
    if (!user) { setGate('need_login'); return; }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { setGate('allowed'); return; }

    const unlock = getUnlockStatus(category);
    if (unlock === 'granted') {
      setGate('allowed');
      return;
    }

    fetch('/api/mock-test/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    })
      .then(async (res) => {
        const data = (await res.json()) as { allowed?: boolean; reason?: string };
        if (res.ok && data.allowed) {
          AnalyticsEvents.mockTestStart(category);
          setGate('allowed');
          return;
        }
        if (data.reason === 'daily_limit') {
          AnalyticsEvents.mockTestLimit(category);
          setGate('limit_reached');
          return;
        }
        if (res.status === 401) {
          setGate('need_login');
          return;
        }
        setGate('limit_reached');
      })
      .catch(() => setGate('limit_reached'));
  }, [mode, user, authLoading, category]);

  useEffect(() => {
    if (!user || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setIsPremiumUser(false);
      return;
    }
    const supabase = createClient();
    isPremium(supabase, user.id).then(setIsPremiumUser).catch(() => setIsPremiumUser(false));
  }, [user]);

  // ── Timer (test + practice when set selected) ─────────────────────
  useEffect(() => {
    const active = mode === 'test' || (mode === 'practice' && selectedSet !== null);
    if (!active || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); setSubmitted(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, submitted, selectedSet]);

  // ── Helpers ───────────────────────────────────────────────────────
  function runAfterQuizAd(action: () => void) {
    if (isPremiumUser || (mode !== 'lesson' && mode !== 'practice')) {
      action();
      return;
    }

    const count = bumpQuestionProgress(category, mode);
    const adsEnabled = Boolean(process.env.NEXT_PUBLIC_ADSENSE_ID);
    if (adsEnabled && hasAdConsent() && shouldShowQuizInterstitial(count)) {
      pendingAfterAdRef.current = action;
      setShowInterstitialAd(true);
      return;
    }

    action();
  }

  function handleAdContinue() {
    setShowInterstitialAd(false);
    pendingAfterAdRef.current?.();
    pendingAfterAdRef.current = null;
  }

  function handlePick(i: number) {
    if (mode === 'lesson') return;
    if ((mode === 'practice' || mode === 'test') && picked !== null) return;
    setPendingPick(i);
  }

  function handlePartPick(partIndex: number, choice: number) {
    if (mode === 'lesson') return;
    if (q && isAnswerComplete(q, answers[idx])) return;
    setPartPicks(prev => {
      const next = [...prev];
      next[partIndex] = choice;
      return next;
    });
  }

  function handleConfirm() {
    if (q && isHazardQuestion(q)) {
      if (!partPicks.every(p => p !== null)) return;
      const next = [...answers];
      next[idx] = partPicks as number[];
      setAnswers(next);
      trackWrongIfNeeded(q, partPicks as number[], category);
      if (mode === 'test' && idx < pool.length - 1) setIdx(idx + 1);
      if (mode === 'practice') runAfterQuizAd(() => {});
      return;
    }
    if (pendingPick === null) return;
    const next = [...answers]; next[idx] = pendingPick; setAnswers(next);
    if (q) trackWrongIfNeeded(q, pendingPick, category);
    setPendingPick(null);
    if (mode === 'test' && idx < pool.length - 1) {
      setIdx(idx + 1);
      return;
    }
    if (mode === 'practice') runAfterQuizAd(() => {});
  }
  function handleNext() {
    if (mode === 'lesson') {
      recordPracticeDay();
      runAfterQuizAd(() => {
        if (idx < pool.length - 1) setIdx(idx + 1);
      });
      return;
    }
    if (idx < pool.length - 1) setIdx(idx + 1);
  }
  function handlePrev() { if (idx > 0) setIdx(idx - 1); }

  function handleSubmit() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mode === 'test') {
      const scored = scorePool(pool, answers);
      if (getUnlockStatus(category) === 'granted') {
        setUnlockStatus(category, 'used');
      }
      const result = {
        date: new Date().toISOString(),
        score: scored.earned,
        total: scored.total,
        passed: scored.percent >= meta.passPercent,
      };
      saveQuizResult(category, result);
      // Mirror to the cloud so progress follows a signed-in user across devices.
      if (user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        void saveQuizResultCloud(createClient(), user.id, category, result).catch(() => {});
      }
    }
    setSubmitted(true);
  }

  function handleSelectSet(si: number) {
    setSelectedSet(si);
    setRetryPool(null);
    setIdx(0); setPicked(null); setPendingPick(null); setSubmitted(false);
    if (mode === 'practice') setTimeLeft(PRACTICE_MINUTES * 60);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function handleRestart() {
    setRetryPool(null);
    if (mode === 'practice' || mode === 'lesson') setSelectedSet(null); // back to set picker
    else setShuffleKey(k => k + 1);
    setIdx(0); setPicked(null); setPendingPick(null); setSubmitted(false);
    setTimeLeft(mode === 'practice' ? PRACTICE_MINUTES * 60 : meta.timeLimitMinutes * 60);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function handleRetryWrong() {
    const wrong = pool.filter((q, i) => !isQuestionCorrect(q, answers[i]));
    setRetryPool(shuffleArray(wrong).map(shuffleChoices));
    setIdx(0); setPicked(null); setPendingPick(null); setSubmitted(false);
    setTimeLeft(PRACTICE_MINUTES * 60);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  }

  function renderMedia(q: Question) {
    if (!q.media) return null;
    return (
      <img src={q.media.src} alt={L(q.media.alt ?? {})}
        style={{ maxWidth: 220, maxHeight: 220, objectFit: 'contain' }}
        onError={e => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const ph = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (ph) ph.style.display = 'flex';
        }}
      />
    );
  }

  // Derived values
  const scored        = scorePool(pool, answers);
  const correctCount  = scored.correctQuestions;
  const scorePercent  = scored.percent;
  const passed        = scorePercent >= meta.passPercent;
  const metaName      = locale === 'my' ? meta.nameMy : locale === 'ja' ? meta.nameJa : meta.nameEn;
  const isLastQ       = idx === pool.length - 1;
  const hazardQ       = q ? isHazardQuestion(q) : false;
  const hazardDone    = hazardQ && q ? isAnswerComplete(q, answers[idx]) : false;
  const showExp           = mode === 'lesson' || (mode === 'practice' && (picked !== null || hazardDone));
  const isCorrectPick     = hazardQ && q
    ? isQuestionCorrect(q, answers[idx])
    : picked === (q?.answer ?? -1);
  const hazardReady       = hazardQ && q
    && partPicks.length === q.parts!.length
    && partPicks.every(p => p !== null)
    && !hazardDone;
  const showSubmitConfirm = (mode === 'practice' || mode === 'test') && (
    (pendingPick !== null && picked === null) || hazardReady
  );
  const testCanSubmit     = mode === 'test' && isLastQ && pendingPick === null && !hazardReady;

  // ══════════════════════════════════════════════════════════════════
  //  GATE SCREENS
  // ══════════════════════════════════════════════════════════════════
  if (mode === 'test' && gate === 'checking') {
    return <div className="quiz-layout" style={{ display: 'grid', placeItems: 'center' }}>
      <p style={{ color: 'var(--ink-soft)', fontFamily: 'var(--display)', fontWeight: 600 }}>{t('gate_checking')}</p>
    </div>;
  }

  if (mode === 'test' && gate === 'need_login') {
    return <div className="quiz-layout" style={{ display: 'grid', placeItems: 'center', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: 10 }}>{t('gate_signin_title')}</h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24, fontSize: '.95rem' }}>{t('gate_signin_desc')}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href={`/${locale}/auth/login`} className="btn btn-primary">{t('gate_signin_btn')}</Link>
          <Link href={`/${locale}/auth/signup`} className="btn btn-ghost">{t('gate_signup_btn')}</Link>
        </div>
      </div>
    </div>;
  }

  if (mode === 'test' && gate === 'limit_reached') {
    return <div className="quiz-layout" style={{ display: 'grid', placeItems: 'center', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>⏰</div>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: 10 }}>{t('gate_limit_title')}</h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 8, fontSize: '.95rem' }}><strong>{metaName}</strong> — {t('gate_limit_desc1')}</p>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24, fontSize: '.9rem' }}>{t('gate_limit_desc2')}</p>
        <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 14, padding: '14px 16px', marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.92rem', marginBottom: 6 }}>
            {t('gate_ad_title')}
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.82rem', marginBottom: 12 }}>
            {t('gate_ad_desc')}
          </p>
          <RewardedAdButton
            className="btn btn-ghost"
            label={t('gate_ad_button')}
            onRewarded={() => {
              setUnlockStatus(category, 'granted');
              setGate('allowed');
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href={`/${locale}/premium`} className="btn btn-primary">{t('gate_premium')}</Link>
          <BackButton label={`← ${t('back')}`} className="btn btn-ghost" />
        </div>
      </div>
    </div>;
  }

  // ══════════════════════════════════════════════════════════════════
  //  SET PICKER (practice + lesson)
  // ══════════════════════════════════════════════════════════════════
  if ((mode === 'practice' || mode === 'lesson') && selectedSet === null && !retryPool) {
    const isLesson = mode === 'lesson';
    const hasInspiredSets = setInfos.some(s => s.isInspiredSet);
    return (
      <div className="quiz-layout">
        <div className="quiz-wrap">
          <div style={{ marginBottom: 28 }}>
            <BackButton label={`← ${t('back')}`} className="btn btn-ghost" style={{ fontSize: '.82rem', padding: '8px 14px' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{metaName}</div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
              {t('choose_set') ?? 'Choose a set'}
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem' }}>
              {hasInspiredSets
                ? (isLesson ? t('set_desc_learn_inspired') : t('set_desc_inspired'))
                : (isLesson
                  ? (t('set_desc_learn') ?? `${questions.length} questions · ${setInfos.length} sets · self-paced`)
                  : (t('set_desc') ?? `${questions.length} questions · ${setInfos.length} sets · ${PRACTICE_MINUTES} min each`))}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {setInfos.map((info, si) => {
              const set = info.questions;
              const setTitle = info.isInspiredSet
                ? (locale === 'my'
                  ? set[0]?.inspiredSet?.titleMy ?? info.labelValues?.title
                  : info.labelValues?.title)
                : null;
              return (
                <button
                  key={si}
                  onClick={() => handleSelectSet(si)}
                  style={{
                    background: '#fff',
                    border: info.isInspiredSet ? '2px solid var(--guide)' : '2px solid var(--line)',
                    borderRadius: 16,
                    padding: '24px 16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'border-color .15s, box-shadow .15s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--guide)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(27,156,86,.15)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = info.isInspiredSet ? 'var(--guide)' : 'var(--line)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: info.isInspiredSet ? 'var(--guide-deep)' : 'var(--guide)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.1rem',
                  }}>
                    {si + 1}
                  </div>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.88rem', lineHeight: 1.25 }}>
                    {setTitle ?? `${t('set_label') ?? 'Set'} ${si + 1}`}
                  </div>
                  {info.isInspiredSet && (
                    <div style={{ fontSize: '.68rem', color: 'var(--guide-deep)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                      {t('inspired_set_badge')}
                    </div>
                  )}
                  <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', background: 'var(--paint)', padding: '3px 10px', borderRadius: 20 }}>
                    {set.length} {t('questions_count')}
                  </div>
                  {!isLesson && (
                    <div style={{ fontSize: '.72rem', color: 'var(--guide)', marginTop: 2 }}>
                      ⏱ {PRACTICE_MINUTES} {t('minutes')}
                    </div>
                  )}
                  {isLesson && (
                    <div style={{ fontSize: '.72rem', color: 'var(--guide)', marginTop: 2 }}>
                      📖 {t('self_paced') ?? 'Self-paced'}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: '.8rem', color: 'var(--ink-soft)' }}>
            {isLesson
              ? (t('set_hint_learn') ?? 'Questions appear in order. Take your time to study each one.')
              : (t('set_hint') ?? 'Questions within each set are shuffled every time.')}
          </p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  //  RESULTS SCREEN
  // ══════════════════════════════════════════════════════════════════
  if (submitted) {
    const wrongQs = pool.filter((question, i) => !isQuestionCorrect(question, answers[i]));
    const isRetry = retryPool !== null;

    if (mode === 'test') {
      const best = getBestScore(category);
      const bestPct = best ? Math.round((best.score / best.total) * 100) : scorePercent;

      return (
        <div className="quiz-layout">
          <div className="quiz-wrap">
            <div className="result-card">
              <div className={`result-icon ${passed ? 'pass' : 'fail'}`}>
                {passed
                  ? <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--guide)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>}
              </div>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', marginBottom: 8 }}>
                {passed ? t('result_pass') : t('result_fail')}
              </h2>
              <div className={`score-big ${passed ? 'pass' : 'fail'}`}>{scorePercent}%</div>
              <p style={{ color: 'var(--ink-soft)', marginTop: 12 }}>
                {scored.earned} / {scored.total} {t('result_points')}
                <span style={{ display: 'block', marginTop: 4, fontSize: '.85rem' }}>
                  {correctCount} / {pool.length} {t('result_correct')}
                </span>
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                <StatPill color="var(--guide)" label={t('correct')} value={correctCount} />
                <StatPill color="var(--red, #e53e3e)" label={t('wrong')} value={wrongQs.length} />
                {best && <StatPill color="var(--asphalt)" label="Best" value={`${bestPct}%`} />}
                <StatPill color="var(--asphalt)" label={t('result_attempts') ?? 'Tries'} value={getAttemptCount(category)} />
              </div>
              <WrongReview wrongQs={wrongQs} answers={answers} pool={pool} L={L} choiceLabel={choiceLabel} t={t} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                {wrongQs.length > 0 && (
                  <RewardedAdButton
                    className="btn btn-primary"
                    label={t('retry_wrong') ?? `Retry ${wrongQs.length} wrong`}
                    onRewarded={handleRetryWrong}
                  />
                )}
                <RewardedAdButton
                  className="btn btn-ghost"
                  label={t('result_try_again') ?? 'Try again'}
                  onRewarded={handleRestart}
                />
                <BackButton label={t('back')} className="btn btn-ghost" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Practice results
    return (
      <div className="quiz-layout">
        <div className="quiz-wrap">
          <div className="result-card">
            <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>
              {wrongQs.length === 0 ? '🎉' : wrongQs.length <= Math.ceil(pool.length * 0.2) ? '💪' : '📚'}
            </div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: 6 }}>
              {isRetry
                ? (t('retry_result') ?? 'Retry complete')
                : (t('practice_result') ?? 'Practice complete')}
              {selectedSet !== null && !isRetry && (
                <span style={{ display: 'block', fontSize: '.9rem', fontWeight: 500, color: 'var(--ink-soft)', marginTop: 4 }}>
                  {t('set_label') ?? 'Set'} {selectedSet + 1}
                </span>
              )}
            </h2>

            <div className={`score-big ${wrongQs.length === 0 ? 'pass' : scorePercent >= 70 ? '' : 'fail'}`}
              style={scorePercent >= 70 && wrongQs.length > 0 ? { color: 'var(--amber, #d97706)' } : undefined}>
              {scorePercent}%
            </div>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
              <StatPill color="var(--guide)" label={t('correct')} value={correctCount} />
              <StatPill color="var(--red, #e53e3e)" label={t('wrong')} value={wrongQs.length} />
              <StatPill color="var(--asphalt)" label="Total" value={pool.length} />
            </div>

            {wrongQs.length === 0 && (
              <div style={{ background: '#edfaed', border: '1px solid var(--guide)', borderRadius: 12, padding: '12px 18px', marginTop: 20, fontSize: '.9rem', color: 'var(--guide-deep)', fontFamily: 'var(--display)', fontWeight: 600 }}>
                {t('all_correct') ?? '🎉 Perfect — all answers correct!'}
              </div>
            )}

            <WrongReview wrongQs={wrongQs} answers={answers} pool={pool} L={L} choiceLabel={choiceLabel} t={t} showExplanation />
            <AdBanner placement="quiz_result" slot={AD_SLOTS.quiz_result} format="rectangle" className="quiz-ad" />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
              {wrongQs.length > 0 && (
                <button className="btn btn-primary" onClick={handleRetryWrong}>
                  {t('retry_wrong') ?? `Retry ${wrongQs.length} wrong`}
                </button>
              )}
              <button className="btn btn-ghost" onClick={handleRestart}>
                {isRetry ? (t('back_to_sets') ?? 'Back to sets') : (t('shuffle_restart') ?? 'New shuffle')}
              </button>
              <BackButton label={t('back')} className="btn btn-ghost" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  //  QUIZ SCREEN
  // ══════════════════════════════════════════════════════════════════
  const showTimer = mode === 'test' || (mode === 'practice' && selectedSet !== null);
  const practiceCanFinish = mode === 'practice' && isLastQ;

  return (
    <>
      {showInterstitialAd && <QuizInterstitialAd onContinue={handleAdContinue} />}
    <div className="quiz-layout">
      <div className="quiz-wrap">

        {/* Header */}
        <div className="quiz-header">
          {(mode === 'practice' || mode === 'lesson') ? (
            <button className="btn btn-ghost" style={{ fontSize: '.82rem', padding: '8px 14px' }}
              onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setSelectedSet(null); setRetryPool(null); setSubmitted(false); setIdx(0); setPicked(null); setPendingPick(null); }}>
              ← {t('sets') ?? 'Sets'}
            </button>
          ) : (
            <BackButton label={`← ${t('back')}`} className="btn btn-ghost" style={{ fontSize: '.82rem', padding: '8px 14px' }} />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.9rem', color: 'var(--ink-soft)' }}>
              {t('question')} {idx + 1} {t('of')} {pool.length}
            </span>
            {retryPool && (
              <span style={{ fontSize: '.68rem', color: 'var(--red, #e53e3e)', background: 'rgba(229,57,53,.1)', padding: '1px 8px', borderRadius: 20, fontFamily: 'var(--display)', fontWeight: 700 }}>
                {t('retry_mode') ?? 'RETRY'}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {showTimer && (
              <div className={`timer-badge ${timeLeft < 120 ? 'urgent' : ''}`}>
                ⏱ {formatTime(timeLeft)}
              </div>
            )}
            <ReminderBell lang={locale} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((idx + 1) / pool.length) * 100}%` }} />
        </div>

        {/* Card */}
        {q && (
          <div className="quiz-card">
            {q.media && (
              <div className="quiz-media">
                {renderMedia(q)}
                <div style={{ display: 'none' }}><MediaPlaceholder label={L(q.media.alt ?? {})} /></div>
              </div>
            )}

            {/* Card top row: question label + Myanmar toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="quiz-q-label">
                {mode === 'lesson' ? 'Lesson' : mode === 'practice' ? 'Practice' : 'Mock Test'} · {idx + 1} / {pool.length}
              </div>
              {(mode === 'lesson' || mode === 'practice') && locale !== 'my' && (
                <button
                  onClick={() => setShowMyanmar(v => !v)}
                  style={{
                    background: showMyanmar ? 'var(--guide)' : 'transparent',
                    color: showMyanmar ? '#fff' : 'var(--guide)',
                    border: '1px solid var(--guide)',
                    borderRadius: 20, padding: '4px 14px', fontSize: '.75rem',
                    cursor: 'pointer', fontFamily: 'var(--display)', fontWeight: 700,
                  }}>
                  🇲🇲 မြန်မာ
                </button>
              )}
            </div>

            <div className="qtext">{L(q.prompt)}</div>
            {showMyanmar && locale !== 'my' && q.prompt['my'] && (
              <div style={{ fontSize: '.9em', color: 'var(--ink-soft)', marginTop: -8, marginBottom: 16, lineHeight: 1.65 }}>
                {q.prompt['my']}
              </div>
            )}

            {hazardQ && q?.parts ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: '.78rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--guide-deep)' }}>
                  {t('hazard_title')}
                </div>
                {q.parts.map((part, pi) => {
                  const partAnswered = hazardDone && Array.isArray(answers[idx]) ? (answers[idx] as number[])[pi] : partPicks[pi];
                  return (
                    <div key={pi} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '12px 14px', background: 'var(--paint)' }}>
                      <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem', color: 'var(--guide-deep)', marginBottom: 8 }}>
                        {part.label ?? partLabel(pi)}
                      </div>
                      <div style={{ fontSize: '.92rem', lineHeight: 1.6, marginBottom: 10 }}>{L(part.prompt)}</div>
                      <div className="opts" style={{ gap: 8 }}>
                        {[0, 1].map(choiceIdx => {
                          let cls = 'opt';
                          const label = choiceIdx === 0 ? t('hazard_true') : t('hazard_false');
                          if (mode === 'lesson') {
                            if (choiceIdx === part.answer) cls += ' correct';
                          } else if (hazardDone && Array.isArray(answers[idx])) {
                            const saved = (answers[idx] as number[])[pi];
                            if (choiceIdx === part.answer) cls += ' correct';
                            else if (choiceIdx === saved) cls += ' wrong';
                          } else if (partPicks[pi] === choiceIdx) {
                            cls += ' correct';
                          }
                          return (
                            <button
                              key={choiceIdx}
                              className={cls}
                              disabled={mode === 'lesson' || hazardDone}
                              onClick={() => handlePartPick(pi, choiceIdx)}
                              style={{ padding: '10px 14px' }}
                            >
                              <span className="k">{choiceIdx === 0 ? '○' : '×'}</span>
                              <span className="opt-text">{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
            <div className="opts">
              {q.choices.map((choice, i) => {
                let cls = 'opt';
                if (mode === 'lesson') {
                  if (i === q.answer) cls += ' correct';
                } else if (mode === 'practice' && picked !== null) {
                  if (i === q.answer) cls += ' correct';
                  else if (i === picked) cls += ' wrong';
                }
                const isPending = pendingPick === i && picked === null;
                return (
                  <button key={i} className={cls}
                    disabled={mode === 'lesson' || ((mode === 'practice' || mode === 'test') && picked !== null)}
                    onClick={() => handlePick(i)}
                    style={isPending ? { borderColor: 'var(--guide)', background: 'rgba(27,156,86,.06)' } : undefined}>
                    <span className="k" style={isPending ? { background: 'var(--guide)', color: '#fff' } : undefined}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="opt-text">
                      <span>{choiceLabel(choice.text)}</span>
                      {showMyanmar && locale !== 'my' && choice.text['my'] && (
                        <span className="opt-my">{choice.text['my']}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            )}

            {/* Improved explanation UI */}
            {showExp && (
              <div style={{ marginTop: 16 }}>
                {/* Result banner */}
                {mode === 'practice' && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                    background: isCorrectPick ? 'rgba(27,156,86,.08)' : 'rgba(224,71,76,.07)',
                    border: `2px solid ${isCorrectPick ? 'var(--guide)' : 'var(--red)'}`,
                    borderRadius: 12, padding: '12px 16px', marginBottom: 12,
                  }}>
                    <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>
                      {isCorrectPick ? '✅' : '❌'}
                    </span>
                    <strong style={{ fontFamily: 'var(--display)', color: isCorrectPick ? 'var(--guide-deep)' : 'var(--red)', fontSize: '.95rem' }}>
                      {isCorrectPick ? t('correct') : t('wrong')}
                    </strong>
                    {!isCorrectPick && (
                      <span style={{ color: 'var(--ink-soft)', fontSize: '.85rem' }}>
                        · {t('correct_answer') ?? 'Correct'}: <strong style={{ color: 'var(--ink)' }}>{choiceLabel(q.choices[q.answer].text)}</strong>
                      </span>
                    )}
                  </div>
                )}

                {/* Explanation card */}
                <div style={{
                  background: 'var(--paint-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: 1 }}>💡</span>
                  <div>
                    {mode === 'lesson' && (
                      <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 4 }}>
                        {t('explanation')}
                      </div>
                    )}
                    <div style={{ fontSize: '.88rem', color: 'var(--ink)', lineHeight: 1.65 }}>
                      {L(q.explanation)}
                    </div>
                    {showMyanmar && locale !== 'my' && q.explanation?.['my'] && (
                      <div style={{ fontSize: '.82rem', color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.6 }}>
                        {q.explanation['my']}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation — flex row with Submit absolutely centred so Prev/Next never shift */}
        <div className="quiz-nav-bar" style={{ marginTop: 24 }}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left: Previous */}
            <button className="btn btn-ghost" onClick={handlePrev} disabled={idx === 0}
              style={{ opacity: idx === 0 ? .4 : 1 }}>
              ← {t('prev')}
            </button>

            {/* Centre: Submit Answer — absolutely positioned so it never shifts Prev/Next */}
            {showSubmitConfirm && (
              <button className="btn btn-primary" onClick={handleConfirm}
                style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 700, minWidth: 140, whiteSpace: 'nowrap' }}>
                {t('submit') ?? 'Submit Answer'}
              </button>
            )}

            {/* Right: Next / Finish / Submit Test */}
            <div>
              {practiceCanFinish && (
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {t('finish')} →
                </button>
              )}
              {!practiceCanFinish && testCanSubmit && (
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {t('submit_test')}
                </button>
              )}
              {!practiceCanFinish && !testCanSubmit && (
                <button className="btn btn-primary" onClick={handleNext}
                  disabled={isLastQ}
                  style={{ opacity: isLastQ ? .4 : 1 }}>
                  {t('next')} →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question navigator — practice + test mode */}
        {(mode === 'practice' || mode === 'test') && (
          <QuestionNavigator
            pool={pool} answers={answers} idx={idx} onJump={setIdx} t={t}
            showResults={mode === 'practice'}
            onSubmitTest={mode === 'test' ? handleSubmit : undefined}
          />
        )}

      </div>
    </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────
function QuestionNavigator({
  pool, answers, idx, onJump, t, showResults = true, onSubmitTest,
}: {
  pool: Question[];
  answers: QuizAnswer[];
  idx: number;
  onJump: (i: number) => void;
  t: (key: string) => string;
  showResults?: boolean;
  onSubmitTest?: () => void;
}) {
  const answeredCount = pool.filter((question, i) => isAnswerComplete(question, answers[i])).length;
  const correctCount  = pool.filter((question, i) => isAnswerComplete(question, answers[i]) && isQuestionCorrect(question, answers[i])).length;
  const wrongCount    = pool.filter((question, i) => isAnswerComplete(question, answers[i]) && !isQuestionCorrect(question, answers[i])).length;
  const unanswered    = pool.length - answeredCount;

  return (
    <div style={{ marginTop: 20, background: '#fff', border: '1px solid var(--line)', borderRadius: 18, padding: '18px 20px', boxShadow: 'var(--shadow)' }}>
      {/* Summary row */}
      <div style={{ display: 'flex', gap: 1, marginBottom: 16, background: 'var(--paint-2)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)' }}>
        {showResults ? (
          <>
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px', background: 'rgba(27,156,86,.06)' }}>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--guide)', lineHeight: 1 }}>{correctCount}</div>
              <div style={{ fontSize: '.65rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', color: 'var(--ink-soft)', marginTop: 4, textTransform: 'uppercase' }}>Correct</div>
            </div>
            <div style={{ width: 1, background: 'var(--line)', alignSelf: 'stretch' }} />
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px', background: 'rgba(224,71,76,.05)' }}>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--red)', lineHeight: 1 }}>{wrongCount}</div>
              <div style={{ fontSize: '.65rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', color: 'var(--ink-soft)', marginTop: 4, textTransform: 'uppercase' }}>Incorrect</div>
            </div>
            <div style={{ width: 1, background: 'var(--line)', alignSelf: 'stretch' }} />
          </>
        ) : (
          <>
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px', background: 'rgba(27,156,86,.06)' }}>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--guide)', lineHeight: 1 }}>{answeredCount}</div>
              <div style={{ fontSize: '.65rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', color: 'var(--ink-soft)', marginTop: 4, textTransform: 'uppercase' }}>Answered</div>
            </div>
            <div style={{ width: 1, background: 'var(--line)', alignSelf: 'stretch' }} />
          </>
        )}
        <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px' }}>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--ink-soft)', lineHeight: 1 }}>{unanswered}</div>
          <div style={{ fontSize: '.65rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', color: 'var(--ink-soft)', marginTop: 4, textTransform: 'uppercase' }}>{t('unanswered') ?? 'Left'}</div>
        </div>
      </div>

      {/* Number grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center' }}>
        {pool.map((question, i) => {
          const ans = answers[i];
          const isCurrent = i === idx;
          const isAnswered = isAnswerComplete(question, ans);
          const isCorrect  = isAnswered && isQuestionCorrect(question, ans);
          const isWrong    = isAnswered && !isQuestionCorrect(question, ans);

          let bg     = 'var(--paint-2)';
          let color  = 'var(--ink-soft)';
          let border = '2px solid transparent';
          let fontWeight = 600;

          if (showResults) {
            if (isCorrect) { bg = 'rgba(27,156,86,.15)'; color = 'var(--guide-deep)'; }
            if (isWrong)   { bg = 'rgba(224,71,76,.12)'; color = 'var(--red)'; }
          } else {
            if (isAnswered) { bg = 'rgba(27,156,86,.15)'; color = 'var(--guide-deep)'; }
          }
          if (isCurrent) { border = '2px solid var(--guide)'; fontWeight = 800; }

          return (
            <button key={i} onClick={() => onJump(i)} style={{
              width: 32, height: 32, borderRadius: 8,
              background: bg, color, border, fontWeight,
              fontFamily: 'var(--display)', fontSize: '.72rem',
              cursor: 'pointer', transition: '.12s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Submit Test button inside navigator */}
      {onSubmitTest && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={onSubmitTest}
            style={{ minWidth: 180, fontWeight: 700 }}
          >
            {unanswered > 0
              ? `${t('submit_test') ?? 'Submit Test'} (${unanswered} ${t('unanswered') ?? 'left'})`
              : (t('submit_test') ?? 'Submit Test')}
          </button>
        </div>
      )}
    </div>
  );
}

function StatPill({ color, label, value }: { color: string; label: string; value: number | string }) {
  return (
    <div style={{ textAlign: 'center', background: 'var(--paint-2)', borderRadius: 10, padding: '8px 16px', minWidth: 60 }}>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.2rem', color }}>{value}</div>
      <div style={{ fontSize: '.7rem', color: 'var(--ink-soft)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function WrongReview({
  wrongQs, answers, pool, L, choiceLabel, t, showExplanation,
}: {
  wrongQs: Question[];
  answers: QuizAnswer[];
  pool: Question[];
  L: (obj: Partial<Record<string, string>>) => string;
  choiceLabel: (text: Partial<Record<string, string>>) => string;
  t: (key: string) => string;
  showExplanation?: boolean;
}) {
  if (wrongQs.length === 0) return null;
  return (
    <div style={{ width: '100%', marginTop: 24, textAlign: 'left' }}>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.75rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 10 }}>
        {t('wrong_review') ?? 'Review wrong answers'} ({wrongQs.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
        {wrongQs.map((wq, wi) => {
          const yourAns = answers[pool.indexOf(wq)];
          return (
            <div key={wq.id} style={{ background: 'var(--paint)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px', fontSize: '.82rem' }}>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>
                {wi + 1}. {L(wq.prompt)}
              </div>
              {isHazardQuestion(wq) && wq.parts ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {wq.parts.map((part, pi) => {
                    const saved = Array.isArray(yourAns) ? yourAns[pi] : null;
                    const correctLabel = part.answer === 0 ? t('hazard_true') : t('hazard_false');
                    const yourLabel = saved === 0 ? t('hazard_true') : saved === 1 ? t('hazard_false') : '—';
                    return (
                      <div key={pi} style={{ fontSize: '.8rem', color: 'var(--ink-soft)' }}>
                        <strong>{part.label ?? partLabel(pi)}</strong> {L(part.prompt)}
                        <div>{t('your_answer') ?? 'Your answer'}: {yourLabel} · {t('correct_answer') ?? 'Correct'}: {correctLabel}</div>
                      </div>
                    );
                  })}
                </div>
              ) : yourAns !== null && typeof yourAns === 'number' && (
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', color: 'var(--red, #e53e3e)', marginBottom: 4 }}>
                  <span style={{ flexShrink: 0 }}>✗</span>
                  <span><strong>{t('your_answer') ?? 'Your answer'}:</strong> {choiceLabel(wq.choices[yourAns].text)}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', color: 'var(--guide)' }}>
                <span style={{ flexShrink: 0 }}>✓</span>
                <span><strong>{t('correct_answer') ?? 'Correct'}:</strong> {choiceLabel(wq.choices[wq.answer].text)}</span>
              </div>
              {showExplanation && wq.explanation && (
                <div style={{ marginTop: 8, padding: '8px 10px', background: '#fff', borderRadius: 8, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                  💡 {L(wq.explanation)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
