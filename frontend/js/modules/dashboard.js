document.addEventListener("DOMContentLoaded", loadDashboard);

function loadDashboard() {
  loadStatistics();
  loadQuizStatistics();
  drawQuizChart();
  loadStudyInsights();
  drawStudyHeatmap();
  drawSubjectDistribution();
  loadContinueLearning();
  loadFavorites();
  loadRecentActivity();
  loadSubjectProgress();
}

function loadStatistics() {
  const completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

  document.getElementById("completedCount").textContent = completed.length;

  document.getElementById("studyHours").textContent = completed.length * 2;

  document.getElementById("currentStreak").textContent = 1;

  document.getElementById("revisionPending").textContent = Math.max(
    0,
    95 - completed.length,
  );
}

function loadContinueLearning() {
  const lastChapter = JSON.parse(localStorage.getItem("lastChapter"));

  if (!lastChapter) {
    document.getElementById("resumeBtn").disabled = true;
    return;
  }

  document.getElementById("continueTitle").textContent = lastChapter.title;

  document.getElementById("resumeBtn").addEventListener("click", () => {
    window.location.href = `chapter.html?subject=${lastChapter.subject}&id=${lastChapter.id}`;
  });
}

function loadRecentActivity() {
  const container = document.getElementById("activityList");

  let activity = JSON.parse(localStorage.getItem("activity")) || [];

  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];

  history.forEach((item) => {
    activity.push(`Scored ${item.percentage}% in ${item.chapter}`);
  });

  if (activity.length === 0) {
    container.innerHTML = "No activity yet.";

    return;
  }

  container.innerHTML = "";

  activity
    .slice()
    .reverse()
    .forEach((item) => {
      container.innerHTML += `

                <div class="activity-item">

                    ${item}

                </div>

            `;
    });
}

function loadSubjectProgress() {
  const completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

  const totals = {
    physics: 6,
    chemistry: 6,
    mathematics: 6,
  };

  updateSubject("physics", totals.physics);
  updateSubject("chemistry", totals.chemistry);
  updateSubject("math", totals.mathematics);

  function updateSubject(subject, total) {
    const count = completed.filter((chapter) =>
      chapter.startsWith(subject + "-"),
    ).length;

    const percent = Math.round((count / total) * 100);

    document.getElementById(subject + "Percent").textContent = percent + "%";

    document.getElementById(subject + "Bar").style.width = percent + "%";
  }
}

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const container = document.getElementById("favoritesList");

  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = "No favourite chapters yet.";

    return;
  }

  container.innerHTML = "";

  favorites.forEach((item) => {
    const parts = item.split("-");

    const subject = parts[0];

    const chapter = parts.slice(1).join("-");

    container.innerHTML += `

            <div class="activity-item">

                ⭐ <strong>${chapter}</strong>

                <br>

                ${subject}

            </div>

        `;
  });
}

function loadQuizStatistics() {
  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];

  document.getElementById("quizAttempts").textContent = history.length;

  if (history.length === 0) {
    document.getElementById("quizBestScore").textContent = "0";

    document.getElementById("quizAverage").textContent = "0%";

    return;
  }

  let total = 0;

  let best = 0;

  history.forEach((item) => {
    total += item.percentage;

    if (item.percentage > best) {
      best = item.percentage;
    }
  });

  document.getElementById("quizBestScore").textContent = best + "%";

  document.getElementById("quizAverage").textContent =
    Math.round(total / history.length) + "%";
}

function loadStudyInsights() {
  const completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

  const lastChapter = JSON.parse(localStorage.getItem("lastChapter"));

  const totalChapters = 18; // 6 Physics + 6 Chemistry + 6 Mathematics (current)

  const subjects = {
    physics: 0,
    chemistry: 0,
    mathematics: 0,
  };

  completed.forEach((chapter) => {
    const subject = chapter.split("-")[0];

    if (subjects[subject] !== undefined) {
      subjects[subject]++;
    }
  });

  let mostStudied = "-";
  let max = 0;

  Object.entries(subjects).forEach(([subject, count]) => {
    if (count > max) {
      max = count;

      mostStudied = subject.charAt(0).toUpperCase() + subject.slice(1);
    }
  });

  document.getElementById("mostStudiedSubject").textContent = mostStudied;

  document.getElementById("totalCompleted").textContent = completed.length;

  document.getElementById("completionPercent").textContent =
    Math.round((completed.length / totalChapters) * 100) + "%";

  document.getElementById("lastStudied").textContent = lastChapter
    ? lastChapter.title
    : "-";
}

function drawQuizChart() {
  const canvas = document.getElementById("quizChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (history.length === 0) {
    ctx.font = "20px Arial";

    ctx.fillText("No quiz data available.", 20, 40);

    return;
  }

  const padding = 50;

  const graphWidth = canvas.width - padding * 2;

  const graphHeight = canvas.height - padding * 2;

  ctx.beginPath();

  ctx.moveTo(padding, padding);

  ctx.lineTo(padding, canvas.height - padding);

  ctx.lineTo(canvas.width - padding, canvas.height - padding);

  ctx.stroke();

  ctx.beginPath();

  history.forEach((item, index) => {
    const x = padding + index * (graphWidth / Math.max(history.length - 1, 1));

    const y = canvas.height - padding - (item.percentage / 100) * graphHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  history.forEach((item, index) => {
    const x = padding + index * (graphWidth / Math.max(history.length - 1, 1));

    const y = canvas.height - padding - (item.percentage / 100) * graphHeight;

    ctx.beginPath();

    ctx.arc(x, y, 5, 0, Math.PI * 2);

    ctx.fill();

    ctx.fillText(item.percentage + "%", x - 10, y - 10);
  });
}

function drawStudyHeatmap() {
  const container = document.getElementById("studyHeatmap");

  if (!container) return;

  container.innerHTML = "";

  const activity = JSON.parse(localStorage.getItem("activity")) || [];

  for (let i = 0; i < 30; i++) {
    const box = document.createElement("div");

    box.className = "heatmap-box";

    if (i < activity.length) {
      box.classList.add("active");
    }

    container.appendChild(box);
  }
}

function drawSubjectDistribution() {
  const completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

  const subjects = {
    physics: 0,
    chemistry: 0,
    mathematics: 0,
  };

  completed.forEach((chapter) => {
    const subject = chapter.split("-")[0];

    if (subjects[subject] !== undefined) {
      subjects[subject]++;
    }
  });

  const max = Math.max(...Object.values(subjects), 1);

  update("physics");
  update("chemistry");
  update("mathematics");

  function update(subject) {
    const count = subjects[subject];

    const percent = (count / max) * 100;

    const id = subject === "mathematics" ? "math" : subject;

    document.getElementById(id + "Distribution").style.width = percent + "%";

    document.getElementById(id + "DistributionText").textContent =
      `${count} Chapters`;
  }
}
