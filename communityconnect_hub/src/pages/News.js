import React, { useEffect, useState } from "react";

/**
 * Fetches live local Chennai news headlines from NewsAPI.org using public/demo API key.
 * Displays headlines with error/loading state and applies CommunityConnect Hub's dark theme.
 * Note: For demonstration, uses NewsAPI public demo key. For production, use your own key.
 */

// PUBLIC_INTERFACE
function News() {
  /**
   * Fetches and displays live Chennai news using NewsAPI.org (demo key).
   * Dark mode, card-style, modern layout.
   */
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // NewsAPI demo key and endpoint for Chennai; safe for public demo.
  const API_KEY = "9f751c7a39ee44b9a3a040882c3b1263"; // See: https://newsapi.org/
  const CITY_QUERY = "Chennai";
  const API_URL = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(
    CITY_QUERY
  )}&country=in&apiKey=${API_KEY}&pageSize=10`;

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news feed");
        return res.json();
      })
      .then((data) => {
        if (!data.articles || data.status !== "ok") {
          throw new Error("News data format error");
        }
        setArticles(data.articles);
        setLoading(false);
      })
      .catch(() => {
        setFetchError(
          "Unable to load news at this time. Please try again later."
        );
        setLoading(false);
      });
      // eslint-disable-next-line
  }, []);

  let content;
  if (loading) {
    content = (
      <div style={{ color: "var(--cch-text-muted)", textAlign: "center", marginTop: 17 }}>
        Loading live news for Chennai...
      </div>
    );
  } else if (fetchError) {
    content = (
      <div
        style={{
          color: "var(--primary)",
          textAlign: "center",
          fontWeight: 600,
          padding: "17px 0 5px 0",
        }}
      >
        {fetchError}
      </div>
    );
  } else if (!articles.length) {
    content = (
      <div
        style={{
          color: "var(--cch-text-muted)",
          textAlign: "center",
          fontStyle: "italic",
          marginTop: 16,
        }}
      >
        No current Chennai news stories found.
      </div>
    );
  } else {
    // Show list of news using modern card/dark styles
    content = (
      <ul className="cch-news-list">
        {articles.map((item, idx) => (
          <li className="cch-news-article" key={idx}>
            <a
              href={item.url}
              className="cch-news-title"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={0}
            >
              {item.title}
            </a>
            {item.description && (
              <span className="cch-news-summary">{item.description}</span>
            )}
            <div className="cch-news-meta">
              <span className="cch-news-source">
                {item.source?.name || "News"}
              </span>
              <span className="cch-news-date">
                {item.publishedAt
                  ? new Date(item.publishedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section
        className="cch-section cch-news"
        style={{ maxWidth: 550, margin: "0 auto" }}
      >
        <h2 className="cch-section-title" style={{ color: "var(--primary)" }}>
          News Feed
        </h2>
        {content}
        <div
          style={{
            marginTop: 20,
            textAlign: "right",
            fontSize: "0.91rem",
            color: "var(--cch-text-muted)",
          }}
        >
          Data powered by{" "}
          <a
            href="https://newsapi.org/"
            style={{ color: "var(--accent)" }}
            tabIndex={-1}
            target="_blank"
            rel="noopener noreferrer"
          >
            NewsAPI.org
          </a>
        </div>
      </section>
    </div>
  );
}

export default News;
