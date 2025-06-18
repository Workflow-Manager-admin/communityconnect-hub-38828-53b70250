// [DEPRECATED] - This file provided the old monolithic layout for CommunityConnect Hub.
// See src/pages/*.js and src/components/Navbar.js for new modular design with routing.

import React from "react";
import "./CommunityConnectHub.css";

// PUBLIC_INTERFACE
function NewsSection() {
  /** This component displays a list of mock news articles. */
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
    <section className="cch-section cch-news">
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
  );
}

// PUBLIC_INTERFACE
function WeatherSection() {
  /** This component displays mock current weather data. */
  const weather = {
    location: "Downtown",
    temperature: 72,
    description: "Partly Cloudy",
    icon: "🌤️",
    high: 76,
    low: 59,
    wind: "8mph WSW",
    humidity: "55%",
  };
  return (
    <section className="cch-section cch-weather">
      <h2 className="cch-section-title" style={{ color: "var(--accent)" }}>
        Weather
      </h2>
      <div className="cch-weather-main">
        <span className="cch-weather-icon" aria-label="weather icon">
          {weather.icon}
        </span>
        <div>
          <div className="cch-weather-temp">{weather.temperature}&deg;F</div>
          <div className="cch-weather-desc">{weather.description}</div>
          <div className="cch-weather-details">
            <span>
              <b>H:</b> {weather.high}&deg;F{" "}
            </span>
            <span>
              <b>L:</b> {weather.low}&deg;F{" "}
            </span>
            <span>
              <b>Wind:</b> {weather.wind}{" "}
            </span>
            <span>
              <b>Humidity:</b> {weather.humidity}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function EmergencyContactsSection() {
  /** This component displays a list of emergency contacts. */
  const contacts = [
    {
      name: "Police",
      number: "911",
      icon: "🚓",
      color: "var(--primary)",
    },
    {
      name: "Fire Department",
      number: "911",
      icon: "🚒",
      color: "var(--primary)",
    },
    {
      name: "Medical Emergency",
      number: "911",
      icon: "🚑",
      color: "var(--accent)",
    },
    {
      name: "City Hall",
      number: "(555) 123-4567",
      icon: "🏛️",
      color: "var(--secondary)",
    },
    {
      name: "Community Help Line",
      number: "(555) 654-7890",
      icon: "📞",
      color: "var(--secondary)",
    },
  ];
  return (
    <section className="cch-section cch-emergency">
      <h2 className="cch-section-title" style={{ color: "var(--primary)" }}>
        Emergency Contacts
      </h2>
      <ul className="cch-contact-list">
        {contacts.map((c, idx) => (
          <li
            className="cch-contact-item"
            key={idx}
            style={{
              borderLeft: `4px solid ${c.color}`,
            }}
          >
            <span className="cch-contact-icon" aria-label={c.name}>
              {c.icon}
            </span>
            <span className="cch-contact-name">{c.name}</span>
            <a
              className="cch-contact-number"
              href={`tel:${c.number.replace(/[^+\d]/g, "")}`}
              tabIndex={0}
            >
              {c.number}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// PUBLIC_INTERFACE
function EventsSection() {
  /** This component displays a simple event calendar using demo event data. */
  const events = [
    {
      title: "Farmers Market",
      date: "2024-06-08",
      place: "Main Square",
      description: "Weekly farmer’s market with fresh produce and crafts.",
    },
    {
      title: "Concert in the Park",
      date: "2024-06-10",
      place: "City Park Amphitheater",
      description: "Live music event for all ages. Free entry.",
    },
    {
      title: "Community Clean-Up Drive",
      date: "2024-06-12",
      place: "Riverside Trail",
      description: "Join neighbors for a morning of trail clean-up and fun.",
    },
  ];

  // Sort next-upcoming events, show max 3 to keep layout clean
  const today = new Date();
  const nextEvents = events
    .filter((ev) => new Date(ev.date) >= today)
    .slice(0, 3);

  return (
    <section className="cch-section cch-events">
      <h2 className="cch-section-title" style={{ color: "var(--secondary)" }}>
        Local Events
      </h2>
      <ul className="cch-events-list">
        {nextEvents.map((ev, idx) => (
          <li key={idx} className="cch-event-item">
            <div className="cch-event-date">
              {new Date(ev.date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div>
              <div className="cch-event-title">{ev.title}</div>
              <div className="cch-event-place">{ev.place}</div>
              <div className="cch-event-description">{ev.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// PUBLIC_INTERFACE
export default function CommunityConnectHub() {
  /** Main container: lays out all CommunityConnect Hub core sections. */
  return (
    <div className="cch-main-container">
      <header className="cch-main-header">
        <div className="cch-logo" aria-label="CommunityConnect Hub">
          <span style={{ color: "var(--primary)", fontWeight: 700 }}>●</span>
          <span style={{ color: "var(--secondary)", fontWeight: 700 }}>●</span>
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>●</span>
          <span style={{ marginLeft: 12 }}>CommunityConnect Hub</span>
        </div>
        <div className="cch-motto">
          Serving our neighborhood. Stay informed. Stay safe. Stay connected.
        </div>
      </header>
      <main className="cch-content">
        <div className="cch-section-columns">
          <div className="cch-column">
            <NewsSection />
            <EventsSection />
          </div>
          <div className="cch-column">
            <WeatherSection />
            <EmergencyContactsSection />
          </div>
        </div>
      </main>
      <footer className="cch-footer">
        &copy; 2024 CommunityConnect Hub | For demonstration purposes only.
      </footer>
    </div>
  );
}
