function updateStudyStreak() {
  const today = new Date().toDateString();

  const lastStudy = localStorage.getItem("lastStudyDate");

  let streak = Number(localStorage.getItem("studyStreak")) || 0;

  if (lastStudy === today) {
    return;
  }

  if (lastStudy) {
    const previous = new Date(lastStudy);

    const difference = (new Date(today) - previous) / (1000 * 60 * 60 * 24);

    if (difference === 1) {
      streak++;
    } else {
      streak = 1;
    }
  } else {
    streak = 1;
  }

  localStorage.setItem("studyStreak", streak);

  localStorage.setItem("lastStudyDate", today);
}
