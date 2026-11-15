# Technical audit

**Scope:** source-level review of the repository on `audit/architecture-mobile-firebase-privacy`. No Firebase Console, production database, deployment environment, or user data was accessed. Findings are based on tracked source and configuration only.

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
| High | `src/app.js` | Deletion is client-side and walks owned Firestore collections before deleting Authentication. A partial failure can leave orphaned data or remove data before Auth deletion fails. | Replace with authenticated, idempotent trusted backend deletion that verifies caller, handles all owned paths, and reports status. | No; current limitation documented; no privileged client workaround added. | Yes, requires Cloud Function/backend setup and security review. |

## Privacy and account lifecycle

| Severity | Affected file/component | Observed problem and impact | Recommendation | Implemented? | Firebase Console work? |
|---|---|---|---|---|---|
| High | `public/privacy.html` | Notice is a draft with deployment-specific placeholders; it is not a final legal notice. | Complete controller/contact, hosting, retention, transfer and rights details after operational/legal review. | No; explicit draft warning retained. | Yes, verify actual Firebase/hosting settings and agreements. |
| Medium | `src/app.js` | JSON export is available and scoped to the authenticated user's profile, workouts, custom exercises and body weights. | Keep owner scoping, test export serialization and explain local-only preferences separately. | Existing functionality; needs targeted tests. | No |
| Medium | `src/app.js` | Account deletion reauthenticates with password, but cascading deletion is not server-controlled and no Storage path was found in code. | Deploy a trusted deletion function before relying on complete deletion; verify all data stores and backup retention. | Documented only. | Yes |
| Low | `src/app.js`, `src/pwa.js`, `public/sw.js` | App uses localStorage for device preferences/draft and a service worker for shell assets. Analytics, Crashlytics, Performance Monitoring and advertising SDKs were not found in the reviewed source/dependencies. | Keep user-scoped local data cleanup and ensure service-worker caching excludes Firebase/API requests. | Existing source behavior; confirm on deployed build. | Review service configuration manually. |

## Mobile usability and accessibility

| Severity | Affected file/component | Observed problem and impact | Recommendation | Implemented? | Firebase Console work? |
|---|---|---|---|---|---|
| Medium | `index.html`, `src/styles.css` | Existing responsive styles and contextual action bar are present. Browser measurements at 320, 360, 390, 768 and 1090 px showed no document-width overflow on the logged-out screen; authenticated workout flows were not exercised. | Verify authenticated workout forms, menu/dialog behavior, touch targets and reduced-motion behavior before release. | Width pass completed; no new mobile changes in this branch. | No |
| Medium | `index.html`, `src/app.js` | Application uses custom drawers/overlays; focus restoration and complete keyboard interaction should be tested end-to-end. | Add/maintain Escape handling, focus return, visible focus and accessible names, then browser-test the flows. | No new changes in this branch. | No |
| Low | chart components in `src/app.js` and `index.html` | Charts have explanatory copy, but chart data is not guaranteed to have an equivalent dynamic textual summary. | Provide a concise summary from the same real data used by each chart. | No. | No |

## Build, deployment and tests

| Severity | Affected file/component | Observed problem and impact | Recommendation | Implemented? | Firebase Console work? |
|---|---|---|---|---|---|
| Medium | `package.json`, `tests/` | Project is Vite/vanilla JavaScript with Firebase compat and Chart.js; no lint or TypeScript scripts are configured. Targeted workout-metric unit tests and Firebase Emulator Rules tests are present. | Expand tests to form validation, normalization, and export serialization as code is extracted. | Partly: metrics unit tests pass; Rules tests and `test:rules` script are added, but emulator execution is blocked because Java is unavailable. | No |
| Medium | `firebase.json`, `.github/workflows/deploy.yml` | Firebase Hosting deployment workflow/config exist. Repository config does not prove production rules or hosting settings match. | Review GitHub workflow secrets/permissions and Firebase project selection before manually deploying. | No deployment occurred. | Yes, manual review. |
| Low | `firebase.json` | Firestore Rules path is configured; no Firestore indexes file was present at audit time. Compound queries may require indexes when exercised. | Add indexes only when Firebase reports a required query index; export and review indexes separately. | No indexes added without evidence. | If index deployment is later chosen, yes. |

## Privacy and release caveat

This audit is not a legal determination and does not claim GDPR compliance. A legal and operational review of the actual deployment, Firebase Console configuration, service-provider agreements, retention, backups, access controls, privacy notice and incident process remains necessary. No production data was queried or changed, and no Firebase rules, functions or hosting deployment was performed.
