export function calculateWorkoutMetrics({ repetitions, weight, rpe }) {
        const reps=Number(repetitions), load=Number(weight), effort=Number(rpe);
        if(!Number.isFinite(reps)||!Number.isFinite(load)||!Number.isFinite(effort)||reps<=0||load<=0||effort<0||effort>10) throw new Error("Please enter valid values for repetitions, weight and RPE.");
        const adjustedReps=reps+Math.max(0,10-effort);
        const e1RM=load*(1+adjustedReps/30);
        const intensityVolume=reps*load*Math.pow(load/e1RM,2.5);
        if(!Number.isFinite(e1RM)||!Number.isFinite(intensityVolume)) throw new Error("Workout metrics could not be calculated.");
        return {e1RM:Number(e1RM.toFixed(2)),intensityVolume:Number(intensityVolume.toFixed(2)),volume:Number((reps*load).toFixed(2))};
      }
