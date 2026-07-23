let searchData = [];

/*
    Load search database
*/
async function loadSearchData() {
  if (searchData.length > 0) {
    return searchData;
  }

  try {
    const response = await fetch("data/search.json");

    if (!response.ok) {
      throw new Error("Unable to load search database.");
    }

    searchData = await response.json();

    return searchData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/*
    Search database
*/
async function searchDatabase(query) {
  await loadSearchData();

  query = query.toLowerCase().trim();

  if (!query) return [];

  return searchData
    .map((item) => {
      let score = 0;

      const title = item.title.toLowerCase();
      const subject = item.subject.toLowerCase();
      const keywords = (item.keywords || []).join(" ").toLowerCase();

      if (title === query) {
        score = 100;
      } else if (title.startsWith(query)) {
        score = 80;
      } else if (title.includes(query)) {
        score = 60;
      } else if (subject.includes(query)) {
        score = 40;
      } else if (keywords.includes(query)) {
        score = 20;
      }

      return {
        ...item,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}
