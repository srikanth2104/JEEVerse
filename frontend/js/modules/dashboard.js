document.addEventListener("DOMContentLoaded", loadDashboard);

function loadDashboard() {
    loadStatistics();
    loadContinueLearning();
    loadRecentActivity();
    loadSubjectProgress();
}

function loadStatistics() {
    const completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

    document.getElementById("completedCount").textContent = completed.length;

    document.getElementById("studyHours").textContent = completed.length * 2;

    document.getElementById("currentStreak").textContent = 1;

    document.getElementById("revisionPending").textContent =
        Math.max(0, 95 - completed.length);
}

function loadContinueLearning() {
    const lastChapter = JSON.parse(localStorage.getItem("lastChapter"));

    if (!lastChapter) {
        document.getElementById("resumeBtn").disabled = true;
        return;
    }

    document.getElementById("continueTitle").textContent =
        lastChapter.title;
    
    document.getElementById("resumeBtn").addEventListener("click", () => {
        window.location.href =
            `chapter.html?subject=${lastChapter.subject}&id=${lastChapter.id}`;
    });
}

function loadRecentActivity() {
    const activity = JSON.parse(localStorage.getItem("activity")) || [];
    const list = document.getElementById("activityList");

    if (activity.length === 0) {
        list.innerHTML = "No activity yet.";
        return;
    }

    list.innerHTML = "";
    activity.slice().reverse().forEach(item => {
        const div = document.createElement("div");
        div.className = "activity-item";

        div.innerHTML = `
            <p>✅ ${item}</p>
        `;

        list.appendChild(div);
    });
}

function loadSubjectProgress() {
    const completed = JSON.parse(localStorage.getItem("completedChapters")) || [];

    const totals = {
        physics: 6,
        chemistry: 6,
        mathematics: 6
    };

    updateSubject("physics", totals.physics);
    updateSubject("chemistry", totals.chemistry);
    updateSubject("math", totals.mathematics);

    function updateSubject(subject, total) {
        const count = completed.filter(chapter => chapter.startsWith(subject + "-")).length;

        const percent = Math.round((count / total) * 100);

        document.getElementById(subject + "Percent").textContent =
          percent + "%";

        document.getElementById(subject + "Bar").style.width = percent + "%";
    }
}