let chapters = [];

console.log("subject.js loaded");

document.addEventListener("DOMContentLoaded", loadSubject);

async function loadSubject() {
  console.log("1. loadSubject started");

  try {
    const response = await fetch("../data/physics/chapters.json");
    console.log("2. Fetch successful");

    chapters = await response.json();
    console.log("3. JSON loaded:", chapters);

    renderChapters(chapters);
    initializeFilters();
    console.log("4. renderChapters finished");
  } catch (error) {
    console.error("ERROR:", error);
  }
}

function renderChapters(chapters) {
  console.log("5. Inside renderChapters");

  const grid = document.querySelector(".chapter-grid");
  console.log("6. Grid found:", grid);

  grid.innerHTML = "";

  chapters.forEach((chapter) => {
    const unlocked = isChapterUnlocked("physics", chapter.slug);

    const card = document.createElement("div");
    card.className = "chapter-card";

    card.innerHTML = `
      <h3>${chapter.name}</h3>

      <div class="chapter-meta">
        <p>⭐ Weightage ${"★".repeat(chapter.weightage)}</p>
        <p>📈 Difficulty ${"★".repeat(chapter.difficulty)}</p>
        <p>⏱ ${chapter.estimatedHours} Hours</p>
      </div>

      ${
        unlocked
          ? `<a href="chapter.html?subject=physics&id=${chapter.slug}" class="btn btn-primary">
                Study
             </a>`
          : `<button class="btn btn-secondary" disabled>
                🔒 Locked
             </button>`
      }
    `;

    grid.appendChild(card);
  });

  console.log("8. All cards added");
}

function initializeFilters() {
  const difficulty = document.getElementById("difficultyFilter");

  const weightage = document.getElementById("weightageFilter");

  const reset = document.getElementById("resetFilters");

  if (!difficulty) return;

  difficulty.addEventListener("change", filterChapters);

  weightage.addEventListener("change", filterChapters);

  reset.addEventListener("click", () => {
    difficulty.value = "";

    weightage.value = "";

    renderChapters(chapters);
    saveRecentChapter({
      title: chapter.title,

      subject: chapter.subject,

      url: window.location.pathname + window.location.search,
    });
  });
}

function filterChapters() {
  const difficulty = document.getElementById("difficultyFilter").value;

  const weightage = document.getElementById("weightageFilter").value;

  let filtered = chapters;

  if (difficulty) {
    filtered = filtered.filter((chapter) => chapter.difficulty == difficulty);
  }

  if (weightage) {
    filtered = filtered.filter((chapter) => chapter.weightage == weightage);
  }

  renderChapters(filtered);
}
