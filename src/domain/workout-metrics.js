export function calculateWorkoutMetrics({ repetitions, weight, rpe = null }) {
  const reps = Number(repetitions), load = Number(weight), effort = rpe === null || rpe === undefined || rpe === "" ? null : Number(rpe);
  if (!Number.isInteger(reps) || reps <= 0 || !Number.isFinite(load) || load < 0 || (effort !== null && (!Number.isFinite(effort) || effort < 0 || effort > 10))) throw new Error("Please enter valid values for repetitions, weight and RPE.");
  if (load === 0) return { e1RM: 0, intensityVolume: 0, volume: 0 };
  const neutralEffort = effort === null ? 5 : effort;
  const adjustedReps = reps + Math.max(0, 10 - neutralEffort);
  const e1RM = load * (1 + adjustedReps / 30);
  const intensityVolume = reps * load * Math.pow(load / e1RM, 2.5);
  if (!Number.isFinite(e1RM) || !Number.isFinite(intensityVolume)) throw new Error("Workout metrics could not be calculated.");
  return { e1RM: Number(e1RM.toFixed(2)), intensityVolume: Number(intensityVolume.toFixed(2)), volume: Number((reps * load).toFixed(2)) };
}
