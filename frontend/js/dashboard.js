/*
====================================================
JEEVerse Dashboard Controller
====================================================
*/

document.addEventListener("DOMContentLoaded", initializeDashboard);

/* ==================================================
   Dashboard Initialization
================================================== */

function initializeDashboard() {
  initializeGreeting();

  initializeQuickActions();

  initializeDailyGoal();

  initializeQuote();

  initializePomodoro();

  initializeModules();
}

/* ==================================================
   Safe Module Loader
================================================== */

function initializeModules() {
  run(loadStatistics);

  run(loadContinueLearning);

  run(loadSubjectProgress);

  run(loadPlanner);

  run(loadFavorites);

  run(loadRecentActivity);

  run(loadAchievements);

  run(drawQuizChart);

  run(drawStudyHeatmap);
}

function run(fn) {
  if (typeof fn !== "function") return;

  try {
    fn();
  } catch (error) {
    console.error(`${fn.name} failed`, error);
  }
}

/* ==================================================
   Greeting
================================================== */

function initializeGreeting() {
  const greeting = document.getElementById("welcomeMessage");

  if (!greeting) return;

  const hour = new Date().getHours();

  let text = "Welcome";

  if (hour < 12) {
    text = "Good Morning ☀️";
  } else if (hour < 17) {
    text = "Good Afternoon 🌤️";
  } else {
    text = "Good Evening 🌙";
  }

  greeting.textContent = text;
}

/* ==================================================
   Daily Goal
================================================== */

function initializeDailyGoal() {
  const progress = document.getElementById("goalProgressBar");

  const text = document.getElementById("goalText");

  if (!progress || !text) return;

  const completed = Number(localStorage.getItem("completedToday")) || 0;

  const target = 5;

  const percentage = Math.min((completed / target) * 100, 100);

  progress.style.width = percentage + "%";

  text.textContent = `${completed}/${target} Chapters`;
}

/* ==================================================
   Quote
================================================== */

function initializeQuote() {
  const quote = document.getElementById("dailyQuote");

  if (!quote) return;

  const quotes = [
    "Success is the sum of small efforts repeated every day.",
    "Consistency beats motivation.",
    "Every solved problem makes you stronger.",
    "Dreams work only when you work.",
    "Small progress is still progress.",
    "Discipline creates freedom.",
    "Today's hard work is tomorrow's rank.",
  ];

  quote.textContent = quotes[new Date().getDate() % quotes.length];
}

/* ==================================================
   Quick Actions
================================================== */

function initializeQuickActions() {
  const actions = document.querySelectorAll(".action-card");

  if (actions.length < 4) return;

  actions[0].addEventListener("click", resumeLearning);

  actions[1].addEventListener("click", () => {
    scrollToSection("plannerContent");
  });

  actions[2].addEventListener("click", () => {
    window.location.href = "quiz.html";
  });

  actions[3].addEventListener("click", () => {
    scrollToSection("favoritesContainer");
  });
}

function resumeLearning() {
  const chapter = JSON.parse(localStorage.getItem("lastOpenedChapter"));

  if (!chapter) {
    alert("No chapter available.");
    return;
  }

  window.location.href = chapter.url;
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
  });
}

/* ==================================================
   Pomodoro Timer
================================================== */

let timer = null;

let timeLeft = 25 * 60;

let timerRunning = false;

function initializePomodoro() {
  updateTimerDisplay();

  document.getElementById("startTimer").onclick = startTimer;
  document.getElementById("pauseTimer").onclick = pauseTimer;
  document.getElementById("resetTimer").onclick = resetTimer;
}

function startTimer() {
  if (timerRunning) return;

  timerRunning = true;

  timer = setInterval(() => {
    timeLeft--;

    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);

      timerRunning = false;

      alert("Pomodoro Completed!");

      timeLeft = 25 * 60;

      updateTimerDisplay();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);

  timerRunning = false;
}

function resetTimer() {
  clearInterval(timer);

  timerRunning = false;

  timeLeft = 25 * 60;

  updateTimerDisplay();
}

function updateTimerDisplay() {
  const display = document.getElementById("timerDisplay");

  if (!display) return;

  const minutes = Math.floor(timeLeft / 60);

  const seconds = timeLeft % 60;

  display.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
