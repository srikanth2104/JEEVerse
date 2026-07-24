/*
====================================================
JEEVerse Achievement Manager
====================================================
*/

const achievements = [
  {
    id: "first_chapter",
    title: "First Step",
    description: "Complete your first chapter.",
    icon: "🎯",
    check: () => {
      const completed =
        JSON.parse(localStorage.getItem("completedChapters")) || [];

      return completed.length >= 1;
    },
  },

  {
    id: "ten_chapters",
    title: "Consistent Learner",
    description: "Complete 10 chapters.",
    icon: "📚",
    check: () => {
      const completed =
        JSON.parse(localStorage.getItem("completedChapters")) || [];

      return completed.length >= 10;
    },
  },

  {
    id: "hundred_xp",
    title: "XP Hunter",
    description: "Earn 100 XP.",
    icon: "⭐",
    check: () => {
      const xp = Number(localStorage.getItem("xp")) || 0;

      return xp >= 100;
    },
  },

  {
    id: "five_hundred_xp",
    title: "JEE Warrior",
    description: "Earn 500 XP.",
    icon: "🚀",
    check: () => {
      const xp = Number(localStorage.getItem("xp")) || 0;

      return xp >= 500;
    },
  },

  {
    id: "streak_7",
    title: "Weekly Streak",
    description: "Study for 7 consecutive days.",
    icon: "🔥",
    check: () => {
      const streak = Number(localStorage.getItem("studyStreak")) || 0;

      return streak >= 7;
    },
  },

  {
    id: "streak_30",
    title: "Discipline Master",
    description: "Study for 30 consecutive days.",
    icon: "🏅",
    check: () => {
      const streak = Number(localStorage.getItem("studyStreak")) || 0;

      return streak >= 30;
    },
  },
];

/*
====================================================
Load Dashboard Achievements
====================================================
*/

function loadAchievements() {
  const container = document.getElementById("achievementGrid");

  if (!container) return;

  let unlocked = JSON.parse(localStorage.getItem("achievements")) || [];

  achievements.forEach((achievement) => {
    if (achievement.check() && !unlocked.includes(achievement.id)) {
      unlocked.push(achievement.id);
    }
  });

  localStorage.setItem("achievements", JSON.stringify(unlocked));

  container.innerHTML = "";

  achievements.forEach((achievement) => {
    const isUnlocked = unlocked.includes(achievement.id);

    container.innerHTML += `

        <div class="achievement-card ${isUnlocked ? "unlocked" : "locked"}">

            <h1>${achievement.icon}</h1>

            <h3>${achievement.title}</h3>

            <p>${achievement.description}</p>

            <strong>

                ${isUnlocked ? "Unlocked ✅" : "Locked 🔒"}

            </strong>

        </div>

        `;
  });
}
