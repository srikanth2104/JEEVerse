document.addEventListener("DOMContentLoaded", loadBookmarks);

function loadBookmarks() {
  const container = document.getElementById("bookmarkContainer");

  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  container.innerHTML = "";

  if (bookmarks.length === 0) {
    container.innerHTML = `
            <div class="content-card">

                <h2>No bookmarks yet.</h2>

                <p>
                    Bookmark revision notes to see them here.
                </p>

            </div>
        `;

    return;
  }

  bookmarks.forEach((bookmark, index) => {
    container.innerHTML += `

        <div class="content-card">

            <h2>${bookmark.title}</h2>

            <p>${bookmark.content}</p>

            <p>

                <strong>

                    ${bookmark.subject}

                </strong>

                • ${bookmark.chapter}

            </p>

            <button
                class="btn btn-primary openBtn"
                data-subject="${bookmark.subject.toLowerCase()}"
                data-chapter="${bookmark.chapter.toLowerCase()}">

                Open Chapter

            </button>

            <button
                class="btn btn-secondary removeBtn"
                data-index="${index}">

                Remove

            </button>

        </div>

        `;
  });

  registerButtons();
}

function registerButtons() {
  document.querySelectorAll(".removeBtn").forEach((button) => {
    button.onclick = () => {
      removeBookmark(button.dataset.index);
    };
  });

  document.querySelectorAll(".openBtn").forEach((button) => {
    button.onclick = () => {
      const subject = button.dataset.subject;

      const chapter = button.dataset.chapter.replace(/\s+/g, "-");

      window.location.href = `chapter.html?subject=${subject}&id=${chapter}`;
    };
  });
}

function removeBookmark(index) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  bookmarks.splice(index, 1);

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  loadBookmarks();
}

