document.addEventListener("DOMContentLoaded", loadChapter);

async function loadChapter() {
  try {
    const params = new URLSearchParams(window.location.search);

    const subject = params.get("subject");
    const chapterId = params.get("id");

    const response = await fetch(`../data/${subject}/${chapterId}.json`);

    if (!response.ok) {
      throw new Error("Chapter not found");
    }

    const chapter = await response.json();

    const main = document.getElementById("mainContent");
    main.innerHTML = "";

    renderHeader(chapter);
    renderOverview(chapter);
    renderConcepts(chapter);
    renderFormulas(chapter);
    renderNotes(chapter);
    renderPYQ(chapter);

    initializeCompletion(subject, chapterId, chapter);

    localStorage.setItem(
      "lastChapter",
      JSON.stringify({
        subject,
        id: chapterId,
        title: chapter.title,
      }),
    );
  } catch (error) {
    console.error(error);
  }
}

function renderHeader(chapter) {
  const header = document.getElementById("chapterHeader");

  header.innerHTML = `
        <h1>${chapter.title}</h1>

        <p>${chapter.subject} • ${chapter.unit}</p>

        <div class="chapter-meta">
            <span>⭐ Weightage ${"★".repeat(chapter.weightage)}</span>
            <span>📈 Difficulty ${"★".repeat(chapter.difficulty)}</span>
            <span>⏱ ${chapter.estimatedHours} Hours</span>
        </div>
    `;
}

function renderOverview(chapter) {
  const overview = document.getElementById("overviewCard");

  overview.innerHTML = `
        <div class="overview-card">
            <p>${chapter.overview || "Overview will be added soon."}</p>
        </div>
    `;
}

function renderConcepts(chapter) {
  const main = document.getElementById("mainContent");

  if (!chapter.concepts?.length) {
    main.innerHTML += `
            <section id="conceptSection" class="content-card">
                <h2>🧠 Key Concepts</h2>
                <p>Key Concepts will be added soon.</p>
            </section>
        `;
    return;
  }

  let html = "";

  chapter.concepts.forEach((concept) => {
    html += `<li>${concept}</li>`;
  });

  main.innerHTML += `
        <section id="conceptSection" class="content-card">
            <h2>🧠 Key Concepts</h2>
            <ul>${html}</ul>
        </section>
    `;
}

function renderFormulas(chapter) {
  const main = document.getElementById("mainContent");

  if (!chapter.formulas?.length) {
    main.innerHTML += `
            <section id="formulaSection" class="content-card">
                <h2>📐 Formula Sheet</h2>
                <p>Formulas will be added soon.</p>
            </section>
        `;
    return;
  }

  let html = "";

  chapter.formulas.forEach((formula) => {
    html += `<div class="formula-box">${formula}</div>`;
  });

  main.innerHTML += `
        <section id="formulaSection" class="content-card">
            <h2>📐 Formula Sheet</h2>
            ${html}
        </section>
    `;
}

function renderNotes(chapter) {
  const main = document.getElementById("mainContent");

  if (!chapter.notes?.length) {
    main.innerHTML += `
            <section id="notesSection" class="content-card">
                <h2>📝 Smart Revision Notes</h2>
                <p>Notes will be added soon.</p>
            </section>
        `;
    return;
  }

  let html = "";

  chapter.notes.forEach((note) => {
    html += `
            <div class="note-card">
                <h3>${note.title}</h3>
                <p>${note.content}</p>
            </div>
        `;
  });

  main.innerHTML += `
        <section id="notesSection" class="content-card">
            <h2>📝 Smart Revision Notes</h2>
            ${html}
        </section>
    `;
}

function renderPYQ(chapter) {
  const main = document.getElementById("mainContent");

  if (!chapter.pyq || !chapter.pyq.importantTopics) {
    main.innerHTML += `
            <section id="pyqSection" class="content-card">
                <h2>📊 PYQ Trend Analysis</h2>
                <p>PYQs will be added soon.</p>
            </section>
        `;
    return;
  }

  let topics = "";

  chapter.pyq.importantTopics.forEach((topic) => {
    topics += `<li>${topic}</li>`;
  });

  main.innerHTML += `
        <section id="pyqSection" class="content-card">
            <h2>📊 PYQ Trend Analysis</h2>

            <div class="pyq-grid">

                <div class="pyq-stat">
                    <h3>${chapter.pyq.totalQuestions ?? 0}</h3>
                    <p>Total Questions Asked</p>
                </div>

                <div class="pyq-stat">
                    <h3>${chapter.pyq.averagePerYear ?? 0}</h3>
                    <p>Average Questions / Year</p>
                </div>

            </div>

            <h3>Most Asked Topics</h3>

            <ul>${topics}</ul>
        </section>
    `;
}

function initializeCompletion(subject, chapterId, chapter) {
  const button = document.getElementById("completeBtn");
  const progressBar = document.getElementById("chapterProgress");
  const progressText = document.getElementById("progressText");

  let completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

  const chapterKey = `${subject}-${chapterId}`;

  updateProgressUI(completed.includes(chapterKey));

  button.addEventListener("click", () => {
    if (completed.includes(chapterKey)) {
      return;
    }

    // Save completed chapter
    completed.push(chapterKey);

    localStorage.setItem("completedChapters", JSON.stringify(completed));

    // Save revision schedule
    const revisionData = JSON.parse(localStorage.getItem("revisionData")) || {};

    revisionData[chapterKey] = {
      completedOn: new Date().toISOString(),
      nextRevision: Date.now() + 3 * 24 * 60 * 60 * 1000,
    };

    localStorage.setItem("revisionData", JSON.stringify(revisionData));

    // Save activity
    const activity = JSON.parse(localStorage.getItem("activity")) || [];

    activity.push(`Completed ${chapter.title}`);

    if (activity.length > 20) {
      activity.shift();
    }

    localStorage.setItem("activity", JSON.stringify(activity));

    updateProgressUI(true);
  });

  function updateProgressUI(done) {
    if (done) {
      progressBar.style.width = "100%";
      progressText.textContent = "100% Completed";
      button.textContent = "Completed ✓";
      button.disabled = true;
    } else {
      progressBar.style.width = "0%";
      progressText.textContent = "0% Completed";
      button.textContent = "Mark as Completed";
      button.disabled = false;
    }
  }
}
