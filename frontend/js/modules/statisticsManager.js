/*
====================================================
JEEVerse Statistics Manager
====================================================
*/

function loadStatistics() {
  updateCompletedCount();
  updateStudyHours();
  updateXP();
  loadAchievements();
  updateStreak();
}

/* ============================================
   Completed Chapters
============================================ */

function updateCompletedCount() {
  const completedElement = document.getElementById("completedCount");
  const todayElement = document.getElementById("completedToday");

  if (!completedElement) return;

  const completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

  completedElement.textContent = completed.length;

  if (todayElement) {
    const today = new Date().toDateString();

    const completedToday = completed.filter(
      (chapter) =>
        chapter.completedOn &&
        new Date(chapter.completedOn).toDateString() === today,
    );

    todayElement.textContent = `+${completedToday.length} Today`;
  }
}

/* ============================================
   Study Hours
============================================ */

function updateStudyHours() {
  const studyHoursElement = document.getElementById("studyHours");

  if (!studyHoursElement) return;

  const studyHours = Number(localStorage.getItem("studyHours")) || 0;

  studyHoursElement.textContent = studyHours.toFixed(1);
}

/* ============================================
   XP
============================================ */

function updateXP() {
  const xpElement = document.getElementById("xpCount");

  if (!xpElement) return;

  const xp = Number(localStorage.getItem("xp")) || 0;

  xpElement.textContent = xp;
}

/* ============================================
   Study Streak
============================================ */

function updateStreak() {
  const streakElement = document.getElementById("currentStreak");

  if (!streakElement) return;

  let streak = Number(localStorage.getItem("studyStreak")) || 0;

  streakElement.textContent = streak;
}

/* ============================================
   XP Helpers
============================================ */

function addXP(points) {
  const currentXP = Number(localStorage.getItem("xp")) || 0;

  localStorage.setItem("xp", currentXP + points);

  updateXP();
}

/* ============================================
   Study Hours Helpers
============================================ */

function addStudyHours(hours) {
  const current = Number(localStorage.getItem("studyHours")) || 0;

  localStorage.setItem("studyHours", current + hours);

  updateStudyHours();
  updateTodayHeatmap(hours);
  drawStudyHeatmap();
}

/* ============================================
   Complete Chapter
============================================ */

function markChapterCompleted(chapter) {
  let completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

  const exists = completed.some((item) => item.title === chapter.title);

  if (exists) return;

  completed.push({
    ...chapter,
    completedOn: new Date().toISOString(),
  });

  localStorage.setItem("completedChapters", JSON.stringify(completed));

  addXP(50);

  updateStudyStreak();

  loadStatistics();
  if (typeof loadAchievements === "function") {
    loadAchievements();
  }
  if (typeof loadSubjectProgress === "function") {
    loadSubjectProgress();
  }
}

/* ============================================
   Daily Streak Logic
============================================ */

function updateStudyStreak() {
  const today = new Date().toDateString();

  const lastDate = localStorage.getItem("lastStudyDate");

  let streak = Number(localStorage.getItem("studyStreak")) || 0;

  if (!lastDate) {
    streak = 1;
  } else {
    const previous = new Date(lastDate);

    const difference = Math.floor(
      (Date.now() - previous.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (difference === 0) {
      // already studied today
    } else if (difference === 1) {
      streak++;
    } else {
      streak = 1;
    }
  }

  localStorage.setItem("studyStreak", streak);

  localStorage.setItem("lastStudyDate", today);

  updateStreak();
}

function updateTodayHeatmap(hours) {
  let heatmap = JSON.parse(localStorage.getItem("studyHeatmap")) || [
    0, 0, 0, 0, 0, 0, 0,
  ];

  let day = new Date().getDay();

  day = day === 0 ? 6 : day - 1;

  heatmap[day] = Math.min(5, Math.round(hours));

  localStorage.setItem("studyHeatmap", JSON.stringify(heatmap));
}
