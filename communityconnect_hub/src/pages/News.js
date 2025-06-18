import React, { useEffect, useState } from "react";

/**
 * News.js — CommunityConnect Hub Live News Page (Chennai only)
 *
 * Fetches live news for Chennai from NewsAPI.org using the provided API key.
 * - Uses q=Chennai in the query string and pageSize=12 for full attempt, or just q=Chennai on fallback.
 * - Passes API key in 'X-Api-Key' header (not as a query param).
 * - If no articles or an error, retries ONCE with minimal param as recommended by NewsAPI.
 * - Visibly distinguishes loading, error, empty, and data states, styled for dark theme.
 */

// PUBLIC_INTERFACE
function News() {
  /**
   * Fetches and displays live news using NewsAPI.org and provided API key,
   * robust error and retry logic, visually distinct dark theme for all states.
   */
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [retryUsed, setRetryUsed] = useState(false);

  // NewsAPI key (hardcoded for demo; secure appropriately in production!)
  const API_KEY = "737e634c6ef84eb4a280c96c4ec7815f";
  const CITY_QUERY = "Chennai";

  /**
   * Core fetch helper for NewsAPI with error extraction and retry flexibility.
   *
   * @param {Object} params - { pageSize, retry }
   * @returns {Promise<{ articles: [], status: string, raw: object }>}
   */
  // PUBLIC_INTERFACE
  async function fetchNews({ pageSize = 12, retry = false }) {
    setLoading(true);
    setFetchError(null);

    let url = "https://newsapi.org/v2/top-headlines";
    if (!retry) {
      url += `?q=${encodeURIComponent(CITY_QUERY)}&pageSize=${pageSize}`;
    } else {
      // Fallback retry: only minimal NewsAPI-supported query
      url += `?q=${encodeURIComponent(CITY_QUERY)}`;
    }

    try {
      const response = await fetch(url, {
        headers: { "X-Api-Key": API_KEY },
        mode: "cors"
      });

      let json = null;
      try {
        json = await response.json();
      } catch (parseErr) {
        // NewsAPI may send HTML on auth or server issues
        throw new Error("Unable to parse NewsAPI response.");
      }

      // Diagnostic error handling per NewsAPI contract
      if (response.ok && json.status === "ok" && Array.isArray(json.articles)) {
        return { articles: json.articles, status: "ok", raw: json };
      } else if (json && json.status === "error" && json.message) {
        // Relay specific NewsAPI error
        throw new Error(`NewsAPI: ${json.message}`);
      } else if (!response.ok) {
        throw new Error(
          `Network error: ${response.status} ${response.statusText || ""}`.trim()
        );
      } else {
        throw new Error("Unknown error fetching news.");
      }
    } catch (err) {
      throw err;
    }
  }

  // ----- Effect: fetch and handle diagnostic logic -----
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setArticles([]);
    setFetchError(null);
    setRetryUsed(false);

    // First: try normal query
    fetchNews({ pageSize: 12, retry: false })
      .then(({ articles }) => {
        if (!isMounted) return;
        if (Array.isArray(articles) && articles.length > 0) {
          setArticles(articles);
          setLoading(false);
        } else {
          // No news found: attempt fallback with minimal param
          setRetryUsed(true);
          fetchNews({ retry: true })
            .then(({ articles: articles2 }) => {
              if (!isMounted) return;
              setArticles(Array.isArray(articles2) ? articles2 : []);
              setLoading(false);
            })
            .catch((err2) => {
              if (!isMounted) return;
              setFetchError(
                err2 && err2.message
                  ? err2.message
                  : "Unable to fetch news. Please try again later."
              );
              setLoading(false);
            });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        // Attempt single fallback only in case of some NewsAPI errors (query/config errors), not for severe network issues
        if (
          err &&
          (typeof err.message === "string" &&
            /newsapi/i.test(err.message) &&
            !retryUsed)
        ) {
          setRetryUsed(true);
          fetchNews({ retry: true })
            .then(({ articles: articles2 }) => {
              if (!isMounted) return;
              setArticles(Array.isArray(articles2) ? articles2 : []);
              setLoading(false);
            })
            .catch((err2) => {
              if (!isMounted) return;
              setFetchError(
                err2 && err2.message
                  ? err2.message
                  : "Unable to fetch news. Please try again later."
              );
              setLoading(false);
            });
        } else {
          setFetchError(
            err && err.message
              ? err.message
              : "Unable to load news. Please try again later."
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  // ----- UI States -----
  let content = null;
  if (loading) {
    // LOADING
    content = (
      <div
        style={{
          color: "var(--cch-text-muted)",
          textAlign: "center",
          margin: "38px 0",
          fontSize: "1.12rem",
          fontStyle: "italic",
          background: "rgba(30,30,40,0.25)",
          borderRadius: 9,
          border: "1.1px solid var(--cch-border,rgba(255,255,255,0.1))",
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.09)",
          padding: "17px 6px",
          letterSpacing: ".01em",
        }}
      >
        Fetching Chennai news headlines…{" "}
        <span role="status" style={{ marginLeft: 4, color: "var(--primary)" }}>
          📰
        </span>
      </div>
    );
  } else if (fetchError) {
    // ERROR (NewsAPI/network shown, red highlight)
    content = (
      <div
        style={{
          color: "var(--primary)",
          background: "rgba(220,0,0,0.11)",
          textAlign: "center",
          fontWeight: 600,
          borderRadius: "10px",
          margin: "30px auto 5px auto",
          padding: "18px 12px 14px 12px",
          border: "1.4px solid var(--primary)",
          maxWidth: 480,
          fontSize: "1.06rem",
          boxShadow: "0 1px 11px 0 rgba(220,0,0,0.08)",
        }}
      >
        <span
          role="img"
          aria-label="error"
          style={{
            fontSize: "1.25em",
            marginRight: 6,
            verticalAlign: "-2px",
            filter: "drop-shadow(0 0 2.5px var(--primary))",
          }}
        >
          ⚠️
        </span>
        {fetchError}
      </div>
    );
  } else if (Array.isArray(articles) && articles.length === 0) {
    // EMPTY (No news)
    content = (
      <div
        style={{
          color: "var(--cch-text-muted)",
          textAlign: "center",
          fontStyle: "italic",
          margin: "27px 0",
          background: "rgba(40,40,55,0.16)",
          padding: "15px 7px",
          borderRadius: "9px",
          border: "1.1px solid var(--cch-border,rgba(255,255,255,0.12))",
        }}
      >
        No recent news stories found for Chennai.
        {retryUsed && (
          <span
            style={{
              display: "block",
              color: "var(--cch-text-muted)",
              opacity: 0.7,
              marginTop: 3,
              fontSize: "0.97em",
            }}
          >
            (Tried both with and without additional parameters.)
          </span>
        )}
      </div>
    );
  } else if (Array.isArray(articles) && articles.length) {
    // DATA STATE
    content = (
      <ul className="cch-news-list">
        {articles.map((news, idx) => (
          <li
            className="cch-news-article"
            key={news.url || news.title || idx}
            style={{
              animationDelay: `${0.06 * idx}s`,
              borderLeft:
                idx % 2 === 0
                  ? "3px solid var(--primary)"
                  : "3px solid var(--accent)",
              background: "rgba(10,20,29,0.06)",
              borderRadius: "7px",
            }}
            tabIndex={-1}
          >
            <a
              href={news.url}
              className="cch-news-title"
              tabIndex={0}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1.12rem",
                filter: "brightness(1.14)",
                letterSpacing: "0.01em",
                lineHeight: 1.32,
                display: "block",
              }}
              title={news.title}
            >
              {news.title}
            </a>
            {news.description && (
              <span
                className="cch-news-summary"
                style={{
                  display: "block",
                  color: "var(--cch-text-muted)",
                  fontSize: "1.01rem",
                  margin: "2px 0 7px 0",
                  letterSpacing: ".01em",
                }}
              >
                {news.description}
              </span>
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

  // --- Main Render ---
  return (
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section
        className="cch-section cch-news"
        style={{
          maxWidth: 560,
          margin: "0 auto",
          background: "var(--cch-card,#23243a)",
          borderRadius: "var(--cch-radius,13px)",
          boxShadow: "var(--cch-shadow,0 4px 12px rgba(0,0,0,0.18))",
          border: "1.7px solid var(--cch-border,rgba(255,255,255,0.10))",
        }}
      >
        <h2
          className="cch-section-title"
          style={{
            color: "var(--primary)",
            letterSpacing: ".01em",
            textShadow: "0 3px 27px rgba(0,0,0,0.18),0 0px 1px #c12323",
          }}
        >
          Latest Chennai Headlines
        </h2>
        {content}
        <div
          style={{
            marginTop: 26,
            textAlign: "right",
            fontSize: "0.93rem",
            color: "var(--cch-text-muted)",
            opacity: 0.98,
          }}
        >
          Data powered by{" "}
          <a
            href="https://newsapi.org/"
            tabIndex={-1}
            style={{ color: "var(--accent)", textShadow: "none" }}
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
