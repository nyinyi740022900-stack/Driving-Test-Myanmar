'use client';

import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import BackButton from '@/components/BackButton';
import { useCountry } from '@/components/CountryProvider';
import {
  SG_CLASS3_PRACTICAL,
  DEMERIT_FAIL_THRESHOLD,
  filterChecklistByTags,
  pickChecklistText,
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

  const [showAtv, setShowAtv] = useState(false);
  const [showAtm, setShowAtm] = useState(true);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['narrow']));
  const [showGuide, setShowGuide] = useState(true);
  const [openMoment, setOpenMoment] = useState<string | null>('emergency_brake_demo');

  const data = useMemo(
    () => filterChecklistByTags(SG_CLASS3_PRACTICAL, showAtv, showAtm),
    [showAtv, showAtm]
  );

  const itemCount = useMemo(() => {
    let n = 0;
    for (const section of SG_CLASS3_PRACTICAL.sections) {
      for (const item of section.items) {
        n += item.variants?.length ?? 1;
      }
    }
    return n;
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

  if (country !== 'sg') {
    return (
      <div className="pcl-wrap">
        <div className="pcl-hero">
          <BackButton label={t('breadcrumb_home')} className="pcl-back" />
          <div className="pcl-hero-inner">
            <div className="eyebrow">{t('jp_only_eyebrow')}</div>
            <p>{t('jp_only_lead')}</p>
            <div className="pcl-jp-links">
              <Link href={`/${locale}/resources/roadmap`} className="pcl-btn">
                {t('jp_roadmap_link')} →
              </Link>
              <Link href={`/${locale}/resources/guide`} className="pcl-btn ghost">
                {t('jp_guide_link')} →
              </Link>
            </div>
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

      <div className="pcl-pass-criteria">
        <h2>{t('pass_criteria_title')}</h2>
        <div className="pcl-pass-grid">
          <article className="pcl-pass-card pass">
            <span className="pcl-pass-label">{t('pass_demerit_label')}</span>
            <span className="pcl-pass-value">{t('pass_demerit_value', { max: DEMERIT_FAIL_THRESHOLD })}</span>
            <p>{t('pass_demerit_detail', { max: DEMERIT_FAIL_THRESHOLD })}</p>
          </article>
          <article className="pcl-pass-card fail">
            <span className="pcl-pass-label">{t('pass_immediate_label')}</span>
            <span className="pcl-pass-value">{t('pass_immediate_value')}</span>
            <p>{t('pass_immediate_detail')}</p>
          </article>
          <article className="pcl-pass-card neutral">
            <span className="pcl-pass-label">{t('pass_items_label')}</span>
            <span className="pcl-pass-value">{itemCount}</span>
            <p>{t('pass_items_detail')}</p>
          </article>
        </div>
        <div className="pcl-mark-legend" aria-label={t('legend_title')}>
          <span className="pcl-legend-item">
            <span className="pcl-badge if">{t('badge_if')}</span>
            {t('legend_circle')}
          </span>
          <span className="pcl-legend-item">
            <span className="pcl-badge pts">−2</span>
            {t('legend_box')}
          </span>
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
        </div>
      </div>

      <div className="pcl-sections">
        <p className="pcl-sections-intro">{t('sections_intro')}</p>
        {data.sections.map(section => (
          <SectionBlock
            key={section.id}
            section={section}
            locale={locale}
            open={openSections.has(section.id)}
            showGuide={showGuide}
            onToggleSection={() => toggleSection(section.id)}
            t={t}
          />
        ))}
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

function PenaltyBadges({
  demerits,
  immediate,
  noDemerit,
  t,
}: {
  demerits: number;
  immediate?: boolean;
  noDemerit?: boolean;
  t: ReturnType<typeof useTranslations<'practicalChecklist'>>;
}) {
  return (
    <span className="pcl-badges">
      {immediate && <span className="pcl-badge if">{t('badge_if')}</span>}
      {!noDemerit && demerits > 0 && <span className="pcl-badge pts">−{demerits}</span>}
      {noDemerit && <span className="pcl-badge zero">{t('badge_zero')}</span>}
    </span>
  );
}

function SectionBlock({
  section, locale, open, showGuide, onToggleSection, t,
}: {
  section: PracticalCheckSection;
  locale: Locale;
  open: boolean;
  showGuide: boolean;
  onToggleSection: () => void;
  t: ReturnType<typeof useTranslations<'practicalChecklist'>>;
}) {
  const sectionGuide = getSectionGuide(section.id);

  return (
    <section id={`section-${section.id}`} className={`pcl-section ${open ? 'open' : ''}`}>
      <button type="button" className="pcl-section-head" onClick={onToggleSection} aria-expanded={open}>
        <div className="pcl-section-title-wrap">
          <h2>{pickChecklistText(section.title, locale)}</h2>
          {section.subtitle && (
            <span className="pcl-section-sub">{pickChecklistText(section.subtitle, locale)}</span>
          )}
        </div>
        <span className="pcl-chevron" aria-hidden="true">{open ? '−' : '+'}</span>
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
              showGuide={showGuide}
              t={t}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ItemRow({
  item, sectionId, locale, showGuide, t,
}: {
  item: PracticalCheckItem;
  sectionId: string;
  locale: Locale;
  showGuide: boolean;
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
            <VariantRow key={v.id} variant={v} locale={locale} t={t} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pcl-item-wrap">
      <div className={`pcl-item pcl-item-static ${item.immediateFailure ? 'immediate' : ''}`}>
        <span className="pcl-num">{item.num}</span>
        <span className="pcl-item-label">{label}</span>
        {item.tag && <span className="pcl-tag">{item.tag.toUpperCase()}</span>}
        <PenaltyBadges
          demerits={item.demerits ?? 0}
          immediate={item.immediateFailure}
          noDemerit={item.noDemerit}
          t={t}
        />
        {itemGuide && (
          <button
            type="button"
            className={`pcl-tips-btn inline ${tipsOpen ? 'active' : ''}`}
            onClick={() => setTipsOpen(!tipsOpen)}
            aria-expanded={tipsOpen}
          >
            {tipsOpen ? '▾' : '▸'} {t('tips_short')}
          </button>
        )}
      </div>
      {tipsOpen && itemGuide && <ItemGuidePanel guide={itemGuide} locale={locale} t={t} />}
    </div>
  );
}

function VariantRow({
  variant, locale, t,
}: {
  variant: PracticalCheckVariant;
  locale: Locale;
  t: ReturnType<typeof useTranslations<'practicalChecklist'>>;
}) {
  return (
    <div className={`pcl-variant pcl-variant-static ${variant.immediateFailure ? 'immediate' : ''}`}>
      <span className="pcl-variant-label">{pickChecklistText(variant.label, locale)}</span>
      <PenaltyBadges
        demerits={variant.demerits}
        immediate={variant.immediateFailure}
        noDemerit={variant.noDemerit}
        t={t}
      />
    </div>
  );
}
