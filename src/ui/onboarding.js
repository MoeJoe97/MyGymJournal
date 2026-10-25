const COMPLETION_KEY_PREFIX = "gymJournal:onboardingCompleted:";

const STEPS = [
  {
    title: "Your training overview",
    description: "Overall Progress summarizes your recent training development. Use the exercise selection below to choose the exercise you want to review in more detail.",
    target: '[data-tour="overall-progress"]',
    prepare: "home"
  },
  {
    title: "Track your progress",
    description: "The Progress view shows how your selected exercise develops over time. The charts help you compare training volume, performance, and your best results across the selected period.",
    target: '[data-tour="progress-charts"]',
    prepare: "progress"
  },
  {
    title: "Review individual sets",
    description: "Use the date to select a workout session. The charts below show the recorded sets, weights, and repetitions for the selected exercise and training day.",
    target: '[data-tour="sets-charts"]',
    prepare: "sets"
  },
  {
    title: "Create a workout entry",
    description: "Create lets you record a new workout. Select an exercise, enter your sets, weights, and repetitions, and save the session to update your training history.",
    target: '[data-tour="create-content"]',
    prepare: "create"
  },
  {
    title: "Track your body weight",
    description: "Use Weight to record your current body weight and review its development over time. Regular entries make long-term trends easier to recognize.",
    target: '[data-tour="weight-content"]',
    prepare: "weight"
  }
];

function completionKey(uid) {
  return `${COMPLETION_KEY_PREFIX}${uid}`;
}

function isVisible(element) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== "hidden" && getComputedStyle(element).display !== "none";
}

function waitForTarget(selector, timeout = 4500) {
  return new Promise((resolve) => {
    const started = performance.now();
    const check = () => {
      const element = document.querySelector(selector);
      if (isVisible(element)) return resolve(element);
      if (performance.now() - started >= timeout) return resolve(null);
      requestAnimationFrame(check);
    };
    check();
  });
}

export function createOnboarding({ auth, navigation, closeTransientUi, openCreate, openWeight, closeCreate, closeWeight }) {
  const overlay = document.getElementById("onboardingOverlay");
  const card = document.getElementById("onboardingCard");
  const spotlight = document.getElementById("onboardingSpotlight");
  const title = document.getElementById("onboardingTitle");
  const description = document.getElementById("onboardingDescription");
  const stepIndicator = document.getElementById("onboardingStepIndicator");
  const closeButton = document.getElementById("onboardingClose");
  const continueButton = document.getElementById("onboardingContinue");
  if (!overlay || !card || !spotlight || !title || !description || !stepIndicator || !closeButton || !continueButton) return null;

  let uid = null;
  let stepIndex = 0;
  let active = false;
  let positioningFrame = 0;
  let previousOverflow = "";

  const clearTarget = () => {
    document.querySelectorAll(".onboarding-target").forEach((element) => element.classList.remove("onboarding-target"));
  };

  const finish = (save = true) => {
    active = false;
    cancelAnimationFrame(positioningFrame);
    clearTarget();
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("onboarding-active");
    document.body.style.overflow = previousOverflow;
    closeTransientUi?.();
    if (save && uid) localStorage.setItem(completionKey(uid), "true");
  };

  const position = (target) => {
    if (!active || !isVisible(target)) return;
    const rect = target.getBoundingClientRect();
    const padding = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    spotlight.style.left = `${Math.max(4, rect.left - padding)}px`;
    spotlight.style.top = `${Math.max(4, rect.top - padding)}px`;
    spotlight.style.width = `${Math.min(viewportWidth - 8, rect.width + padding * 2)}px`;
    spotlight.style.height = `${Math.min(viewportHeight - 8, rect.height + padding * 2)}px`;
    const cardWidth = Math.min(360, viewportWidth - 28);
    const gap = 16;
    let left = Math.min(Math.max(14, rect.left + rect.width / 2 - cardWidth / 2), viewportWidth - cardWidth - 14);
    let top = rect.bottom + gap;
    if (top + card.offsetHeight > viewportHeight - 18) top = rect.top - card.offsetHeight - gap;
    if (top < 72) top = Math.min(viewportHeight - card.offsetHeight - 18, Math.max(72, rect.top + rect.height / 2 - card.offsetHeight / 2));
    card.style.width = `${cardWidth}px`;
    card.style.left = `${left}px`;
    card.style.top = `${Math.max(60, top)}px`;
  };

  const reposition = () => {
    if (!active) return;
    cancelAnimationFrame(positioningFrame);
    positioningFrame = requestAnimationFrame(() => position(document.querySelector(STEPS[stepIndex].target)));
  };

  const renderStep = async () => {
    const step = STEPS[stepIndex];
    closeTransientUi?.();
    await navigation?.(step.prepare);
    if (step.prepare === "create") await openCreate?.();
    if (step.prepare === "weight") {
      closeCreate?.();
      await openWeight?.();
    }
    const target = await waitForTarget(step.target);
    if (!target) {
      console.warn(`[onboarding] Could not find visible target: ${step.target}`);
      if (stepIndex < STEPS.length - 1) { stepIndex += 1; return renderStep(); }
      return finish(false);
    }
    clearTarget();
    target.classList.add("onboarding-target");
    title.textContent = step.title;
    description.textContent = step.description;
    stepIndicator.textContent = `${stepIndex + 1} of ${STEPS.length}`;
    continueButton.setAttribute("aria-label", stepIndex === STEPS.length - 1 ? "Finish tutorial" : "Continue tutorial");
    continueButton.textContent = stepIndex === STEPS.length - 1 ? "✓" : "→";
    requestAnimationFrame(() => position(target));
  };

  const start = async (user = auth.currentUser, force = false) => {
    if (!user || active) return;
    uid = user.uid;
    if (!force && localStorage.getItem(completionKey(uid)) === "true") return;
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

  const next = async () => {
    if (!active) return;
    if (stepIndex === STEPS.length - 1) {
      closeCreate?.();
      closeWeight?.();
      await navigation?.("home");
      finish(true);
      return;
    }
    if (stepIndex === 3) closeCreate?.();
    stepIndex += 1;
    await renderStep();
  };

  closeButton.addEventListener("click", () => finish(true));
  continueButton.addEventListener("click", next);
  document.addEventListener("keydown", (event) => {
    if (!active) return;
    if (event.key === "Escape") { event.preventDefault(); finish(true); }
    if (event.key === "Enter" || event.key === "ArrowRight") { event.preventDefault(); next(); }
  });
  window.addEventListener("resize", reposition, { passive: true });
  window.addEventListener("orientationchange", reposition, { passive: true });
  window.addEventListener("scroll", reposition, { passive: true, capture: true });

  return {
    start,
    replay: () => start(auth.currentUser, true),
    isActive: () => active,
    close: () => finish(true)
  };
}
