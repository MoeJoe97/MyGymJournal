Replace index.html, src/app.js and src/styles.css. Firestore rules were added for owner-only access, minimized profile updates, and integer workout set numbers.

## Privacy foundation

This application uses Firebase Authentication with email/password and Cloud Firestore in `europe-west3`. User-owned data includes profile nickname/email, Firebase user ID, exercises, workout sets, RPE, estimated 1RM, training volume, timestamps, training dates, and body-weight entries. Local keys are `gymJournal:trainingDraft:{uid}`, `gymJournal:weightUnit`, `gymJournal:defaultPeriod`, `gymJournal:restDuration`, and `gymJournal:onboardingCompleted:{uid}`. Cache Storage contains only successful same-origin shell responses and legal pages; it never caches Firebase Authentication or Firestore requests.

Google Analytics, Crashlytics, Performance Monitoring, advertising, behavioral tracking, BigQuery, Vercel Analytics, Speed Insights, and Sentry are disabled/not connected. Runtime CDN/font requests were removed; Firebase and Chart.js are bundled through npm. Production source maps are disabled.

Users can export their own data as JSON and clear MyGymJournal-owned local data. Account deletion reauthenticates, deletes owner-scoped Firestore data, deletes the Authentication account, and clears owned local keys. The current deletion flow is client-side. Before public production release, replace it with an authenticated server-side deletion function for more reliable and centrally controlled deletion. Consider moving admin authorization to Firebase custom claims.

Legal pages contain placeholders requiring completion: `[RESPONSIBLE_PERSON_OR_COMPANY]`, `[POSTAL_ADDRESS]`, `[CONTACT_EMAIL]`, `[SUPERVISORY_AUTHORITY]`, `[RETENTION_PERIOD]`, `[HOSTING_PROVIDER_DETAILS]`, and `[LAST_UPDATED_DATE]`. App Check status remains to be reviewed.
