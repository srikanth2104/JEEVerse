document.addEventListener("DOMContentLoaded", () => {
  loadFormulaBook("physics");
  initializeTabs();
});

async function loadFormulaBook(subject) {
  const container = document.getElementById("formulaContainer");

  container.innerHTML = `
        <div class="content-card">
            <p>Loading formulas...</p>
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

        if (!data.formulas || data.formulas.length === 0) continue;

        const formulas = data.formulas
          .map((formula) => `<li>${formula}</li>`)
          .join("");

        container.innerHTML += `
                    <div class="content-card">
                        <h2>${data.title}</h2>

                        <ul>
                            ${formulas}
                        </ul>
                    </div>
                `;

        renderedCount++;
      } catch (error) {
        console.warn(
          `Skipped ${chapter.slug}.json because it doesn't exist or is invalid.`,
          error,
        );
      }
    }

    if (renderedCount === 0) {
      container.innerHTML = `
                <div class="content-card">
                    <h2>No formulas available yet.</h2>

                    <p>
                        Formula sheets will appear here as chapters are added.
                    </p>
                </div>
            `;
    }
  } catch (error) {
    console.error(error);

    container.innerHTML = `
            <div class="content-card">
                <h2>Unable to load Formula Book.</h2>

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

      loadFormulaBook(tab.dataset.subject);
    });
  });
}
