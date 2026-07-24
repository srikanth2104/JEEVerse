/*
====================================================
JEEVerse Progress Manager
====================================================
*/

function loadSubjectProgress() {
  const container = document.getElementById("subjectProgress");

  if (!container) return;

  const completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

  /*
        Total chapters in every subject.
        Update these whenever you add chapters.
    */

  const totals = {
    Physics: 30,
    Chemistry: 30,
    Mathematics: 30,
  };

  const completedCount = {
    Physics: 0,
    Chemistry: 0,
    Mathematics: 0,
  };

  completed.forEach((chapter) => {
    if (completedCount.hasOwnProperty(chapter.subject)) {
      completedCount[chapter.subject]++;
    }
  });

  container.innerHTML = "";

  Object.keys(totals).forEach((subject) => {
    const total = totals[subject];

    const done = completedCount[subject];

    const percentage = Math.round((done / total) * 100);

    container.innerHTML += `

        <div class="progress-item">

            <div class="progress-info">

                <span>${subject}</span>

                <span>${percentage}%</span>

            </div>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${percentage}%">
                </div>

            </div>

            <small>

                ${done} / ${total} Chapters Completed

            </small>

        </div>

        `;
  });
}
