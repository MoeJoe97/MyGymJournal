# Profile data minimization

## Current and final schema

The final permitted profile fields are `admin`, `nickname`, `email`, `createdAt`, and `updatedAt`. Obsolete fields are `address`, `street`, `postalCode`, `city`, `country`, and `birthDate`. New account creation does not populate obsolete fields. When a signed-in user deliberately saves their nickname, the client sends Firestore `FieldValue.delete()` transforms for the obsolete fields, preserves `createdAt` and `admin`, keeps the Authentication email unchanged, and updates `updatedAt`.

The cleanup is not run on app load and is not a bulk production migration. The UI saves only after validation and reflects the new profile after the write/read succeeds; on failure it reports an error and leaves edit mode available.

## Optional one-time administrative cleanup (not executed)

1. Obtain authorization and create a verified, restorable Firestore backup.
2. Use a dry-run script with read-only credentials in a controlled environment. Enumerate `/users` and report counts of documents containing each obsolete key; never export profile values into source control or ordinary logs.
3. Review a sample in a restricted environment and confirm the only intended deletes are the six listed fields. Preserve all other fields and document IDs.
4. Run on staging, then compare document counts and allowed-field presence. Re-run dry-run and confirm zero remaining obsolete fields.
5. For production, use an approved Admin SDK job with explicit project ID, dry-run default, confirmation gate, bounded batches, and an audit log containing counts but no profile values.
6. Keep the backup until post-migration verification and rollback window have completed.

To verify nothing else was removed, compare pre/post key inventories and document counts, confirm `admin`, `nickname`, `email`, `createdAt`, and unrelated data remain unchanged, and inspect a restricted random sample. Roll back only from the verified backup; do not reconstruct deleted values from guesses.
