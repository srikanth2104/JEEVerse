document.addEventListener("DOMContentLoaded", initializeHomeSearch);
let selectedIndex = -1;
let currentResults = [];

function highlightText(text, keyword) {
  if (!keyword) return text;

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(`(${escapedKeyword})`, "gi");

  return text.replace(regex, "<mark>$1</mark>");
}

async function initializeHomeSearch() {
  const input = document.getElementById("homeSearch");
  const results = document.getElementById("homeSearchResults");
  input.addEventListener("focus", showRecentSearches);
  if (!input || !results) return;

  await loadSearchData();

  input.addEventListener("input", async () => {
    const query = input.value.trim();

    results.style.display = "block";

    results.innerHTML = `
  <div class="search-item">
    Searching...
  </div>
`;

    if (query.length < 2) return;

    const matches = await searchDatabase(query);
    const limitedResults = matches.slice(0, 8);

    currentResults = limitedResults;
    selectedIndex = -1;

    if (limitedResults.length === 0) {
      results.style.display = "block";
      results.innerHTML = `
        <div class="search-item">
          <strong>No results found.</strong>
          <br>
          <small>Try another keyword.</small>
        </div>
      `;
      return;
    }

    results.style.display = "block";

    limitedResults.forEach((item) => {
      results.innerHTML += `
    <div class="search-item">
      <a href="pages/${item.url}" onclick="saveRecentSearch('${item.title}'); 
      document.getElementById('homeSearchResults').style.display='none';">

        <div class="search-title">
          <strong>${highlightText(item.title, query)}</strong>

          <span class="search-badge">
            ${item.subject}
          </span>
        </div>

        <small>${item.type}</small>

      </a>
    </div>
  `;
    });
  });

  input.addEventListener("keydown", (event) => {
    const items = document.querySelectorAll(".search-item");

    if (items.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        selectedIndex++;

        if (selectedIndex >= items.length) {
          selectedIndex = 0;
        }

        updateSelection(items);

        break;

      case "ArrowUp":
        event.preventDefault();

        selectedIndex--;

        if (selectedIndex < 0) {
          selectedIndex = items.length - 1;
        }

        updateSelection(items);

        break;

      case "Enter":
        if (selectedIndex >= 0) {
          event.preventDefault();

          const link = items[selectedIndex].querySelector("a");

          if (link) {
            const title = currentResults[selectedIndex].title;

            saveRecentSearch(title);
            input.value = "";
            results.style.display = "none";

            window.location.href = link.href;
          }
        }

        break;

      case "Escape":
        results.style.display = "none";
        selectedIndex = -1;
        break;
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".hero-search")) {
      results.style.display = "none";
    }
  });
}

function updateSelection(items) {
  items.forEach((item) => {
    item.classList.remove("selected");
  });

  if (selectedIndex >= 0) {
    items[selectedIndex].classList.add("selected");

    items[selectedIndex].scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }
}

function saveRecentSearch(title) {
  let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];

  recent = recent.filter((item) => item !== title);

  recent.unshift(title);

  if (recent.length > 5) {
    recent.pop();
  }

  localStorage.setItem("recentSearches", JSON.stringify(recent));
}

function showRecentSearches() {
  const input = document.getElementById("homeSearch");
  const results = document.getElementById("homeSearchResults");

  if (input.value.trim() !== "") return;

  const recent = JSON.parse(localStorage.getItem("recentSearches")) || [];

  if (recent.length === 0) return;

  results.style.display = "block";

  results.innerHTML = "";

  recent.forEach((title) => {
    results.innerHTML += `
      <div class="search-item recent-search">
        🕘 ${title}
      </div>
    `;
  });
}