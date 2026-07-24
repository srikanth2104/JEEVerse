const STORAGE_KEY = "unlockedChapters";

function getUnlockedChapters() {
  return (
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      physics: ["kinematics"],
      chemistry: [],
      mathematics: [],
    }
  );
}

function saveUnlockedChapters(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function unlockNextChapter(subject, currentSlug, chapters) {
  const unlocked = getUnlockedChapters();

  const currentIndex = chapters.findIndex(
    (chapter) => chapter.slug === currentSlug,
  );

  if (currentIndex === -1) return;

  const nextChapter = chapters[currentIndex + 1];

  if (!nextChapter) return;

  if (!unlocked[subject].includes(nextChapter.slug)) {
    unlocked[subject].push(nextChapter.slug);

    saveUnlockedChapters(unlocked);
  }
}

function isChapterUnlocked(subject, slug) {
  const unlocked = getUnlockedChapters();

  return unlocked[subject]?.includes(slug);
}
