document.addEventListener("DOMContentLoaded", loadRevisionPlanner);

function loadRevisionPlanner() {
  const container = document.getElementById("revisionPlannerContainer");

  const revisionData = JSON.parse(localStorage.getItem("revisionData")) || {};

  if (Object.keys(revisionData).length === 0) {
    container.innerHTML = `
            <div class="content-card">

                <h2>No Revisions Scheduled</h2>

                <p>
                    Complete chapters to generate your
                    revision plan.
                </p>

            </div>
        `;

    return;
  }

  container.innerHTML = "";

  Object.entries(revisionData).forEach(([key, value]) => {
    const [subject, chapter] = key.split("-");

    const nextRevision = new Date(value.nextRevision);

    const today = new Date();

    const overdue = nextRevision <= today;

    container.innerHTML += `

        <div class="content-card">

            <h2>${chapter.replace("-", " ")}</h2>

            <p><strong>Subject:</strong> ${capitalize(subject)}</p>

            <p>
                <strong>Next Revision:</strong>
                ${nextRevision.toDateString()}
            </p>

            <p style="color:${overdue ? "red" : "green"}">

                ${overdue ? "Revision Due" : "Upcoming"}

            </p>

            <button
                class="btn btn-primary"
                onclick="markRevised('${key}')">

                Mark as Revised

            </button>

            <a
                href="chapter.html?subject=${subject}&id=${chapter}"
                class="btn btn-secondary">

                Study Now

            </a>

        </div>

        `;
  });
}

function markRevised(key) {
  const revisionData = JSON.parse(localStorage.getItem("revisionData")) || {};

  revisionData[key].completedOn = new Date().toISOString();

  revisionData[key].interval *= 2;

  revisionData[key].nextRevision =
    Date.now() + revisionData[key].interval * 24 * 60 * 60 * 1000;

  localStorage.setItem("revisionData", JSON.stringify(revisionData));

  loadRevisionPlanner();
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
