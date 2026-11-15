# Firebase deployment and Rules guide

This repository's Firebase configuration does not imply that its Rules or indexes are active in production. No deployment is performed by this guide.

## Install and select a project

Install the Firebase CLI using the official Firebase documentation for your operating system (for npm-based environments, `npm install -g firebase-tools`), then authenticate and verify the CLI:

```sh
firebase --version
firebase login
```

List/select the project interactively and verify the selected project before any deploy:

```sh
firebase projects:list
firebase use
firebase use --add
firebase use
```

Confirm the project ID with the project owner and compare it to the intended environment in Firebase Console. Do not copy production project identifiers or credentials into public logs. Never deploy while the selected project is uncertain.

## Emulator and Rules tests

Install repository dependencies and ensure a Java runtime is available (the Firestore Emulator requires Java). The project test script starts and stops the Firestore Emulator automatically:

```sh
npm ci
npm run test:rules
```

To inspect the emulator manually instead, start it in one terminal and run the test file in another:

```sh
firebase emulators:start --only firestore
node --test tests/firestore-rules.test.js
```

A successful emulator run only validates the tested Rules and fixtures; it does not deploy or establish production state.

## Deploy only Rules or indexes (manual action)

After review, backup/version capture, and explicit project verification, deploy only the intended resource:

```sh
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

**Warning:** Deploying repository Rules through Firebase CLI overwrites the corresponding active Rules in the Firebase Console. Review the diff and current console rules before proceeding. This repository currently has no `firestore.indexes.json`; do not deploy indexes until a reviewed file exists.

## Verify and roll back

After a manually approved deployment, confirm the Rules release in Firebase Console, test sign-in and owner-scoped read/write behavior using non-production test accounts, and verify the application without changing real user data. Monitor denied requests and query-index errors. Do not treat a successful local build as evidence of a Firebase deployment.

Before changing Rules, save the currently active Rules in a secure version-controlled/restricted location. To roll back, restore the previously reviewed Rules source, re-check the Firebase project with `firebase use`, and run `firebase deploy --only firestore:rules` only after explicit approval. Firebase Console's Rules release history can also be used to inspect prior versions; follow the console's rollback flow if appropriate.

No application, Firebase Hosting, Functions, Rules, or indexes were deployed automatically in this work.
