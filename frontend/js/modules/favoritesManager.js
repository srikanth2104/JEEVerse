/*
====================================================
JEEVerse Favorites Manager
====================================================
*/

/*
-----------------------------------------
Add Favorite
-----------------------------------------
*/

function addFavorite(chapter) {
  if (!chapter || !chapter.title) return;

  let favorites = JSON.parse(localStorage.getItem("favoriteChapters")) || [];

  const exists = favorites.some((item) => item.title === chapter.title);

  if (exists) return;

  favorites.push({
    title: chapter.title,

    subject: chapter.subject,

    url: chapter.url,

    addedOn: new Date().toISOString(),
  });

  localStorage.setItem("favoriteChapters", JSON.stringify(favorites));

  loadFavorites();
}

/*
-----------------------------------------
Remove Favorite
-----------------------------------------
*/

function removeFavorite(title) {
  let favorites = JSON.parse(localStorage.getItem("favoriteChapters")) || [];

  favorites = favorites.filter((chapter) => chapter.title !== title);

  localStorage.setItem("favoriteChapters", JSON.stringify(favorites));

  loadFavorites();
}

/*
-----------------------------------------
Check Favorite
-----------------------------------------
*/

function isFavorite(title) {
  const favorites = JSON.parse(localStorage.getItem("favoriteChapters")) || [];

  return favorites.some((chapter) => chapter.title === title);
}

/*
-----------------------------------------
Dashboard Favorites
-----------------------------------------
*/

function loadFavorites() {
  const container = document.getElementById("favoritesContainer");

  if (!container) return;

  const favorites = JSON.parse(localStorage.getItem("favoriteChapters")) || [];

  if (favorites.length === 0) {
    container.innerHTML = `

        <div class="empty-card">

            <h3>No Favorite Chapters</h3>

            <p>

                Click the ⭐ button while reading a chapter.

            </p>

        </div>

        `;

    return;
  }

  container.innerHTML = "";

  favorites.forEach((chapter) => {
    container.innerHTML += `

        <div class="favorite-card">

            <h3>${chapter.title}</h3>

            <p>${chapter.subject}</p>

            <div
                style="
                    display:flex;
                    gap:12px;
                    margin-top:18px;
                ">

                <a
                    href="${chapter.url}"
                    class="btn btn-primary">

                    Open

                </a>

                <button
                    class="btn btn-secondary"
                    onclick="removeFavorite('${chapter.title}')">

                    Remove

                </button>

            </div>

        </div>

        `;
  });
}
