document.addEventListener("DOMContentLoaded", loadPlanner);
function loadPlanner() {
    const planner = document.getElementById("plannerContent");
    const revisionData = JSON.parse(localStorage.getItem("revisionData")) || {};

    planner.innerHTML = "";
    
    const chapters = Object.keys(revisionData).sort((a, b) => {
        const first = revisionData[a].nextRevision;
        const second = revisionData[b].nextRevision;

        return first - second;
    });

    if (chapters.length === 0) {
        planner.innerHTML = `
            <div class="content-card">
                <h2>No revisions scheduled.</h2>
                <p>
                    Complete a chapter to automatically create your revision plan.
                </p>
            </div>
        `;
        return;
    }

    chapters.forEach(chapterKey => {
        const data = revisionData[chapterKey];

        const parts = chapterKey.split("-");

        const subject = parts[0];

        const chapter = parts[1];

        const completedDate = new Date(data.completedOn);

        const revisionDate = new Date(data.nextRevision);

        const today = new Date();

        const milliSecondsPerDay = 1000 * 60 * 60 * 24;
        const daysLeft = Math.ceil(
            (revisionDate.getTime() - Date.now()) / milliSecondsPerDay
        );

        let status = "";
        let statusClass = "";

        if (daysLeft < 0) {
            status = "Overdue";
            statusClass = "status-overdue";
        } else if (daysLeft === 0) {
            status = "Due Today";
            statusClass = "status-today";
        } else {
            status = "Upcoming";
            statusClass = "status-upcoming";
        }

        planner.innerHTML += `
            <div class="content-card">
                <h2>${chapter}</h2>
                <p><strong>Subject:</strong> ${subject}</p>

                <p><strong>Completed:</strong> ${completedDate.toLocaleDateString()}</p>
                
                <p><strong>Next Revision:</strong>
                    ${revisionDate.toLocaleDateString()}
                </p>

                <p><strong>Days Left:</strong>${daysLeft}</p>

                <p><strong>Status:</strong>
                    <span class="${statusClass}">${status}</span>
                </p>

                <button class="btn btn-primary reviseBtn" data-key="${chapterKey}">
                    Mark as Revised
                </button>
            </div>
        `;
    });

    document.querySelectorAll(".reviseBtn").forEach(button => {
        button.addEventListener("click", () => {
            markRevision(button.dataset.key);
        });
    });
}

function markRevision(chapterKey) {
    
    const revisionData =
        JSON.parse(localStorage.getItem("revisionData")) || {};
    
    const chapter = revisionData[chapterKey];

    const intervals = [3, 7, 14, 30];

    let index = intervals.indexOf(chapter.interval);

    if (index === -1) {
        index = 0;
    }

    if (index < intervals.length - 1) {
        chapter.interval = intervals[index + 1];
    }

    chapter.completedOn = new Date().toISOString();

    chapter.nextRevision = Date.now() + chapter.interval * 24 * 60 * 60 * 1000;

    revisionData[chapterKey] = chapter;

    localStorage.setItem("revisionData", JSON.stringify(revisionData));

    loadPlanner();
}