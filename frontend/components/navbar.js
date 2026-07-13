function Navbar() {
  return `
    <nav class="navbar">
    <div class="container nav-container">
        <div class="logo">
            📘 <span>JEEVerse</span>
        </div>

        <ul class="nav-links">

            <li><a class="active" href="index.html">Home</a></li>

            <li><a href="pages/dashboard.html">Dashboard</a></li>

            <li><a href="pages/subjects.html">Subjects</a></li>

            <li><a href="pages/formula-book.html">Formula Book</a></li>

            <li><a href="pages/planner.html">Planner</a></li>

            <li><a href="pages/about.html">About</a></li>

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
