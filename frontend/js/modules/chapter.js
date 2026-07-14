document.addEventListener("DOMContentLoaded", loadChapter);
async function loadChapter() {
    try {
        const params = new URLSearchParams(window.location.search);

        const subject = params.get("subject");
        const chapterId = params.get("id");

        console.log("Subject :",subject);
        console.log("Chapter: ",chapterId);

        const response = await fetch(`../data/${subject}/${chapterId}.json`);

        if (!response.ok) {
            throw new Error("Chapter not found");
        }
        const chapter = await response.json();
    
        console.log(chapter);
        renderHeader(chapter);
        renderOverview(chapter);
        renderConcepts(chapter);
        renderFormulas(chapter);
        renderNotes(chapter);
        renderPYQ(chapter);
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

function renderConcepts(chapter) {
    const main = document.getElementById("mainContent");

    let html = "";
    (chapter.concepts || []).forEach(concept => {
        html += `<li>${concept}</li>`;
    });

    main.innerHTML += `
        <section class="content-card">
            <h2>🧠 Key Concepts</h2>
            <ul>${html}</ul>
        </section>
    `;
}

function renderFormulas(chapter) {
    const main = document.getElementById("mainContent");

    let html = "";
    (chapter.formulas || []).forEach(formula => {
        html += `
            <div class="formula-box">${formula}</div>
        `;
    });

    main.innerHTML += `
        <section class="content-card">
            <h2>📐 Formula Sheet</h2>
            ${html}
        </section>
    `;
}

function renderNotes(chapter) {
    const main = document.getElementById("mainContent");

    let html = "";

    (chapter.notes || []).forEach(note => {
        html += `
            <div class="note-card">
                <h3>${note.title}</h3>

                <p>${note.content}</p>
            </div>
        `;
    });

    main.innerHTML += `
        <section class="content-card">
            <h2>📝 Smart Revision Notes</h2>
            ${html}
        </section>
    `;
}

function renderPYQ(chapter) {
  if (!chapter.pyq) return;

  const main = document.getElementById("mainContent");

  let topics = "";

  (chapter.pyq.importantTopics || []).forEach((topic) => {
    topics += `<li>${topic}</li>`;
  });

  main.innerHTML += `
        <section class="content-card">
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

function renderOverview(chapter) {
    const overview = document.getElementById("overviewCard");
    overview.innerHTML = `
        <div class="overview-card">
            <p>${chapter.overview}</p>
        </div>
    `;
}