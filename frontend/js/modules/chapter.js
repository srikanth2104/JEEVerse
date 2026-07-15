document.addEventListener("DOMContentLoaded", loadChapter);
async function loadChapter() {
    try {
        const params = new URLSearchParams(window.location.search);

        const subject = params.get("subject");
        const chapterId = params.get("id");

        //console.log("Subject :",subject);
        //console.log("Chapter: ",chapterId);

        const response = await fetch(`../data/${subject}/${chapterId}.json`);

        if (!response.ok) {
            throw new Error("Chapter not found");
        }
        const chapter = await response.json();
    
        //console.log(chapter);

        const main = document.getElementById("mainContent");
        main.innerHTML = "";

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

    if (!chapter.concepts?.length) {
      main.innerHTML += `
            <section id="conceptSection" class="content-card">
                <h2>🧠 Key Concepts</h2>
                <p>Key Concepts will be added soon.</p>
            </section>
        `;
      return;
    }

    chapter.concepts.forEach(concept => {
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

    let html = "";

    if (!chapter.formulas?.length) {
      main.innerHTML += `
            <section id="formulaSection" class="content-card">
                <h2>📐 Formula Sheet</h2>
                <p>Formulas will be added soon.</p>
            </section>
        `;
      return;
    }

    chapter.formulasforEach(formula => {
        html += `
            <div class="formula-box">${formula}</div>
        `;
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

    let html = "";

    if (!chapter.notes?.length) {
        main.innerHTML += `
            <section id="notesSection" class="content-card">
                <h2>📝 Smart Revision Notes</h2>
                <p>Notes will be added soon.</p>
            </section>
        `;
        return;
    }

    chapter.notesforEach(note => {
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

function renderOverview(chapter) {
    const overview = document.getElementById("overviewCard");
    overview.innerHTML = `
        <div class="overview-card">
            <p>${chapter.overview || "Overview will be added soon."}</p>
        </div>
    `;
}