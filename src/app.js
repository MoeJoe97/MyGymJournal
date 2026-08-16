import { firebaseConfig } from "./config/firebase-config.js";
import { calculateWorkoutMetrics } from "./domain/workout-metrics.js";
import { showSuccessMessage, showErrorMessage } from "./ui/toast.js";

// ============================
      // Firebase Config + Init
      // ============================
      firebase.initializeApp(firebaseConfig);
      const auth = firebase.auth();
      const db = firebase.firestore();
      const appShell = document.querySelector(".app");

      // ============================
      // DOM Elements
      // ============================
      const exerciseLogSheet = document.getElementById("exerciseLogSheet");
      const closeExerciseLogBtn = document.getElementById("closeExerciseLogBtn");
      const accountSheet = document.getElementById("accountSheet");
      const closeAccountSheetBtn = document.getElementById("closeAccountSheetBtn");
      const accountStatusBadge = document.getElementById("accountStatusBadge");
      const accountInfoSection = document.getElementById("accountInfoSection");
      const accountActionsSection = document.getElementById("accountActionsSection");
      const accountLoggedOutSection = document.getElementById("accountLoggedOutSection");
      const accountInfoEmail = document.getElementById("accountInfoEmail");
      const accountNicknameInput = document.getElementById("accountNicknameInput");
      const accountStreetInput = document.getElementById("accountStreetInput");
      const accountPostalCodeInput = document.getElementById("accountPostalCodeInput");
      const accountCityInput = document.getElementById("accountCityInput");
      const accountCountryInput = document.getElementById("accountCountryInput");
      const accountBirthDateInput = document.getElementById("accountBirthDateInput");
      const accountNicknameView = document.getElementById("accountNicknameView");
      const accountStreetView = document.getElementById("accountStreetView");
      const accountPostalCodeView = document.getElementById("accountPostalCodeView");
      const accountCityView = document.getElementById("accountCityView");
      const accountCountryView = document.getElementById("accountCountryView");
      const accountBirthDateView = document.getElementById("accountBirthDateView");
      const accountEditToggleBtn = document.getElementById("accountEditToggleBtn");
      const accountSaveEditBtn = document.getElementById("accountSaveEditBtn");
      const accountCancelEditBtn = document.getElementById("accountCancelEditBtn");
      const accountResetPasswordBtn = document.getElementById("accountResetPasswordBtn");
      const accountDeleteBtn = document.getElementById("accountDeleteBtn");
      const logoutButton = document.getElementById("logoutButton");

      const menuButton = document.getElementById("menuButton");
      const closeDrawerBtn = document.getElementById("closeDrawerBtn");
      const drawer = document.getElementById("drawer");
      const overlay = document.getElementById("overlay");
      const menuAccount = document.getElementById("menuAccount");
      const menuTraining = document.getElementById("menuTraining");
      const menuProgress = document.getElementById("menuProgress");
      const menuSets = document.getElementById("menuSets");
      const menuExerciseLog = document.getElementById("menuExerciseLog");
      const accountPill = document.getElementById("accountPill");
      const userStatusParagraph = document.getElementById("userStatus");

      const tabTraining = document.getElementById("tabTraining");
      const tabProgress = document.getElementById("tabProgress");
      const tabSets = document.getElementById("tabSets");
      const trainingView = document.getElementById("trainingView");
      const progressView = document.getElementById("progressView");
      const setsView = document.getElementById("setsView");

      const loginHintTraining = document.getElementById("loginHintTraining");
      const loginHintProgress = document.getElementById("loginHintProgress");
      const loginHintSets = document.getElementById("loginHintSets");

      const rangeFilterDiv = document.getElementById("rangeFilter");
      const progressRangeFilterDiv = document.getElementById("progressRangeFilter");
      const overallChartCanvas = document.getElementById("overallChart");
      const exercisesListUl = document.getElementById("exercisesList");
      const exerciseSearchInput = document.getElementById("exerciseSearch");
      const sortButton = document.getElementById("sortButton");
      const sortMenu = document.getElementById("sortMenu");

      const progressExerciseSearch = document.getElementById("progressExerciseSearch");
      const progressExerciseList = document.getElementById("progressExerciseList");
      const showProgressChartsButton = document.getElementById("showProgressChartsButton");
      const ivPerDayChartCanvas = document.getElementById("ivPerDayChart");
      const e1rmPerDayChartCanvas = document.getElementById("e1rmPerDayChart");
      const maxWeightPerDayChartCanvas = document.getElementById("maxWeightPerDayChart");
      const volumePerDayChartCanvas = document.getElementById("volumePerDayChart");
      const weightPerDayChartCanvas = document.getElementById("weightPerDayChart");
      const repsPerDayChartCanvas = document.getElementById("repsPerDayChart");

      const setsExerciseSearch = document.getElementById("setsExerciseSearch");
      const setsExerciseList = document.getElementById("setsExerciseList");
      const setsDaySelect = document.getElementById("setsDaySelect");
      const setsPrevDayButton = document.getElementById("setsPrevDayButton");
      const setsNextDayButton = document.getElementById("setsNextDayButton");
      const setsLatestButton = document.getElementById("setsLatestButton");
      const showSetsChartsButton = document.getElementById("showSetsChartsButton");
      const setsSelectedDayLabel = document.getElementById("setsSelectedDayLabel");
      const setsLatestDayLabel = document.getElementById("setsLatestDayLabel");
      const ivPerSetChartCanvas = document.getElementById("ivPerSetChart");
      const e1rmPerSetChartCanvas = document.getElementById("e1rmPerSetChart");
      const maxWeightPerSetChartCanvas = document.getElementById("maxWeightPerSetChart");
      const volumePerSetChartCanvas = document.getElementById("volumePerSetChart");
      const repsPerSetChartCanvas = document.getElementById("repsPerSetChart");

      const fabCreate = document.getElementById("fabCreate");
      const fabExerciseLog = document.getElementById("fabExerciseLog");
      const createModal = document.getElementById("createModal");
      const createModalOverlay = document.getElementById("createModalOverlay");
      const createModalClose = document.getElementById("createModalClose");
      const createCancelButton = document.getElementById("createCancelButton");
      const createSaveButton = document.getElementById("createSaveButton");
      const createExerciseSearch = document.getElementById("createExerciseSearch");
      const createExerciseList = document.getElementById("createExerciseList");
      const createRepetitionsInput = document.getElementById("createRepetitionsInput");
      const createWeightInput = document.getElementById("createWeightInput");
      const createRpeInput = document.getElementById("createRpeInput");
      const createExerciseValidationMessage = document.getElementById("createExerciseValidationMessage");
      const messageDiv = document.getElementById("message");
      setTimeout(() => { try { if (messageDiv && typeof messageDiv.remove === "function") messageDiv.remove(); } catch (_) {} }, 0);

      const editWorkoutModal = document.getElementById("editWorkoutModal");
      const editExerciseInput = document.getElementById("editExerciseInput");
      const editRepsInput = document.getElementById("editRepsInput");
      const editWeightInput = document.getElementById("editWeightInput");
      const editRpeInput = document.getElementById("editRpeInput");
      const editSaveButton = document.getElementById("editSaveButton");
      const editCancelButton = document.getElementById("editCancelButton");
      const editDeleteButton = document.getElementById("editDeleteButton");

      // Login overlay
      const loginOverlay = document.getElementById("loginOverlay");
      const loginOverlayButton = document.getElementById("loginOverlayButton");
      const registerOverlayButton = document.getElementById("registerOverlayButton");
      const loginEmailOverlay = document.getElementById("loginEmailOverlay");
      const loginPasswordOverlay = document.getElementById("loginPasswordOverlay");
      const passwordConfirmInput = document.getElementById("authPasswordConfirm");
      const nicknameInput = document.getElementById("authNickname");
      const passwordError = document.getElementById("passwordError");
      const confirmPasswordError = document.getElementById("confirmPasswordError");
      const resendVerificationButton = document.getElementById("resendVerificationButton");
      const verificationNoticeOverlay = document.getElementById("verificationNoticeOverlay");
      const verificationNoticeEmail = document.getElementById("verificationNoticeEmail");
      const closeVerificationNoticeBtn = document.getElementById("closeVerificationNoticeBtn");

      const closeAccountOverlay = document.getElementById("closeAccountOverlay");
      const closeAccountOverlayX = document.getElementById("closeAccountOverlayX");
      const closeAccountPasswordInput = document.getElementById("closeAccountPasswordInput");
      const closeAccountError = document.getElementById("closeAccountError");
      const confirmCloseAccountBtn = document.getElementById("confirmCloseAccountBtn");
      const cancelCloseAccountBtn = document.getElementById("cancelCloseAccountBtn");
      const deletionSuccessOverlay = document.getElementById("deletionSuccessOverlay");
      const closeDeletionSuccessBtn = document.getElementById("closeDeletionSuccessBtn");
      const deletionSuccessOkBtn = document.getElementById("deletionSuccessOkBtn");
      // ============================
      // State
      // ============================
      let clientSideExercisesMap = new Map();
      let cachedAllWorkouts = [];
      let cachedUserId = null;
      let editWorkoutId = null;
      let activeSortMode = "improv_desc";
      let activeExerciseKey = null;
      let activeRangeTraining = "max";
      let activeRangeProgress = "max";
      let authMode = "login";
      let lastHapticIndex = null;
      let pendingVerificationEmail = "";
      let pendingVerificationPassword = "";
      let isRegisteringAccount = false;
      let currentUserProfile = null;
      let isAccountEditMode = false;
      let showVerificationOverlayAfterLogout = false;
      let justClosedAccountFlow = false;
      let forceVerificationOverlay = false;
      let ignoreNextLoggedOutSync = false;
      let showDeletionSuccessAfterLogout = false;

      const chartInstances = {
        overall: { overall: null },
        progress: {
          ivPerDay: null,
          e1rmPerDay: null,
          maxWeightPerDay: null,
          volumePerDay: null,
          weightPerDay: null,
          repsPerDay: null,
        },
        sets: {
          iv: null,
          e1rm: null,
          weight: null,
          volume: null,
          reps: null,
        },
      };

      const renderRequestIds = { progress: 0, sets: 0 };

      const chartConfigs = {
        overall: {
          key: "overall",
          canvas: overallChartCanvas,
          title: "Overall Performance",
          yLabel: "Total IV",
          beginAtZero: true,
        },
        progress: [
          {
            key: "ivPerDay",
            canvas: ivPerDayChartCanvas,
            title: "IV per Day",
            yLabel: "IV",
            beginAtZero: true,
            tooltipLabel: "IV",
            reducer: (map, dayKey, item) => map.set(dayKey, (map.get(dayKey) || 0) + Number(item.intensityVolume || 0)),
          },
          {
            key: "e1rmPerDay",
            canvas: e1rmPerDayChartCanvas,
            title: "e1RM per Day",
            yLabel: "kg",
            beginAtZero: true,
            tooltipLabel: "e1RM",
            reducer: (map, dayKey, item) => map.set(dayKey, Math.max(map.get(dayKey) || 0, Number(item.e1RM || 0))),
          },
          {
            key: "maxWeightPerDay",
            canvas: maxWeightPerDayChartCanvas,
            title: "Max Weight per Day",
            yLabel: "kg",
            beginAtZero: true,
            tooltipLabel: "Max Weight",
            reducer: (map, dayKey, item) => map.set(dayKey, Math.max(map.get(dayKey) || 0, Number(item.weight || 0))),
          },
          {
            key: "volumePerDay",
            canvas: volumePerDayChartCanvas,
            title: "Volume per Day",
            yLabel: "Volume",
            beginAtZero: true,
            tooltipLabel: "Volume",
            reducer: (map, dayKey, item) => map.set(dayKey, (map.get(dayKey) || 0) + Number(item.weight || 0) * Number(item.repetitions || 0)),
          },
          {
            key: "weightPerDay",
            canvas: weightPerDayChartCanvas,
            title: "Weight per Day",
            yLabel: "kg",
            beginAtZero: true,
            tooltipLabel: "Weight",
            reducer: (map, dayKey, item) => map.set(dayKey, Math.max(map.get(dayKey) || 0, Number(item.weight || 0))),
          },
          {
            key: "repsPerDay",
            canvas: repsPerDayChartCanvas,
            title: "Repetitions per Day",
            yLabel: "Reps",
            beginAtZero: true,
            tooltipLabel: "Reps",
            reducer: (map, dayKey, item) => map.set(dayKey, (map.get(dayKey) || 0) + Number(item.repetitions || 0)),
          },
        ],
        sets: [
          { key: "iv", canvas: ivPerSetChartCanvas, title: "IV per Set", yLabel: "IV", beginAtZero: true, tooltipLabel: "IV", getValue: (item) => Number(item.intensityVolume || 0) },
          { key: "e1rm", canvas: e1rmPerSetChartCanvas, title: "e1RM per Set", yLabel: "kg", beginAtZero: true, tooltipLabel: "e1RM", getValue: (item) => Number(item.e1RM || 0) },
          { key: "weight", canvas: maxWeightPerSetChartCanvas, title: "Weight per Set", yLabel: "kg", beginAtZero: true, tooltipLabel: "Weight", getValue: (item) => Number(item.weight || 0) },
          { key: "volume", canvas: volumePerSetChartCanvas, title: "Volume per Set", yLabel: "Volume", beginAtZero: true, tooltipLabel: "Volume", getValue: (item) => Number(item.weight || 0) * Number(item.repetitions || 0) },
          { key: "reps", canvas: repsPerSetChartCanvas, title: "Repetitions per Set", yLabel: "Reps", beginAtZero: true, tooltipLabel: "Reps", getValue: (item) => Number(item.repetitions || 0) },
        ],
      };

      const dropdownConfigs = [
        { name: "progress", input: progressExerciseSearch, list: progressExerciseList, highlightedIndex: -1, onSelected: async (key) => syncExerciseAcrossTabs(key, { forceLatestSets: true, activateProgressTab: false }) },
        { name: "sets", input: setsExerciseSearch, list: setsExerciseList, highlightedIndex: -1, onSelected: async (key) => syncExerciseAcrossTabs(key, { forceLatestSets: true, activateProgressTab: false }) },
        { name: "create", input: createExerciseSearch, list: createExerciseList, highlightedIndex: -1, onSelected: async (key) => { activeExerciseKey = key; clearCreateInlineMessage(); } },
      ];

      // ============================
      // Messaging / UI helpers
      // ============================
      function removeHomeMessageElement() {
       try {
       const homeMessageEl = document.getElementById("message");
       if (!homeMessageEl) return;
       homeMessageEl.innerHTML = "";
       homeMessageEl.className = "";
       homeMessageEl.textContent = "";
       homeMessageEl.style.display = "none";
       homeMessageEl.style.visibility = "hidden";
       homeMessageEl.style.opacity = "0";
       homeMessageEl.style.pointerEvents = "none";
       homeMessageEl.style.maxHeight = "0";
       homeMessageEl.style.overflow = "hidden";
       if (typeof homeMessageEl.remove === "function") homeMessageEl.remove();
       } catch (_) {}
      }
      function clearHomeMessage() {
        removeHomeMessageElement();
      }
      function openLoginOverlay(prefillEmail = "") {
       if (verificationNoticeOverlay) {
        verificationNoticeOverlay.classList.remove('open');
        hideElementForA11y(verificationNoticeOverlay);
       }
       closeDrawer();
       closeAccountSheet();
       closeExerciseLogSheet();
       closeCreateModal();
       closeCloseAccountOverlay();
       if (deletionSuccessOverlay) {
        deletionSuccessOverlay.classList.remove('open');
        deletionSuccessOverlay.style.display = 'none';
        deletionSuccessOverlay.style.visibility = 'hidden';
        deletionSuccessOverlay.style.pointerEvents = 'none';
        hideElementForA11y(deletionSuccessOverlay);
       }
       switchToLoginMode();
       if (prefillEmail) loginEmailOverlay.value = prefillEmail;
       loginPasswordOverlay.value = '';
       if (loginOverlay) {
        loginOverlay.classList.remove('hidden');
        loginOverlay.style.display = 'flex';
        loginOverlay.style.visibility = 'visible';
        loginOverlay.style.pointerEvents = 'auto';
        showElementForA11y(loginOverlay);
       }
       lockAppBehindLoginOverlay();
       setTimeout(() => loginEmailOverlay?.focus(), 0);
      }
      function clearCreateInlineMessage() {
        if (!createExerciseValidationMessage) return;
        createExerciseValidationMessage.textContent = "";
        createExerciseValidationMessage.style.display = "none";
        createExerciseValidationMessage.classList.remove("inline-form-message");
      }
      function showCreateInlineMessage(text) {
        if (!createExerciseValidationMessage) return;
        createExerciseValidationMessage.textContent = text;
        createExerciseValidationMessage.style.display = "block";
        createExerciseValidationMessage.classList.add("inline-form-message");
      }
      function clearAuthInlineErrors() {
       if (passwordError) { passwordError.textContent = ''; passwordError.style.display = 'none'; }
       if (confirmPasswordError) { confirmPasswordError.textContent = ''; confirmPasswordError.style.display = 'none'; }
      }
      function showLoginPasswordError(message) {
       if (!passwordError) return;
       passwordError.textContent = message;
       passwordError.style.display = 'block';
      }

      function setAccountStatusUi(isLoggedIn) {
        if (accountStatusBadge) {
          accountStatusBadge.textContent = isLoggedIn ? "Logged in" : "Logged out";
          accountStatusBadge.classList.toggle("logged-in", isLoggedIn);
        }
        if (accountInfoSection) accountInfoSection.style.display = isLoggedIn ? "block" : "none";
        if (accountActionsSection) accountActionsSection.style.display = isLoggedIn ? "block" : "none";
        if (accountLoggedOutSection) accountLoggedOutSection.style.display = isLoggedIn ? "none" : "block";
      }

      function setAccountInfoValue(element, value) {
        if (!element) return;
        const normalized = value === undefined || value === null || value === "" ? "—" : String(value);
        element.textContent = normalized;
        if (element.classList) element.classList.toggle('empty', normalized === '—');
      }

      function formatBirthDateForDisplay(value) {
        const normalized = normalizeBirthDateForInput(value);
        if (!normalized) return '—';
        const parts = normalized.split('-');
        if (parts.length !== 3) return normalized;
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }

      function syncAccountViewModeFields(profile, user = auth.currentUser) {
        setAccountInfoValue(accountInfoEmail, user?.email || profile?.email || '—');
        setAccountInfoValue(accountNicknameView, profile?.nickname || '');
        setAccountInfoValue(accountStreetView, profile?.street || profile?.address || '');
        setAccountInfoValue(accountPostalCodeView, profile?.postalCode || '');
        setAccountInfoValue(accountCityView, profile?.city || '');
        setAccountInfoValue(accountCountryView, profile?.country || '');
        setAccountInfoValue(accountBirthDateView, formatBirthDateForDisplay(profile?.birthDate));
      }

      function normalizeBirthDateForInput(value) {
        if (!value) return "";
        const asString = String(value).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(asString)) return asString;
        const parsed = new Date(asString);
        if (Number.isNaN(parsed.getTime())) return "";
        const y = parsed.getFullYear();
        const m = String(parsed.getMonth() + 1).padStart(2, "0");
        const d = String(parsed.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }

      function populateAccountForm(profile, user = auth.currentUser) {
       setAccountInfoValue(accountInfoEmail, user?.email || profile?.email || "—");
       if (accountNicknameInput) accountNicknameInput.value = profile?.nickname || "";
       if (accountStreetInput) accountStreetInput.value = profile?.street || profile?.address || "";
       if (accountPostalCodeInput) accountPostalCodeInput.value = profile?.postalCode || "";
       if (accountCityInput) accountCityInput.value = profile?.city || "";
       if (accountCountryInput) accountCountryInput.value = profile?.country || "";
       if (accountBirthDateInput) accountBirthDateInput.value = normalizeBirthDateForInput(profile?.birthDate);
       syncAccountViewModeFields(profile, user);
      }
      function blurActiveElement() {
       const active = document.activeElement;
       if (active && typeof active.blur === 'function') active.blur();
      }
      function safelyHideOverlayAndRestoreFocus(overlayEl, fallbackEl = menuButton) {
       const active = document.activeElement;
       if (overlayEl && active && overlayEl.contains(active) && typeof active.blur === 'function') {
        try { active.blur(); } catch (_) {}
       }
       if (fallbackEl && typeof fallbackEl.focus === 'function') {
        setTimeout(() => { try { fallbackEl.focus(); } catch (_) {} }, 0);
       }
       if (overlayEl) hideElementForA11y(overlayEl);
      }
      function hideElementForA11y(el) {
       if (!el) return;
       el.setAttribute('aria-hidden', 'true');
       try { el.inert = true; } catch (_) {}
      }
      function showElementForA11y(el) {
       if (!el) return;
       el.setAttribute('aria-hidden', 'false');
       try { el.inert = false; } catch (_) {}
      }
      function lockAppBehindLoginOverlay() {
       if (!appShell) return;
       appShell.setAttribute('aria-hidden', 'true');
       try { appShell.inert = true; } catch (_) {}
      }
      function unlockAppAfterLogin() {
       if (!appShell) return;
       appShell.setAttribute('aria-hidden', 'false');
       try { appShell.inert = false; } catch (_) {}
      }
      function setVerificationNoticeText(email) {
       if (verificationNoticeEmail) verificationNoticeEmail.textContent = email || 'your email address';
      }
      function openVerificationNoticeOverlay(email) {
       clearHomeMessage();
       ignoreNextLoggedOutSync = true;
       const targetEmail = email || pendingVerificationEmail || '';
       if (targetEmail) pendingVerificationEmail = targetEmail;
       openLoginOverlay(targetEmail);
       setVerificationNoticeText(targetEmail);
       if (verificationNoticeOverlay) {
        verificationNoticeOverlay.classList.add('open');
        verificationNoticeOverlay.style.display = 'flex';
        verificationNoticeOverlay.style.visibility = 'visible';
        verificationNoticeOverlay.style.pointerEvents = 'auto';
        showElementForA11y(verificationNoticeOverlay);
       }
       setTimeout(() => closeVerificationNoticeBtn?.focus(), 0);
      }
      function closeVerificationNoticeOverlay() {
       clearHomeMessage();
       ignoreNextLoggedOutSync = false;
       if (verificationNoticeOverlay) {
        verificationNoticeOverlay.classList.remove('open');
        verificationNoticeOverlay.style.display = 'none';
        verificationNoticeOverlay.style.visibility = 'hidden';
        verificationNoticeOverlay.style.pointerEvents = 'none';
        hideElementForA11y(verificationNoticeOverlay);
       }
       openLoginOverlay(pendingVerificationEmail);
      }

      function openCloseAccountOverlay() {
       clearHomeMessage();
       closeDrawer();
       closeAccountSheet();
       closeExerciseLogSheet();
       closeCreateModal();
       if (closeAccountError) {
        closeAccountError.textContent = '';
        closeAccountError.style.display = 'none';
       }
       if (closeAccountPasswordInput) closeAccountPasswordInput.value = '';
       if (closeAccountOverlay) {
        closeAccountOverlay.style.display = 'flex';
        closeAccountOverlay.style.visibility = 'visible';
        closeAccountOverlay.style.pointerEvents = 'auto';
        closeAccountOverlay.classList.add('open');
        showElementForA11y(closeAccountOverlay);
       }
       setTimeout(() => closeAccountPasswordInput?.focus(), 0);
      }
      function closeCloseAccountOverlay() {
       if (closeAccountOverlay) {
        safelyHideOverlayAndRestoreFocus(closeAccountOverlay, menuButton);
        closeAccountOverlay.classList.remove('open');
        closeAccountOverlay.style.display = 'none';
        closeAccountOverlay.style.visibility = 'hidden';
        closeAccountOverlay.style.pointerEvents = 'none';
       }
       if (closeAccountError) {
        closeAccountError.textContent = '';
        closeAccountError.style.display = 'none';
       }
       if (closeAccountPasswordInput) closeAccountPasswordInput.value = '';
      }
      function openDeletionSuccessOverlay() {
       if (deletionSuccessOverlay) {
        deletionSuccessOverlay.style.display = 'flex';
        deletionSuccessOverlay.style.visibility = 'visible';
        deletionSuccessOverlay.style.pointerEvents = 'auto';
        deletionSuccessOverlay.classList.add('open');
        showElementForA11y(deletionSuccessOverlay);
       }
      }
      function closeDeletionSuccessOverlay() {
       if (deletionSuccessOverlay) {
        safelyHideOverlayAndRestoreFocus(deletionSuccessOverlay, menuButton);
        deletionSuccessOverlay.classList.remove('open');
        deletionSuccessOverlay.style.display = 'none';
        deletionSuccessOverlay.style.visibility = 'hidden';
        deletionSuccessOverlay.style.pointerEvents = 'none';
       }
       openLoginOverlay(pendingVerificationEmail || '');
      }

      function closeCurrentAccount() {
       const user = auth.currentUser;
       if (!user || !user.email) {
        openLoginOverlay();
        return;
       }
       openCloseAccountOverlay();
      }
      async function confirmCloseCurrentAccount() {
       const user = auth.currentUser;
       const password = (closeAccountPasswordInput?.value || '').trim();
       if (!user || !user.email) {
        if (closeAccountError) {
         closeAccountError.textContent = 'No authenticated user available.';
         closeAccountError.style.display = 'block';
        }
        return;
       }
       if (!password) {
        if (closeAccountError) {
         closeAccountError.textContent = 'Please enter your current password.';
         closeAccountError.style.display = 'block';
        }
        closeAccountPasswordInput?.focus();
        return;
       }
       if (confirmCloseAccountBtn) {
        confirmCloseAccountBtn.disabled = true;
        confirmCloseAccountBtn.textContent = 'Deleting...';
       }
       try {
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
        await user.reauthenticateWithCredential(credential);
        await deleteUserOwnedData(user.uid);
        showDeletionSuccessAfterLogout = true;
        ignoreNextLoggedOutSync = true;
        await user.delete();
        closeCloseAccountOverlay();
       } catch (error) {
        console.error('Delete account error:', error);
        if (closeAccountError) {
         if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') closeAccountError.textContent = 'Wrong password. Please try again.';
         else if (error.code === 'auth/requires-recent-login') closeAccountError.textContent = 'Please sign in again and retry account deletion.';
         else closeAccountError.textContent = `Could not delete account: ${error.message}`;
         closeAccountError.style.display = 'block';
        }
       } finally {
        if (confirmCloseAccountBtn) {
         confirmCloseAccountBtn.disabled = false;
         confirmCloseAccountBtn.textContent = 'Confirm';
        }
       }
      }

      function setAccountEditMode(enabled) {
       isAccountEditMode = !!enabled;
       const fieldPairs = [
        [accountNicknameInput, accountNicknameView],
        [accountStreetInput, accountStreetView],
        [accountPostalCodeInput, accountPostalCodeView],
        [accountCityInput, accountCityView],
        [accountCountryInput, accountCountryView],
        [accountBirthDateInput, accountBirthDateView],
       ];
       fieldPairs.forEach(([input, view]) => {
        if (input) {
         input.disabled = !isAccountEditMode;
         input.style.display = isAccountEditMode ? 'block' : 'none';
        }
        if (view) {
         view.style.display = isAccountEditMode ? 'none' : 'block';
        }
       });
       if (accountInfoSection) {
        accountInfoSection.classList.toggle('profile-edit-mode', isAccountEditMode);
        accountInfoSection.classList.toggle('profile-view-mode', !isAccountEditMode);
       }
       if (accountActionsSection) accountActionsSection.classList.toggle('account-edit-mode', isAccountEditMode);
       if (accountEditToggleBtn) {
        accountEditToggleBtn.hidden = isAccountEditMode;
        accountEditToggleBtn.style.display = isAccountEditMode ? 'none' : 'block';
       }
       if (accountSaveEditBtn) {
        accountSaveEditBtn.hidden = !isAccountEditMode;
        accountSaveEditBtn.style.display = isAccountEditMode ? 'block' : 'none';
       }
       if (accountCancelEditBtn) {
        accountCancelEditBtn.hidden = !isAccountEditMode;
        accountCancelEditBtn.style.display = isAccountEditMode ? 'block' : 'none';
       }
      }
      function cancelAccountEditing() {
        populateAccountForm(currentUserProfile, auth.currentUser);
        forceAccountButtonsToViewMode();
        setAccountEditMode(false);
      }
      function forceAccountButtonsToViewMode() {
       if (accountInfoSection) {
        accountInfoSection.classList.remove('profile-edit-mode');
        accountInfoSection.classList.add('profile-view-mode');
       }
       const fieldPairs = [
        [accountNicknameInput, accountNicknameView],
        [accountStreetInput, accountStreetView],
        [accountPostalCodeInput, accountPostalCodeView],
        [accountCityInput, accountCityView],
        [accountCountryInput, accountCountryView],
        [accountBirthDateInput, accountBirthDateView],
       ];
       fieldPairs.forEach(([input, view]) => {
        if (input) { input.disabled = true; input.style.display = 'none'; }
        if (view) { view.style.display = 'block'; }
       });
       if (accountActionsSection) accountActionsSection.classList.remove('account-edit-mode');
       if (accountEditToggleBtn) {
        accountEditToggleBtn.hidden = false;
        accountEditToggleBtn.style.display = 'block';
       }
       if (accountSaveEditBtn) {
        accountSaveEditBtn.hidden = true;
        accountSaveEditBtn.style.display = 'none';
       }
       if (accountCancelEditBtn) {
        accountCancelEditBtn.hidden = true;
        accountCancelEditBtn.style.display = 'none';
       }
       isAccountEditMode = false;
      }
      async function loadCurrentUserProfile() {
       const user = auth.currentUser;
       if (!user) {
        currentUserProfile = null;
        populateAccountForm(null, null);
        syncAccountViewModeFields(null, null);
        forceAccountButtonsToViewMode();
        setAccountEditMode(false);
        return null;
       }
       const snap = await db.collection("users").doc(user.uid).get();
       currentUserProfile = snap.exists ? snap.data() : null;
       populateAccountForm(currentUserProfile, user);
       syncAccountViewModeFields(currentUserProfile, user);
       forceAccountButtonsToViewMode();
       setAccountEditMode(false);
       return currentUserProfile;
      }
      function isMobileView() { return window.innerWidth <= 640; }
      function vibrateTick() { if (isMobileView() && navigator.vibrate) navigator.vibrate(8); }
      function normalizeExerciseInput(input) { return String(input || "").trim().toLowerCase().replace(/\s+/g, " "); }
      function toTitleCase(text) { return String(text || "").split(" ").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "); }

      function findExerciseKeyByDisplayName(inputValue) {
        const normalizedInput = normalizeExerciseInput(inputValue);
        for (const [key, name] of clientSideExercisesMap.entries()) {
          if (normalizeExerciseInput(name) === normalizedInput) return key;
        }
        return null;
      }
      function getExerciseDisplayNameFromKey(key) { return clientSideExercisesMap.get(key) || key || ""; }
      function getExerciseMatches(rawQuery) {
        const query = normalizeExerciseInput(rawQuery);
        const rows = [];
        for (const [key, name] of clientSideExercisesMap.entries()) {
          const normalizedName = normalizeExerciseInput(name);
          const starts = query ? normalizedName.startsWith(query) : true;
          const includes = query ? normalizedName.includes(query) : true;
          if (!query || includes) rows.push({ key, name, score: starts ? 0 : 1 });
        }
        rows.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
        return rows;
      }
      function getDropdownConfigByName(name) { return dropdownConfigs.find((cfg) => cfg.name === name); }
      function hideDropdown(config) { if (config?.list) { config.list.style.display = "none"; config.highlightedIndex = -1; } }
      function selectDropdownItemElement(listEl, index) { Array.from(listEl.querySelectorAll("li")).forEach((item, idx) => item.classList.toggle("active", idx === index)); }
      function renderDropdownOptions(config, rawQuery) {
        const matches = getExerciseMatches(rawQuery);
        config.list.innerHTML = "";
        matches.forEach(({ key, name }) => {
          const li = document.createElement("li");
          li.textContent = String(name || "").toUpperCase();
          li.dataset.key = key;
          li.addEventListener("mousedown", (e) => e.preventDefault());
          li.addEventListener("click", async () => { config.input.value = name; hideDropdown(config); await config.onSelected(key); });
          config.list.appendChild(li);
        });
        if (matches.length) {
          config.list.style.display = "block";
          config.highlightedIndex = 0;
          selectDropdownItemElement(config.list, 0);
        } else hideDropdown(config);
        return matches;
      }
      async function chooseHighlightedDropdownItem(config) {
        const items = Array.from(config.list.querySelectorAll("li"));
        if (!items.length) return false;
        const index = config.highlightedIndex >= 0 ? config.highlightedIndex : 0;
        const item = items[index];
        if (!item) return false;
        const key = item.dataset.key;
        const name = getExerciseDisplayNameFromKey(key);
        config.input.value = name;
        hideDropdown(config);
        await config.onSelected(key);
        return true;
      }
      function updateDropdownHighlight(config, direction) {
        const items = Array.from(config.list.querySelectorAll("li"));
        if (!items.length) return;
        if (config.highlightedIndex < 0) config.highlightedIndex = 0;
        else config.highlightedIndex = (config.highlightedIndex + direction + items.length) % items.length;
        selectDropdownItemElement(config.list, config.highlightedIndex);
      }

      function setupExerciseAutocomplete(config) {
        if (!config.input || !config.list) return;
        config.input.addEventListener("input", async () => {
          if (config.name !== "create") {
            activeExerciseKey = null;
            if (config.name === "progress") setsExerciseSearch.value = progressExerciseSearch.value;
            if (config.name === "sets") progressExerciseSearch.value = setsExerciseSearch.value;
          }
          clearCreateInlineMessage();
          renderDropdownOptions(config, config.input.value);
          const exactKey = findExerciseKeyByDisplayName(config.input.value);
          if (exactKey && config.name !== "create") await syncExerciseAcrossTabs(exactKey, { forceLatestSets: true, activateProgressTab: false });
        });
        config.input.addEventListener("focus", () => renderDropdownOptions(config, config.input.value));
        config.input.addEventListener("keydown", async (e) => {
          if (e.key === "Escape") { hideDropdown(config); config.input.blur(); return; }
          if (e.key === "ArrowDown") { e.preventDefault(); if (config.list.style.display !== "block") renderDropdownOptions(config, config.input.value); updateDropdownHighlight(config, 1); return; }
          if (e.key === "ArrowUp") { e.preventDefault(); if (config.list.style.display !== "block") renderDropdownOptions(config, config.input.value); updateDropdownHighlight(config, -1); return; }
          if (e.key === "Enter") {
            e.preventDefault();
            if (config.name === "create") {
              if (hasCreateRequiredValues()) await saveWorkoutEntry();
              else { showCreateInlineMessage("Please enter all values before saving."); showErrorMessage("Please enter all values before saving."); }
              return;
            }
            if (config.list.style.display === "block") { const chosen = await chooseHighlightedDropdownItem(config); if (chosen) return; }
            const exactKey = findExerciseKeyByDisplayName(config.input.value);
            if (!exactKey) { showErrorMessage("Please select a valid exercise from the list."); return; }
            await syncExerciseAcrossTabs(exactKey, { forceLatestSets: true, activateProgressTab: false });
          }
        });
      }

      function isValidPassword(password) {
        return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
      }
      function validateRegisterInputs() {
       const password = loginPasswordOverlay.value;
       const confirmPassword = passwordConfirmInput.value;
       let isValid = true;
       if (authMode === "register") {
        if (!isValidPassword(password)) { passwordError.textContent = "Min. 8 chars, upper, lower, number, special."; passwordError.style.display = "block"; isValid = false; }
        else passwordError.style.display = "none";
        if (confirmPassword && password !== confirmPassword) { confirmPasswordError.textContent = "Passwords do not match."; confirmPasswordError.style.display = "block"; isValid = false; }
        else confirmPasswordError.style.display = "none";
        loginOverlayButton.disabled = !isValid;
        loginOverlayButton.style.opacity = loginOverlayButton.disabled ? "0.5" : "1";
       } else {
        clearAuthInlineErrors();
        loginOverlayButton.disabled = false;
        loginOverlayButton.style.opacity = "1";
       }
      }
      function switchToRegisterMode(email = "", password = "") {
       authMode = "register";
       loginEmailOverlay.value = email;
       loginPasswordOverlay.value = password;
       nicknameInput.style.display = "block";
       passwordConfirmInput.style.display = "block";
       if (loginPanelTitle) loginPanelTitle.textContent = 'Create account';
       if (loginPanelSubtitle) loginPanelSubtitle.textContent = 'Create a new account to continue.';
       clearAuthInlineErrors();
       loginOverlay.classList.remove("hidden");
       loginOverlayButton.textContent = "Create Account";
       registerOverlayButton.textContent = "Back to login";
       setTimeout(() => nicknameInput.focus(), 0);
       validateRegisterInputs();
      }
      function switchToLoginMode() {
       authMode = "login";
       nicknameInput.style.display = "none";
       passwordConfirmInput.style.display = "none";
       nicknameInput.value = "";
       passwordConfirmInput.value = "";
       if (loginPanelTitle) loginPanelTitle.textContent = 'Welcome!';
       if (loginPanelSubtitle) loginPanelSubtitle.textContent = 'Please log in to continue.';
       loginOverlayButton.textContent = "Login";
       registerOverlayButton.textContent = "Create account";
       clearAuthInlineErrors();
       validateRegisterInputs();
      }
      function resetAuthForm() {
        loginEmailOverlay.value = "";
        loginPasswordOverlay.value = "";
        nicknameInput.value = "";
        passwordConfirmInput.value = "";
        switchToLoginMode();
      }

      function baseChartOptions(titleText, yTitle, beginAtZero) {
        return {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false, axis: "x" },
          elements: { point: { radius: (ctx) => (ctx.active ? 5 : 0), hoverRadius: 0, hitRadius: 20, backgroundColor: "#ffffff", borderColor: "#000000", borderWidth: 2 } },
          onHover: (event, elements) => { if (!isMobileView()) return; if (!elements || !elements.length) return; const idx = elements[0].index; if (idx !== lastHapticIndex) { lastHapticIndex = idx; vibrateTick(); } },
          scales: { y: { beginAtZero, display: false }, x: { display: true, ticks: { display: false }, grid: { drawOnChartArea: false, drawTicks: false, borderDash: [4,4], color: "rgba(255,255,255,0.2)" } } },
          plugins: { title: { display: false, text: titleText }, legend: { display: false }, tooltip: { enabled: true } },
        };
      }
      function createDataset(dataPoints) { return [{ data: dataPoints, borderColor: "rgba(255,255,255,0.85)", backgroundColor: "rgba(255,255,255,0.08)", fill: true, tension: 0.25 }]; }
      function destroyChart(chartInstance) { if (chartInstance) { chartInstance.destroy(); chartInstance = null; } return chartInstance; }
      function destroyChartByCanvas(canvas) { const existingChart = Chart.getChart(canvas); if (existingChart) existingChart.destroy(); }
      function destroyChartGroup(groupKey) { Object.keys(chartInstances[groupKey]).forEach((key) => { chartInstances[groupKey][key] = destroyChart(chartInstances[groupKey][key]); }); }
      function createManagedChart(groupKey, chartKey, canvas, labels, dataPoints, title, yLabel, beginAtZero, tooltipCallbacks = null) {
        chartInstances[groupKey][chartKey] = destroyChart(chartInstances[groupKey][chartKey]);
        destroyChartByCanvas(canvas);
        const options = baseChartOptions(title, yLabel, beginAtZero);
        if (tooltipCallbacks) options.plugins.tooltip = { callbacks: tooltipCallbacks };
        chartInstances[groupKey][chartKey] = new Chart(canvas, { type: "line", data: { labels, datasets: createDataset(dataPoints) }, options });
      }

      function tsToDate(ts) { if (!ts) return null; if (typeof ts.toDate === "function") return ts.toDate(); if (typeof ts.seconds === "number") return new Date(ts.seconds * 1000); try { return new Date(ts); } catch { return null; } }
      function getRPEForCalculation(rpeValue) { const n = parseFloat(rpeValue); return !isNaN(n) && n >= 0 && n <= 10 ? n : NaN; }
      function getLocalDayKey(date = new Date()) { const y = date.getFullYear(); const m = String(date.getMonth()+1).padStart(2,"0"); const d = String(date.getDate()).padStart(2,"0"); return `${y}-${m}-${d}`; }
      function getLocalDayBounds(date = new Date()) { return { start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0,0), end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23,59,59,999) }; }
      function formatDayKeyDE(dayKey) { return new Date(dayKey + "T00:00:00").toLocaleDateString("de-DE"); }
      function getCutoffDateForRange(rangeKey) { if (rangeKey === "max") return null; const now = new Date(); const cutoff = new Date(now); if (rangeKey === "day") cutoff.setDate(now.getDate()-1); else if (rangeKey === "week") cutoff.setDate(now.getDate()-7); else if (rangeKey === "month") cutoff.setMonth(now.getMonth()-1); else if (rangeKey === "year") cutoff.setFullYear(now.getFullYear()-1); return cutoff; }
      function filterByRange(items, rangeKey) { const cutoff = getCutoffDateForRange(rangeKey); return cutoff ? items.filter((x) => x.timestamp >= cutoff) : items; }
      function setActiveButtons(containerDiv, rangeKey) { if (!containerDiv) return; containerDiv.querySelectorAll('.range-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.range === rangeKey)); }
      function setLinkSaving(buttonEl, isSaving, originalText) { if (!buttonEl) return; if (!buttonEl.dataset.originalText) buttonEl.dataset.originalText = originalText || buttonEl.textContent || 'Save'; if (isSaving) { buttonEl.textContent = 'Saving...'; buttonEl.classList.add('saving'); buttonEl.classList.remove('accent'); } else { buttonEl.textContent = buttonEl.dataset.originalText; buttonEl.classList.remove('saving'); buttonEl.classList.add('accent'); } }
      function getExerciseDisplayName(exerciseKey, allItems) { for (let i = allItems.length - 1; i >= 0; i--) { if (allItems[i].exerciseDisplay) return allItems[i].exerciseDisplay; } return clientSideExercisesMap.get(exerciseKey) || exerciseKey; }
      function uniqueSortedDayKeys(items) { const set = new Set(); items.forEach((x) => set.add(getLocalDayKey(x.timestamp))); return Array.from(set).sort(); }
      function buildDailySeries(items, reducerFn) { const dayMap = new Map(); items.forEach((item) => reducerFn(dayMap, getLocalDayKey(item.timestamp), item)); const sortedDays = Array.from(dayMap.keys()).sort(); return { labels: sortedDays.map((day) => new Date(`${day}T12:00:00`).toLocaleDateString('de-DE')), dataPoints: sortedDays.map((day) => parseFloat((dayMap.get(day) || 0).toFixed(2))), sortedDays }; }
      function buildDailyTooltipCallbacks(daySeriesMeta, labelPrefix) { return { title: (tooltipItems) => tooltipItems?.length ? tooltipItems[0].label : '', label: (ctx) => `${labelPrefix}: ${Number(ctx.parsed.y || 0).toFixed(2)}`, afterBody: (tooltipItems) => { if (!tooltipItems?.length) return []; const meta = daySeriesMeta[tooltipItems[0].dataIndex] || {}; return [`Sets: ${meta.sets || 0}`, `Reps: ${meta.reps || 0}`, `Max Weight: ${Number(meta.maxWeight || 0).toFixed(2)} kg`]; } }; }
      function buildSetLabels(itemsForDay) { return itemsForDay.map((item, idx) => `Set ${item.setNumber ? item.setNumber : String(idx+1)}`); }
      function buildSetTooltipCallbacks(itemsForDay, valueLabel) { return { title: (tooltipItems) => { const idx = tooltipItems?.length ? tooltipItems[0].dataIndex : 0; const item = itemsForDay[idx]; const sn = item?.setNumber ? item.setNumber : String(idx + 1); return `Set ${sn}`; }, label: (ctx) => { const item = itemsForDay[ctx.dataIndex] || {}; const val = ctx.parsed.y; return [`${valueLabel}: ${Number(val).toFixed(2)}`, `Reps: ${Number(item.repetitions || 0)}`, `RPE: ${item.rpe === 0 || item.rpe ? item.rpe : '—'}`, `Weight: ${Number(item.weight || 0)}`, `e1RM: ${Number(item.e1RM || 0)}`]; } }; }
      function sortSetsWithinDay(itemsForDay) { itemsForDay.sort((a,b) => { const an = parseInt(a.setNumber,10); const bn = parseInt(b.setNumber,10); const aNum = isFinite(an) ? an : 9999; const bNum = isFinite(bn) ? bn : 9999; if (aNum !== bNum) return aNum - bNum; return a.timestamp - b.timestamp; }); }
      function setSetsMetaLabels(selectedDayKey, latestDayKey) { setsSelectedDayLabel.textContent = selectedDayKey ? formatDayKeyDE(selectedDayKey) : '—'; setsLatestDayLabel.textContent = latestDayKey ? formatDayKeyDE(latestDayKey) : '—'; }
      function populateSetsDaySelect(allItems, preferredDayKey = null) { setsDaySelect.innerHTML = ''; const dayKeys = uniqueSortedDayKeys(allItems); if (!dayKeys.length) { const opt = document.createElement('option'); opt.value=''; opt.textContent='— No days —'; setsDaySelect.appendChild(opt); return { dayKeys, latestDayKey: null }; } dayKeys.forEach((dayKey) => { const opt = document.createElement('option'); opt.value=dayKey; opt.textContent=formatDayKeyDE(dayKey); setsDaySelect.appendChild(opt); }); const latestDayKey = dayKeys[dayKeys.length - 1]; setsDaySelect.value = preferredDayKey && dayKeys.includes(preferredDayKey) ? preferredDayKey : latestDayKey; return { dayKeys, latestDayKey }; }
      function getItemsForDay(allItems, dayKey) { return allItems.filter((item) => getLocalDayKey(item.timestamp) === dayKey); }

      function openDrawer() { drawer.classList.add('open'); overlay.classList.add('open'); showElementForA11y(drawer); }
      function closeDrawer() { blurActiveElement(); drawer.classList.remove('open'); overlay.classList.remove('open'); hideElementForA11y(drawer); }
      function activateTab(tabKey) { const t = tabKey === 'training'; const p = tabKey === 'progress'; const s = tabKey === 'sets'; tabTraining.classList.toggle('active', t); tabProgress.classList.toggle('active', p); tabSets.classList.toggle('active', s); trainingView.classList.toggle('active', t); progressView.classList.toggle('active', p); setsView.classList.toggle('active', s); }
      function toggleSortMenu(forceOpen = null) { if (!sortMenu) return; const willOpen = forceOpen !== null ? forceOpen : !sortMenu.classList.contains('open'); sortMenu.classList.toggle('open', willOpen); sortMenu.setAttribute('aria-hidden', String(!willOpen)); }
      function setSortMode(mode) { activeSortMode = mode; sortMenu.querySelectorAll('.sort-item').forEach((b) => b.classList.toggle('active', b.dataset.sort === mode)); renderOverallChartAndExercisesList(); }
      function closeCreateModal() { blurActiveElement(); createModal.classList.remove('open'); hideElementForA11y(createModal); }
      function openBottomSheet(sheetEl, { returnToDrawer = false } = {}) { sheetEl.classList.add('open'); showElementForA11y(sheetEl); sheetEl.dataset.returnToDrawer = returnToDrawer ? 'true' : 'false'; }
      function closeBottomSheet(sheetEl) { blurActiveElement(); const shouldReturnToDrawer = sheetEl.dataset.returnToDrawer === 'true'; sheetEl.classList.remove('open'); hideElementForA11y(sheetEl); sheetEl.dataset.returnToDrawer = 'false'; if (shouldReturnToDrawer) openDrawer(); }
      function openExerciseLogSheet({ returnToDrawer = false } = {}) { openBottomSheet(exerciseLogSheet, { returnToDrawer }); renderExerciseLog(); }
      function closeExerciseLogSheet() { closeBottomSheet(exerciseLogSheet); }
      function openAccountSheet() { closeDrawer(); forceAccountButtonsToViewMode(); setAccountEditMode(false); openBottomSheet(accountSheet, { returnToDrawer: false }); loadCurrentUserProfile().then(() => { forceAccountButtonsToViewMode(); setAccountEditMode(false); }).catch(console.error); }
      function closeAccountSheet() { closeBottomSheet(accountSheet); }
      function returnToExerciseLog() { editWorkoutModal.classList.remove('open'); hideElementForA11y(editWorkoutModal); editWorkoutId = null; openBottomSheet(exerciseLogSheet, { returnToDrawer: false }); renderExerciseLog(); }
      function openEditWorkoutModal(item) { exerciseLogSheet.classList.remove('open'); exerciseLogSheet.setAttribute('aria-hidden','true'); hideElementForA11y(exerciseLogSheet); editWorkoutId=item.id; editExerciseInput.value=item.exerciseDisplay || item.exercise; editRepsInput.value=item.repetitions; editWeightInput.value=item.weight; editRpeInput.value=item.rpe ?? ''; editWorkoutModal.classList.add('open'); showElementForA11y(editWorkoutModal); }
      function clearChartsForLoggedOutState() { destroyChartGroup('overall'); destroyChartGroup('progress'); destroyChartGroup('sets'); setsSelectedDayLabel.textContent='—'; setsLatestDayLabel.textContent='—'; }
      function updateSyncedExerciseInputs(displayName) { progressExerciseSearch.value = displayName || ''; setsExerciseSearch.value = displayName || ''; }
      function resolveCreateExerciseFromUI() { const rawInput = createExerciseSearch.value.trim(); const exactKey = findExerciseKeyByDisplayName(rawInput); if (exactKey) return { exerciseKey: exactKey, exerciseDisplay: getExerciseDisplayNameFromKey(exactKey), isExisting: true }; return { exerciseKey: normalizeExerciseInput(rawInput), exerciseDisplay: toTitleCase(rawInput), isExisting: false }; }
      function hasCreateRequiredValues() { return createExerciseSearch.value.trim() !== '' && createRepetitionsInput.value.trim() !== '' && createWeightInput.value.trim() !== '' && createRpeInput.value.trim() !== ''; }
      function validateCreateRequiredValues() { if (!hasCreateRequiredValues()) { showCreateInlineMessage('Please enter all values before saving.'); showErrorMessage('Please enter all values before saving.'); return false; } clearCreateInlineMessage(); return true; }
      function validateEditRequiredValues() { if (editExerciseInput.value.trim() === '' || editRepsInput.value.trim() === '' || editWeightInput.value.trim() === '' || editRpeInput.value.trim() === '') { showErrorMessage('Please enter all values before saving.'); return false; } return true; }

      // ============================
      // Data loading
      // ============================
      async function loadExercises() {
        if (!auth.currentUser) return;
        clientSideExercisesMap.clear();
        const uid = auth.currentUser.uid;
        const snapshot = await db.collection('users').doc(uid).collection('exercises').orderBy('name').get();
        snapshot.forEach((doc) => clientSideExercisesMap.set(doc.id, doc.data().name));
      }
      function refreshAutocompleteLists() { dropdownConfigs.forEach((config) => { renderDropdownOptions(config, config.input.value || ''); hideDropdown(config); }); }
      async function refreshWorkoutCache(userId) {
        cachedUserId = userId;
        cachedAllWorkouts = [];
        const snapshot = await db.collection('workouts').where('userId', '==', userId).orderBy('timestamp', 'asc').get();
        snapshot.forEach((doc) => {
          const data = doc.data();
          const timestamp = tsToDate(data.timestamp);
          if (timestamp instanceof Date && !isNaN(timestamp)) {
            cachedAllWorkouts.push({ id: doc.id, timestamp, exercise: data.exercise || '', exerciseDisplay: data.exerciseDisplay || null, intensityVolume: data.intensityVolume || 0, setNumber: data.setNumber || '', repetitions: data.repetitions || 0, weight: data.weight || 0, rpe: data.rpe, e1RM: data.e1RM || 0 });
          }
        });
      }
      async function fetchWorkoutsForExercise(userId, exerciseKey) {
        if (cachedUserId === userId && cachedAllWorkouts.length) return cachedAllWorkouts.filter((item) => item.exercise === exerciseKey);
        const snapshot = await db.collection('workouts').where('userId','==',userId).where('exercise','==',exerciseKey).orderBy('timestamp','asc').get();
        const items = [];
        snapshot.forEach((doc) => { const data = doc.data(); items.push({ timestamp: tsToDate(data.timestamp), setNumber: data.setNumber || '', intensityVolume: data.intensityVolume || 0, weight: data.weight || 0, repetitions: data.repetitions || 0, rpe: data.rpe, e1RM: data.e1RM || 0, exerciseDisplay: data.exerciseDisplay || null }); });
        return items.filter((item) => item.timestamp instanceof Date && !isNaN(item.timestamp));
      }
      function renderExerciseLog() {
        const list = document.getElementById('exerciseLogList');
        if (!list) return;
        list.innerHTML = '';
        const items = cachedAllWorkouts.slice().reverse();
        if (!items.length) { list.innerHTML = '<li class="exercise-row">No entries yet.</li>'; return; }
        items.forEach((item) => {
          const row = document.createElement('li'); row.className = 'exercise-log-row';
          const content = document.createElement('div'); content.className = 'exercise-log-content';
          const date = document.createElement('div'); date.className = 'exercise-log-date'; date.textContent = formatDayKeyDE(getLocalDayKey(item.timestamp));
          const name = document.createElement('div'); name.className = 'exercise-log-name'; name.textContent = (item.exerciseDisplay || item.exercise).toUpperCase();
          const meta = document.createElement('div'); meta.className = 'exercise-log-meta'; meta.textContent = `${item.repetitions} reps × ${item.weight} kg`;
          const header = document.createElement('div'); header.className = 'exercise-log-header'; header.append(date, name); content.append(header, meta);
          const arrow = document.createElement('div'); arrow.className = 'exercise-log-arrow'; arrow.textContent = '>'; arrow.addEventListener('click', () => openEditWorkoutModal(item));
          row.append(content, arrow); list.appendChild(row);
        });
      }
      function preselectDefaultExerciseAndRender() { const firstEntry = Array.from(clientSideExercisesMap.entries())[0]; if (!firstEntry) return; const [firstKey] = firstEntry; syncExerciseAcrossTabs(firstKey, { forceLatestSets: true, activateProgressTab: false }); }

      // ============================
      // Charts
      // ============================
      function renderOverallChart(overallItems) {
        destroyChartGroup('overall');
        const dayMap = new Map();
        overallItems.forEach((item) => { const dayKey = getLocalDayKey(item.timestamp); dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + Number(item.intensityVolume || 0)); });
        const sortedDays = Array.from(dayMap.keys()).sort();
        if (!sortedDays.length) return false;
        const labels = sortedDays.map((day) => new Date(`${day}T12:00:00`).toLocaleDateString('de-DE'));
        const dataPoints = sortedDays.map((day) => parseFloat((dayMap.get(day) || 0).toFixed(2)));
        const config = chartConfigs.overall;
        createManagedChart('overall', config.key, config.canvas, labels, dataPoints, config.title, config.yLabel, config.beginAtZero);
        return true;
      }
      function renderOverallChartAndExercisesList() {
        if (!auth.currentUser) { destroyChartGroup('overall'); exercisesListUl.innerHTML = ''; return; }
        const items = filterByRange(cachedAllWorkouts, activeRangeTraining);
        const hasOverallData = renderOverallChart(items);
        if (!hasOverallData) { exercisesListUl.innerHTML = '<li class="exercise-row" style="cursor: default;"><span class="exercise-name">No data in this range.</span><span class="exercise-metric">—</span></li>'; return; }
        const byExercise = new Map();
        items.forEach((item) => { if (!item.exercise) return; if (!byExercise.has(item.exercise)) byExercise.set(item.exercise, []); byExercise.get(item.exercise).push(item); });
        const rows = [];
        for (const [exerciseKey, exerciseItems] of byExercise.entries()) {
          const exDayMap = new Map();
          exerciseItems.forEach((item) => { const dayKey = getLocalDayKey(item.timestamp); if (!exDayMap.has(dayKey)) exDayMap.set(dayKey, { sumIV: 0, sets: 0 }); const value = exDayMap.get(dayKey); value.sumIV += Number(item.intensityVolume || 0); value.sets += 1; });
          const exDays = Array.from(exDayMap.keys()).sort();
          const oldestObj = exDays.length ? exDayMap.get(exDays[0]) : null;
          const newestObj = exDays.length ? exDayMap.get(exDays[exDays.length - 1]) : null;
          const oldestAvg = oldestObj && oldestObj.sets > 0 ? oldestObj.sumIV / oldestObj.sets : 0;
          const newestAvg = newestObj && newestObj.sets > 0 ? newestObj.sumIV / newestObj.sets : 0;
          let improvement = null;
          if (exDays.length >= 1 && oldestAvg > 0) improvement = exDays.length === 1 ? 0 : ((newestAvg - oldestAvg) / oldestAvg) * 100;
          rows.push({ exerciseKey, displayName: getExerciseDisplayName(exerciseKey, exerciseItems), improvement });
        }
        function isValidImprovement(value) { return value !== null && isFinite(value); }
        rows.sort((a,b) => { const aName = a.displayName || ''; const bName = b.displayName || ''; if (activeSortMode === 'alpha_asc') return aName.localeCompare(bName); if (activeSortMode === 'alpha_desc') return bName.localeCompare(aName); const aValid = isValidImprovement(a.improvement); const bValid = isValidImprovement(b.improvement); if (aValid && !bValid) return -1; if (!aValid && bValid) return 1; if (!aValid && !bValid) return aName.localeCompare(bName); if (activeSortMode === 'improv_asc') return a.improvement - b.improvement || aName.localeCompare(bName); return b.improvement - a.improvement || aName.localeCompare(bName); });
        const query = exerciseSearchInput.value.trim().toLowerCase();
        const filteredRows = query ? rows.filter((row) => (row.displayName || '').toLowerCase().includes(query)) : rows;
        exercisesListUl.innerHTML = '';
        if (!filteredRows.length) { exercisesListUl.innerHTML = '<li class="exercise-row" style="cursor: default;"><span class="exercise-name">No exercises found.</span><span class="exercise-metric">—</span></li>'; return; }
        filteredRows.forEach((row) => {
          const li = document.createElement('li'); li.className = 'exercise-row';
          const left = document.createElement('span'); left.className = 'exercise-name'; left.textContent = row.displayName;
          const right = document.createElement('span'); right.className = 'exercise-metric';
          if (row.improvement === null || !isFinite(row.improvement)) right.textContent = '—';
          else { const rounded = Math.round(row.improvement); right.textContent = `${rounded > 0 ? '+' : ''}${rounded}%`; if (rounded > 0) right.classList.add('pos'); if (rounded < 0) right.classList.add('neg'); }
          li.append(left, right);
          li.addEventListener('click', async () => { await syncExerciseAcrossTabs(row.exerciseKey, { forceLatestSets: true, activateProgressTab: true }); });
          exercisesListUl.appendChild(li);
        });
      }

      async function renderProgressChartsForExercise(exerciseKey) {
        const currentUser = auth.currentUser;
        if (!currentUser) { showErrorMessage('Please log in to see charts.'); return; }
        if (!exerciseKey) { showErrorMessage('Please select an exercise.'); return; }
        const requestId = ++renderRequestIds.progress;
        try {
          const allItems = await fetchWorkoutsForExercise(currentUser.uid, exerciseKey);
          if (requestId !== renderRequestIds.progress) return;
          const items = filterByRange(allItems, activeRangeProgress);
          destroyChartGroup('progress');
          if (!items.length) { showErrorMessage('No data in selected range.'); return; }
          const displayName = getExerciseDisplayName(exerciseKey, allItems);
          updateSyncedExerciseInputs(displayName);
          const dayMetaMap = new Map();
          items.forEach((item) => { const dayKey = getLocalDayKey(item.timestamp); if (!dayMetaMap.has(dayKey)) dayMetaMap.set(dayKey, { sets: 0, reps: 0, maxWeight: 0 }); const meta = dayMetaMap.get(dayKey); meta.sets += 1; meta.reps += Number(item.repetitions || 0); meta.maxWeight = Math.max(meta.maxWeight, Number(item.weight || 0)); });
          chartConfigs.progress.forEach((config) => {
            const series = buildDailySeries(items, config.reducer);
            const daySeriesMeta = series.sortedDays.map((dayKey) => dayMetaMap.get(dayKey));
            createManagedChart('progress', config.key, config.canvas, series.labels, series.dataPoints, `${config.title} – ${displayName}`, config.yLabel, config.beginAtZero, buildDailyTooltipCallbacks(daySeriesMeta, config.tooltipLabel));
          });
        } catch (error) { console.error('Error rendering progress charts:', error); showErrorMessage('Error creating progress charts.'); }
      }

      async function renderSetsChartsForExercise(exerciseKey, dayKey = null, forceLatest = false) {
        const currentUser = auth.currentUser;
        if (!currentUser) { showErrorMessage('Please log in to see charts.'); return; }
        if (!exerciseKey) { showErrorMessage('Please select an exercise.'); return; }
        const requestId = ++renderRequestIds.sets;
        try {
          const allItems = await fetchWorkoutsForExercise(currentUser.uid, exerciseKey);
          if (requestId !== renderRequestIds.sets) return;
          destroyChartGroup('sets');
          if (!allItems.length) { showErrorMessage('No data for this exercise yet.'); setSetsMetaLabels(null, null); return; }
          const dayKeysAll = uniqueSortedDayKeys(allItems);
          const latestDayKey = dayKeysAll.length ? dayKeysAll[dayKeysAll.length - 1] : null;
          const preferredDayKey = forceLatest || !dayKey ? latestDayKey : dayKey;
          const { dayKeys } = populateSetsDaySelect(allItems, preferredDayKey);
          const chosenDayKey = setsDaySelect.value || latestDayKey;
          setSetsMetaLabels(chosenDayKey, latestDayKey);
          if (!chosenDayKey) { showErrorMessage('No day available for this exercise.'); return; }
          const itemsForDay = getItemsForDay(allItems, chosenDayKey);
          if (requestId !== renderRequestIds.sets) return;
          if (!itemsForDay.length) { showErrorMessage('No sets for selected day.'); return; }
          sortSetsWithinDay(itemsForDay);
          const displayName = getExerciseDisplayName(exerciseKey, allItems);
          updateSyncedExerciseInputs(displayName);
          const dayLabel = formatDayKeyDE(chosenDayKey);
          const labels = buildSetLabels(itemsForDay);
          for (const config of chartConfigs.sets) {
            if (requestId !== renderRequestIds.sets) return;
            const dataPoints = itemsForDay.map(config.getValue);
            createManagedChart('sets', config.key, config.canvas, labels, dataPoints, `${config.title} – ${displayName} – ${dayLabel}`, config.yLabel, config.beginAtZero, buildSetTooltipCallbacks(itemsForDay, config.tooltipLabel));
          }
          if (dayKeys && dayKeys.length) {
            const index = dayKeys.indexOf(chosenDayKey);
            setsPrevDayButton.style.pointerEvents = index > 0 ? 'auto' : 'none';
            setsPrevDayButton.style.opacity = index > 0 ? '1' : '0.45';
            setsNextDayButton.style.pointerEvents = index >= 0 && index < dayKeys.length - 1 ? 'auto' : 'none';
            setsNextDayButton.style.opacity = index >= 0 && index < dayKeys.length - 1 ? '1' : '0.45';
          }
        } catch (error) { console.error('Error rendering set charts:', error); showErrorMessage('Error creating set charts.'); }
      }

      async function syncExerciseAcrossTabs(exerciseKey, { forceLatestSets = true, activateProgressTab = false } = {}) {
        if (!exerciseKey) return;
        activeExerciseKey = exerciseKey;
        const displayName = getExerciseDisplayNameFromKey(exerciseKey);
        updateSyncedExerciseInputs(displayName);
        hideDropdown(getDropdownConfigByName('progress'));
        hideDropdown(getDropdownConfigByName('sets'));
        if (activateProgressTab) activateTab('progress');
        await renderProgressChartsForExercise(exerciseKey);
        await renderSetsChartsForExercise(exerciseKey, null, true);
        showSuccessMessage(`Exercise synced: ${displayName}.`);
      }

      // ============================
      // Account actions
      // ============================
      async function saveCurrentUserProfile() {
       const user = auth.currentUser;
       if (!user) {
        showErrorMessage('Please log in first.');
        return;
       }
       const nickname = (accountNicknameInput?.value || '').trim();
       const street = (accountStreetInput?.value || '').trim();
       const postalCode = (accountPostalCodeInput?.value || '').trim();
       const city = (accountCityInput?.value || '').trim();
       const country = (accountCountryInput?.value || '').trim();
       const birthDate = (accountBirthDateInput?.value || '').trim();
       if (!nickname) {
        showErrorMessage('Please enter a nickname.');
        accountNicknameInput?.focus();
        return;
       }
       const combinedAddress = [street, postalCode, city, country].filter(Boolean).join(', ');
       const saveBtnText = accountSaveEditBtn ? (accountSaveEditBtn.dataset.originalText || accountSaveEditBtn.textContent || 'Save Account') : 'Save Account';
       if (accountSaveEditBtn) {
        accountSaveEditBtn.dataset.originalText = saveBtnText;
        accountSaveEditBtn.disabled = true;
        accountSaveEditBtn.textContent = 'Saving...';
        accountSaveEditBtn.classList.add('saving');
       }
       try {
        const payload = {
         nickname,
         email: user.email || '',
         street,
         postalCode,
         city,
         country,
         address: combinedAddress,
         birthDate,
         updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await db.collection('users').doc(user.uid).set(payload, { merge: true });
        const freshSnap = await db.collection('users').doc(user.uid).get();
        currentUserProfile = freshSnap.exists ? freshSnap.data() : payload;
        populateAccountForm(currentUserProfile, user);
        syncAccountViewModeFields(currentUserProfile, user);
        userStatusParagraph.textContent = `Logged in as ${currentUserProfile?.nickname || user.email}`;
        forceAccountButtonsToViewMode();
        setAccountEditMode(false);
       } catch (error) {
        console.error('Save account error:', error);
        showErrorMessage(`Could not save account: ${error.message}`);
       } finally {
        if (accountSaveEditBtn) {
         accountSaveEditBtn.disabled = false;
         accountSaveEditBtn.textContent = saveBtnText;
         accountSaveEditBtn.classList.remove('saving');
        }
       }
      }

      async function handleAccountEditToggle() {
       if (!auth.currentUser) {
       showErrorMessage('Please log in first.');
       return;
       }
       populateAccountForm(currentUserProfile, auth.currentUser);
       setAccountEditMode(true);
       setTimeout(() => accountNicknameInput?.focus(), 0);
      }

      async function sendPasswordResetForCurrentUser() {
        const user = auth.currentUser;
        if (!user?.email) { showErrorMessage('No email address available for password reset.'); return; }
        try {
          await auth.sendPasswordResetEmail(user.email);
          showSuccessMessage(`Password reset email sent to ${user.email}.`);
        } catch (error) {
          console.error('Reset password error:', error);
          showErrorMessage(`Could not send password reset email: ${error.message}`);
        }
      }


      // ============================
      // Workout mutations
      // ============================
      async function getNextSetNumberForDay(userId, exerciseKey, nowDate) {
        const bounds = getLocalDayBounds(nowDate);
        const startTs = firebase.firestore.Timestamp.fromDate(bounds.start);
        const endTs = firebase.firestore.Timestamp.fromDate(bounds.end);
        const snapshot = await db.collection('workouts').where('userId', '==', userId).where('exercise', '==', exerciseKey).where('timestamp', '>=', startTs).where('timestamp', '<=', endTs).get();
        let highestSetNumber = 0; snapshot.forEach((doc) => { const candidate = Number.parseInt(doc.data().setNumber, 10); if (Number.isFinite(candidate)) highestSetNumber = Math.max(highestSetNumber, candidate); }); return highestSetNumber + 1;
      }

      async function saveWorkoutEntry() {
        const currentUser = auth.currentUser;
        if (!currentUser) { showErrorMessage('Please log in first (Account).'); return; }
        if (!validateCreateRequiredValues()) return;
        setLinkSaving(createSaveButton, true, 'Save');
        try {
          const { exerciseKey, exerciseDisplay } = resolveCreateExerciseFromUI();
          if (!exerciseKey || !exerciseDisplay) { showCreateInlineMessage('Please enter all values before saving.'); showErrorMessage('Please enter all values before saving.'); return; }
          const repetitions = parseInt(createRepetitionsInput.value, 10);
          const weight = parseFloat(createWeightInput.value);
          const rpeForCalc = getRPEForCalculation(createRpeInput.value);
          if (!isFinite(repetitions) || !isFinite(weight) || !isFinite(rpeForCalc)) { showCreateInlineMessage('Please enter all values before saving.'); showErrorMessage('Please enter all values before saving.'); return; }
          if (repetitions <= 0 || weight <= 0 || rpeForCalc < 0 || rpeForCalc > 10) { showCreateInlineMessage('Please enter valid values for repetitions, weight and RPE.'); showErrorMessage('Please enter valid values for repetitions, weight and RPE.'); return; }
          const now = new Date();
          const dayKey = getLocalDayKey(now);
          const setNumber = await getNextSetNumberForDay(currentUser.uid, exerciseKey, now);
          const { e1RM, intensityVolume } = calculateWorkoutMetrics({ repetitions, weight, rpe: rpeForCalc });
          await db.collection('users').doc(currentUser.uid).collection('exercises').doc(exerciseKey).set({ name: exerciseDisplay, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
          await db.collection('workouts').add({ userId: currentUser.uid, exercise: exerciseKey, exerciseDisplay, repetitions, weight, setNumber, dayKey, rpe: rpeForCalc, e1RM, intensityVolume, timestamp: firebase.firestore.Timestamp.fromDate(now) });
          clearCreateInlineMessage();
          await loadExercises();
          await refreshWorkoutCache(currentUser.uid);
          refreshAutocompleteLists();
          activeExerciseKey = exerciseKey;
          closeCreateModal();
          activateTab('progress');
          await syncExerciseAcrossTabs(exerciseKey, { forceLatestSets: true, activateProgressTab: false });
          renderOverallChartAndExercisesList();
          showSuccessMessage(`Saved "${exerciseDisplay}" (Set ${setNumber}).`);
        } catch (error) { console.error('Create save error:', error); showCreateInlineMessage(`Error saving entry: ${error.message}`); showErrorMessage(`Error saving entry: ${error.message}`); }
        finally { setLinkSaving(createSaveButton, false, 'Save'); }
      }
      function openCreateModal() { if (!auth.currentUser) { showErrorMessage('Please log in first (Account).'); return; } createModal.classList.add('open'); showElementForA11y(createModal); createExerciseSearch.value=''; createRepetitionsInput.value=''; createWeightInput.value=''; createRpeInput.value=''; clearCreateInlineMessage(); setLinkSaving(createSaveButton, false, 'Save'); setTimeout(() => createExerciseSearch.focus(), 60); }
      async function saveEditedWorkout() {
        if (!editWorkoutId || !validateEditRequiredValues()) return;
        const repetitions=Number(editRepsInput.value), weight=Number(editWeightInput.value), rpe=Number(editRpeInput.value);
        try {
          const { e1RM, intensityVolume }=calculateWorkoutMetrics({repetitions,weight,rpe});
          editSaveButton.disabled=true;
          await db.collection('workouts').doc(editWorkoutId).update({repetitions,weight,rpe,e1RM,intensityVolume,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
          await refreshWorkoutCache(auth.currentUser.uid); returnToExerciseLog(); renderOverallChartAndExercisesList();
          if(activeExerciseKey) await syncExerciseAcrossTabs(activeExerciseKey,{forceLatestSets:false,activateProgressTab:false});
          showSuccessMessage('Entry updated successfully.');
        } catch(error) { console.error(error); showErrorMessage(error.message || 'The entry could not be updated.'); } finally { editSaveButton.disabled=false; }
      }

      // ============================
      // Auth
      // ============================
      async function loginFromOverlay() {
       const email = loginEmailOverlay.value.trim();
       const password = loginPasswordOverlay.value;
       clearAuthInlineErrors();
       if (!email) {
        showLoginPasswordError('Please enter your email.');
        loginEmailOverlay?.focus();
        return;
       }
       if (!password) {
        showLoginPasswordError('Please enter your password.');
        loginPasswordOverlay?.focus();
        return;
       }
       if (authMode === 'login') {
        try {
         const cred = await auth.signInWithEmailAndPassword(email, password);
         if (!cred.user.emailVerified) {
          pendingVerificationEmail = email;
          pendingVerificationPassword = password;
          try { await cred.user.sendEmailVerification(); } catch (verificationError) { console.warn('Verification email could not be resent:', verificationError); }
          ignoreNextLoggedOutSync = true;
          await auth.signOut();
          openVerificationNoticeOverlay(email);
          return;
         }
         resendVerificationButton.style.display = 'none';
         loginOverlay.classList.add('hidden');
         activateTab('training');
         return;
        } catch (err) {
         if (err.code === 'auth/wrong-password') {
          showLoginPasswordError('The password is not correct.');
          loginPasswordOverlay?.focus();
          return;
         }
         if (err.code === 'auth/user-not-found') {
          switchToRegisterMode(email, password);
          return;
         }
         if (err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
          let methods = [];
          try { methods = await auth.fetchSignInMethodsForEmail(email); } catch (_) {}
          const emailExists = Array.isArray(methods) && methods.length > 0;
          if (emailExists) {
           showLoginPasswordError('The password is not correct.');
           loginPasswordOverlay?.focus();
           return;
          }
          switchToRegisterMode(email, password);
          return;
         }
         showLoginPasswordError('Login failed. Please try again.');
         return;
        }
       }
       validateRegisterInputs();
       if (!isValidPassword(password)) return;
       if (password !== passwordConfirmInput.value) return;
       const nickname = nicknameInput.value.trim();
       if (!nickname || nickname.length < 2) {
        showLoginPasswordError('Please enter a valid nickname.');
        nicknameInput?.focus();
        return;
       }
       try {
        isRegisteringAccount = true;
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('users').doc(cred.user.uid).set({
         nickname,
         email,
         address: '',
         street: '',
         postalCode: '',
         city: '',
         country: '',
         birthDate: '',
         admin: false,
         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        await cred.user.sendEmailVerification();
        pendingVerificationEmail = email;
        pendingVerificationPassword = password;
        ignoreNextLoggedOutSync = true;
        await auth.signOut();
        openVerificationNoticeOverlay(email);
       } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
         switchToLoginMode();
         loginEmailOverlay.value = email;
         loginPasswordOverlay.value = '';
         showLoginPasswordError('This email already exists. Please log in or use another email.');
         loginPasswordOverlay?.focus();
        } else {
         alert(err.message);
        }
       } finally {
        isRegisteringAccount = false;
       }
      }

      async function resendVerificationEmail() {
        if (!pendingVerificationEmail || !pendingVerificationPassword) { alert('Please log in with your email and password first so the app can resend the verification email.'); return; }
        try {
          const cred = await auth.signInWithEmailAndPassword(pendingVerificationEmail, pendingVerificationPassword);
          await cred.user.sendEmailVerification();
          await auth.signOut();
          alert('Verification email sent again ✅');
        } catch (err) { alert('Error: ' + err.message); }
      }

      async function logoutCurrentUser() {
        try {
          await auth.signOut();
          resetAuthForm();
          showSuccessMessage('Successfully logged out.');
        } catch (error) { showErrorMessage(`Logout error: ${error.message}`); console.error('Logout error:', error); }
      }

      async function syncUiForAuthenticatedUser(user) {
       clearHomeMessage();
       loginOverlay.classList.add('hidden');
       loginOverlay.style.display = 'none';
       loginOverlay.style.visibility = 'hidden';
       loginOverlay.style.pointerEvents = 'none';
       hideElementForA11y(loginOverlay);
       unlockAppAfterLogin();
        resendVerificationButton.style.display = 'none';
        try {
          const userRef = db.collection('users').doc(user.uid);
          const snap = await userRef.get();
          if (!snap.exists) {
            await userRef.set({ admin: false, nickname: user.displayName || '', email: user.email || '', address: '', street: '', postalCode: '', city: '', country: '', birthDate: '', createdAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
          }
        } catch (err) { console.error('User doc creation failed', err); }

        await loadCurrentUserProfile();
        const nickname = currentUserProfile?.nickname || user.email;
        userStatusParagraph.textContent = `Logged in as ${nickname}`;
        accountPill.textContent = 'Logged in';
        setAccountStatusUi(true);
        loginHintTraining.style.display='none'; loginHintProgress.style.display='none'; loginHintSets.style.display='none';
        await loadExercises();
        await refreshWorkoutCache(user.uid);
        refreshAutocompleteLists();
        renderOverallChartAndExercisesList();
        preselectDefaultExerciseAndRender();
      }
      function syncUiForLoggedOutUser() {
       clearHomeMessage();
       resetAuthForm();
       userStatusParagraph.textContent = 'You are currently logged out.';
       accountPill.textContent = 'Login';
       setAccountStatusUi(false);
       populateAccountForm(null, null);
       syncAccountViewModeFields(null, null);
       forceAccountButtonsToViewMode();
       setAccountEditMode(false);
       loginHintTraining.style.display='block'; loginHintProgress.style.display='block'; loginHintSets.style.display='block';
       clientSideExercisesMap.clear(); cachedAllWorkouts=[]; cachedUserId=null; activeExerciseKey=null; currentUserProfile=null;
       exercisesListUl.innerHTML=''; exerciseSearchInput.value=''; progressExerciseSearch.value=''; setsExerciseSearch.value=''; createExerciseSearch.value=''; setsDaySelect.innerHTML='<option value="">-- Select a day --</option>'; createExerciseList.innerHTML=''; progressExerciseList.innerHTML=''; setsExerciseList.innerHTML=''; clearChartsForLoggedOutState();
       closeDrawer();
       closeAccountSheet();
       if (ignoreNextLoggedOutSync) {
        ignoreNextLoggedOutSync = false;
       }
       openLoginOverlay(pendingVerificationEmail);
       if (showDeletionSuccessAfterLogout) {
        showDeletionSuccessAfterLogout = false;
        openDeletionSuccessOverlay();
       }
      }

      // ============================
      // Event bindings
      // ============================
      menuButton.addEventListener('click', openDrawer);
      closeDrawerBtn.addEventListener('click', closeDrawer);
      overlay.addEventListener('click', closeDrawer);
      menuTraining.addEventListener('click', () => { activateTab('training'); closeDrawer(); });
      menuProgress.addEventListener('click', () => { activateTab('progress'); closeDrawer(); });
      menuSets.addEventListener('click', () => { activateTab('sets'); closeDrawer(); });
      menuExerciseLog.addEventListener('click', () => { closeDrawer(); openExerciseLogSheet({ returnToDrawer: true }); });
      menuAccount.addEventListener('click', openAccountSheet);

      tabTraining.addEventListener('click', () => activateTab('training'));
      tabProgress.addEventListener('click', () => activateTab('progress'));
      tabSets.addEventListener('click', () => activateTab('sets'));

      sortButton.addEventListener('click', (e) => { e.stopPropagation(); toggleSortMenu(); });
      sortMenu.addEventListener('click', (e) => { const btn = e.target.closest('.sort-item'); if (!btn) return; setSortMode(btn.dataset.sort); toggleSortMenu(false); });
      document.addEventListener('click', (e) => { toggleSortMenu(false); if (!e.target.closest('.exercise-dropdown')) dropdownConfigs.forEach(hideDropdown); });

      closeExerciseLogBtn.addEventListener('click', closeExerciseLogSheet);
      closeAccountSheetBtn.addEventListener('click', closeAccountSheet);
      accountResetPasswordBtn.addEventListener('click', sendPasswordResetForCurrentUser);
      accountDeleteBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeCurrentAccount(); });
      if (accountEditToggleBtn) accountEditToggleBtn.addEventListener('click', handleAccountEditToggle);
      if (accountSaveEditBtn) accountSaveEditBtn.addEventListener('click', saveCurrentUserProfile);
      if (accountCancelEditBtn) accountCancelEditBtn.addEventListener('click', cancelAccountEditing);
      logoutButton.addEventListener('click', logoutCurrentUser);

      createModalOverlay.addEventListener('click', closeCreateModal);
      createModalClose.addEventListener('click', closeCreateModal);
      createCancelButton.addEventListener('click', closeCreateModal);
      editCancelButton.addEventListener('click', returnToExerciseLog);
      editSaveButton.addEventListener('click', saveEditedWorkout);
      editDeleteButton.addEventListener('click', async () => { if (!editWorkoutId) return; if (!confirm('Delete this entry?')) return; await db.collection('workouts').doc(editWorkoutId).delete(); await refreshWorkoutCache(auth.currentUser.uid); returnToExerciseLog(); renderOverallChartAndExercisesList(); if (activeExerciseKey) await syncExerciseAcrossTabs(activeExerciseKey, { forceLatestSets: false, activateProgressTab: false }); showSuccessMessage('Entry deleted successfully.'); });

      if (rangeFilterDiv) rangeFilterDiv.addEventListener('click', (e) => { const btn = e.target.closest('.range-btn'); if (!btn) return; activeRangeTraining = btn.dataset.range; setActiveButtons(rangeFilterDiv, activeRangeTraining); renderOverallChartAndExercisesList(); });
      if (progressRangeFilterDiv) progressRangeFilterDiv.addEventListener('click', (e) => { const btn = e.target.closest('.range-btn'); if (!btn) return; activeRangeProgress = btn.dataset.range; setActiveButtons(progressRangeFilterDiv, activeRangeProgress); if (activeExerciseKey) renderProgressChartsForExercise(activeExerciseKey); });
      exerciseSearchInput.addEventListener('input', renderOverallChartAndExercisesList);

      loginOverlayButton.addEventListener('click', loginFromOverlay);
      loginPasswordOverlay.addEventListener('input', validateRegisterInputs);
      passwordConfirmInput.addEventListener('input', validateRegisterInputs);
      registerOverlayButton.addEventListener('click', () => { if (authMode === 'login') switchToRegisterMode(loginEmailOverlay.value, loginPasswordOverlay.value); else switchToLoginMode(); });
      resendVerificationButton.addEventListener('click', resendVerificationEmail);
      if (closeVerificationNoticeBtn) closeVerificationNoticeBtn.addEventListener('click', () => { closeVerificationNoticeOverlay(); });

      if (closeAccountOverlayX) closeAccountOverlayX.addEventListener('click', closeCloseAccountOverlay);
      if (cancelCloseAccountBtn) cancelCloseAccountBtn.addEventListener('click', closeCloseAccountOverlay);
      if (confirmCloseAccountBtn) confirmCloseAccountBtn.addEventListener('click', confirmCloseCurrentAccount);
      if (closeAccountPasswordInput) closeAccountPasswordInput.addEventListener('keydown', async (e) => { if (e.key === 'Enter') { e.preventDefault(); await confirmCloseCurrentAccount(); } if (e.key === 'Escape') { e.preventDefault(); closeCloseAccountOverlay(); } });
      if (closeDeletionSuccessBtn) closeDeletionSuccessBtn.addEventListener('click', closeDeletionSuccessOverlay);
      if (deletionSuccessOkBtn) deletionSuccessOkBtn.addEventListener('click', closeDeletionSuccessOverlay);
      dropdownConfigs.forEach(setupExerciseAutocomplete);

      showProgressChartsButton.addEventListener('click', async () => { if (!activeExerciseKey) { showErrorMessage('Please select a valid exercise from the list.'); return; } await syncExerciseAcrossTabs(activeExerciseKey, { forceLatestSets: true, activateProgressTab: false }); });
      showSetsChartsButton.addEventListener('click', async () => { if (!activeExerciseKey) { showErrorMessage('Please select a valid exercise from the list.'); return; } await renderSetsChartsForExercise(activeExerciseKey, null, true); });
      setsDaySelect.addEventListener('change', async () => { if (!activeExerciseKey || !setsDaySelect.value) return; await renderSetsChartsForExercise(activeExerciseKey, setsDaySelect.value, false); });
      setsLatestButton.addEventListener('click', async () => { if (!activeExerciseKey) return; await renderSetsChartsForExercise(activeExerciseKey, null, true); });
      setsPrevDayButton.addEventListener('click', async () => { if (!activeExerciseKey || !auth.currentUser) return; const allItems = await fetchWorkoutsForExercise(auth.currentUser.uid, activeExerciseKey); const dayKeys = uniqueSortedDayKeys(allItems); const current = setsDaySelect.value; const idx = dayKeys.indexOf(current); if (idx > 0) { const prevKey = dayKeys[idx - 1]; setsDaySelect.value = prevKey; await renderSetsChartsForExercise(activeExerciseKey, prevKey, false); } });
      setsNextDayButton.addEventListener('click', async () => { if (!activeExerciseKey || !auth.currentUser) return; const allItems = await fetchWorkoutsForExercise(auth.currentUser.uid, activeExerciseKey); const dayKeys = uniqueSortedDayKeys(allItems); const current = setsDaySelect.value; const idx = dayKeys.indexOf(current); if (idx >= 0 && idx < dayKeys.length - 1) { const nextKey = dayKeys[idx + 1]; setsDaySelect.value = nextKey; await renderSetsChartsForExercise(activeExerciseKey, nextKey, false); } });

      [createExerciseSearch, createRepetitionsInput, createWeightInput, createRpeInput].forEach((inputEl) => {
        inputEl.addEventListener('keydown', async (e) => { if (e.key !== 'Enter') return; e.preventDefault(); if (hasCreateRequiredValues()) await saveWorkoutEntry(); else { showCreateInlineMessage('Please enter all values before saving.'); showErrorMessage('Please enter all values before saving.'); } });
        inputEl.addEventListener('input', () => { if (hasCreateRequiredValues()) clearCreateInlineMessage(); });
      });
      createSaveButton.addEventListener('click', saveWorkoutEntry);
      fabCreate.addEventListener('click', openCreateModal);
      fabExerciseLog.addEventListener('click', () => openExerciseLogSheet({ returnToDrawer: false }));

      function attachSheetSwipeToClose(sheetEl, closeFn) { let startY = null; sheetEl.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }); sheetEl.addEventListener('touchmove', (e) => { if (startY === null) return; const deltaY = e.touches[0].clientY - startY; if (deltaY > 80) { closeFn(); startY = null; } }); sheetEl.addEventListener('touchend', () => { startY = null; }); }
      attachSheetSwipeToClose(exerciseLogSheet, closeExerciseLogSheet);
      attachSheetSwipeToClose(accountSheet, closeAccountSheet);

      auth.onAuthStateChanged(async (user) => {
       if (user) {
        if (!user.emailVerified) {
         if (isRegisteringAccount) return;
         pendingVerificationEmail = user.email || pendingVerificationEmail;
         if (!verificationNoticeOverlay?.classList.contains('open')) {
          ignoreNextLoggedOutSync = true;
          await auth.signOut();
          openVerificationNoticeOverlay(pendingVerificationEmail);
         }
         return;
        }
        await syncUiForAuthenticatedUser(user);
       } else {
        syncUiForLoggedOutUser();
       }
      });
      setActiveButtons(rangeFilterDiv, activeRangeTraining);
      setActiveButtons(progressRangeFilterDiv, activeRangeProgress);
      hideElementForA11y(drawer);
      hideElementForA11y(accountSheet);
      hideElementForA11y(exerciseLogSheet);
      hideElementForA11y(createModal);
      hideElementForA11y(editWorkoutModal);
      hideElementForA11y(verificationNoticeOverlay);
      if (verificationNoticeOverlay) { verificationNoticeOverlay.classList.remove('open'); verificationNoticeOverlay.style.display = 'none'; verificationNoticeOverlay.style.visibility = 'hidden'; verificationNoticeOverlay.style.pointerEvents = 'none'; }
      hideElementForA11y(closeAccountOverlay);
      if (closeAccountOverlay) { closeAccountOverlay.style.display = 'none'; closeAccountOverlay.style.visibility = 'hidden'; closeAccountOverlay.style.pointerEvents = 'none'; }
      hideElementForA11y(deletionSuccessOverlay);
      if (deletionSuccessOverlay) { deletionSuccessOverlay.style.display = 'none'; deletionSuccessOverlay.style.visibility = 'hidden'; deletionSuccessOverlay.style.pointerEvents = 'none'; }
      hideElementForA11y(loginOverlay);
      if (loginOverlay) { loginOverlay.style.display = 'none'; loginOverlay.style.visibility = 'hidden'; loginOverlay.style.pointerEvents = 'none'; }
      forceAccountButtonsToViewMode();
      setAccountEditMode(false);
      if (auth.currentUser) unlockAppAfterLogin(); else lockAppBehindLoginOverlay();
      clearHomeMessage();


      // ============================
      // Feature update: global helpers and feature wiring
      // ============================
      const featureDom = {
        menuPersonalRecords: document.getElementById('menuPersonalRecords'), menuStatistics: document.getElementById('menuStatistics'), menuWeightTracking: document.getElementById('menuWeightTracking'),
        useLastEntryButton: document.getElementById('useLastEntryButton'), progressValue: document.getElementById('overallProgressValue'), progressDescription: document.getElementById('overallProgressDescription'),
        recordsSheet: document.getElementById('personalRecordsSheet'), closeRecords: document.getElementById('closePersonalRecordsBtn'), recordsSearch: document.getElementById('recordsSearchInput'), recordsSort: document.getElementById('recordsSortSelect'), recordsList: document.getElementById('personalRecordsList'),
        statsSheet: document.getElementById('statisticsSheet'), closeStats: document.getElementById('closeStatisticsBtn'), statsGrid: document.getElementById('statisticsMetricGrid'), statsList: document.getElementById('statisticsList'),
        weightSheet: document.getElementById('weightTrackingSheet'), closeWeight: document.getElementById('closeWeightTrackingBtn'), openWeightEntry: document.getElementById('openWeightEntryButton'), bodyWeightChart: document.getElementById('bodyWeightChart'), weightList: document.getElementById('weightEntriesList'),
        weightModal: document.getElementById('weightEntryModal'), weightModalOverlay: document.getElementById('weightEntryModalOverlay'), weightModalClose: document.getElementById('weightEntryModalClose'), weightDate: document.getElementById('weightEntryDateInput'), weightValue: document.getElementById('weightEntryValueInput'), weightError: document.getElementById('weightEntryValidationMessage'), weightSave: document.getElementById('saveWeightEntryButton'), weightCancel: document.getElementById('cancelWeightEntryButton')
      };
      const featureState = { bodyWeights: [], recordsSort: 'e1rm_desc' };
      chartInstances.weight = chartInstances.weight || { bodyWeight: null };
      function fNumber(value, decimals = 0) { const n = Number(value || 0); return isFinite(n) ? n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '—'; }
      function fKg(value, decimals = 1) { const n = Number(value || 0); return isFinite(n) && n > 0 ? `${fNumber(n, decimals)} kg` : '—'; }
      function getLastWorkoutEntry() { return cachedAllWorkouts.length ? cachedAllWorkouts.slice().sort((a,b)=>b.timestamp-a.timestamp)[0] : null; }
      function useLastWorkoutEntry() { const last = getLastWorkoutEntry(); if (!last) { showCreateInlineMessage('No previous entry available yet.'); return; } createExerciseSearch.value = last.exerciseDisplay || getExerciseDisplayNameFromKey(last.exercise) || last.exercise || ''; createRepetitionsInput.value = last.repetitions || ''; createWeightInput.value = last.weight || ''; createRpeInput.value = last.rpe === 0 || last.rpe ? last.rpe : ''; activeExerciseKey = last.exercise || activeExerciseKey; clearCreateInlineMessage(); }
      function getProgressPercent(items) { const map = new Map(); items.forEach(item => { const d=getLocalDayKey(item.timestamp); if (!map.has(d)) map.set(d,{iv:0,sets:0}); const v=map.get(d); v.iv += Number(item.intensityVolume||0); v.sets += 1; }); const days=Array.from(map.keys()).sort(); if (days.length < 2) return null; const first=map.get(days[0]); const last=map.get(days[days.length-1]); const firstAvg=first.sets ? first.iv/first.sets : 0; const lastAvg=last.sets ? last.iv/last.sets : 0; return firstAvg ? ((lastAvg-firstAvg)/firstAvg)*100 : null; }
      function updateFeatureProgress() { if (!featureDom.progressValue) return; const items = auth.currentUser ? filterByRange(cachedAllWorkouts, activeRangeTraining) : []; const progress = getProgressPercent(items); featureDom.progressValue.classList.remove('pos','neg'); if (progress === null || !isFinite(progress)) { featureDom.progressValue.textContent='—'; featureDom.progressDescription.textContent='Add entries on at least two different days to calculate your progress.'; return; } const r=Math.round(progress); featureDom.progressValue.textContent=`${r>0?'+':''}${r}%`; featureDom.progressValue.classList.add(r>=0?'pos':'neg'); featureDom.progressDescription.textContent='Change from your first to your latest training day in the selected range.'; }
      function buildRecordRows() { const map=new Map(); cachedAllWorkouts.forEach(item => { if (!item.exercise) return; const row=map.get(item.exercise) || { key:item.exercise, name:item.exerciseDisplay || getExerciseDisplayNameFromKey(item.exercise), maxWeight:0, maxE1RM:0, lastDate:null }; const w=Number(item.weight||0), e=Number(item.e1RM||0); if (w>row.maxWeight) row.maxWeight=w; if (e>row.maxE1RM) row.maxE1RM=e; if (!row.lastDate || item.timestamp>row.lastDate) row.lastDate=item.timestamp; if (item.exerciseDisplay) row.name=item.exerciseDisplay; map.set(item.exercise,row); }); return Array.from(map.values()).map(r => ({...r, ratio:r.maxE1RM>0?(r.maxWeight/r.maxE1RM)*100:null})); }
      function renderFeatureRecords() { if (!featureDom.recordsList) return; const q=(featureDom.recordsSearch?.value||'').toLowerCase().trim(); let rows=buildRecordRows(); if (q) rows=rows.filter(r => String(r.name||'').toLowerCase().includes(q)); const mode=featureState.recordsSort; rows.sort((a,b)=>{ const an=a.name||'', bn=b.name||''; if(mode==='alpha_asc') return an.localeCompare(bn); if(mode==='alpha_desc') return bn.localeCompare(an); if(mode==='weight_asc') return a.maxWeight-b.maxWeight||an.localeCompare(bn); if(mode==='weight_desc') return b.maxWeight-a.maxWeight||an.localeCompare(bn); if(mode==='e1rm_asc') return a.maxE1RM-b.maxE1RM||an.localeCompare(bn); return b.maxE1RM-a.maxE1RM||an.localeCompare(bn); }); featureDom.recordsList.innerHTML=''; if(!rows.length){ featureDom.recordsList.innerHTML='<li class="record-row"><div class="record-main"><div class="record-name">No records found.</div><div class="record-meta">Create workout entries to see personal records.</div></div></li>'; return;} rows.forEach(r=>{ const li=document.createElement('li'); li.className='record-row'; const ratio=r.ratio===null?'—':`${Math.round(r.ratio)}%`; li.innerHTML=`<div class="record-main"><div class="record-name">${r.name||r.key}</div><div class="record-meta">Latest entry: ${r.lastDate?formatDayKeyDE(getLocalDayKey(r.lastDate)):'—'}</div></div><div class="record-values"><div class="record-value-block"><span class="record-value-label">Weight</span><span class="record-value-number">${fKg(r.maxWeight,1)}</span></div><div class="record-value-block"><span class="record-value-label">e1RM</span><span class="record-value-number">${fKg(r.maxE1RM,1)}</span></div><div class="record-value-block"><span class="record-value-label">Ratio</span><span class="record-value-number">${ratio}</span></div></div>`; featureDom.recordsList.appendChild(li); }); }
      function renderFeatureStats() { if (!featureDom.statsGrid || !featureDom.statsList) return; const sets=cachedAllWorkouts.length; const exercises=new Set(cachedAllWorkouts.map(i=>i.exercise).filter(Boolean)).size; const volume=cachedAllWorkouts.reduce((s,i)=>s+Number(i.weight||0)*Number(i.repetitions||0),0); const reps=cachedAllWorkouts.reduce((s,i)=>s+Number(i.repetitions||0),0); const days=uniqueSortedDayKeys(cachedAllWorkouts).length; const maxW=cachedAllWorkouts.reduce((m,i)=>Math.max(m,Number(i.weight||0)),0); const maxE=cachedAllWorkouts.reduce((m,i)=>Math.max(m,Number(i.e1RM||0)),0); featureDom.statsGrid.innerHTML=`<div class="metric-card"><div class="metric-label">Sets</div><div class="metric-value">${fNumber(sets)}</div><div class="metric-subtext">Saved workout entries</div></div><div class="metric-card"><div class="metric-label">Exercises</div><div class="metric-value">${fNumber(exercises)}</div><div class="metric-subtext">Unique exercises</div></div><div class="metric-card"><div class="metric-label">Training Days</div><div class="metric-value">${fNumber(days)}</div><div class="metric-subtext">Days with entries</div></div>`; const data=[['Total Volume',`${fNumber(volume)} kg`,'Weight multiplied by repetitions across all entries.'],['Total Repetitions',fNumber(reps),'Sum of all repetitions.'],['Highest Weight',fKg(maxW,1),'Highest actual weight used in any entry.'],['Highest e1RM',fKg(maxE,1),'Highest estimated one-rep max across all entries.']]; featureDom.statsList.innerHTML=''; data.forEach(([n,v,m])=>{ const li=document.createElement('li'); li.className='stats-row'; li.innerHTML=`<div class="stats-main"><div class="stats-name">${n}</div><div class="stats-meta">${m}</div></div><div class="record-value-number">${v}</div>`; featureDom.statsList.appendChild(li); }); }
      function showWeightMessage(msg){ if(!featureDom.weightError) return; featureDom.weightError.textContent=msg||''; featureDom.weightError.style.display=msg?'block':'none'; }
      async function loadFeatureBodyWeights(userId=auth.currentUser?.uid){ featureState.bodyWeights=[]; if(!userId) return; const snap=await db.collection('users').doc(userId).collection('bodyWeights').orderBy('timestamp','asc').get(); snap.forEach(doc=>{ const d=doc.data(); const ts=tsToDate(d.timestamp); if(ts instanceof Date && !isNaN(ts)) featureState.bodyWeights.push({id:doc.id, dayKey:d.dayKey||getLocalDayKey(ts), weight:Number(d.weight||0), timestamp:ts}); }); }
      function renderFeatureWeight(){ if(!featureDom.bodyWeightChart || !featureDom.weightList) return; chartInstances.weight.bodyWeight=destroyChart(chartInstances.weight.bodyWeight); destroyChartByCanvas(featureDom.bodyWeightChart); const rows=featureState.bodyWeights.slice().sort((a,b)=>a.timestamp-b.timestamp);


      if(rows.length){

        const values = rows.map(r => Number(r.weight || 0));

        const minWeight = Math.min(...values);
        const maxWeight = Math.max(...values);

        const range = Math.max(maxWeight - minWeight, 2);

        createManagedChart(
          'weight',
          'bodyWeight',
          featureDom.bodyWeightChart,
          rows.map(r => formatDayKeyDE(r.dayKey)),
          values,
          'Body Weight',
          'kg',
          false,
          {
            label: (ctx) => `Weight: ${Number(ctx.parsed.y || 0).toFixed(1)} kg`
          }
        );

        const chart = chartInstances.weight.bodyWeight;

        if(chart){
          chart.options.scales.y.min =
            Math.floor(minWeight - range * 0.25);

          chart.options.scales.y.max =
            Math.ceil(maxWeight + range * 0.25);

          chart.update();
        }
      }


      featureDom.weightList.innerHTML=''; if(!rows.length){ featureDom.weightList.innerHTML='<li class="weight-row"><div class="weight-main"><div class="weight-date">No weight entries yet.</div><div class="weight-meta">Use Enter Weight to add your first entry.</div></div></li>'; return;} rows.slice().reverse().forEach(r=>{ const li=document.createElement('li'); li.className='weight-row'; li.innerHTML=`<div class="weight-main"><div class="weight-date">${formatDayKeyDE(r.dayKey)}</div><div class="weight-meta">Body weight entry</div></div><div class="record-value-number">${fKg(r.weight,1)}</div>`; featureDom.weightList.appendChild(li); }); }
      function openFeatureWeightModal(){ if(!auth.currentUser){ openLoginOverlay(); return; } showWeightMessage(''); featureDom.weightDate.value=getLocalDayKey(new Date()); featureDom.weightValue.value=''; featureDom.weightModal.classList.add('open'); featureDom.weightModal.style.display='block'; featureDom.weightModal.style.visibility='visible'; featureDom.weightModal.style.pointerEvents='auto'; featureDom.weightModal.style.zIndex='3600'; showElementForA11y(featureDom.weightModal); setTimeout(()=>featureDom.weightValue?.focus(),50); }
      function closeFeatureWeightModal(){ blurActiveElement(); featureDom.weightModal.classList.remove('open'); featureDom.weightModal.style.display='none'; featureDom.weightModal.style.visibility='hidden'; featureDom.weightModal.style.pointerEvents='none'; hideElementForA11y(featureDom.weightModal); showWeightMessage(''); }
      async function saveFeatureWeight(){ const user=auth.currentUser; if(!user){ openLoginOverlay(); return; } const weight=Number(featureDom.weightValue.value); if(!isFinite(weight)||weight<=0){showWeightMessage('Please enter a valid weight.'); return;} const date=new Date(`${featureDom.weightDate.value||getLocalDayKey(new Date())}T12:00:00`); const dayKey=getLocalDayKey(date); try{ await db.collection('users').doc(user.uid).collection('bodyWeights').doc(dayKey).set({weight,dayKey,timestamp:firebase.firestore.Timestamp.fromDate(date),updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}); await loadFeatureBodyWeights(user.uid); closeFeatureWeightModal(); renderFeatureWeight(); }catch(e){ console.error('Save body weight error:',e); showWeightMessage(`Could not save weight: ${e.message}`); } }
      function openFeatureSheet(sheet, renderFn){ closeDrawer(); openBottomSheet(sheet,{returnToDrawer:false}); if(renderFn) renderFn(); }
      const originalRenderOverallChartAndExercisesList = renderOverallChartAndExercisesList;
      renderOverallChartAndExercisesList = function(){ originalRenderOverallChartAndExercisesList(); updateFeatureProgress(); };
      const originalSyncUiForAuthenticatedUser = syncUiForAuthenticatedUser;
      syncUiForAuthenticatedUser = async function(user){ await originalSyncUiForAuthenticatedUser(user); await loadFeatureBodyWeights(user.uid); updateFeatureProgress(); renderFeatureWeight(); };
      const originalSyncUiForLoggedOutUser = syncUiForLoggedOutUser;
      syncUiForLoggedOutUser = function(){ originalSyncUiForLoggedOutUser(); featureState.bodyWeights=[]; updateFeatureProgress(); renderFeatureWeight(); };
      featureDom.useLastEntryButton?.addEventListener('click', useLastWorkoutEntry);
      featureDom.menuPersonalRecords?.addEventListener('click',()=>openFeatureSheet(featureDom.recordsSheet,renderFeatureRecords));
      featureDom.menuStatistics?.addEventListener('click',()=>openFeatureSheet(featureDom.statsSheet,renderFeatureStats));
      featureDom.menuWeightTracking?.addEventListener('click',()=>openFeatureSheet(featureDom.weightSheet,renderFeatureWeight));
      featureDom.closeRecords?.addEventListener('click',()=>closeBottomSheet(featureDom.recordsSheet));
      featureDom.closeStats?.addEventListener('click',()=>closeBottomSheet(featureDom.statsSheet));
      featureDom.closeWeight?.addEventListener('click',()=>closeBottomSheet(featureDom.weightSheet));
      featureDom.recordsSearch?.addEventListener('input', renderFeatureRecords);
      featureDom.recordsSort?.addEventListener('change',()=>{ featureState.recordsSort=featureDom.recordsSort.value; renderFeatureRecords(); });
      featureDom.openWeightEntry?.addEventListener('click', openFeatureWeightModal);
      featureDom.weightModalOverlay?.addEventListener('click', closeFeatureWeightModal);
      featureDom.weightModalClose?.addEventListener('click', closeFeatureWeightModal);
      featureDom.weightCancel?.addEventListener('click', closeFeatureWeightModal);
      featureDom.weightSave?.addEventListener('click', saveFeatureWeight);
      [featureDom.weightDate, featureDom.weightValue].forEach(el=>el?.addEventListener('keydown',async(e)=>{ if(e.key==='Enter'){e.preventDefault(); await saveFeatureWeight();} if(e.key==='Escape'){e.preventDefault(); closeFeatureWeightModal();} }));
      [ [featureDom.recordsSheet,()=>closeBottomSheet(featureDom.recordsSheet)], [featureDom.statsSheet,()=>closeBottomSheet(featureDom.statsSheet)], [featureDom.weightSheet,()=>closeBottomSheet(featureDom.weightSheet)] ].forEach(([sheet,fn])=>{ if(sheet) attachSheetSwipeToClose(sheet,fn); });
      [featureDom.recordsSheet,featureDom.statsSheet,featureDom.weightSheet,featureDom.weightModal].forEach(el=>hideElementForA11y(el));
      if (featureDom.weightModal) { featureDom.weightModal.classList.remove('open'); featureDom.weightModal.style.display='none'; featureDom.weightModal.style.visibility='hidden'; featureDom.weightModal.style.pointerEvents='none'; }
      updateFeatureProgress();

      // Override account deletion cleanup to include body weight entries as well.
      async function deleteUserOwnedData(uid) {
       const workoutsSnap = await db.collection('workouts').where('userId', '==', uid).get();
       for (const doc of workoutsSnap.docs) {
        await doc.ref.delete();
       }
       const exercisesSnap = await db.collection('users').doc(uid).collection('exercises').get();
       for (const doc of exercisesSnap.docs) {
        await doc.ref.delete();
       }
       const bodyWeightsSnap = await db.collection('users').doc(uid).collection('bodyWeights').get();
       for (const doc of bodyWeightsSnap.docs) {
        await doc.ref.delete();
       }
       await db.collection('users').doc(uid).delete();
      }
