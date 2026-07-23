let currentSubject = "physics";

document.addEventListener("DOMContentLoaded", () => {
  loadRevisionNotes("physics");
  initializeTabs();
  document
    .getElementById("revisionSearch")
    .addEventListener("input", filterRevisionNotes);
});

async function loadRevisionNotes(subject) {
  currentSubject = subject;
  const container = document.getElementById("revisionContainer");

  container.innerHTML = `
        <div class="content-card">
            <p>Loading revision notes...</p>
        </div>
    `;

  try {
    const response = await fetch(`../data/${subject}/chapters.json`);

    if (!response.ok) {
      container.innerHTML = `
                <div class="content-card">
                    <h2>${subject.charAt(0).toUpperCase() + subject.slice(1)}</h2>
                    <p>Content coming soon...</p>
                </div>
            `;

      return;
    }

    const chapters = await response.json();

    container.innerHTML = "";

    let renderedCount = 0;

    for (const chapter of chapters) {
      try {
        const chapterResponse = await fetch(
          `../data/${subject}/${chapter.slug}.json`,
        );

        if (!chapterResponse.ok) continue;

        const text = await chapterResponse.text();

        if (!text.trim()) continue;

        const data = JSON.parse(text);

        if (!data.notes || data.notes.length === 0) continue;

        let notesHTML = "";

        data.notes.forEach((note) => {
          notesHTML += `

        <div class="revision-note-card">

            <h3>📝 ${note.title}</h3>

            <p>${note.content}</p>

        </div>

    `;
        });

        container.innerHTML += `
                    <div class="content-card">

                        <h2>${data.title}</h2>

                        ${notesHTML}

                    </div>
                `;

        renderedCount++;
      } catch (error) {
        console.warn(`Skipped ${chapter.slug}.json`, error);
      }
    }

    if (renderedCount === 0) {
      container.innerHTML = `
                <div class="content-card">

                    <h2>No revision notes available yet.</h2>

                    <p>
                        Revision notes will appear here as chapters are added.
                    </p>

                </div>
            `;
    }
  } catch (error) {
    console.error(error);

    container.innerHTML = `
            <div class="content-card">

                <h2>Unable to load revision notes.</h2>

                <p>Please try again later.</p>

            </div>
        `;
  }
}

function initializeTabs() {
  const tabs = document.querySelectorAll(".subject-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => {
        btn.classList.remove("active");
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-secondary");
      });

      tab.classList.add("active");
      tab.classList.remove("btn-secondary");
      tab.classList.add("btn-primary");

      loadRevisionNotes(tab.dataset.subject);
    });
  });
}

function filterRevisionNotes(e) {
  const keyword = e.target.value.toLowerCase();

  const cards = document.querySelectorAll("#revisionContainer .content-card");

  cards.forEach((card) => {
    const title = card.querySelector("h2").textContent.toLowerCase();

    if (title.includes(keyword)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}