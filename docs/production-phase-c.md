# Phase C — Production polish

Completed items for launch readiness (July 2026).

## Legal & trust

- **Refund policy** at `/[locale]/refund` (en / my / ja)
- Footer link + sitemap entry

## Payments & premium

- **Expiry stacking** — approving a plan extends from current `expires_at` if still premium (`lib/subscription-expiry.ts`)

## Tooling

- **ESLint** — `eslint.config.mjs`, `npm run lint`
- **Playwright** — `tests/smoke.spec.ts`, `npm run test:e2e`

## Docs

- `docs/SPEC.md` — question counts updated to 1,700 total
- Root `README.md` — current stack and checklist

## Deferred

- Admin panel i18n (large scope; admin is English-only for now)
- Custom SVG/Lottie media (Phase 2.5)
- Human spreadsheet QA (`data/review/review.xlsx`)

## Verify locally

```bash
cd web
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

## Production env (Vercel)

| Variable | Required |
|----------|----------|
| `ADMIN_EMAILS` | Admin access |
| Supabase keys | Already set |

Run `supabase/mock_test_source.sql` if not applied after Phase A.
