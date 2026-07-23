document.addEventListener("DOMContentLoaded", initializeSearch);

async function initializeSearch() {
  const searchInput = document.getElementById("globalSearch");

  const results = document.getElementById("searchResults");

  if (!searchInput || !results) return;

  const response = await fetch("../data/search.json");
  const chapters = await response.json();

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    results.innerHTML = "";

    if (!query) return;

    const filtered = chapters.filter((chapter) =>
      chapter.title.toLowerCase().includes(query),
    );

    filtered.forEach((chapter) => {
      results.innerHTML += `
                <div class="search-item"
                     onclick="window.location.href='${chapter.url}'">

                    ${chapter.title}

                </div>
            `;
    });
  });
}
