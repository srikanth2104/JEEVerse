/*
====================================================
JEEVerse Recent Manager
====================================================
*/

/*
-----------------------------------------
Save Recently Opened Chapter
-----------------------------------------
*/

function saveRecentChapter(chapter) {
  if (!chapter || !chapter.title) return;

  let recent = JSON.parse(localStorage.getItem("recentChapters")) || [];

  // Remove duplicate

  recent = recent.filter((item) => item.title !== chapter.title);

  // Add newest

  recent.unshift({
    title: chapter.title,

    subject: chapter.subject,

    url: chapter.url,

    openedOn: new Date().toISOString(),
  });

  // Keep only latest 10

  if (recent.length > 10) {
    recent.pop();
  }

  localStorage.setItem("recentChapters", JSON.stringify(recent));

  // Used by Resume Button

  localStorage.setItem("lastOpenedChapter", JSON.stringify(recent[0]));
}

/*
-----------------------------------------
Continue Learning
-----------------------------------------
*/

function loadContinueLearning() {
  const container = document.getElementById("continueLearning");

  if (!container) return;

  const chapter = JSON.parse(localStorage.getItem("lastOpenedChapter"));

  if (!chapter) {
    container.innerHTML = `

        <div class="empty-card">

            <h3>No Chapter Opened Yet</h3>

            <p>

                Start learning to continue your journey.

            </p>

        </div>

        `;

    return;
  }

  container.innerHTML = `

    <div class="continue-card">

        <div>

            <h3>${chapter.title}</h3>

            <p>${chapter.subject}</p>

        </div>

        <a
            href="${chapter.url || "#"}"
            class="btn btn-primary">

            Resume

        </a>

    </div>

    `;
}

/*
-----------------------------------------
Recent Activity
-----------------------------------------
*/

function loadRecentActivity() {
  const container = document.getElementById("recentContainer");

  if (!container) return;

  const recent = JSON.parse(localStorage.getItem("recentChapters")) || [];

  if (recent.length === 0) {
    container.innerHTML = `

        <div class="empty-card">

            <h3>No Recent Chapters</h3>

            <p>

                Recently opened chapters will appear here.

            </p>

        </div>

        `;

    return;
  }

  container.innerHTML = "";

  recent.forEach((chapter) => {
    container.innerHTML += `

        <div class="recent-card">

            <div>

                <h3>${chapter.title}</h3>

                <p>${chapter.subject}</p>

            </div>

            <a
                href="${chapter.url || "#"}"
                class="btn btn-secondary">

                Open

            </a>

        </div>

        `;
  });
}
