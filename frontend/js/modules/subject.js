console.log("subject.js loaded");

document.addEventListener("DOMContentLoaded", loadSubject);

async function loadSubject() {
  console.log("1. loadSubject started");

  try {
    const response = await fetch("../data/physics/chapters.json");
    console.log("2. Fetch successful");

    const chapters = await response.json();
    console.log("3. JSON loaded:", chapters);

    renderChapters(chapters);
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

  chapters.forEach((chapter, index) => {
    console.log(`7. Rendering chapter ${index + 1}:`, chapter.name);

    const card = document.createElement("div");
    card.className = "chapter-card";

    card.innerHTML = `
            <h3>${chapter.name}</h3>
            <div class="chapter-meta">
                <p>⭐ Weightage ${"★".repeat(chapter.weightage)}</p>
                <p>📈 Difficulty ${"★".repeat(chapter.difficulty)}</p>
                <p>⏱ ${chapter.estimatedHours} Hours</p>
            </div>
            <a href="chapter.html?id=${chapter.slug}" class="btn btn-primary">
                Study
            </a>
        `;

    grid.appendChild(card);
  });

  console.log("8. All cards added");
}