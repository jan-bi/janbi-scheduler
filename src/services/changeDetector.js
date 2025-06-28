const SCRAPER_URL = process.env.SCRAPER_URL || "http://localhost:3001/scrape";

export default async function detectChanges(savedUrl, previousValues = {}) {
  const { url, selectors } = savedUrl;

  try {
    const scraperResponse = await fetch(SCRAPER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, selectors }),
    });

    const scrapeResult = await scraperResponse.json();

    if (!scraperResponse.ok || !scrapeResult.success) {
      console.error("스크래퍼 서버 응답 오류", scrapeResult.message || scraperResponse.statusText);

      return {
        isChanged: false,
        changedSelectors: [],
        changedContents: [],
      };
    }

    const changedSelectors = [];
    const changedContents = [];

    for (const { selector, value: after, tag } of scrapeResult.data) {
      const before = previousValues[selector] || "";

      changedContents.push({ selector, beforeHtml: before, afterHtml: after, tag });

      if (before !== after) {
        changedSelectors.push(selector);
      }
    }

    return {
      isChanged: changedSelectors.length > 0,
      changedSelectors,
      changedContents,
    };
  } catch (err) {
    console.error("스크래핑 요청 중 오류 발생:", err);

    return {
      isChanged: false,
      changedSelectors: [],
      changedContents: [],
    };
  }
}
