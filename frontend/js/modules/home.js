document.addEventListener("DOMContentLoaded", initializeHomeSearch);

let selectedIndex = -1;
let currentResults = [];

/* --------------------------
   Highlight Search Text
-------------------------- */

function highlightText(text, keyword) {
  if (!keyword) return text;

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}

/* --------------------------
   Initialize
-------------------------- */

async function initializeHomeSearch() {
  const input = document.getElementById("homeSearch");
  const results = document.getElementById("homeSearchResults");

  if (!input || !results) return;

  await loadSearchData();

  input.addEventListener("focus", () => {
    if (input.value.trim() === "") {
      showRecentSearches();
    }
  });

  input.addEventListener("input", () => performSearch(input.value));

  input.addEventListener("keydown", handleKeyboard);

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".hero-search")) {
      results.style.display = "none";
    }
  });
}

/* --------------------------
   Search
-------------------------- */

async function performSearch(query) {
  const results = document.getElementById("homeSearchResults");

  query = query.trim();

  results.style.display = "block";

  if (query.length < 2) {
    showRecentSearches();
    return;
  }

  results.innerHTML = `
<div class="search-item">
Searching...
</div>
`;

  const matches = await searchDatabase(query);

  currentResults = matches.slice(0, 8);

  selectedIndex = -1;

  renderResults(currentResults, query);
}

/* --------------------------
   Render Search Results
-------------------------- */

function renderResults(items, query) {
  const results = document.getElementById("homeSearchResults");

  results.innerHTML = "";

  if (items.length === 0) {
    results.innerHTML = `
<div class="search-item">
<strong>No Results Found</strong>
</div>
`;
    return;
  }

  items.forEach((item) => {
    results.innerHTML += `
<div class="search-item">

<a href="pages/${item.url}"
   onclick='saveRecentSearch(${JSON.stringify(item)});'>

<div class="search-title">

<strong>
${highlightText(item.title, query)}
</strong>

<span class="search-badge">
${item.subject}
</span>

</div>

<small>${item.type || "Chapter"}</small>

</a>

</div>
`;
  });

  results.style.display = "block";
}

/* --------------------------
   Keyboard Navigation
-------------------------- */

function handleKeyboard(event) {
  const items = document.querySelectorAll(".search-item");

  if (items.length === 0) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();

      selectedIndex++;

      if (selectedIndex >= items.length) selectedIndex = 0;

      updateSelection(items);

      break;

    case "ArrowUp":
      event.preventDefault();

      selectedIndex--;

      if (selectedIndex < 0) selectedIndex = items.length - 1;

      updateSelection(items);

      break;

    case "Enter":
      event.preventDefault();

      if (currentResults.length === 0) return;

      if (selectedIndex === -1) selectedIndex = 0;

      const item = currentResults[selectedIndex];

      saveRecentSearch(item);

      window.location.href = `pages/${item.url}`;

      break;

    case "Escape":
      document.getElementById("homeSearchResults").style.display = "none";

      selectedIndex = -1;

      break;
  }
}

/* --------------------------
   Highlight Selected Item
-------------------------- */

function updateSelection(items) {
  items.forEach((item) => item.classList.remove("selected"));

  if (selectedIndex >= 0) {
    items[selectedIndex].classList.add("selected");

    items[selectedIndex].scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }
}

/* --------------------------
   Recent Searches
-------------------------- */

function saveRecentSearch(item) {
  let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];

  recent = recent.filter((search) => search.title !== item.title);

  recent.unshift({
    title: item.title,
    url: item.url,
    subject: item.subject,
    type: item.type || "Chapter",
  });

  if (recent.length > 5) recent.pop();

  localStorage.setItem("recentSearches", JSON.stringify(recent));
}

/* --------------------------
   Show Recent Searches
-------------------------- */

function showRecentSearches() {
  const results = document.getElementById("homeSearchResults");

  let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];

  results.innerHTML = "";

  if (recent.length === 0) {
    results.style.display = "none";
    return;
  }

  recent.forEach((item) => {
    results.innerHTML += `
<div class="search-item">

<a href="pages/${item.url}"
   onclick='saveRecentSearch(${JSON.stringify(item)});'>

🕘 ${item.title}

</a>

</div>
`;
  });

  results.style.display = "block";
}
