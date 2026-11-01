const COMPLETION_KEY_PREFIX = "gymJournal:onboardingCompleted:";

const STEPS = [
  { title: "Training", description: "The Training tab is your starting point. Here you can select an exercise, review your overall development, and open the main functions for recording workouts and body weight.", target: '[data-tour="training-overview"]', prepare: "training" },
  { title: "Overall Progress", description: "Overall Progress compares the first and latest training day in the selected range using average intensity volume per set. A positive percentage means the latest day is higher.", target: '[data-tour="overall-progress"]', prepare: "training" },
  { title: "Choose what to analyze", description: "Select an exercise from the Exercises list or search field, then use Sort to order the list by improvement or name. The selected exercise drives the analysis views.", target: '[data-tour="exercise-selection"]', prepare: "training" },
  { title: "Select a period", description: "Day, Week, Month, Year, and Max control which workouts appear in the Training chart and summary. Max is selected by default here; changing it updates this view only.", target: '[data-tour="training-period-selector"]', prepare: "training" },
  { title: "Progress", description: "Progress shows the selected exercise across workout dates. The active Progress tab, exercise selector, and period filter work together to load the daily analysis.", target: '[data-tour="nav-progress"]', prepare: "progress" },
  { title: "Progress metrics", description: "Daily charts include Intensity Volume (IV), Estimated 1RM in kg, Max Weight in kg, Training Volume, Weight in kg, and Repetitions. Each uses the recorded sets for the selected exercise and period.", target: '[data-tour="progress-chart-volume"]', prepare: "progress" },
  { title: "Reading the charts", description: "The horizontal axis is the workout date and the vertical axis is the chart metric. Hover or touch a point for its value; the legend and chart label identify the series and unit.", target: '[data-tour="progress-chart-intensity"]', prepare: "progress" },
  { title: "Filter your progress", description: "Choose the exercise in the Progress selector and use Day, Week, Month, Year, or Max to change the included dates. Show reloads the charts without changing stored workouts.", target: '[data-tour="progress-filters"]', prepare: "progress" },
  { title: "Sets", description: "The Sets tab inspects individual entries from one workout session. It displays per-set intensity volume, estimated 1RM, weight, volume, and repetitions for the selected exercise and day.", target: '[data-tour="sets-controls"]', prepare: "sets" },
  { title: "Choose a workout date", description: "Select one of the available workout dates, or use Prev, Next, and Latest. Only dates with entries for the selected exercise are available, and the current date is shown below the controls.", target: '[data-tour="sets-date-selector"]', prepare: "sets" },
  { title: "Analyze your sets", description: "Each set chart uses set number on the horizontal axis. The vertical value is IV, estimated 1RM in kg, weight in kg, volume, or repetitions; touch or hover points for exact values.", target: '[data-tour="sets-chart-intensity"]', prepare: "sets" },
  { title: "Record a workout", description: "Create a new workout entry by selecting an exercise and entering repetitions, weight, and optional RPE. Choose a set type when needed, then save to update all analysis views.", target: '[data-tour="create-content"]', prepare: "create" },
  { title: "Track body weight", description: "Weight records body weight with a date and value, then shows the saved history as a trend. Use the existing period controls to compare recent entries with longer-term changes.", target: '[data-tour="weight-content"]', prepare: "weight" },
];

function completionKey(uid) { return `${COMPLETION_KEY_PREFIX}${uid}`; }
function isVisible(element) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
}
function waitForTarget(selector, timeout = 6000) {
  return new Promise((resolve) => {
    const started = performance.now();
    const check = () => {
      const target = document.querySelector(selector);
      if (isVisible(target)) return resolve(target);
      if (performance.now() - started > timeout) return resolve(null);
      requestAnimationFrame(check);
    };
    check();
  });
}

export function createOnboarding({ auth, navigation, closeTransientUi, openCreate, closeCreate, openWeight, closeWeight }) {
  const overlay = document.getElementById("onboardingOverlay");
  const card = document.getElementById("onboardingCard");
  const spotlight = document.getElementById("onboardingSpotlight");
  const title = document.getElementById("onboardingTitle");
  const description = document.getElementById("onboardingDescription");
  const indicator = document.getElementById("onboardingStepIndicator");
  const closeButton = document.getElementById("onboardingClose");
  const backButton = document.getElementById("onboardingBack");
  const continueButton = document.getElementById("onboardingContinue");
  if (![overlay, card, spotlight, title, description, indicator, closeButton, continueButton].every(Boolean)) return null;

  let active = false;
  let stepIndex = 0;
  let uid = null;
  let frame = 0;
  let previousOverflow = "";
  let previousState = null;
  let openedCreate = false;
  let openedWeight = false;
  let resizeObserver = null;

  const clearTarget = () => document.querySelectorAll(".onboarding-target").forEach((el) => el.classList.remove("onboarding-target"));
  const saveState = () => ({ scrollY: window.scrollY, activeTab: document.querySelector(".tab.active")?.id || "tabTraining" });
  const scrollTargetIntoView = (target) => {
    if (window.innerWidth <= 640) target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
  };
  const disconnectObserver = () => { resizeObserver?.disconnect(); resizeObserver = null; };
  const restoreState = async () => {
    await navigation?.(previousState?.activeTab === "tabProgress" ? "progress" : previousState?.activeTab === "tabSets" ? "sets" : "training");
    if (previousState?.scrollY != null) window.scrollTo({ top: previousState.scrollY, behavior: "auto" });
  };
  const finish = async (save = true) => {
    if (!active) return;
    active = false;
    cancelAnimationFrame(frame);
    disconnectObserver();
    clearTarget();
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("onboarding-active");
    document.body.style.overflow = previousOverflow;
    if (openedCreate) closeCreate?.();
    if (openedWeight) closeWeight?.();
    closeTransientUi?.();
    await restoreState();
    if (save && uid) localStorage.setItem(completionKey(uid), "true");
  };
  const position = (target) => {
    if (!active || !isVisible(target)) return;
    const rect = target.getBoundingClientRect();
    const pad = window.innerWidth <= 640 ? 6 : 9;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    spotlight.style.left = `${Math.max(4, rect.left - pad)}px`;
    spotlight.style.top = `${Math.max(4, rect.top - pad)}px`;
    spotlight.style.width = `${Math.min(vw - 8, rect.width + pad * 2)}px`;
    spotlight.style.height = `${Math.min(vh - 8, rect.height + pad * 2)}px`;
    const cardWidth = Math.min(380, vw - 28);
    const gap = 24;
    let left = Math.max(14, Math.min(vw - cardWidth - 14, rect.left + rect.width / 2 - cardWidth / 2));
    let top = rect.bottom + gap;
    if (top + card.offsetHeight > vh - 16) top = rect.top - card.offsetHeight - gap;
    if (top < 64) top = Math.max(64, Math.min(vh - card.offsetHeight - 16, rect.top + rect.height / 2 - card.offsetHeight / 2));
    card.style.width = `${cardWidth}px`;
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
    card.style.setProperty("--pointer-left", `${Math.max(22, Math.min(cardWidth - 22, rect.left + rect.width / 2 - left))}px`);
  };
  const reposition = () => {
    if (!active) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => position(document.querySelector(STEPS[stepIndex].target)));
  };
  const renderStep = async () => {
    const step = STEPS[stepIndex];
    clearTarget();
    openedCreate = false;
    openedWeight = false;
    closeTransientUi?.();
    await navigation?.(step.prepare);
    if (step.prepare === "create") { await openCreate?.(); openedCreate = true; }
    if (step.prepare === "weight") { closeCreate?.(); await openWeight?.(); openedWeight = true; }
    const target = await waitForTarget(step.target);
    if (!target) return finish(false);
    scrollTargetIntoView(target);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    target.classList.add("onboarding-target");
    title.textContent = step.title;
    description.textContent = step.description;
    indicator.textContent = `${stepIndex + 1} of ${STEPS.length}`;
    backButton?.toggleAttribute("hidden", stepIndex === 0);
    continueButton.textContent = stepIndex === STEPS.length - 1 ? "✓" : "→";
    continueButton.setAttribute("aria-label", stepIndex === STEPS.length - 1 ? "Finish tutorial" : "Continue tutorial");
    card.classList.remove("onboarding-card-pulse");
    void card.offsetWidth;
    card.classList.add("onboarding-card-pulse");
    resizeObserver?.disconnect();
    resizeObserver = new ResizeObserver(reposition);
    resizeObserver.observe(target);
    reposition();
  };
  const start = async (user = auth.currentUser, force = false) => {
    if (!user || active) return;
    if (!force && localStorage.getItem(completionKey(user.uid)) === "true") return;
    uid = user.uid;
    previousState = saveState();
    active = true;
    stepIndex = 0;
    previousOverflow = document.body.style.overflow;
    document.body.classList.add("onboarding-active");
    document.body.style.overflow = "hidden";
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    await renderStep();
    closeButton.focus();
  };
  const next = async () => { if (!active) return; if (stepIndex >= STEPS.length - 1) return finish(true); stepIndex += 1; await renderStep(); };
  const previous = async () => { if (!active || stepIndex === 0) return; stepIndex -= 1; await renderStep(); };

  closeButton.addEventListener("click", () => finish(true));
  continueButton.addEventListener("click", next);
  backButton?.addEventListener("click", previous);
  document.addEventListener("keydown", (event) => {
    if (!active) return;
    if (event.key === "Escape") { event.preventDefault(); finish(true); }
    else if (event.key === "Enter" || event.key === "ArrowRight") { event.preventDefault(); next(); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
  });
  ["resize", "orientationchange", "scroll"].forEach((eventName) => window.addEventListener(eventName, reposition, { passive: true, capture: eventName === "scroll" }));

  return { start, replay: () => start(auth.currentUser, true), isActive: () => active, close: () => finish(true) };
}
