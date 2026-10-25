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
function waitFrame() { return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))); }
function waitForTarget(selector, timeout = 7000) {
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
  const sourceNodes = ["onboardingOverlay", "onboardingSpotlight", "onboardingClose", "onboardingCard"];
  const source = Object.fromEntries(sourceNodes.map((id) => [id, document.getElementById(id)]));
  if (!Object.values(source).every(Boolean)) return null;

  let portal = document.getElementById("tutorialPortalRoot");
  if (!portal) {
    portal = document.createElement("div");
    portal.id = "tutorialPortalRoot";
    document.body.appendChild(portal);
  }
  Object.values(source).forEach((node) => portal.appendChild(node));
  const overlay = source.onboardingOverlay;
  const spotlight = source.onboardingSpotlight;
  const card = source.onboardingCard;
  const title = document.getElementById("onboardingTitle");
  const description = document.getElementById("onboardingDescription");
  const indicator = document.getElementById("onboardingStepIndicator");
  const closeButton = document.getElementById("onboardingClose");
  const backButton = document.getElementById("onboardingBack");
  const continueButton = document.getElementById("onboardingContinue");
  if (![title, description, indicator, closeButton, backButton, continueButton].every(Boolean)) return null;

  let active = false;
  let stepIndex = 0;
  let uid = null;
  let frame = 0;
  let previousOverflow = "";
  let previousScrollY = 0;
  let previousState = null;
  let openedCreate = false;
  let openedWeight = false;
  let resizeObserver = null;
  let visualViewport = window.visualViewport;
  const cleanupListeners = [];

  const addListener = (target, event, handler, options) => {
    target.addEventListener(event, handler, options);
    cleanupListeners.push(() => target.removeEventListener(event, handler, options));
  };
  const clearTarget = () => document.querySelectorAll(".onboarding-target").forEach((el) => el.classList.remove("onboarding-target"));
  const saveState = () => ({ scrollY: window.scrollY, activeTab: document.querySelector(".tab.active")?.id || "tabTraining" });
  const viewport = () => ({ width: visualViewport?.width || window.innerWidth, height: visualViewport?.height || window.innerHeight, offsetTop: visualViewport?.offsetTop || 0 });
  const scrollTargetIntoView = async (target) => {
    if (target.getBoundingClientRect().top < 0 || target.getBoundingClientRect().bottom > viewport().height) {
      target.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
      await waitFrame();
    }
  };
  const disconnectObserver = () => { resizeObserver?.disconnect(); resizeObserver = null; };
  const restoreState = async () => {
    await navigation?.(previousState?.activeTab === "tabProgress" ? "progress" : previousState?.activeTab === "tabSets" ? "sets" : "training");
    window.scrollTo({ top: previousScrollY, behavior: "auto" });
  };
  const finish = async (save = true) => {
    if (!active) return;
    active = false;
    cancelAnimationFrame(frame);
    disconnectObserver();
    clearTarget();
    cleanupListeners.splice(0).forEach((cleanup) => cleanup());
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    portal.classList.remove("tutorial-open");
    document.body.classList.remove("tutorial-active");
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = "";
    if (openedCreate) closeCreate?.();
    if (openedWeight) closeWeight?.();
    closeTransientUi?.();
    await restoreState();
    if (save && uid) localStorage.setItem(completionKey(uid), "true");
  };
  const fallbackPosition = () => {
    const { width, height, offsetTop } = viewport();
    spotlight.style.left = "16px"; spotlight.style.top = `${Math.max(72, offsetTop + 72)}px`;
    spotlight.style.width = `${Math.max(0, width - 32)}px`; spotlight.style.height = "0px";
    card.style.left = "16px"; card.style.top = `${Math.max(96, height / 2 - card.offsetHeight / 2)}px`;
    card.style.width = `${Math.max(0, width - 32)}px`;
    card.style.setProperty("--pointer-left", "50%");
  };
  const position = (target) => {
    if (!active) return;
    const { width: vw, height: vh, offsetTop } = viewport();
    const rect = target?.getBoundingClientRect();
    const usable = rect && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw;
    if (!usable) { console.warn("[tutorial] Target is not usable; using centered fallback", STEPS[stepIndex].target); fallbackPosition(); return; }
    const pad = vw <= 640 ? 8 : 10;
    const left = Math.max(8, rect.left - pad);
    const top = Math.max(offsetTop + 8, rect.top - pad);
    spotlight.style.left = `${left}px`; spotlight.style.top = `${top}px`;
    spotlight.style.width = `${Math.min(vw - left - 8, rect.width + pad * 2)}px`;
    spotlight.style.height = `${Math.min(vh - top - 8, rect.height + pad * 2)}px`;
    const margin = vw <= 640 ? 16 : 20;
    const cardWidth = Math.min(390, vw - margin * 2);
    card.style.width = `${cardWidth}px`;
    const cardHeight = card.offsetHeight;
    const gap = 20;
    const spaces = [
      { left: Math.max(margin, Math.min(vw - cardWidth - margin, rect.left + rect.width / 2 - cardWidth / 2)), top: rect.bottom + gap },
      { left: Math.max(margin, Math.min(vw - cardWidth - margin, rect.left + rect.width / 2 - cardWidth / 2)), top: rect.top - cardHeight - gap },
      { left: rect.right + gap, top: rect.top + rect.height / 2 - cardHeight / 2 },
      { left: rect.left - cardWidth - gap, top: rect.top + rect.height / 2 - cardHeight / 2 },
    ];
    const fit = (p) => p.left >= margin && p.left + cardWidth <= vw - margin && p.top >= offsetTop + 56 && p.top + cardHeight <= vh - 64;
    const placement = spaces.find(fit) || { left: margin, top: Math.max(offsetTop + 64, vh - cardHeight - 72) };
    card.style.left = `${Math.max(margin, Math.min(vw - cardWidth - margin, placement.left))}px`;
    card.style.top = `${Math.max(offsetTop + 56, Math.min(vh - cardHeight - 64, placement.top))}px`;
    card.style.setProperty("--pointer-left", `${Math.max(20, Math.min(cardWidth - 20, rect.left + rect.width / 2 - parseFloat(card.style.left)))}px`);
  };
  const reposition = () => { if (!active) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(() => position(document.querySelector(STEPS[stepIndex].target))); };
  const renderStep = async () => {
    const step = STEPS[stepIndex];
    clearTarget(); openedCreate = false; openedWeight = false; closeTransientUi?.();
    await navigation?.(step.prepare);
    if (step.prepare === "create") { await openCreate?.(); openedCreate = true; }
    if (step.prepare === "weight") { closeCreate?.(); await openWeight?.(); openedWeight = true; }
    const target = await waitForTarget(step.target);
    title.textContent = step.title; description.textContent = step.description; indicator.textContent = `${stepIndex + 1} of ${STEPS.length}`;
    backButton.toggleAttribute("hidden", stepIndex === 0);
    continueButton.textContent = stepIndex === STEPS.length - 1 ? "✓" : "→";
    continueButton.setAttribute("aria-label", stepIndex === STEPS.length - 1 ? "Finish tutorial" : "Continue tutorial");
    if (!target) { console.warn("[tutorial] Timed out waiting for target", step.target); fallbackPosition(); return; }
    await scrollTargetIntoView(target); await waitFrame(); target.classList.add("onboarding-target");
    card.classList.remove("onboarding-card-pulse"); void card.offsetWidth; card.classList.add("onboarding-card-pulse");
    disconnectObserver(); resizeObserver = new ResizeObserver(reposition); resizeObserver.observe(target); reposition();
  };
  const start = async (user = auth.currentUser, force = false) => {
    if (!user || active) return;
    if (!force && localStorage.getItem(completionKey(user.uid)) === "true") return;
    uid = user.uid; previousState = saveState(); previousScrollY = window.scrollY; active = true; stepIndex = 0;
    previousOverflow = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.classList.add("tutorial-active"); document.body.style.overflow = "hidden"; document.body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : "";
    portal.classList.add("tutorial-open"); overlay.classList.add("open"); overlay.setAttribute("aria-hidden", "false");
    addListener(window, "resize", reposition); addListener(window, "orientationchange", reposition); addListener(window, "scroll", reposition, { passive: true, capture: true });
    if (visualViewport) { addListener(visualViewport, "resize", reposition); addListener(visualViewport, "scroll", reposition); }
    await renderStep(); closeButton.focus();
  };
  const next = async () => { if (!active) return; if (stepIndex >= STEPS.length - 1) return finish(true); stepIndex += 1; await renderStep(); };
  const previous = async () => { if (!active || stepIndex === 0) return; stepIndex -= 1; await renderStep(); };

  closeButton.addEventListener("click", () => finish(true)); continueButton.addEventListener("click", next); backButton.addEventListener("click", previous);
  addListener(document, "keydown", (event) => { if (!active) return; if (event.key === "Escape") { event.preventDefault(); finish(true); } else if (event.key === "Enter" || event.key === "ArrowRight") { event.preventDefault(); next(); } else if (event.key === "ArrowLeft") { event.preventDefault(); previous(); } });
  return { start, replay: () => start(auth.currentUser, true), isActive: () => active, close: () => finish(true) };
}
