import React, { useEffect, useState } from "react";

/**
 * News.js — CommunityConnect Hub Live News Page (Chennai only)
 *
 * Fetches live news for Chennai from NewsAPI.org using the provided API key.
 * Handles robust UI: loading, error, empty, and data states with modern dark theme & card animation.
 * All mock/demo data is removed. Shows real news headlines and descriptions for Chennai.
 */

// PUBLIC_INTERFACE
function News() {
  /**
   * Fetches and displays live Chennai news using NewsAPI.org and provided API key.
   * Uses robust error/loading/data UI and CommunityConnect Hub's modern dark style.
   */
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Use provided API key for NewsAPI
  const API_KEY = "737e634c6ef84eb4a280c96c4ec7815f";
  const CITY_QUERY = "Chennai";
  const API_URL = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(
    CITY_QUERY
  )}&country=in&apiKey=${API_KEY}&pageSize=12`;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setArticles([]);
    setFetchError("");
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch live news feed.");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (!data.articles || !Array.isArray(data.articles) || data.status !== "ok") {
          throw new Error("News data format error from NewsAPI.");
        }
        setArticles(data.articles);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setFetchError(
          err?.message
            ? "Unable to load live news at this time. " + err.message
            : "Unable to load live news at this time. Please try again later."
        );
        setLoading(false);
      });
    return () => { isMounted = false; };
    // eslint-disable-next-line
  }, []);

  let content;
  if (loading) {
    content = (
      <div style={{
        color: "var(--cch-text-muted)",
        textAlign: "center",
        margin: "30px 0",
        fontSize: "1.08rem",
        fontStyle: "italic"
      }}>
        Fetching latest news for Chennai … <span role="status" style={{marginLeft:4}}>📰</span>
      </div>
    );
  } else if (fetchError) {
    content = (
      <div
        style={{
          color: "var(--primary)",
          textAlign: "center",
          fontWeight: 600,
          background: "rgba(220,0,0,0.07)",
          borderRadius: "8px",
          padding: "13px 9px",
          margin: "19px 0 5px 0",
          border: "1.2px solid var(--primary)"
        }}>
        <span role="img" aria-label="error" style={{ fontSize: "1.18em", marginRight: 4 }}>⚠️</span>
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
          margin: "19px 0"
        }}>
        No recent news stories found for Chennai.
      </div>
    );
  } else {
    // UI for article list
    content = (
      <ul className="cch-news-list">
        {articles.map((news, idx) => (
          <li className="cch-news-article"
              key={news.url || news.title || idx}
              style={{ animationDelay: `${0.05 * idx}s` }}
          >
            <a
              href={news.url}
              className="cch-news-title"
              tabIndex={0}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--primary)",
                textDecoration: "none"
              }}
            >
              {news.title}
            </a>
            {news.description && (
              <span className="cch-news-summary">{news.description}</span>
            )}
            <div className="cch-news-meta">
              {news.source?.name && (
                <span className="cch-news-source">{news.source.name}</span>
              )}
              <span className="cch-news-date">
                {news.publishedAt
                  ? new Date(news.publishedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
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
        style={{
          maxWidth: 550,
          margin: "0 auto",
          background: "var(--cch-card,#23243a)",
          borderRadius: "var(--cch-radius,13px)",
          boxShadow: "var(--cch-shadow,0 4px 12px rgba(0,0,0,0.18))",
          border: "1.5px solid var(--cch-border,rgba(255,255,255,0.1))"
        }}
      >
        <h2 className="cch-section-title" style={{ color: "var(--primary)" }}>
          Latest Chennai Headlines
        </h2>
        {content}
        <div
          style={{
            marginTop: 22,
            textAlign: "right",
            fontSize: "0.93rem",
            color: "var(--cch-text-muted)"
          }}
        >
          Data powered by{" "}
          <a
            href="https://newsapi.org/"
            tabIndex={-1}
            style={{ color: "var(--accent)" }}
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
