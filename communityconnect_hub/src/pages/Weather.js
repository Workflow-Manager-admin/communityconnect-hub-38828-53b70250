import React from "react";

// PUBLIC_INTERFACE
function Weather() {
  /**
   * Weather page showing dark-styled card with demo data.
   */
  const weather = {
    location: "Downtown",
    temperature: 72,
    description: "Partly Cloudy",
    icon: "🌤️",
    high: 76,
    low: 59,
    wind: "8mph WSW",
    humidity: "55%",
    updated: "2024-06-05 14:30",
  };
  return (
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section className="cch-section cch-weather" style={{ maxWidth: 450, margin: "0 auto" }}>
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
            <div style={{ color: "var(--cch-text-muted)", fontSize: "0.99rem", marginTop: 5 }}>
              Last updated: {weather.updated}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Weather;
