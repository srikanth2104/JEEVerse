console.log(window.location.href);

const params = new URLSearchParams(window.location.search);

console.log("Search:", window.location.search);
console.log("subject =", params.get("subject"));
console.log("id =", params.get("id"));

document.addEventListener("DOMContentLoaded", loadChapter);

async function loadChapter() {
  try {
    const params = new URLSearchParams(window.location.search);

    const subject = params.get("subject");
    const chapterId = params.get("id");

    if (!subject || !chapterId) {
      throw new Error("Missing subject or chapter id");
    }

    const url = `../data/${subject}/${chapterId}.json`;

    console.log("Loading:", url);

    const response = await fetch(url);

    console.log("Status:", response.status);

    const text = await response.text();

    console.log("Response Text:");
    console.log(text);

    const chapter = JSON.parse(text);

    const main = document.getElementById("mainContent");
    main.innerHTML = "";
    console.log("1");
    renderHeader(chapter);

    console.log("2");
    renderOverview(chapter);

    console.log("3");
    renderConcepts(chapter);

    console.log("4");
    renderFormulas(chapter);

    console.log("5");
    renderNotes(chapter);

    console.log("6");
    renderPYQ(chapter);

    console.log("7");
    initializeCompletion(subject, chapterId, chapter);

    console.log("8");
    initializeFavorites(subject, chapterId, chapter);

    console.log("9");
    loadAchievement(subject, chapterId);

    console.log("DONE");

    localStorage.setItem(
      "lastOpenedChapter",
      JSON.stringify({
        title: chapter.title,
        url: window.location.pathname + window.location.search,
        subject: chapter.subject,
      }),
    );

    // Continue Learning
    localStorage.setItem(
      "lastChapter",
      JSON.stringify({
        subject,
        id: chapterId,
        title: chapter.title,
      }),
    );
  } catch (error) {
    console.error("ERROR FOUND:");

    console.error(error);

    console.error(error.stack);

    throw error;
  }
}

const favoriteButton = document.getElementById("favoriteBtn");

if (favoriteButton) {
  updateFavoriteButton();

  favoriteButton.onclick = () => {
    if (isFavorite(chapter.title)) {
      removeFavorite(chapter.title);
    } else {
      addFavorite({
        title: chapter.title,

        subject: chapter.subject,

        url: window.location.pathname + window.location.search,
      });
    }

    updateFavoriteButton();
  };
}

function updateFavoriteButton() {
  const button = document.getElementById("favoriteBtn");

  if (!button) return;

  if (isFavorite(chapter.title)) {
    button.textContent = "★ Remove Favorite";

    button.classList.remove("btn-secondary");

    button.classList.add("btn-primary");
  } else {
    button.textContent = "☆ Add to Favorites";

    button.classList.remove("btn-primary");

    button.classList.add("btn-secondary");
  }
}

function renderHeader(chapter) {
  const header = document.getElementById("chapterHeader");

  header.innerHTML = `
    <h1>${chapter.title}</h1>

    <p>${chapter.subject} • ${chapter.unit}</p>

    <div class="chapter-meta">
        <span>⭐ Weightage ${"★".repeat(chapter.weightage || 0)}</span>

        <span>📈 Difficulty ${"★".repeat(chapter.difficulty || 0)}</span>

        <span>⏱ ${chapter.estimatedHours || 0} Hours</span>
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

  if (!chapter.concepts || chapter.concepts.length === 0) {
    main.innerHTML += `
      <section id="conceptSection" class="content-card">
          <h2>🧠 Key Concepts</h2>
          <p>Key concepts will be added soon.</p>
      </section>
    `;
    return;
  }

  const html = chapter.concepts
    .map((concept) => `<li>${concept}</li>`)
    .join("");

  main.innerHTML += `
    <section id="conceptSection" class="content-card">
        <h2>🧠 Key Concepts</h2>
        <ul>${html}</ul>
    </section>
  `;
}

function renderFormulas(chapter) {
  const main = document.getElementById("mainContent");

  if (!chapter.formulas || chapter.formulas.length === 0) {
    main.innerHTML += `
      <section id="formulaSection" class="content-card">
          <h2>📐 Formula Sheet</h2>
          <p>Formulas will be added soon.</p>
      </section>
    `;
    return;
  }

  const html = chapter.formulas
    .map((formula) => `<div class="formula-box">${formula}</div>`)
    .join("");

  main.innerHTML += `
    <section id="formulaSection" class="content-card">
        <h2>📐 Formula Sheet</h2>
        ${html}
    </section>
  `;
}

function renderNotes(chapter) {
  const main = document.getElementById("mainContent");

  if (!chapter.notes || chapter.notes.length === 0) {
    main.innerHTML += `
      <section id="notesSection" class="content-card">
        <h2>📝 Smart Revision Notes</h2>
        <p>Notes will be added soon.</p>
      </section>
    `;
    return;
  }

  const html = chapter.notes
    .map(
      (note) => `
      <div class="note-card">

        <h3>${note.title}</h3>

        <p>${note.content}</p>

        <button
          class="btn btn-secondary bookmarkBtn"
          data-title="${note.title}"
          data-content="${note.content}"
          data-subject="${chapter.subject}"
          data-chapter="${chapter.title}">

          ⭐ Bookmark

        </button>

      </div>
    `,
    )
    .join("");

  main.innerHTML += `
    <section id="notesSection" class="content-card">

      <h2>📝 Smart Revision Notes</h2>

      ${html}

    </section>
  `;

  document.querySelectorAll(".bookmarkBtn").forEach((button) => {
    button.addEventListener("click", saveBookmark);
  });
}

function renderPYQ(chapter) {
  const main = document.getElementById("mainContent");

  if (!chapter.pyq || !chapter.pyq.importantTopics) {
    main.innerHTML += `
      <section id="pyqSection" class="content-card">

        <h2>📊 PYQ Trend Analysis</h2>

        <p>PYQ analysis will be added soon.</p>

      </section>
    `;
    return;
  }

  const topics = chapter.pyq.importantTopics
    .map((topic) => `<li>${topic}</li>`)
    .join("");

  main.innerHTML += `
    <section id="pyqSection" class="content-card">

      <h2>📊 PYQ Trend Analysis</h2>

      <div class="pyq-grid">

        <div class="pyq-stat">
          <h3>${chapter.pyq.totalQuestions || 0}</h3>
          <p>Total Questions Asked</p>
        </div>

        <div class="pyq-stat">
          <h3>${chapter.pyq.averagePerYear || 0}</h3>
          <p>Average Questions / Year</p>
        </div>

      </div>

      <h3>Most Asked Topics</h3>

      <ul>

        ${topics}

      </ul>

    </section>
  `;
}

function initializeCompletion(subject, chapterId, chapter) {
  const button = document.getElementById("completeBtn");
  const progressBar = document.getElementById("chapterProgress");
  const progressText = document.getElementById("progressText");

  let completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

  const chapterKey = `${subject}-${chapterId}`;

  updateUI(completed.includes(chapterKey));

  button.addEventListener("click", () => {
    if (completed.includes(chapterKey)) return;

    completed.push(chapterKey);

    localStorage.setItem("completedChapters", JSON.stringify(completed));

    fetch(`../data/${subject}/chapters.json`)
      .then((response) => response.json())
      .then((chapters) => {
        unlockNextChapter(subject, chapterId, chapters);
      });

    // Revision Schedule
    const revisionData = JSON.parse(localStorage.getItem("revisionData")) || {};

    revisionData[chapterKey] = {
      completedOn: new Date().toISOString(),
      nextRevision: Date.now() + 3 * 24 * 60 * 60 * 1000,
      interval: 3,
    };

    localStorage.setItem("revisionData", JSON.stringify(revisionData));

    // Activity
    let activity = JSON.parse(localStorage.getItem("activity")) || [];

    activity.push(`Completed ${chapter.title}`);

    if (activity.length > 20) activity.shift();

    localStorage.setItem("activity", JSON.stringify(activity));

    updateUI(true);
    addXP(50);
    updateStudyStreak();
    checkAchievements();
    loadAchievement(subject, chapterId);
  });

  function updateUI(done) {
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

function initializeFavorites(subject, chapterId, chapter) {
  const button = document.getElementById("favoriteBtn");

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const key = `${subject}-${chapterId}`;

  updateButton();

  button.addEventListener("click", () => {
    let activity = JSON.parse(localStorage.getItem("activity")) || [];

    if (favorites.includes(key)) {
      favorites = favorites.filter((item) => item !== key);

      activity.push(`Removed ${chapter.title} from Favorites`);
    } else {
      favorites.push(key);

      activity.push(`Added ${chapter.title} to Favorites`);
    }

    if (activity.length > 20) activity.shift();

    localStorage.setItem("favorites", JSON.stringify(favorites));

    localStorage.setItem("activity", JSON.stringify(activity));

    updateButton();
  });

  function updateButton() {
    if (favorites.includes(key)) {
      button.textContent = "★ Favorited";
      button.classList.remove("btn-secondary");
      button.classList.add("btn-primary");
    } else {
      button.textContent = "☆ Add to Favorites";
      button.classList.remove("btn-primary");
      button.classList.add("btn-secondary");
    }
  }
}

function loadAchievement(subject, chapterId) {
  const achievement = document.getElementById("achievementBox");

  if (!achievement) return;

  const completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

  const quizScores = JSON.parse(localStorage.getItem("quizScores")) || {};

  const key = `${subject}-${chapterId}`;

  if (!completed.includes(key)) {
    achievement.innerHTML = `
      <p>
        Finish this chapter to unlock achievements.
      </p>
    `;
    return;
  }

  const score = quizScores[key];

  if (score === undefined) {
    achievement.innerHTML = `
      <p>
        Complete the quiz to unlock the badge.
      </p>
    `;
    return;
  }

  const percentage = Math.round((score / 3) * 100);

  if (percentage >= 70) {
    achievement.innerHTML = `
      <h2>🏆 Chapter Master</h2>

      <p>Congratulations!</p>

      <p>You mastered this chapter.</p>
    `;
  } else {
    achievement.innerHTML = `
      <p>
        Score at least 70% in the quiz
        to unlock this achievement.
      </p>
    `;
  }
}

function saveBookmark(event) {
  const button = event.target;

  const bookmark = {
    title: button.dataset.title,
    content: button.dataset.content,
    subject: button.dataset.subject,
    chapter: button.dataset.chapter,
  };

  let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  const exists = bookmarks.some(
    (item) =>
      item.title === bookmark.title && item.chapter === bookmark.chapter,
  );

  if (exists) {
    button.textContent = "⭐ Bookmarked";
    button.disabled = true;
    return;
  }

  bookmarks.push(bookmark);

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  let activity = JSON.parse(localStorage.getItem("activity")) || [];

  activity.push(`Bookmarked "${bookmark.title}"`);

  if (activity.length > 20) activity.shift();

  localStorage.setItem("activity", JSON.stringify(activity));

  button.textContent = "⭐ Bookmarked";
  button.disabled = true;
}
