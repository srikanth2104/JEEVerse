document.addEventListener("DOMContentLoaded", loadPlanner);
function loadPlanner() {
    const revisionData = JSON.parse(localStorage.getItem("revisionData")) || {};

    console.log(revisionData);
}