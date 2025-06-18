import React, { useEffect, useState } from "react";

/**
 * Fetch live news from NewsAPI.org.
 * Uses demo API key. For production, obtain your own at https://newsapi.org/register.
 * Focuses on Chennai news via 'q=Chennai'.
 * NewsAPI demo docs: https://newsapi.org/docs/endpoints/top-headlines
 */

// PUBLIC_INTERFACE
function News() {
  /**
   * Fetches and displays live Chennai news using NewsAPI.org demo key.
   * Adheres to dark theme and card styling.
   */
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // NewsAPI demo key and endpoint (no sensitive info, for demo only)
  const API_KEY = "9f751c7a39ee44b9a3a040882c3b1263";
  const CITY_QUERY = "Chennai";
  // Use 'in' as country (for India), q for Chennai.
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
        if (data.status !== "ok" || !data.articles) {
          throw new Error("Error loading news");
        }
        setArticles(data.articles);
        setLoading(false);
      })
      .catch(() => {
        setFetchError("Unable to load news at this time.");
        setLoading(false);
      });
      // eslint-disable-next-line
  }, []);

  let content;
  if (loading) {
    content = (
      <div style={{ color: "var(--cch-text-muted)", textAlign: "center", marginTop: 16 }}>
        Loading live news...
      </div>
    );
  } else if (fetchError) {
    content = (
      <div style={{ color: "var(--primary)", textAlign: "center", fontWeight: 600, padding: "17px 0 5px 0" }}>
        {fetchError}
      </div>
    );
  } else if (!articles.length) {
    content = (
      <div style={{ color: "var(--cch-text-muted)", textAlign: "center", fontStyle: "italic", marginTop: 13 }}>
        No live Chennai news found. Please check back later.
      </div>
    );
  } else {
    // Render articles using Hub's card+dark style
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
              {/* Use news source if available */}
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
      <section className="cch-section cch-news" style={{ maxWidth: 550, margin: "0 auto" }}>
        <h2 className="cch-section-title" style={{ color: "var(--primary)" }}>
          News Feed
        </h2>
        {content}
        <div style={{marginTop:20, textAlign:'right', fontSize:'0.9rem', color:"var(--cch-text-muted)"}}>
          Data powered by <a href="https://newsapi.org/" style={{color:"var(--accent)"}} tabIndex={-1} target="_blank" rel="noopener noreferrer">NewsAPI.org</a>
        </div>
      </section>
    </div>
  );
}

export default News;
