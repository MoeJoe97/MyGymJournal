export function showAppMessage(type, text) {
        if (!text) return;
        const region = document.getElementById("appToastRegion");
        if (!region) return;
        const toast = document.createElement("div");
        toast.className = `app-toast ${type === "error" ? "error" : "success"}`;
        const icon = document.createElement("span");
        icon.className = "app-toast-icon"; icon.setAttribute("aria-hidden", "true");
        icon.textContent = type === "error" ? "!" : "✓";
        const label = document.createElement("span"); label.textContent = String(text);
        toast.append(icon, label); region.replaceChildren(toast);
        setTimeout(() => toast.remove(), type === "error" ? 5000 : 3000);
      }
      export function showSuccessMessage(text) { showAppMessage("success", text); }
      export function showErrorMessage(text) { showAppMessage("error", text); }
      export function displayMessage(text, isError = false) { showAppMessage(isError ? "error" : "success", text); }
