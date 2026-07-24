/*
====================================
JEEVerse XP System
====================================
*/

const XP_PER_LEVEL = 500;

function getXP() {
  return Number(localStorage.getItem("userXP")) || 0;
}

function saveXP(xp) {
  localStorage.setItem("userXP", xp);
}

function getLevel() {
  return Math.floor(getXP() / XP_PER_LEVEL) + 1;
}

function getLevelProgress() {
  return getXP() % XP_PER_LEVEL;
}

function getXPNeeded() {
  return XP_PER_LEVEL - getLevelProgress();
}

function getLevelTitle(level) {
  if (level >= 50) return "Legend";

  if (level >= 40) return "Grand Master";

  if (level >= 30) return "Master";

  if (level >= 20) return "Expert";

  if (level >= 10) return "Scholar";

  if (level >= 5) return "Learner";

  return "Beginner";
}

function addXP(amount) {
  const previousLevel = getLevel();

  const newXP = getXP() + amount;

  saveXP(newXP);
  showToast(`⭐ +${amount} XP Earned`, "info");

  const currentLevel = getLevel();

  if (currentLevel > previousLevel) {
    showLevelUp(currentLevel);
  }

  updateXPUI();
}

function showLevelUp(level) {
  showToast(`🎉 Level Up! Level ${level} - ${getLevelTitle(level)}`);
}

function updateXPUI() {
  const xp = getXP();

  const level = getLevel();

  const progress = getLevelProgress();

  if (document.getElementById("userLevel")) {
    document.getElementById("userLevel").textContent = level;
  }

  if (document.getElementById("userXP")) {
    document.getElementById("userXP").textContent = xp;
  }

  if (document.getElementById("levelTitle")) {
    document.getElementById("levelTitle").textContent = getLevelTitle(level);
  }

  if (document.getElementById("xpProgress")) {
    document.getElementById("xpProgress").style.width =
      (progress / XP_PER_LEVEL) * 100 + "%";
  }

  if (document.getElementById("xpRemaining")) {
    document.getElementById("xpRemaining").textContent =
      getXPNeeded() + " XP to next level";
  }
}

document.addEventListener("DOMContentLoaded", updateXPUI);
