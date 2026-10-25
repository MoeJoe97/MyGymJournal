export function createTrainingMode({ db, auth, getExercises, getPreviousSession, calculateMetrics, onSaved }) {
  const state = { active: false, exercise: '', date: '', sets: [], timer: { startedAt: 0, duration: 90, paused: false, pausedAt: 0, elapsedBeforePause: 0 } };
  let autosaveTimer = null;
  let timerId = null;
  const draftKey = () => `gymJournal:trainingDraft:${auth.currentUser?.uid || 'guest'}`;
  const saveDraft = () => { try { localStorage.setItem(draftKey(), JSON.stringify(state)); } catch (_) {} };
  const loadDraft = () => { try { const value = JSON.parse(localStorage.getItem(draftKey())); if (value?.active) Object.assign(state, value); } catch (_) {} };
  const clearDraft = () => { try { localStorage.removeItem(draftKey()); } catch (_) {} };
  const scheduleSave = (save) => { clearTimeout(autosaveTimer); saveDraft(); autosaveTimer = setTimeout(save, 650); };
  const beginTimer = (set) => { if (set.startedAt) return; set.startedAt = Date.now(); state.timer.startedAt = set.startedAt; state.timer.paused = false; saveDraft(); };
  const remaining = () => Math.max(0, state.timer.duration - Math.floor((Date.now() - state.timer.startedAt) / 1000));
  const startTimer = () => { clearInterval(timerId); timerId = setInterval(() => { document.dispatchEvent(new CustomEvent('gymjournal:timer', { detail: { remaining: state.timer.paused ? state.timer.duration - state.timer.elapsedBeforePause : remaining(), paused: state.timer.paused } })); }, 500); };
  const start = (exercise = '') => { loadDraft(); state.active = true; state.exercise = exercise || state.exercise; state.date ||= new Date().toISOString().slice(0, 10); state.timer.duration = Number(localStorage.getItem('gymJournal:restDuration') || 90); startTimer(); saveDraft(); document.dispatchEvent(new CustomEvent('gymjournal:training-start', { detail: { ...state } })); };
  const addSet = (values = {}) => { const set = { id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, weight: values.weight || '', repetitions: values.repetitions || '', rpe: values.rpe || '', startedAt: 0, status: 'incomplete' }; state.sets.push(set); scheduleSave(() => onSaved?.(state)); return set; };
  const setExercise = (exercise) => { state.exercise = exercise; scheduleSave(() => onSaved?.(state)); };
  const updateSet = (id, patch) => { const set = state.sets.find((item) => item.id === id); if (!set) return; Object.assign(set, patch); if (Object.values(patch).some((value) => value !== '')) beginTimer(set); set.status = set.weight !== '' && set.repetitions !== '' ? 'complete' : 'incomplete'; scheduleSave(() => onSaved?.(state)); };
  const finish = async () => { clearInterval(timerId); clearTimeout(autosaveTimer); await onSaved?.(state, { flush: true }); state.active = false; clearDraft(); document.dispatchEvent(new CustomEvent('gymjournal:training-finish')); };
  const leave = async () => { await onSaved?.(state, { flush: true }); clearInterval(timerId); state.active = false; saveDraft(); document.dispatchEvent(new CustomEvent('gymjournal:training-leave')); };
  const pause = () => { if (!state.timer.startedAt) return; state.timer.paused = !state.timer.paused; if (state.timer.paused) state.timer.elapsedBeforePause = state.timer.duration - remaining(); else state.timer.startedAt = Date.now() - state.timer.elapsedBeforePause * 1000; saveDraft(); };
  const addRest = (seconds) => { state.timer.duration += seconds; saveDraft(); };
  return { state, start, addSet, updateSet, setExercise, finish, leave, pause, addRest, getPreviousSession, getExercises, calculateMetrics };
}
