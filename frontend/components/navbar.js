function Navbar() {
  // Detect whether we are on index.html or inside /pages/
  const isHome =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/frontend/");

  const prefix = isHome ? "" : "../";

  return `
    <nav class="navbar">
      <div class="container nav-container">

        <div class="logo">
          📘 <span>JEEVerse</span>
        </div>

        <ul class="nav-links">

          <li><a href="${prefix}index.html">Home</a></li>

          <li><a href="${prefix}pages/dashboard.html">Dashboard</a></li>

          <li><a href="${prefix}pages/subjects.html">Subjects</a></li>

          <li><a href="${prefix}pages/formula-book.html">Formula Book</a></li>

          <li><a href="${prefix}pages/revision-planner.html">Planner</a></li>

          <li><a href="${prefix}pages/achievements.html">Achievements</a></li>

          <li><a href="${prefix}pages/about.html">About</a></li>

        </ul>

        <div class="nav-actions">

          <button class="search-btn">🔍</button>

          <button class="theme-btn">🌙</button>

          <button class="menu-btn">☰</button>

        </div>

      </div>
    </nav>
  `;
}

// Insert navbar automatically
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");

  if (navbar) {
    navbar.innerHTML = Navbar();
  }
});
