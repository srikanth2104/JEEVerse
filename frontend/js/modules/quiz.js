document.addEventListener("DOMContentLoaded", initializeQuiz);
let timerInterval;
let timeRemaining = 300; // 5 minutes
let currentSubject = "physics";
let currentQuiz = null;

function initializeQuiz() {
  initializeSubjectButtons();

  loadChapters("physics");

  document
    .getElementById("chapterSelect")
    .addEventListener("change", toggleStartButton);

  document.getElementById("startQuizBtn").addEventListener("click", startQuiz);

  document.getElementById("submitQuiz").addEventListener("click", submitQuiz);
}

function initializeSubjectButtons() {
  const buttons = document.querySelectorAll(".subject-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-secondary");
      });

      button.classList.remove("btn-secondary");
      button.classList.add("btn-primary");

      currentSubject = button.dataset.subject;

      loadChapters(currentSubject);
    });
  });
}

async function loadChapters(subject) {
  const select = document.getElementById("chapterSelect");

  select.innerHTML = `
    <option value="">
      Loading...
    </option>
  `;

  document.getElementById("startQuizBtn").disabled = true;

  try {
    const response = await fetch(`../data/${subject}/chapters.json`);

    if (!response.ok) {
      throw new Error("No chapters found.");
    }

    const chapters = await response.json();

    select.innerHTML = `
      <option value="">
        Select Chapter
      </option>
    `;

    chapters.forEach((chapter) => {
      select.innerHTML += `
        <option value="${chapter.slug}">
          ${chapter.name}
        </option>
      `;
    });
  } catch (error) {
    console.error(error);

    select.innerHTML = `
      <option value="">
        No chapters available
      </option>
    `;
  }
}

function toggleStartButton() {
  const chapter = document.getElementById("chapterSelect").value;

  document.getElementById("startQuizBtn").disabled = chapter === "";
}

async function startQuiz() {
  const chapter = document.getElementById("chapterSelect").value;

  if (!chapter) return;

  try {
    const response = await fetch(
      `../data/quizzes/${currentSubject}/${chapter}.json`,
    );

    if (!response.ok) {
      throw new Error("Quiz not found.");
    }

    const quiz = await response.json();
    currentQuiz = quiz;

    renderQuiz(quiz);
    document.getElementById("submitQuiz").disabled = false;
    document.getElementById("quizResult").innerHTML = "";

    startTimer();
  } catch (error) {
    alert("Quiz not available yet.");

    console.error(error);
  }
}

function renderQuiz(quiz) {
  const container = document.getElementById("quizContainer");

  container.innerHTML = "";

  quiz.questions.forEach((question, index) => {
    let options = "";

    question.options.forEach((option, optionIndex) => {
      options += `
        <label>

          <input
            type="radio"
            name="q${index}"
            value="${optionIndex}">

          ${option}

        </label>

        <br>
      `;
    });

    container.innerHTML += `

      <div class="quiz-question" id="question${index}">

        <h3>
          Q${index + 1}. ${question.question}
        </h3>

        ${options}

      </div>

    `;
  });
}

function startTimer() {
  clearInterval(timerInterval);

  timeRemaining = 300;

  updateTimer();

  timerInterval = setInterval(() => {
    timeRemaining--;

    updateTimer();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);

      alert("Time is up!");

      document.getElementById("submitQuiz").click();
    }
  }, 1000);
}

function updateTimer() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function submitQuiz() {
  clearInterval(timerInterval);

  if (!currentQuiz) return;

  let score = 0;

  currentQuiz.questions.forEach((question, index) => {
    const options = document.querySelectorAll(`input[name="q${index}"]`);
    const selected = document.querySelector(`input[name="q${index}"]:checked`);

    options.forEach((option) => {
      option.disabled = true;
      const label = option.parentElement;

      if (Number(option.value) === question.answer) {
        label.style.background = "#d4edda";
        label.style.border = "2px solid #28a745";
      }
    });

    if (selected) {
      if (Number(selected.value) === question.answer) {
        score++;
      } else {
        selected.parentElement.style.background = "#f8d7da";
        selected.parentElement.style.border = "2px solid #dc3545";
      }
    }

    const container = document.getElementById(`question${index}`);

    container.innerHTML = `
      <p class="correct-answer">
        ✅ Correct Answer:
        <strong>${question.options[question.answer]}</strong>
      </p>
    `;
  });

  const result = document.getElementById("quizResult");
  const report = generatePerformanceReport(
    score, currentQuiz.questions.length
  );
  result.innerHTML = `
      <div class="content-card">
        <h2>Quiz Completed</h2>
        <h3>Score: ${score}/${currentQuiz.questions.length}</h3>
        <h3>${report.percentage}%</h3>
        <h3>${report.level}</h3>
        <p>${report.message}</p>
      </div>
  `;

  saveQuizScore(score);
  saveQuizHistory(
    score, currentQuiz.questions.length
  );

  document.getElementById("submitQuiz").disabled = true;
}

function saveQuizScore(score) {
  const chapter = document.getElementById("chapterSelect").value;

  const key = `${currentSubject}-${chapter}`;

  const quizScores = JSON.parse(localStorage.getItem("quizScores")) || {};

  quizScores[key] = score;

  localStorage.setItem("quizScores", JSON.stringify(quizScores));
}

function saveQuizHistory(score, totalQuestions) {
  const chapter = document.getElementById("chapterSelect").value;

  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];

  history.push({
    subject: currentSubject,

    chapter,

    score,

    total: totalQuestions,

    percentage: Math.round((score * 100) / totalQuestions),

    date: new Date().toLocaleString(),
  });

  localStorage.setItem("quizHistory", JSON.stringify(history));
}

function generatePerformanceReport(score, totalQuestions) {
  const percentage = Math.round((score / totalQuestions) * 100);

  let level = "";
  let message = "";

  if (percentage >= 90) {
    level = "Excellent 🌟";

    message = "Outstanding! You have mastered this chapter.";
  } else if (percentage >= 70) {
    level = "Good 👍";

    message = "Good understanding. Revise weak areas once.";
  } else if (percentage >= 50) {
    level = "Average ⚠";

    message = "Needs more practice before moving ahead.";
  } else {
    level = "Needs Improvement ❌";

    message = "Revise the chapter thoroughly and attempt again.";
  }

  return {
    percentage,
    level,
    message,
  };
}