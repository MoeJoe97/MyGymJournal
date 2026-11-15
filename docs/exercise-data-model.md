# Exercise data model

## Observed implementation

- The selectable exercise list is populated from `users/{uid}/exercises`, queried in `src/app.js` by `loadExercises()`.
- New exercise names are persisted to `users/{uid}/exercises/{normalized-name}` when workout entries are saved.
- The client does not read or write the top-level `/exercises` collection.
- No `users/{uid}/exercises` or `/exercises` access is performed by any other repository module found in the audit.
- New workout documents are stored in `/workouts/{workoutId}` and include `userId`, `exercise` (normalized exercise key), `exerciseDisplay` (historical display name), repetitions, weight, set number, day key, timestamp, RPE, calculated metrics, and set grouping fields. They do not include `exerciseId`.
- Reads and progress grouping/filtering currently use the `exercise` string. The display name is used for presentation. Name spelling/case normalization is not an authoritative stable ID and historical variants may remain separate.
- Existing workout documents containing `exercise`/`exerciseDisplay` and no `exerciseId` remain the supported format.

## Compatible target

Keep user-created exercises at `/users/{uid}/exercises/{exerciseId}`. Treat `/exercises/{exerciseId}` as a future global catalog, with authenticated read and administrator-only writes. Do not switch the application to the global catalog until the collection is populated and the selection UX has been verified. For any later new workout writes, add a stable `exerciseId` only after the selected exercise has a reliable mapping; retain `exercise` and `exerciseDisplay` as historical fallback/snapshot fields. Readers must continue to support documents without `exerciseId`.

No production collection was deleted, renamed, backfilled, or migrated in this work.

## Optional migration plan (not executed)

1. Obtain approval, create and verify a restorable Firestore backup, and run only against a staging export first.
2. Build a dry-run report without writes. Normalize candidate names consistently (Unicode normalization, trim, case-fold, collapse whitespace, and apply only reviewed alias rules).
3. Detect exact duplicate IDs/names and normalized-name collisions. Do not resolve ambiguous matches automatically; send them to a reviewed mapping table.
4. Count scanned, exact-match, normalized-match, ambiguous, unmatched, and would-update documents; retain sample IDs only in a restricted operational report, never this repository.
5. Validate each proposed mapping against historical display names and progress grouping. Confirm the app can read both old and new formats.
6. Apply a separately reviewed, idempotent batch migration only after a second backup and explicit approval. Never run migration at app startup.
7. Verify counts and representative histories, compare pre/post exercise grouping, and retain before/after reports.
8. Roll back from the backup or a recorded field-level inverse mapping; do not attempt destructive rollback from guessed names.

## Security note

The repository Rules are not active in production merely because `firestore.rules` exists. Review and emulator-test proposed Rules, then deploy them manually to the intended Firebase project.
