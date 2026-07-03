'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BackButton from '@/components/BackButton';
import { useCountry } from '@/components/CountryProvider';
import {
  SG_CLASS3_PRACTICAL,
  DEMERIT_FAIL_THRESHOLD,
  clearChecklistState,
  filterChecklistByTags,
  loadChecklistState,
  pickChecklistText,
  saveChecklistState,
  scorePracticalChecklist,
  type PracticalCheckItem,
  type PracticalCheckSection,
  type PracticalCheckVariant,
} from '@/lib/practicalChecklist';
import {
  SG_PRACTICAL_GUIDE,
  getItemGuideForItem,
  getSectionGuide,
  pickGuideText,
  type CriticalMoment,
  type ItemGuide,
  type SectionGuide,
} from '@/lib/practicalGuide';
import type { Locale } from '@/lib/types';

export default function PracticalChecklist() {
  const params = useParams();
  const locale = (params?.locale as Locale) ?? 'en';
  const { country } = useCountry();
  const t = useTranslations('practicalChecklist');

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [remarks, setRemarks] = useState('');
  const [showAtv, setShowAtv] = useState(false);
  const [showAtm, setShowAtm] = useState(true);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['narrow']));
  const [showGuide, setShowGuide] = useState(true);
  const [openMoment, setOpenMoment] = useState<string | null>('emergency_brake_demo');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadChecklistState();
    if (saved) {
      setChecked(new Set(saved.checked));
      setRemarks(saved.remarks);
      setShowAtv(saved.showAtv);
      setShowAtm(saved.showAtm);
      setOpenSections(new Set(saved.openSections.length ? saved.openSections : ['narrow']));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveChecklistState({
      checked: [...checked],
      remarks,
      showAtv,
      showAtm,
      openSections: [...openSections],
    });
  }, [checked, remarks, showAtv, showAtm, openSections, hydrated]);

  const data = useMemo(
    () => filterChecklistByTags(SG_CLASS3_PRACTICAL, showAtv, showAtm),
    [showAtv, showAtm]
  );

  const score = useMemo(() => scorePracticalChecklist(checked, data), [checked, data]);

  const toggle = useCallback((id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSection = useCallback((id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = () => setOpenSections(new Set(data.sections.map(s => s.id)));
  const collapseAll = () => setOpenSections(new Set());

  const resetAll = () => {
    if (!confirm(t('reset_confirm'))) return;
    setChecked(new Set());
    setRemarks('');
    clearChecklistState();
  };

  const demeritPct = Math.min(100, (score.demeritPoints / DEMERIT_FAIL_THRESHOLD) * 100);

  if (country !== 'sg') {
    return (
      <div className="pcl-wrap">
        <div className="pcl-hero">
          <BackButton label={t('breadcrumb_home')} className="pcl-back" />
          <div className="pcl-hero-inner">
            <div className="eyebrow">{t('hero.eyebrow')}</div>
            <h1>{t('sg_only_title')}</h1>
            <p>{t('sg_only_lead')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pcl-wrap">
      <div className="pcl-hero">
        <div className="pcl-hero-bar">
          <BackButton label={t('breadcrumb_home')} className="pcl-back" />
          <span className="pcl-crumb">/ {t('breadcrumb_title')}</span>
        </div>
        <div className="pcl-hero-inner">
          <div className="eyebrow">{t('hero.eyebrow')}</div>
          <h1>{pickChecklistText(data.meta.title, locale)}</h1>
          <p>{pickChecklistText(data.meta.subtitle, locale)}</p>
        </div>
      </div>

      <div className="pcl-score-sticky" role="status" aria-live="polite">
        <div className="pcl-score-grid">
          <div className="pcl-score-card">
            <span className="pcl-score-label">{t('demerit_points')}</span>
            <span className={`pcl-score-value ${score.demeritPoints >= DEMERIT_FAIL_THRESHOLD ? 'fail' : ''}`}>
              {score.demeritPoints}
              <small>/{DEMERIT_FAIL_THRESHOLD}</small>
            </span>
            <div className="pcl-meter" aria-hidden="true">
              <div className="pcl-meter-fill" style={{ width: `${demeritPct}%` }} />
            </div>
          </div>
          <div className="pcl-score-card">
            <span className="pcl-score-label">{t('immediate_failures')}</span>
            <span className={`pcl-score-value ${score.immediateFailures > 0 ? 'fail' : ''}`}>
              {score.immediateFailures}
            </span>
          </div>
          <div className={`pcl-result-card ${score.passed ? 'pass' : score.checkedCount > 0 ? 'fail' : 'neutral'}`}>
            <span className="pcl-result-label">{t('result')}</span>
            <span className="pcl-result-value">
              {score.checkedCount === 0 ? '—' : score.passed ? t('passed') : t('failed')}
            </span>
          </div>
        </div>
        <p className="pcl-rules">{pickChecklistText(data.meta.rules, locale)}</p>
      </div>

      {showGuide && (
        <div className="pcl-critical">
          <div className="pcl-critical-head">
            <h2>{t('critical_title')}</h2>
            <p>{t('critical_sub')}</p>
          </div>
          <div className="pcl-moments">
            {SG_PRACTICAL_GUIDE.criticalMoments.map(moment => (
              <CriticalMomentCard
                key={moment.id}
                moment={moment}
                locale={locale}
                open={openMoment === moment.id}
                onToggle={() => setOpenMoment(openMoment === moment.id ? null : moment.id)}
                onJump={moment.relatedSection ? () => {
                  setOpenSections(prev => new Set([...prev, moment.relatedSection!]));
                  document.getElementById(`section-${moment.relatedSection}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } : undefined}
                t={t}
              />
            ))}
          </div>
        </div>
      )}

      <div className="pcl-toolbar">
        <div className="pcl-toggles">
          <label className="pcl-toggle">
            <input type="checkbox" checked={showGuide} onChange={e => setShowGuide(e.target.checked)} />
            <span>{t('show_guide')}</span>
          </label>
          <label className="pcl-toggle">
            <input type="checkbox" checked={showAtm} onChange={e => setShowAtm(e.target.checked)} />
            <span>{t('show_atm')}</span>
          </label>
          <label className="pcl-toggle">
            <input type="checkbox" checked={showAtv} onChange={e => setShowAtv(e.target.checked)} />
            <span>{t('show_atv')}</span>
          </label>
        </div>
        <div className="pcl-toolbar-actions">
          <button type="button" className="pcl-btn ghost" onClick={expandAll}>{t('expand_all')}</button>
          <button type="button" className="pcl-btn ghost" onClick={collapseAll}>{t('collapse_all')}</button>
          <button type="button" className="pcl-btn danger" onClick={resetAll}>{t('reset')}</button>
        </div>
      </div>

      <div className="pcl-sections">
        {data.sections.map(section => (
          <SectionBlock
            key={section.id}
            section={section}
            locale={locale}
            checked={checked}
            open={openSections.has(section.id)}
            showGuide={showGuide}
            onToggleSection={() => toggleSection(section.id)}
            onToggleItem={toggle}
            t={t}
          />
        ))}
      </div>

      <div className="pcl-remarks">
        <label className="pcl-remarks-label" htmlFor="pcl-remarks">{t('remarks')}</label>
        <textarea
          id="pcl-remarks"
          className="pcl-remarks-input"
          rows={3}
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          placeholder={t('remarks_ph')}
        />
      </div>

      <div className="pcl-footer-note">
        <p>{t('disclaimer')}</p>
      </div>
    </div>
  );
}

function CriticalMomentCard({
  moment, locale, open, onToggle, onJump, t,
}: {
  moment: CriticalMoment;
  locale: Locale;
  open: boolean;
  onToggle: () => void;
  onJump?: () => void;
  t: ReturnType<typeof useTranslations<'practicalChecklist'>>;
}) {
  return (
    <article className={`pcl-moment ${open ? 'open' : ''}`}>
      <button type="button" className="pcl-moment-head" onClick={onToggle} aria-expanded={open}>
        <span className="pcl-moment-icon" aria-hidden="true">⚠</span>
        <div className="pcl-moment-titles">
          <h3>{pickGuideText(moment.title, locale)}</h3>
          {!open && <p>{pickGuideText(moment.lead, locale).slice(0, 100)}…</p>}
        </div>
        <span className="pcl-chevron">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pcl-moment-body">
          <p className="pcl-moment-lead">{pickGuideText(moment.lead, locale)}</p>
          <div className="pcl-steps">
            <h4>{t('steps_label')}</h4>
            <ol>
              {moment.steps.map(step => (
                <li key={pickGuideText(step.title, locale)}>
                  <strong>{pickGuideText(step.title, locale)}</strong>
                  <span>{pickGuideText(step.body, locale)}</span>
                </li>
              ))}
            </ol>
          </div>
          {moment.warnings.length > 0 && (
            <div className="pcl-warn-box">
              <h4>{t('warnings_label')}</h4>
              <ul>
                {moment.warnings.map(w => (
                  <li key={pickGuideText(w, locale)}>{pickGuideText(w, locale)}</li>
                ))}
              </ul>
            </div>
          )}
          {onJump && (
            <button type="button" className="pcl-btn ghost pcl-jump" onClick={onJump}>
              {t('jump_section')} →
            </button>
          )}
        </div>
      )}
    </article>
  );
}

function SectionGuidePanel({ guide, locale, t }: {
  guide: SectionGuide;
  locale: Locale;
  t: ReturnType<typeof useTranslations<'practicalChecklist'>>;
}) {
  return (
    <div className="pcl-section-guide">
      <p className="pcl-guide-overview">{pickGuideText(guide.overview, locale)}</p>
      <div className="pcl-guide-focus">
        <span className="pcl-guide-label">{t('examiner_focus')}</span>
        <p>{pickGuideText(guide.examinerFocus, locale)}</p>
      </div>
      {guide.tips.length > 0 && (
        <div className="pcl-tip-box">
          <h4>{t('tips_label')}</h4>
          <ul>
            {guide.tips.map(tip => (
              <li key={pickGuideText(tip, locale)}>{pickGuideText(tip, locale)}</li>
            ))}
          </ul>
        </div>
      )}
      {guide.warnings.length > 0 && (
        <div className="pcl-warn-box compact">
          <h4>{t('warnings_label')}</h4>
          <ul>
            {guide.warnings.map(w => (
              <li key={pickGuideText(w, locale)}>{pickGuideText(w, locale)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ItemGuidePanel({ guide, locale, t }: {
  guide: ItemGuide;
  locale: Locale;
  t: ReturnType<typeof useTranslations<'practicalChecklist'>>;
}) {
  return (
    <div className="pcl-item-guide">
      <p>{pickGuideText(guide.explain, locale)}</p>
      {guide.procedure && guide.procedure.length > 0 && (
        <div className="pcl-steps compact">
          <h4>{t('procedure_label')}</h4>
          <ol>
            {guide.procedure.map(step => (
              <li key={pickGuideText(step.title, locale)}>
                <strong>{pickGuideText(step.title, locale)}</strong>
                <span>{pickGuideText(step.body, locale)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {guide.avoid.length > 0 && (
        <div className="pcl-tip-box compact">
          <h4>{t('how_to_avoid')}</h4>
          <ul>
            {guide.avoid.map(a => (
              <li key={pickGuideText(a, locale)}>{pickGuideText(a, locale)}</li>
            ))}
          </ul>
        </div>
      )}
      {guide.mistakes.length > 0 && (
        <div className="pcl-warn-box compact">
          <h4>{t('common_mistakes')}</h4>
          <ul>
            {guide.mistakes.map(m => (
              <li key={pickGuideText(m, locale)}>{pickGuideText(m, locale)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  section, locale, checked, open, showGuide, onToggleSection, onToggleItem, t,
}: {
  section: PracticalCheckSection;
  locale: Locale;
  checked: Set<string>;
  open: boolean;
  showGuide: boolean;
  onToggleSection: () => void;
  onToggleItem: (id: string) => void;
  t: ReturnType<typeof useTranslations<'practicalChecklist'>>;
}) {
  const sectionGuide = getSectionGuide(section.id);
  const sectionChecked = section.items.reduce((n, item) => {
    if (item.variants?.length) {
      return n + item.variants.filter(v => checked.has(v.id)).length;
    }
    return n + (checked.has(item.id) ? 1 : 0);
  }, 0);

  return (
    <section id={`section-${section.id}`} className={`pcl-section ${open ? 'open' : ''}`}>
      <button type="button" className="pcl-section-head" onClick={onToggleSection} aria-expanded={open}>
        <div className="pcl-section-title-wrap">
          <h2>{pickChecklistText(section.title, locale)}</h2>
          {section.subtitle && (
            <span className="pcl-section-sub">{pickChecklistText(section.subtitle, locale)}</span>
          )}
        </div>
        <div className="pcl-section-meta">
          {sectionChecked > 0 && <span className="pcl-section-count">{sectionChecked}</span>}
          <span className="pcl-chevron" aria-hidden="true">{open ? '−' : '+'}</span>
        </div>
      </button>
      {open && (
        <div className="pcl-section-body">
          {showGuide && sectionGuide && (
            <SectionGuidePanel guide={sectionGuide} locale={locale} t={t} />
          )}
          {section.items.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              sectionId={section.id}
              locale={locale}
              checked={checked}
              showGuide={showGuide}
              onToggle={onToggleItem}
              t={t}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ItemRow({
  item, sectionId, locale, checked, showGuide, onToggle, t,
}: {
  item: PracticalCheckItem;
  sectionId: string;
  locale: Locale;
  checked: Set<string>;
  showGuide: boolean;
  onToggle: (id: string) => void;
  t: ReturnType<typeof useTranslations<'practicalChecklist'>>;
}) {
  const [tipsOpen, setTipsOpen] = useState(false);
  const label = pickChecklistText(item.label, locale);
  const itemGuide = showGuide ? getItemGuideForItem(item.id, item.num, sectionId) : undefined;

  if (item.variants?.length) {
    return (
      <div className="pcl-item pcl-item-group">
        <div className="pcl-item-head">
          <span className="pcl-num">{item.num}</span>
          <span className="pcl-item-label">{label}</span>
          {item.tag && <span className="pcl-tag">{item.tag.toUpperCase()}</span>}
          {itemGuide && (
            <button
              type="button"
              className={`pcl-tips-btn ${tipsOpen ? 'active' : ''}`}
              onClick={() => setTipsOpen(!tipsOpen)}
              aria-expanded={tipsOpen}
            >
              {tipsOpen ? t('hide_tips') : t('show_tips')}
            </button>
          )}
        </div>
        {tipsOpen && itemGuide && <ItemGuidePanel guide={itemGuide} locale={locale} t={t} />}
        <div className="pcl-variants">
          {item.variants.map(v => (
            <VariantCheck key={v.id} variant={v} locale={locale} checked={checked.has(v.id)} onToggle={onToggle} t={t} />
          ))}
        </div>
      </div>
    );
  }

  const isChecked = checked.has(item.id);
  const isImmediate = item.immediateFailure;
  const demerits = item.noDemerit ? 0 : (item.demerits ?? 0);

  return (
    <div className="pcl-item-wrap">
      <label className={`pcl-item pcl-item-single ${isChecked ? 'checked' : ''} ${isImmediate ? 'immediate' : ''}`}>
        <input type="checkbox" checked={isChecked} onChange={() => onToggle(item.id)} className="pcl-check" />
        <span className="pcl-num">{item.num}</span>
        <span className="pcl-item-label">{label}</span>
        {item.tag && <span className="pcl-tag">{item.tag.toUpperCase()}</span>}
        <span className="pcl-badges">
          {isImmediate && <span className="pcl-badge if">{t('badge_if')}</span>}
          {!item.noDemerit && demerits > 0 && <span className="pcl-badge pts">−{demerits}</span>}
          {item.noDemerit && <span className="pcl-badge zero">{t('badge_zero')}</span>}
        </span>
        {itemGuide && (
          <button
            type="button"
            className={`pcl-tips-btn inline ${tipsOpen ? 'active' : ''}`}
            onClick={e => { e.preventDefault(); setTipsOpen(!tipsOpen); }}
            aria-expanded={tipsOpen}
          >
            {tipsOpen ? '▾' : '▸'} {t('tips_short')}
          </button>
        )}
      </label>
      {tipsOpen && itemGuide && <ItemGuidePanel guide={itemGuide} locale={locale} t={t} />}
    </div>
  );
}

function VariantCheck({
  variant, locale, checked, onToggle, t,
}: {
  variant: PracticalCheckVariant;
  locale: Locale;
  checked: boolean;
  onToggle: (id: string) => void;
  t: ReturnType<typeof useTranslations<'practicalChecklist'>>;
}) {
  const isImmediate = variant.immediateFailure;
  const demerits = variant.noDemerit ? 0 : variant.demerits;

  return (
    <label className={`pcl-variant ${checked ? 'checked' : ''} ${isImmediate ? 'immediate' : ''}`}>
      <input type="checkbox" checked={checked} onChange={() => onToggle(variant.id)} className="pcl-check" />
      <span className="pcl-variant-label">{pickChecklistText(variant.label, locale)}</span>
      <span className="pcl-badges">
        {isImmediate && <span className="pcl-badge if">{t('badge_if')}</span>}
        {!variant.noDemerit && demerits > 0 && <span className="pcl-badge pts">−{demerits}</span>}
        {variant.noDemerit && <span className="pcl-badge zero">{t('badge_zero')}</span>}
      </span>
    </label>
  );
}
