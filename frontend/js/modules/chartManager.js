/*
====================================================
JEEVerse Chart Manager
====================================================
*/

/* ===========================================
   Quiz Performance Line Chart
=========================================== */

function loadQuizStatistics() {
  let quizData = JSON.parse(localStorage.getItem("quizScores"));

  if (!quizData || quizData.length === 0) {
    quizData = [65, 72, 80, 78, 85, 91];

    localStorage.setItem("quizScores", JSON.stringify(quizData));
  }

  return quizData;
}

function drawQuizChart() {
  const canvas = document.getElementById("quizChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const data = loadQuizStatistics();

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const padding = 50;

  /* ---------- Axes ---------- */

  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  /* ---------- Labels ---------- */

  ctx.font = "14px Arial";
  ctx.fillStyle = "#6b7280";

  for (let i = 0; i <= 100; i += 20) {
    const y = height - padding - ((height - padding * 2) * i) / 100;

    ctx.fillText(i, 15, y + 5);

    ctx.beginPath();
    ctx.moveTo(padding - 5, y);
    ctx.lineTo(width - padding, y);
    ctx.strokeStyle = "#eeeeee";
    ctx.stroke();
  }

  /* ---------- Plot ---------- */

  const step = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 3;

  ctx.beginPath();

  data.forEach((score, index) => {
    const x = padding + index * step;

    const y = height - padding - ((height - padding * 2) * score) / 100;

    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  /* ---------- Points ---------- */

  data.forEach((score, index) => {
    const x = padding + index * step;

    const y = height - padding - ((height - padding * 2) * score) / 100;

    ctx.beginPath();

    ctx.fillStyle = "#2563eb";

    ctx.arc(x, y, 5, 0, Math.PI * 2);

    ctx.fill();

    ctx.fillStyle = "#111827";

    ctx.fillText(score, x - 8, y - 12);
  });
}

/* ===========================================
   Study Heatmap
=========================================== */

function drawStudyHeatmap() {
  const container = document.getElementById("studyHeatmap");

  if (!container) return;

  let heatmap = JSON.parse(localStorage.getItem("studyHeatmap"));

  if (!heatmap || heatmap.length === 0) {
    heatmap = [1, 3, 0, 2, 4, 5, 2];

    localStorage.setItem("studyHeatmap", JSON.stringify(heatmap));
  }

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  container.innerHTML = "";

  days.forEach((day, index) => {
    const value = heatmap[index];

    let color = "#e5e7eb";

    if (value === 1) color = "#bfdbfe";

    if (value === 2) color = "#93c5fd";

    if (value === 3) color = "#60a5fa";

    if (value === 4) color = "#3b82f6";

    if (value >= 5) color = "#2563eb";

    container.innerHTML += `

        <div
            style="
                display:inline-flex;
                flex-direction:column;
                align-items:center;
                margin:10px;
            ">

            <div
                style="
                    width:45px;
                    height:45px;
                    border-radius:10px;
                    background:${color};
                ">
            </div>

            <small>${day}</small>

        </div>

        `;
  });
}
