import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test, { after, before, beforeEach } from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

const projectId = 'demo-my-gym-journal-rules';
let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: await readFile(new URL('../firestore.rules', import.meta.url), 'utf8'),
    },
  });
});

after(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

async function seed(path, value) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), path), value);
  });
}

function userDb(uid, email = `${uid}@example.test`) {
  return testEnv.authenticatedContext(uid, { email }).firestore();
}

test('owner can read own profile but another user cannot', async () => {
  await seed('users/alice', {
    admin: false,
    nickname: 'Alice',
    email: 'alice@example.test',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await assertSucceeds(getDoc(doc(userDb('alice'), 'users/alice')));
  await assertFails(getDoc(doc(userDb('bob'), 'users/alice')));
  await assertFails(getDoc(doc(testEnv.unauthenticatedContext().firestore(), 'users/alice')));
  await assertFails(setDoc(doc(testEnv.unauthenticatedContext().firestore(), 'users/anonymous'), {
    admin: false,
    nickname: 'Anonymous',
    email: 'anonymous@example.test',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
  await assertFails(setDoc(doc(userDb('bob'), 'users/alice'), {
    admin: false,
    nickname: 'Alice',
    email: 'alice@example.test',
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
});

test('registration payload matches client profile creation fields', async () => {
  const db = userDb('new-user', 'new-user@example.test');
  const registrationPayload = {
    admin: false,
    nickname: 'New User',
    email: 'new-user@example.test',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await assertSucceeds(setDoc(doc(db, 'users/new-user'), registrationPayload));
});

test('new profiles cannot contain obsolete fields or self-assign admin', async () => {
  const db = userDb('alice');
  const base = {
    admin: false,
    nickname: 'Alice',
    email: 'alice@example.test',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await assertSucceeds(setDoc(doc(db, 'users/alice'), base));
  await assertFails(setDoc(doc(db, 'users/alice'), { ...base, nickname: '' }));
  await assertFails(setDoc(doc(db, 'users/alice'), { ...base, nickname: 'A' }));
  await assertFails(setDoc(doc(db, 'users/bob'), base));
  await assertFails(setDoc(doc(db, 'users/alice'), { ...base, admin: true }));
  await assertFails(setDoc(doc(db, 'users/alice'), { ...base, birthDate: '2000-01-01' }));
});

test('owner can delete obsolete profile fields while preserving protected fields', async () => {
  await seed('users/alice', {
    admin: false,
    nickname: 'Old name',
    email: 'alice@example.test',
    createdAt: new Date(),
    updatedAt: new Date(),
    birthDate: '2000-01-01',
    city: 'Example',
  });
  const db = userDb('alice');

  await assertSucceeds(updateDoc(doc(db, 'users/alice'), {
    nickname: 'Alice',
    birthDate: deleteField(),
    city: deleteField(),
    updatedAt: serverTimestamp(),
  }));
  await assertFails(updateDoc(doc(db, 'users/alice'), {
    birthDate: '2000-01-01',
    updatedAt: serverTimestamp(),
  }));
  await assertFails(updateDoc(doc(db, 'users/alice'), {
    admin: true,
    updatedAt: serverTimestamp(),
  }));
  await assertSucceeds(updateDoc(doc(db, 'users/alice'), {
    nickname: 'New name',
    updatedAt: serverTimestamp(),
  }));
  await assertFails(updateDoc(doc(db, 'users/alice'), {
    email: 'other@example.test',
    updatedAt: serverTimestamp(),
  }));
  await assertFails(deleteDoc(doc(userDb('bob'), 'users/alice')));
  await assertSucceeds(deleteDoc(doc(db, 'users/alice')));
});

test('workouts are owner-scoped and reject invalid data or ownership transfer', async () => {
  const workout = {
    userId: 'alice',
    exercise: 'bench press',
    exerciseDisplay: 'Bench Press',
    repetitions: 8,
    weight: 60,
    rpe: 8,
    setNumber: 1,
    dayKey: '2026-01-02',
    timestamp: new Date(),
    e1RM: 76,
    intensityVolume: 480,
    setType: 'normal',
    groupId: null,
    groupPosition: null,
  };
  await seed('workouts/alice-workout', workout);
  const alice = userDb('alice');
  const bob = userDb('bob');

  await assertSucceeds(getDoc(doc(alice, 'workouts/alice-workout')));
  await assertFails(getDoc(doc(bob, 'workouts/alice-workout')));
  await assertSucceeds(setDoc(doc(alice, 'workouts/new-workout'), workout));
  const invalidWorkoutCases = [
    ['unknown-extra-field', { ...workout, unexpected: true }],
    ['overlong-group-id', { ...workout, setType: 'superset', groupId: 'g'.repeat(121), groupPosition: 1 }],
    ['group-position-over-20', { ...workout, setType: 'superset', groupId: 'group-1', groupPosition: 21 }],
    ['superset-without-group-id', { ...workout, setType: 'superset', groupPosition: 1 }],
    ['superset-without-group-position', { ...workout, setType: 'superset', groupId: 'group-1' }],
    ['normal-set-with-group', { ...workout, groupId: 'group-1', groupPosition: 1 }],
    ['invalid-training-mode', { ...workout, trainingMode: 'yes' }],
    ['invalid-created-at', { ...workout, createdAt: 'not-a-timestamp' }],
    ['set-number-over-1000', { ...workout, setNumber: 1001 }],
  ];
  for (const [id, payload] of invalidWorkoutCases) {
    await assertFails(setDoc(doc(alice, `workouts/${id}`), payload), id);
  }
  await assertFails(setDoc(doc(alice, 'workouts/invalid-workout'), { ...workout, repetitions: 0 }));
  await assertFails(setDoc(doc(alice, 'workouts/invalid-weight'), { ...workout, weight: -1 }));
  await assertFails(setDoc(doc(alice, 'workouts/invalid-date'), { ...workout, dayKey: 'not-a-date' }));
  await assertFails(setDoc(doc(testEnv.unauthenticatedContext().firestore(), 'workouts/anonymous'), workout));
  await assertFails(updateDoc(doc(alice, 'workouts/alice-workout'), { userId: 'bob' }));
  await assertFails(setDoc(doc(bob, 'workouts/forged-workout'), workout));
  await assertFails(updateDoc(doc(bob, 'workouts/alice-workout'), { repetitions: 5, updatedAt: serverTimestamp() }));

  await seed('workouts/legacy-workout', {
    userId: 'alice', exercise: 'old name', repetitions: 6, weight: 50,
    setNumber: 1, dayKey: '2020-01-01', timestamp: new Date(),
  });
  await assertSucceeds(updateDoc(doc(alice, 'workouts/legacy-workout'), {
    repetitions: 7,
    weight: 55,
    e1RM: 68,
    intensityVolume: 385,
    updatedAt: serverTimestamp(),
  }));
});

test('workout batch accepts an existing personal exercise with createdAt', async () => {
  const db = userDb('alice');
  const createdAt = Timestamp.fromDate(new Date('2026-01-01T12:00:00Z'));
  const exerciseRef = doc(db, 'users/alice/exercises/front-squat');
  const workoutRef = doc(db, 'workouts/front-squat-workout');
  const workout = {
    userId: 'alice', exercise: 'front-squat', exerciseDisplay: 'Front Squat',
    repetitions: 5, weight: 80, setNumber: 1, dayKey: '2026-01-02', timestamp: Timestamp.now(),
  };

  await seed('users/alice/exercises/front-squat', {
    name: 'Front Squat', createdAt, updatedAt: createdAt,
  });

  const batch = writeBatch(db);
  batch.set(workoutRef, workout);
  batch.update(exerciseRef, { name: 'Front Squat', updatedAt: serverTimestamp() });
  await assertSucceeds(batch.commit());
});

test('workout batch accepts a new personal exercise without createdAt', async () => {
  const db = userDb('alice');
  const exerciseRef = doc(db, 'users/alice/exercises/pendlay-row');
  const workoutRef = doc(db, 'workouts/pendlay-row-workout');
  const workout = {
    userId: 'alice', exercise: 'pendlay-row', exerciseDisplay: 'Pendlay Row',
    repetitions: 8, weight: 50, setNumber: 1, dayKey: '2026-01-02', timestamp: Timestamp.now(),
  };

  const batch = writeBatch(db);
  batch.set(workoutRef, workout);
  batch.set(exerciseRef, { name: 'Pendlay Row', updatedAt: serverTimestamp() });
  await assertSucceeds(batch.commit());
});

test('personal exercise update may preserve createdAt', async () => {
  const createdAt = Timestamp.fromDate(new Date('2026-01-01T12:00:00Z'));
  await seed('users/alice/exercises/front-squat', {
    name: 'Front Squat', createdAt, updatedAt: createdAt,
  });

  await assertSucceeds(updateDoc(doc(userDb('alice'), 'users/alice/exercises/front-squat'), {
    name: 'Paused Front Squat', updatedAt: serverTimestamp(),
  }));

  const updated = await getDoc(doc(userDb('alice'), 'users/alice/exercises/front-squat'));
  assert.equal(updated.data().createdAt.isEqual(createdAt), true);
});

test('personal exercise update cannot modify or remove createdAt', async () => {
  const createdAt = Timestamp.fromDate(new Date('2026-01-01T12:00:00Z'));
  const exerciseRef = doc(userDb('alice'), 'users/alice/exercises/front-squat');
  await seed('users/alice/exercises/front-squat', {
    name: 'Front Squat', createdAt, updatedAt: createdAt,
  });

  await assertFails(updateDoc(exerciseRef, {
    createdAt: Timestamp.fromDate(new Date('2026-01-02T12:00:00Z')),
    updatedAt: serverTimestamp(),
  }));
  await assertFails(updateDoc(exerciseRef, {
    createdAt: deleteField(), updatedAt: serverTimestamp(),
  }));
});

test('personal exercises reject unknown fields', async () => {
  await assertFails(setDoc(doc(userDb('alice'), 'users/alice/exercises/front-squat'), {
    name: 'Front Squat', updatedAt: serverTimestamp(), unexpected: true,
  }));
});

test('custom exercises remain scoped to their owner', async () => {
  const alice = userDb('alice');
  const bob = userDb('bob');
  const ownExercise = doc(alice, 'users/alice/exercises/front-squat');
  const otherExercise = doc(bob, 'users/alice/exercises/front-squat');

  await assertSucceeds(setDoc(ownExercise, { name: 'Front Squat', updatedAt: serverTimestamp() }));
  await assertSucceeds(getDoc(ownExercise));
  await assertFails(getDoc(otherExercise));
  await assertSucceeds(updateDoc(ownExercise, { name: 'Front Squat', updatedAt: serverTimestamp() }));
  await assertFails(setDoc(doc(bob, 'users/alice/exercises/hack-squat'), { name: 'Hack Squat', updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(doc(bob, 'users/alice/exercises/front-squat'), { name: 'Stolen', updatedAt: serverTimestamp() }));
  await assertFails(deleteDoc(doc(bob, 'users/alice/exercises/front-squat')));
  const bodyWeightRef = doc(alice, 'users/alice/bodyWeights/2026-01-02');
  const exactWeightPayload = {
    weight: 70,
    dayKey: '2026-01-02',
    timestamp: Timestamp.fromDate(new Date('2026-01-02T12:00:00')),
    updatedAt: serverTimestamp(),
  };
  await assertSucceeds(setDoc(bodyWeightRef, exactWeightPayload, { merge: true }));
  await assertSucceeds(setDoc(bodyWeightRef, { ...exactWeightPayload, weight: 71 }, { merge: true }));
  await assertFails(getDoc(doc(bob, 'users/alice/bodyWeights/2026-01-02')));
  await assertFails(setDoc(doc(alice, 'private-data/record'), { value: 'denied' }));
  await assertFails(getDoc(doc(alice, 'private-data/record')));
});

test('global catalog is readable to signed-in users and writable only by admins', async () => {
  await seed('users/admin', { admin: true });
  await seed('exercises/bench-press', { name: 'Bench Press' });
  const regular = userDb('alice');
  const admin = userDb('admin');

  await assertSucceeds(getDoc(doc(regular, 'exercises/bench-press')));
  await assertFails(setDoc(doc(regular, 'exercises/squat'), { name: 'Squat' }));
  await assertFails(updateDoc(doc(regular, 'exercises/bench-press'), { name: 'Renamed' }));
  await assertFails(deleteDoc(doc(regular, 'exercises/bench-press')));
  await assertSucceeds(setDoc(doc(admin, 'exercises/squat'), { name: 'Squat' }));
  await assertSucceeds(updateDoc(doc(admin, 'exercises/squat'), { name: 'Back Squat' }));
  await assertFails(getDoc(doc(testEnv.unauthenticatedContext().firestore(), 'exercises/bench-press')));
});
