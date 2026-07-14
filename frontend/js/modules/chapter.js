document.addEventListener("DOMContentLoaded", loadChapter);
async function loadChapter() {
    try {
        const params = new URLSearchParams(window.location.search);

        const subject = params.get("subject");
        const chapterId = params.get("id");

        console.log("Subject :",subject);
        console.log("Chapter: ",chapterId);

        const response = await fetch(`../data/${subject}/${chapterId}.json`);

        if (!response.ok) {
            throw new Error("Chapter not found");
        }
        const chapter = await response.json();
    
        console.log(chapter);
        renderHeader(chapter);
    } catch (error) {
        console.error(error);
    }
}

function renderHeader(chapter) {
    const header = document.getElementById("chapterHeader");

    header.innerHTML = `
        <h1>${chapter.title}</h1>

        <p>${chapter.subject} • ${chapter.unit}</p>

        <div class="chapter-meta">
            <span>⭐ Weightage ${"★".repeat(chapter.weightage)}</span>

            <span>📈 Difficulty ${"★".repeat(chapter.difficulty)}</span>

            <span>⏱ ${chapter.estimatedHours} Hours</span>
        </div>
    `;
}
