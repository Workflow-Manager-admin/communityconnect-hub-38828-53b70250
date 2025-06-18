import React from "react";

// PUBLIC_INTERFACE
function News() {
  /**
   * News feed using mock demo data, styled for dark mode.
   */
  const news = [
    {
      title: "New Community Park Opens",
      summary:
        "A new green space launches in the heart of town, featuring walking trails and a small amphitheater.",
      url: "#",
      source: "Community News",
      published: "2024-06-02",
    },
    {
      title: "Local Library Extends Hours",
      summary:
        "The city library now opens earlier and closes later to better serve students and families.",
      url: "#",
      source: "City Updates",
      published: "2024-05-31",
    },
    {
      title: "Farmers Market Every Weekend",
      summary:
        "Fresh produce and artisan goods available each Saturday at the town square through September.",
      url: "#",
      source: "Events Board",
      published: "2024-06-01",
    },
  ];
  return (
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section className="cch-section cch-news" style={{ maxWidth: 550, margin: "0 auto" }}>
        <h2 className="cch-section-title" style={{ color: "var(--primary)" }}>
          News Feed
        </h2>
        <ul className="cch-news-list">
          {news.map((item, idx) => (
            <li className="cch-news-article" key={idx}>
              <a href={item.url} className="cch-news-title" tabIndex={0}>
                {item.title}
              </a>
              <span className="cch-news-summary">{item.summary}</span>
              <div className="cch-news-meta">
                <span className="cch-news-source">{item.source}</span>
                <span className="cch-news-date">{item.published}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default News;
