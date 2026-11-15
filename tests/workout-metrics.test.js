import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWorkoutMetrics } from '../src/domain/workout-metrics.js';

test('calculates volume and estimated one-rep max for a valid set', () => {
  const metrics = calculateWorkoutMetrics({ repetitions: 5, weight: 100, rpe: 5 });

  assert.equal(metrics.volume, 500);
  assert.equal(metrics.e1RM, 133.33);
  assert.ok(Number.isFinite(metrics.intensityVolume));
  assert.ok(metrics.intensityVolume > 0);
});

test('treats missing RPE as neutral effort', () => {
  assert.deepEqual(
    calculateWorkoutMetrics({ repetitions: 5, weight: 100 }),
    calculateWorkoutMetrics({ repetitions: 5, weight: 100, rpe: 5 }),
  );
});

test('returns zero metrics for a zero-load set', () => {
  assert.deepEqual(
    calculateWorkoutMetrics({ repetitions: 5, weight: 0, rpe: 7 }),
    { e1RM: 0, intensityVolume: 0, volume: 0 },
  );
});

test('rejects invalid repetitions, weight, and RPE', () => {
  assert.throws(() => calculateWorkoutMetrics({ repetitions: 0, weight: 100 }));
  assert.throws(() => calculateWorkoutMetrics({ repetitions: 5, weight: -1 }));
  assert.throws(() => calculateWorkoutMetrics({ repetitions: 5, weight: 100, rpe: 11 }));
});
