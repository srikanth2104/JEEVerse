function addXP(amount) {
  let xp = Number(localStorage.getItem("xp")) || 0;

  xp += amount;

  localStorage.setItem("xp", xp);

  updateLevel();
}

function updateLevel() {
  const xp = Number(localStorage.getItem("xp")) || 0;

  const level = Math.floor(xp / 100) + 1;

  localStorage.setItem("level", level);
}

function getXP() {
  return Number(localStorage.getItem("xp")) || 0;
}

function getLevel() {
  return Number(localStorage.getItem("level")) || 1;
}
