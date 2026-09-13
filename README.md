# MyGymJournal update

## Included
- Normal, superset, and drop-set entry modes
- Atomic Firestore batch save for grouped entries
- Backward-compatible workout fields
- Updated Firestore rules
- Correct Vite favicon integration

## Replace in repository
- `/index.html`
- `/src/app.js`
- `/src/styles.css`
- `/firestore.rules`

Keep your existing files imported by app.js:
- `/src/config/firebase-config.js`
- `/src/domain/workout-metrics.js`
- `/src/ui/toast.js`

## Deploy
1. Deploy Firestore rules.
2. Commit the source files.
3. Run the Vite build or let GitHub Actions run it.
4. Test normal sets, supersets, drop sets, editing, deletion, charts, and old entries.
