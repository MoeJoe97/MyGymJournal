# Gym Journal, modular version

This project is the modularized version of the original single-file application. The business functions remain unchanged.

## Architecture

- `index.html`: semantic markup and application containers
- `src/styles.css`: complete visual styling
- `src/app.js`: application orchestration, Firebase access, controllers and event bindings
- `src/config/firebase-config.js`: Firebase web configuration
- `src/domain/workout-metrics.js`: central e1RM, intensity-volume and volume calculation
- `src/ui/toast.js`: accessible success and error notifications
- `firestore.rules`: Firestore authorization and validation
- `.github/workflows/deploy-pages.yml`: automatic GitHub Pages build and deployment

## Local development

Requirements: Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

The deployable frontend is generated in `dist/`. Do not upload the source files directly to a static host that expects production files. Upload the content of `dist/`.

## GitHub Pages deployment

1. Create or open the GitHub repository.
2. Copy all project files to the repository root.
3. Commit and push to the `main` branch.
4. In GitHub, open `Settings > Pages`.
5. Under `Build and deployment`, select `GitHub Actions` as the source.
6. The included workflow installs dependencies, builds the app, and publishes `dist/`.
7. In Firebase Authentication, add the resulting GitHub Pages domain to **Authorized domains**.

## Firebase Hosting deployment, alternative to GitHub Pages

```bash
npm install
npm run build
npm install -g firebase-tools
firebase login
cp .firebaserc.example .firebaserc
firebase deploy --only hosting
```

The project ID in `.firebaserc.example` is already set to `gym-journal-9c036`. Verify it before deployment.

## Firestore Rules deployment

Rules are not deployed by GitHub Pages. Use one of these methods:

### Firebase console

Open `Firebase Console > Firestore Database > Rules`, paste the complete content of `firestore.rules`, publish it, and test the application.

### Firebase CLI

```bash
firebase login
cp .firebaserc.example .firebaserc
firebase deploy --only firestore:rules
```

## Firebase Authentication

After changing the public URL, add the new host in:

`Firebase Console > Authentication > Settings > Authorized domains`

Typical entries are the GitHub Pages host, a custom domain, or the Firebase Hosting domain.

## Important deployment split

- Frontend: GitHub Pages or Firebase Hosting
- Authentication: Firebase Authentication
- Database: Cloud Firestore
- Access control: `firestore.rules`
- Source code and updates: GitHub repository

## Recommended validation after deployment

1. Register a test account and verify its email.
2. Log in and update the profile.
3. Create a new exercise and workout entry.
4. Edit the entry and verify that e1RM and intensity volume change.
5. Delete an entry and create another set.
6. Add a body-weight entry.
7. Open all charts, records and statistics.
8. Log out and verify that private data is inaccessible.
9. Test account deletion with a disposable account.

## Next architecture step

`src/app.js` deliberately remains the integration layer in this first modularization. The next safe refactoring step is to split it into feature controllers and repositories for auth, workouts, charts, profiles and body weight, backed by automated tests.
