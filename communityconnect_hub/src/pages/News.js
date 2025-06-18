import React, { useEffect, useState } from "react";

/**
 * News.js — CommunityConnect Hub Live News Page (Chennai only)
 *
 * Fetches latest news from the local backend proxy at /api/news,
 * which internally fetches from NewsAPI.org and fixes CORS for frontend delivery.
 *
 * ▸ Server endpoint (default for dev):  http://localhost:5000/api/news
 * ▸ Deployment: update the fetch URL in the code below as needed—
 *   For production, set this to your deployed backend server address, e.g. 'https://yourdomain.com/api/news'
 *   If the frontend and backend are served from the same origin, you can use a relative URL: '/api/news'
 *
 * The backend should return JSON in NewsAPI format: { status: "ok", articles: [] } or { status: "error", ... }
 * **No API keys are needed on the frontend; all secrets/API keys are kept on the server.**
 * Robust loading, error, and data UI is preserved.
 */

// PUBLIC_INTERFACE
function News() {
  /**
   * Fetches and displays live news from the backend proxy (no API key required on client).
   * Visually robust dark theme for all states.
   *
   * To adjust backend address for deployment, change API_ENDPOINT below.
   */
  // === CONFIGURATION FOR END-USERS ===
  // Use '/api/news' for same-origin or relative proxy (recommended for production).
  // Change API_ENDPOINT for dev or deployment as needed.
  const API_ENDPOINT = "http://localhost:5000/api/news";
  // const API_ENDPOINT = "/api/news"; // ← Uncomment for same-origin deployment
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // PUBLIC_INTERFACE
  // Fetch Chennai news from proxy server: expects NewsAPI format.
  async function fetchNews() {
    setLoading(true);
    setFetchError(null);

    try {
      // Sends GET request to backend; CORS must be handled by server.js
      const response = await fetch(API_ENDPOINT, {
        method: "GET",
        // credentials: "include", // Uncomment ONLY if you need cookies
      });

      // Attempt to parse JSON response
      let json = null;
      try {
        json = await response.json();
      } catch (parseErr) {
        throw new Error("Could not parse JSON from news server.");
      }

      if (response.ok && json.status === "ok" && Array.isArray(json.articles)) {
        setArticles(json.articles);
        setLoading(false);
      } else {
        throw new Error(
          json && json.message
            ? String(json.message)
            : "Server returned an unknown error."
        );
      }
    } catch (err) {
      setArticles([]);
      setFetchError(
        err && err.message
          ? `Unable to fetch news: ${err.message}`
          : "Unable to fetch news. Please try again later."
      );
      setLoading(false);
    }
  }

  // ----- Effect: fetch on mount -----
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setArticles([]);
    setFetchError(null);

    fetchNews();

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
    // ERROR
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
    // EMPTY
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
        <div
          style={{
            marginTop: 10,
            fontSize: "0.88rem",
            color: "var(--cch-text-muted)",
            opacity: 0.67,
          }}
        >
          {/* Deployment note for server endpoint */}
          <span>
            (Adjust API endpoint server in <b>News.js</b> for deployment. See comments in code.)
          </span>
        </div>
      </section>
    </div>
  );
}

export default News;
