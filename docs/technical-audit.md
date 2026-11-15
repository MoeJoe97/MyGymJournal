# Technical audit

**Scope:** source-level review of the repository on `v0/architecture-mobile-privacy-audit`. No Firebase Console, production database, deployment environment, or user data was accessed. Findings are based on tracked source and configuration only.

## Architecture and code quality

| Severity | Affected file/component | Observed problem and impact | Recommendation | Implemented? | Firebase Console work? |
|---|---|---|---|---|---|
| High | `src/app.js` | A 1,900+ line imperative module owns Firebase setup, DOM wiring, UI state, charting, account lifecycle, Firestore reads/writes and training workflows. This makes changes hard to isolate and regression-test. | Extract domain services and UI modules in small, behavior-preserving steps, starting with Firestore services and account lifecycle. | No; audit only. | No |
| Medium | `src/app.js`, `src/domain/workout-metrics.js` | Workout validation and calculations are only partly separated; persistence, validation and rendering remain coupled. | Move pure workout validation/normalization into tested domain functions and data access into services. | Partly: metrics are already a pure domain module. | No |
| Low | `src/app.js` | A few debug/error logs may include operational context; one previous workout error log included a user identifier. | Remove user identifiers and avoid logging profile/workout contents. | Yes: the identifier-containing workout error log now omits the UID; error code/message remain for diagnostics. | No |
| Low | `index.html` | Repository contains lowercase `index.html`; no `Index.html` duplicate exists, avoiding case-sensitive deployment ambiguity. | Keep the lowercase Vite entry as the single canonical file. | Verified; no change needed. | No |

## Firebase and data model

| Severity | Affected file/component | Observed problem and impact | Recommendation | Implemented? | Firebase Console work? |
|---|---|---|---|---|---|
| High | `src/config/firebase-config.js` | Firebase web configuration is embedded in source. Web config is a client identifier, not an Admin credential, but it is environment-specific and should not be confused with a secret. | Consider Vite environment variables for per-environment configuration; rotate no keys based on this finding alone. Never put Admin credentials in the client. | No; preserve existing convention and values. | No |
| High | `firestore.rules` | Baseline rules allowed broad workout updates and did not define an explicit top-level `/exercises` match. Missing matches are denied by default, so the app's documented/global catalog would not be readable under these rules. | Validate owner-scoped writes and add explicit authenticated read/admin write policy for global exercises. | Yes: rules are tightened in this branch; not deployed. | Yes, review and deploy manually after emulator tests. |
| Medium | `src/app.js` | Exercise selection is sourced from `/users/{uid}/exercises`; user-entered exercises are saved there. No reads or writes to the top-level `/exercises` collection were found. | Keep current user exercise path compatible; treat global catalog as a separate, currently unused future source. | Documented; no catalog migration. | No |
| Medium | `src/app.js` | `/workouts/{workoutId}` stores exercise names in `exercise` and `exerciseDisplay`, with no `exerciseId`. Progress filtering/grouping uses `exercise` keys, so spelling/case variants can fragment histories. | Keep name-based reads; introduce stable IDs only after catalog mapping and compatibility review. Never rewrite historic documents automatically. | Documented; no ID field written. | No |
| Medium | `src/app.js`, `firestore.rules` | Profile save removes `address`, `street`, `postalCode`, `city`, `country`, and `birthDate` via `FieldValue.delete()` only on deliberate save. Rule policy must permit removal but prevent adding these fields. | Preserve the user-triggered cleanup and constrain profile shape in Rules. | Yes in app; rules updated in this branch. | Yes, rule deployment is manual. |
| High | `src/app.js` | Deletion is client-side and removes owned Firestore documents before deleting Firebase Authentication. If a later step fails, the account may remain after some/all app data was removed. This is non-atomic, is not a reliable cascade, and cannot guarantee deletion from backups or unhandled data stores. | Replace with an authenticated, idempotent Firebase Callable Cloud Function: require a valid caller and recent-auth proof, enumerate and delete every user-owned path in retryable batches, persist/report progress, delete the Auth account only after data cleanup, and return explicit complete/retry status. Ensure a retry can resume cleanup when data is already absent. Deploy only after emulator/security review; no function is deployed by this branch. | No trusted backend; client flow now warns about non-atomic behavior, exposes partial-failure guidance, and only displays completion after Firestore cleanup and Auth deletion both resolve. | Yes, requires Cloud Function/backend implementation, deployment, and security review. |

## Privacy and account lifecycle

| Severity | Affected file/component | Observed problem and impact | Recommendation | Implemented? | Firebase Console work? |
|---|---|---|---|---|---|
| High | `public/privacy.html` | Notice is a draft with deployment-specific placeholders; it is not a final legal notice. | Complete controller/contact, hosting, retention, transfer and rights details after operational/legal review. | No; explicit draft warning retained. | Yes, verify actual Firebase/hosting settings and agreements. |
| Medium | `src/app.js` | JSON export is available and scoped to the authenticated user's profile, workouts, custom exercises and body weights. | Keep owner scoping, test export serialization and explain local-only preferences separately. | Existing functionality; needs targeted tests. | No |
| Medium | `src/app.js` | Client-side account deletion can partially complete; no Storage path was found in code. | Use the callable backend design in the High severity finding; inventory all data stores and backup retention before representing deletion as complete. | Non-atomic behavior and retry guidance are documented in the UI and audit; no backend is deployed. | Yes |
| Low | `src/app.js`, `src/pwa.js`, `public/sw.js` | App uses localStorage for device preferences/draft and a service worker for shell assets. Analytics, Crashlytics, Performance Monitoring and advertising SDKs were not found in the reviewed source/dependencies. | Keep user-scoped local data cleanup and ensure service-worker caching excludes Firebase/API requests. | Existing source behavior; confirm on deployed build. | Review service configuration manually. |

## Mobile usability and accessibility

| Severity | Affected file/component | Observed problem and impact | Recommendation | Implemented? | Firebase Console work? |
|---|---|---|---|---|---|
| Medium | `index.html`, `src/styles.css`, `tests/mobile-state-fixture.html` | The responsive app has a fixed contextual action bar; authenticated Firebase data could not be used in the available browser session. | Keep actions view/workout-specific, avoid covering sheet content, and test authenticated forms against a development-only fixture when Firebase credentials are unavailable. | Menu/action redesign completed. Fixture UI flows and no-overflow checks passed at 320, 360, 390, 768 and 1090 px. Fixture checks do not validate Firebase persistence. | No |
| Medium | `index.html`, `src/app.js` | Application uses custom drawers, sheets and modal overlays. | Keep keyboard focus within modal surfaces, close with Escape, restore focus, expose semantic labels and respect reduced motion. | Drawer and sheet/modal semantics, Escape handling, focus movement/trapping/restoration, body-scroll lock and visible focus added. Keyboard behavior exercised in the development fixture; production Firebase flows remain manual. | No |
| Low | chart components in `src/app.js` and `index.html` | Charts have explanatory copy, but chart data is not guaranteed to have an equivalent dynamic textual summary. | Provide a concise summary from the same real data used by each chart. | No. | No |

### Follow-up implementation and verification

- The previous flat menu was: Account, Tutorial, Training, Progress, Sets, Exercise Log, Personal Records, Statistics and Weight Tracking. The new menu groups these existing destinations/actions as **Training** (start/continue workout, training overview, workout history), **Progress** (progress overview, sets, personal records, statistics, weight tracking), **My Account** (profile/settings, including export/privacy/account closure), **Help** (Tutorial), and separated **Sign out**. Existing header tabs and home content remain.
- A single floating action is shown on authenticated Training when no workout is active. Active-workout controls are contextual and the fixed bar is hidden while sheets/dialogs are open; the training sheet retains its Add Set and Finish actions. Create/finish actions expose disabled/loading states and cannot be submitted repeatedly.
- A development-only, in-memory UI fixture is at `tests/mobile-state-fixture.html`; it is not imported by `index.html` or emitted as a production entry. It exercises profile/settings, workout creation, starting a session, adding/completing a set, finishing, history, progress/sets, records, dialogs, menu keyboard handling and responsive layout. It is simulated state only: it does not authenticate with Firebase or test Firestore writes/reads. The production app's login dialog, drawer and profile/settings sheet were opened in the browser; login-overlay removal was done only to reach the gated shell, not to impersonate an authenticated Firebase session. Menu focus, Escape, focus restoration, body scroll lock and login-dialog focus trapping were checked. The production app remained logged out, so real authenticated Firebase workflows were not verified.
- Browser overflow checks on the fixture passed at 320, 360, 390, 768 and 1090 px. Captures were taken at 320 px (menu), 390 px (profile/settings) and 768 px (active workout). In the test fixture, the drawer is 288 px wide at 320, the profile sheet occupies the bottom portion at 390, and the active workout sheet spans the page width at 768. No horizontal overflow was observed.

### Preview environment notes

- In a protected Vercel Preview, requesting `manifest.webmanifest` can redirect to `vercel.com/sso-api`, which the browser reports as a CORS failure. This is an observed Deployment Protection behavior; do not add broad wildcard CORS headers to the application to work around it.
- Firebase Authentication rejects preview-host sign-in unless the exact preview hostname is listed under **Firebase Console → Authentication → Settings → Authorized domains**. Add the intended preview host there before testing Firebase sign-in.

## Build, deployment and tests

| Severity | Affected file/component | Observed problem and impact | Recommendation | Implemented? | Firebase Console work? |
|---|---|---|---|---|---|
| Medium | `package.json`, `tests/` | Project is Vite/vanilla JavaScript with Firebase compat and Chart.js; no lint or TypeScript scripts are configured. Targeted workout-metric unit tests and Firebase Emulator Rules tests are present. | Expand tests to form validation, normalization, and export serialization as code is extracted. | Partly: metrics unit tests pass; Rules tests and `test:rules` script are added, but emulator execution is blocked because Java is unavailable. | No |
| Medium | `firebase.json`, `.github/workflows/deploy.yml` | Firebase Hosting deployment workflow/config exist. Repository config does not prove production rules or hosting settings match. | Review GitHub workflow secrets/permissions and Firebase project selection before manually deploying. | No deployment occurred. | Yes, manual review. |
| Low | `firebase.json` | Firestore Rules path is configured; no Firestore indexes file was present at audit time. Compound queries may require indexes when exercised. | Add indexes only when Firebase reports a required query index; export and review indexes separately. | No indexes added without evidence. | If index deployment is later chosen, yes. |

## Privacy and release caveat

This audit is not a legal determination and does not claim GDPR compliance. A legal and operational review of the actual deployment, Firebase Console configuration, service-provider agreements, retention, backups, access controls, privacy notice and incident process remains necessary. No production data was queried or changed, and no Firebase rules, functions or hosting deployment was performed.
