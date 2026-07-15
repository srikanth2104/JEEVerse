document.addEventListener("DOMContentLoaded", initProgress);

function initProgress() {
  const params = new URLSearchParams(window.location.search);

  const subject = params.get("subject");
  const chapter = params.get("id");

  const key = `${subject}-${chapter}`;

  const button = document.getElementById("completeBtn");
  const fill = document.getElementById("progressFill");
  const text = document.getElementById("progressText");

  if (localStorage.getItem(key) === "completed") {
    fill.style.width = "100%";
    text.textContent = "100% Completed";

    button.textContent = "Completed ✓";
    button.disabled = true;

    return;
  }

  button.addEventListener("click", () => {
    localStorage.setItem(key, "completed");

    fill.style.width = "100%";
    text.textContent = "100% Completed";

    button.textContent = "Completed ✓";
    button.disabled = true;
  });
}
