# TASKS · Handle (sprint)

State lives on the `claims` branch (`uak status`); this file holds only tasks. IDs are `HND-NNN`.
Rubric is not published yet (PROJECT.md): `Rubric: C?` means "scores on the demo flow, weight unverified".
Stack: Next.js App Router + TypeScript + Tailwind, Postgres (Drizzle), Vitest, Playwright. Real PEY calls cost real money: automated tests use the Fake only.
Suggested agents: Dylan = HND-001/002/006/009/014 · Isaias = HND-004/005/007/008/011 · Javier = HND-003/012/013 · Sebastian = HND-010/015/016/017/018.

## HND-001 · App Next.js desplegada con base de datos y herramientas de prueba

- **Type:** setup
- **Priority:** P0
- **Estimate:** 40 min
- **Rubric / Spec:** C? · walking skeleton
- **Depends on:** None
- **Paths:** package.json, package-lock.json, next.config.ts, tsconfig.json, postcss.config.mjs, eslint.config.mjs, vitest.config.ts, playwright.config.ts, drizzle.config.ts, src/app/layout.tsx, src/app/globals.css, src/app/page.tsx, src/app/api/health/, src/lib/db/client.ts, tests/health.spec.ts, render.yaml, Dockerfile, .github/workflows/, .env.example
- **Freeze-Allowed:** no
- **Acceptance:**
  - Recipe: n/a (skeleton page only) · Hero: n/a
  - `npm run build` passes and `GET /api/health` answers `{ok:true}` with the database reachable.
  - Every foreseeable dependency is installed once: drizzle-orm, drizzle-kit, pg, zod, standardwebhooks, openai, vitest, @playwright/test, tsx.
  - `uak deploy --write` created the Render files (Blueprint with a Postgres), and the human connected the repo so each merge to main redeploys.
  - `.env.example` lists every variable (PEY_*, OPENAI_API_KEY, DATABASE_URL, SESSION_SECRET, APP_URL); no secret is committed.
- **Tests:** health_endpoint_reports_ok_when_database_answers, health_endpoint_reports_not_ok_when_database_is_down
- **Verify:** `npm run build && npx vitest run src/app/api/health`
- **Next step:** `npx create-next-app@latest . --ts --app --eslint --tailwind --src-dir --import-alias "@/*" --use-npm` (see `.uak/stacks/nextjs/STACK.md`), then `bash .uak/bin/uak deploy --help`.

## HND-002 · Contrato: esquema de datos, tipos y fixtures

- **Type:** contract
- **Priority:** P0
- **Estimate:** 45 min
- **Rubric / Spec:** C? · `docs/pey-integration.md`
- **Depends on:** HND-001
- **Paths:** src/lib/db/schema.ts, src/lib/db/migrations/, src/lib/types/, src/lib/fixtures/
- **Freeze-Allowed:** no
- **Acceptance:**
  - Tables with a migration: users, merchants (kyb_status: pending, in_review, approved, rejected, needs_info), merchant_members (role), bank_accounts (pey_bank_account_id), customers (phone), payments (status: pending, paid, rejected, expired; pey_transaction_id, codi_qr_id, num_ref, expires_at), webhook_events (webhook_id unique), points_rules, points_ledger (append-only), audit_log.
  - Zod schemas and TypeScript types exported from `src/lib/types/` for payments, KYB form, loyalty and the PEY webhook payload (fields from `docs/pey-integration.md`).
  - Fixtures with clearly labeled demo values (`demo_data: true`) for tests and design.
  - `npx drizzle-kit generate` produces no pending diff.
- **Test-First:** no (types, schema and fixtures; checked by the compiler and the migration)
- **Verify:** `npx tsc --noEmit && npx drizzle-kit check`
- **Next step:** write `src/lib/db/schema.ts`, then `npx drizzle-kit generate`.

## HND-003 · Design lock: identidad Handle, shell y UI kit

- **Type:** setup
- **Priority:** P0
- **Estimate:** 45 min
- **Rubric / Spec:** C? · `/uak-design-lock`
- **Depends on:** HND-001
- **Paths:** DESIGN.md, src/app/globals.css, src/components/ui/, src/app/layout.tsx, public/design-lock/
- **Freeze-Allowed:** no
- **Acceptance:**
  - Run with `/uak-design-lock`: the human picks the direction from screenshots. The brief's tokens (cream/ink/gold, General Sans, Geist Mono, radius 0.75rem) are the starting reference, not a decision.
  - `DESIGN.md` has the recipe table (map+panel, dashboard, detail, flow, list) and three locked screens: Cobrar (QR), Dashboard, Onboarding.
  - Screenshots at 1280 and 390 wide in `public/design-lock/screens/`.
- **Test-First:** no (visual design, validated with screenshots and the design-critic)
- **Verify:** `test -s DESIGN.md && ls public/design-lock/screens/*-1280.png && bash .uak/bin/uak lint`
- **Next step:** `/uak-design-lock`.

## HND-004 · Spike: cobro real de $0.01 con PEY (QR + consulta + alta de CLABE)

- **Type:** spike
- **Priority:** P0
- **Estimate:** 30 min
- **Rubric / Spec:** C? · riesgo externo principal
- **Depends on:** None
- **Paths:** scripts/pey-spike.mjs, docs/pey-spike.md, src/lib/fixtures/pey/
- **Freeze-Allowed:** no
- **Acceptance:**
  - With the human's `.env` key and a CLABE in `PEY_TEST_CLABE` (never committed), the script registers the bank account (`POST /bank-account`), creates one QR of 0.01 MXN with `generateImage`, and reads it back with `GET /transaction/codi/qr/{id}`. The human pays the $0.01 from their bank app.
  - `docs/pey-spike.md` records the real request/response shapes, the exact `POST /bank-account` body, whether `metadata` comes back in `externalMetadata`, and how long the QR stays valid. Anything not observed is marked "sin verificar".
  - Sanitized responses (no key, no CLABE, no names) are saved as fixtures in `src/lib/fixtures/pey/`.
  - Never more than $0.01 per call.
- **Test-First:** no (an external-API spike; it produces evidence and fixtures)
- **Verify:** `test -s docs/pey-spike.md && ls src/lib/fixtures/pey/*.json`
- **Next step:** read `pey-openapi.json` for `POST /bank-account`, then write the script with plain `fetch`.

## HND-005 · Cliente PEY tipado con Fake para pruebas

- **Type:** feature
- **Priority:** P0
- **Estimate:** 45 min
- **Rubric / Spec:** C? · cobro CoDi real
- **Depends on:** HND-001
- **Uses contract:** HND-002, HND-004
- **Paths:** src/lib/pey/, src/lib/pey/pey.test.ts
- **Freeze-Allowed:** no
- **Acceptance:**
  - Interface `PeyClient` (registerBankAccount, createQr, getTransaction) with a real implementation (Bearer key from env, base URL from `PEY_API_BASE_URL`) and a `FakePeyClient` for tests, labeled as fake.
  - A missing env variable fails with a clear error, never a default URL.
  - PEY errors (`{error:{type,message,requestId}}`) become a typed error that keeps `requestId`.
  - Status mapping: PEY gives only PENDING/PAID; a PENDING payment past `expires_at` is `expired` (derived by us).
  - The real client is never called from automated tests.
- **Tests:** sends_bearer_key_and_amount_when_creating_a_qr, returns_qr_string_and_idc_on_201, maps_pey_error_type_and_keeps_request_id, treats_pending_past_expiration_as_expired, fails_clearly_when_base_url_is_missing
- **Verify:** `npx vitest run src/lib/pey`
- **Next step:** write `src/lib/pey/types.ts` from `docs/pey-integration.md`, then the test names.

## HND-006 · Auth propia con sesiones y roles (owner, empleado, admin)

- **Type:** feature
- **Priority:** P0
- **Estimate:** 60 min
- **Rubric / Spec:** C? · identidad y acceso
- **Depends on:** HND-001, HND-002
- **Uses contract:** HND-003
- **Paths:** src/lib/auth/, src/app/api/auth/, src/app/(auth)/, src/middleware.ts
- **Freeze-Allowed:** no
- **Acceptance:**
  - Recipe: flow · Hero: the login form
  - Register and log in with email and password (hashed, never plain), HttpOnly session cookie, log out.
  - RBAC enforced on the server: a merchant user cannot read another merchant's data; only an admin reaches `/admin`.
  - Several members per merchant with a role.
  - Decision recorded in `docs/decisions/auth.md`: own auth over Supabase (no new account, one database), and what is left out (email and phone verification are roadmap).
- **Tests:** registers_a_user_and_stores_only_a_password_hash, logs_in_with_correct_password_and_sets_http_only_cookie, rejects_wrong_password_without_revealing_which_field, blocks_a_member_from_reading_another_merchants_payments, blocks_non_admin_from_admin_routes
- **Verify:** `npx vitest run src/lib/auth`
- **Next step:** `src/lib/auth/password.ts` and its test names.

## HND-007 · Webhook de PEY: firma, idempotencia y verificación

- **Type:** integration
- **Priority:** P0
- **Estimate:** 60 min
- **Rubric / Spec:** C? · confirmación real en backend
- **Depends on:** HND-001, HND-002, HND-005
- **Uses contract:** HND-011
- **Paths:** src/app/api/webhooks/pey/, src/lib/payments/confirm.ts, src/lib/payments/confirm.test.ts
- **Freeze-Allowed:** no
- **Acceptance:**
  - Recipe: n/a (API only, no screen) · Hero: n/a
  - `POST /api/webhooks/pey` verifies the Standard Webhooks signature over the raw body with `PEY_WEBHOOK_SECRET`; invalid signature answers 400 and changes nothing.
  - `webhook-id` is stored; a repeated one answers 200 and does nothing.
  - Before marking `paid` it calls `getTransaction(transactionId)`; only status PAID counts. The amount must match the payment.
  - Writes an `audit_log` row and calls the points grant (HND-011 contract) once per payment.
- **Tests:** rejects_a_bad_signature_and_changes_nothing, marks_payment_paid_only_after_pey_confirms_paid, ignores_a_repeated_webhook_id, rejects_when_amount_differs_from_the_payment, writes_an_audit_row_on_confirmation
- **Verify:** `npx vitest run src/lib/payments/confirm.test.ts`
- **Next step:** test names first, using `FakePeyClient`.

## HND-008 · API de cobros: crear QR y consultar estado

- **Type:** feature
- **Priority:** P0
- **Estimate:** 45 min
- **Rubric / Spec:** C? · cobro CoDi real
- **Depends on:** HND-001, HND-005, HND-006
- **Paths:** src/app/api/payments/, src/lib/payments/create.ts, src/lib/payments/create.test.ts
- **Freeze-Allowed:** no
- **Acceptance:**
  - Recipe: n/a (API only, no screen) · Hero: n/a
  - `POST /api/payments` (merchant session) with amount and optional customer phone creates a `pending` payment, calls `createQr` with the merchant's `bankAccountId`, `numRef` and an `expiration`, and returns `{paymentId, qrImage, expiresAt}`.
  - `GET /api/payments/{id}` returns the status; if `pending` and past expiration, it answers `expired`.
  - Only an approved merchant with a registered bank account can charge; the amount is validated (greater than 0, two decimals).
- **Tests:** creates_a_pending_payment_and_returns_the_qr, refuses_to_charge_when_merchant_is_not_approved, rejects_zero_or_negative_amounts, reports_expired_after_the_qr_expiration, does_not_show_another_merchants_payment
- **Verify:** `npx vitest run src/lib/payments/create.test.ts`
- **Next step:** test names with `FakePeyClient`.

## HND-009 · Onboarding KYB y cuestionario por reglas

- **Type:** feature
- **Priority:** P0
- **Estimate:** 60 min
- **Rubric / Spec:** C? · onboarding de comercios
- **Depends on:** HND-001, HND-006
- **Uses contract:** HND-003, HND-005
- **Paths:** src/app/onboarding/, src/app/api/onboarding/, src/components/onboarding/, src/lib/kyb/, tests/onboarding.spec.ts
- **Freeze-Allowed:** no
- **Acceptance:**
  - Form with business name, RFC (validated format), business type, address, contact and CLABE (18 digits with check digit). On submit the CLABE is registered with PEY (`registerBankAccount`) and the merchant starts as `pending`.
  - Collected is not verified: no "verificado" badge until an admin approves (HND-014).
  - Deterministic questionnaire maps business type to suggested modules (small shop, carnicería, taquería) as in the brief.
  - Recipe: `flow` · Hero: the QR/charge step teaser after approval.
- **Tests:** rejects_an_rfc_with_invalid_format, rejects_a_clabe_with_a_wrong_check_digit, creates_the_merchant_as_pending_not_verified, suggests_inventory_for_a_butcher_and_orders_for_a_taqueria, saves_the_pey_bank_account_id_after_registration
- **Verify:** `npx vitest run src/lib/kyb`
- **Next step:** `src/lib/kyb/clabe.ts` (check digit) and its tests.

## HND-010 · Función OpenAI: recomendación de módulos y resumen del día

- **Type:** feature
- **Priority:** P0
- **Estimate:** 60 min
- **Rubric / Spec:** C? · reto: OpenAI + CoDi
- **Depends on:** HND-001
- **Uses contract:** HND-002
- **Paths:** src/lib/ai/, src/app/api/ai/, src/lib/ai/ai.test.ts
- **Freeze-Allowed:** no
- **Acceptance:**
  - Recipe: n/a (library and API only, no screen) · Hero: n/a
  - Interface `AiClient` with a real OpenAI implementation (key from `OPENAI_API_KEY`, model from env) and a Fake for tests.
  - `recommendModules(description)` returns JSON validated with zod; if the API fails or returns invalid JSON, it falls back to the deterministic rules and says so (`source: "rules"`).
  - `summarizeDay(payments)` writes a short Spanish summary only from the confirmed payments passed in; with zero payments it says there were no sales and does not invent any.
  - The key never reaches the browser.
- **Tests:** returns_validated_modules_for_a_business_description, falls_back_to_rules_when_the_api_errors, falls_back_when_the_model_returns_invalid_json, summary_mentions_only_confirmed_payments, summary_says_no_sales_when_there_are_none
- **Verify:** `npx vitest run src/lib/ai`
- **Next step:** read `scripts/openai-spike` notes if present, else write the zod schema for the recommendation.

## HND-011 · Puntos de lealtad con ledger e idempotencia

- **Type:** feature
- **Priority:** P0
- **Estimate:** 50 min
- **Rubric / Spec:** C? · lealtad
- **Depends on:** HND-001, HND-002
- **Paths:** src/lib/loyalty/, src/app/api/loyalty/, src/lib/loyalty/loyalty.test.ts
- **Freeze-Allowed:** no
- **Acceptance:**
  - Recipe: n/a (library and API only, no screen) · Hero: n/a
  - Rule per merchant (default 1 point per $10 MXN; 100 points = $10 MXN). A $150 payment earns 15 points.
  - Balance is the sum of an append-only ledger; there is no direct balance update.
  - A grant is keyed by the payment: the same payment never grants twice.
  - Redeeming more than the balance is refused; points belong to the merchant that issued them.
- **Tests:** grants_15_points_for_150_mxn_at_one_per_ten, never_grants_twice_for_the_same_payment, redeems_100_points_as_10_mxn_discount, refuses_a_redemption_above_the_balance, keeps_points_separate_per_merchant
- **Verify:** `npx vitest run src/lib/loyalty`
- **Next step:** test names, then `grantPoints(paymentId)`.

## HND-012 · Pantalla Cobrar: QR y confirmación en vivo

- **Type:** feature
- **Priority:** P0
- **Estimate:** 60 min
- **Rubric / Spec:** C? · el momento wow
- **Depends on:** HND-001, HND-003
- **Uses contract:** HND-008, HND-011
- **Paths:** src/app/cobrar/, src/components/cobrar/, tests/cobrar.spec.ts
- **Freeze-Allowed:** no
- **Acceptance:**
  - Recipe: `flow` · Hero: the QR. Amount keypad, optional customer phone, QR with countdown, then "Pagado" when the status changes, and "Expirado" with a retry button.
  - Works on a phone (390 px) and shows the points earned when a phone was given.
  - Until HND-008 lands it runs on a mock that is labeled as such in the UI (`demo_data: true`).
  - Screenshots in `.uak-shots/HND-012/` and a design-critic SHIP.
- **Tests:** shows_the_qr_after_submitting_a_valid_amount, switches_to_paid_when_status_becomes_paid, shows_expired_and_offers_retry, disables_submit_for_an_invalid_amount
- **Verify:** `npx playwright test tests/cobrar.spec.ts`
- **Next step:** read the Cobrar row in `DESIGN.md`.

## HND-013 · Dashboard del comercio

- **Type:** feature
- **Priority:** P1
- **Estimate:** 60 min
- **Rubric / Spec:** C? · administración del negocio
- **Depends on:** HND-001, HND-003
- **Uses contract:** HND-008, HND-010, HND-011
- **Paths:** src/app/dashboard/, src/components/dashboard/, tests/dashboard.spec.ts
- **Freeze-Allowed:** no
- **Acceptance:**
  - Recipe: `dashboard` · Hero: today's sales total. Sales summary, transaction history with status, customers with points, and the "Resumen del día" from HND-010.
  - Modules shown follow the merchant's onboarding result; empty states are honest (no invented numbers).
  - Screenshots in `.uak-shots/HND-013/` and a design-critic SHIP.
- **Tests:** shows_todays_total_from_paid_payments_only, lists_transactions_with_their_status, shows_an_empty_state_with_no_sales
- **Verify:** `npx playwright test tests/dashboard.spec.ts`
- **Next step:** read the Dashboard row in `DESIGN.md`.

## HND-014 · Panel de administración: aprobar o rechazar comercios

- **Type:** feature
- **Priority:** P1
- **Estimate:** 45 min
- **Rubric / Spec:** C? · operación de la plataforma
- **Depends on:** HND-001, HND-006, HND-009
- **Uses contract:** HND-003
- **Paths:** src/app/admin/, src/app/api/admin/, src/components/admin/
- **Freeze-Allowed:** no
- **Acceptance:**
  - Recipe: `list`. Admin sees merchant requests with state, and can approve, reject or ask for more information; each decision writes an `audit_log` row.
  - Only the `admin` role gets in (server side).
  - Approving enables charging for that merchant (HND-008).
- **Tests:** approves_a_pending_merchant_and_records_who_did_it, rejects_with_a_reason, forbids_a_merchant_user, lists_only_merchants_waiting_for_review_by_default
- **Verify:** `npx vitest run src/app/api/admin`
- **Next step:** test names, then the status transition function.

## HND-015 · Landing de Handle

- **Type:** feature
- **Priority:** P0
- **Estimate:** 60 min
- **Rubric / Spec:** C? · lo primero que abre el jurado
- **Depends on:** HND-001, HND-003
- **Uses contract:** HND-012
- **Paths:** src/app/page.tsx, src/components/landing/, public/landing/
- **Freeze-Allowed:** yes
- **Acceptance:**
  - Recipe: detail · Hero: the Cobrar screenshot
  - Built with the skill `landing-story` from `IDEA.md`: one line, the real case, the wow as a real screenshot of Cobrar, three steps, FAQ, footer, and the call to action. Spanish for Mexican shop owners, no fintech jargon.
  - Promises nothing that is not implemented (no map, no Push, no certifications or alliances); no market figures without a source.
  - Verified at 1280x720 and 390x844; design-critic SHIP.
- **Tests:** shows_the_hero_and_a_call_to_action_above_the_fold, does_not_mention_features_that_are_not_built
- **Verify:** `npm run build && bash .uak/bin/design-lint`
- **Next step:** `/skill landing-story`, after real screenshots from HND-012 exist.

## HND-016 · Documentación: PDR, TDR, diagramas y Business Model Canvas

- **Type:** docs
- **Priority:** P1
- **Estimate:** 60 min
- **Rubric / Spec:** C? · claridad del proyecto
- **Depends on:** None
- **Paths:** docs/pdr.md, docs/tdr.md, docs/diagrams.md, docs/business-model-canvas.md, docs/decisions/
- **Freeze-Allowed:** yes
- **Acceptance:**
  - PDR and TDR in Spanish, scoped to the MVP in `IDEA.md`; roadmap items are labeled as future.
  - Mermaid diagrams: architecture, authentication, onboarding/KYB, CoDi payment flow, points flow, ER model (from HND-002 once merged).
  - Canvas with monetization as hypotheses, none presented as viable until payment-provider agreements are validated.
  - No invented market numbers, competitors or citations: unverified items say "sin verificar".
- **Test-First:** no (documentation)
- **Verify:** `test -s docs/pdr.md && test -s docs/tdr.md && test -s docs/diagrams.md && test -s docs/business-model-canvas.md`
- **Next step:** start with `docs/diagrams.md` using `docs/pey-integration.md`.

## HND-017 · Spike: OpenAI con salida estructurada

- **Type:** spike
- **Priority:** P0
- **Estimate:** 30 min
- **Rubric / Spec:** C? · riesgo externo
- **Depends on:** None
- **Paths:** scripts/openai-spike.mjs, docs/openai-spike.md
- **Freeze-Allowed:** no
- **Acceptance:**
  - With `OPENAI_API_KEY` from `.env` (the key from the claimed hackathon credits), one call returns JSON for "taquería de 3 empleados" with the recommended modules, using plain `fetch`.
  - `docs/openai-spike.md` records the model that worked, latency, approximate cost per call, and the prompt that produced valid JSON. Unobserved items say "sin verificar".
- **Test-First:** no (an external-API spike)
- **Verify:** `test -s docs/openai-spike.md`
- **Next step:** read the OpenAI docs for structured outputs and pick a model.

## HND-018 · Demo, plan B y envío

- **Type:** demo
- **Priority:** P0
- **Estimate:** 60 min
- **Rubric / Spec:** C? · entrega
- **Depends on:** HND-012
- **Uses contract:** HND-013, HND-015
- **Paths:** docs/demo.md, docs/demo.mp4, docs/submission.md
- **Freeze-Allowed:** yes
- **Acceptance:**
  - `docs/demo.md`: the 3-minute script (onboarding, real $0.01 charge, confirmation, points, dashboard with the OpenAI summary) and a checklist of what must be working live.
  - Plan-B video of the whole flow (v1 at the halfway point, final 2 h before the deadline).
  - `docs/submission.md`: the submission text, the repo and deployed URLs, and the receipt of the email to `hola@aibuilders.lat` once sent (the human sends it, and confirms whether the event portal is also required).
  - Timed rehearsal from a clean clone.
- **Test-First:** no (demo and submission)
- **Verify:** `test -s docs/demo.md && test -s docs/submission.md`
- **Next step:** write `docs/demo.md` from `IDEA.md`.
