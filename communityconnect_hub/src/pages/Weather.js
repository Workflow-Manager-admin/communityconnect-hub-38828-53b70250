import React, { useEffect, useState } from "react";

/**
 * Weather.js — CommunityConnect Hub (Local Live Weather)
 *
 * Fetches and displays current weather for the user’s location (via the Geolocation API + OpenWeatherMap).
 * Handles all loading, error, and permission-denied states with dark, modern UI.
 * Stays visually consistent with the CommunityConnect Hub dark theme/colors.
 */

// PUBLIC_INTERFACE
function Weather() {
  /**
   * Requests location; fetches weather for user’s coordinates, displays result in a dark card.
   */
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [geoDenied, setGeoDenied] = useState(false);
  const [geoPending, setGeoPending] = useState(true);
  const [userCoords, setUserCoords] = useState(null);

  // Your OpenWeatherMap API key (DEMO provided for project task)
  const API_KEY = "d0de3aed7ae9465a8c5e0342b340d5fd";

  // Emoji mapping for weather conditions
  const emojiForWeather = (main, icon = "") => {
    if (icon?.startsWith("01")) return "☀️";
    if (icon?.startsWith("02")) return "🌤️";
    if (icon?.startsWith("03") || icon?.startsWith("04")) return "☁️";
    if (icon?.startsWith("09") || icon?.startsWith("10")) return "🌧️";
    if (icon?.startsWith("11")) return "⛈️";
    if (icon?.startsWith("13")) return "❄️";
    if (icon?.startsWith("50")) return "🌫️";
    switch (main) {
      case "Clear":
        return "☀️";
      case "Clouds":
        return "☁️";
      case "Rain":
      case "Drizzle":
        return "🌧️";
      case "Thunderstorm":
        return "⛈️";
      case "Snow":
        return "❄️";
      case "Mist":
      case "Smoke":
      case "Haze":
      case "Dust":
      case "Fog":
      case "Sand":
      case "Ash":
      case "Squall":
      case "Tornado":
        return "🌫️";
      default:
        return "🌈";
    }
  };

  // Try to get user location on mount
  useEffect(() => {
    setGeoPending(true);
    setGeoDenied(false);
    setWeatherData(null);
    setFetchError(null);
    setUserCoords(null);

    if (!("geolocation" in navigator)) {
      setGeoDenied(true);
      setGeoPending(false);
      setLoading(false);
      return;
    }

    // Request position (high accuracy off for speed)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setGeoPending(false);
      },
      (err) => {
        setGeoDenied(true);
        setGeoPending(false);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  // Fetch OpenWeather data (coordinates => API call)
  useEffect(() => {
    if (!userCoords) return;
    setLoading(true);
    setFetchError(null);
    setWeatherData(null);

    const { lat, lon } = userCoords;
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            const msg = err?.message
              ? `OpenWeatherMap: ${err.message}`
              : "Failed to fetch weather data";
            throw new Error(msg);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (!data || data.cod !== 200) {
          throw new Error(
            typeof data?.message === "string"
              ? `OpenWeatherMap: ${data.message}`
              : "Weather data unavailable"
          );
        }
        setWeatherData(data);
        setLoading(false);
      })
      .catch((err) => {
        setFetchError(
          err?.message
            ? String(err.message)
            : "Unable to fetch local weather. Please try again later."
        );
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [userCoords]);

  // ---------- UI Rendering logic ----------
  let content = null;
  if (geoPending) {
    content = (
      <div
        style={{
          color: "var(--cch-text-muted)",
          textAlign: "center",
          margin: "23px 0 15px 0",
        }}
      >
        Detecting your location and loading weather&hellip;
      </div>
    );
  } else if (geoDenied) {
    content = (
      <div
        style={{
          color: "var(--primary, #dc0000)",
          background: "rgba(220,0,0,0.09)",
          fontWeight: 600,
          borderRadius: 8,
          textAlign: "center",
          margin: "22px 0 15px 0",
          padding: "17px 9px",
          border: "1.2px solid var(--primary, #dc0000)",
        }}
      >
        <span role="img" aria-label="denied" style={{ fontSize: "1.35em", marginRight: 4 }}>
          ⚠️
        </span>
        Location access denied. Unable to retrieve live local weather.
      </div>
    );
  } else if (loading) {
    content = (
      <div
        style={{
          color: "var(--cch-text-muted)",
          textAlign: "center",
          margin: "22px 0 13px 0",
        }}
      >
        Loading live local weather&hellip;
      </div>
    );
  } else if (fetchError) {
    content = (
      <div
        style={{
          color: "var(--primary, #dc0000)",
          background: "rgba(220,0,0,0.07)",
          fontWeight: 600,
          borderRadius: 8,
          textAlign: "center",
          margin: "18px 0 13px 0",
          padding: "13px 8px",
          border: "1.2px solid var(--primary, #dc0000)",
        }}
      >
        <span role="img" aria-label="error" style={{ fontSize: "1.3em", marginRight: 4 }}>
          ⚠️
        </span>
        {fetchError}
      </div>
    );
  } else if (weatherData) {
    // Safe parse fields (OpenWeatherMap JSON)
    const w = weatherData;
    const tempC = typeof w.main?.temp === "number" ? Math.round(w.main?.temp) : "--";
    const tempF =
      typeof w.main?.temp === "number" ? Math.round(w.main.temp * (9 / 5) + 32) : "--";
    const weatherIcon = emojiForWeather(w.weather?.[0]?.main, w.weather?.[0]?.icon);
    const weatherMain = w.weather?.[0]?.main || "";
    const weatherDesc = w.weather?.[0]?.description
      ? w.weather[0].description.charAt(0).toUpperCase() +
        w.weather[0].description.slice(1)
      : "";
    const highC =
      typeof w.main?.temp_max === "number"
        ? Math.round(w.main?.temp_max)
        : undefined;
    const lowC =
      typeof w.main?.temp_min === "number"
        ? Math.round(w.main?.temp_min)
        : undefined;
    const highF =
      typeof highC === "number" ? Math.round(highC * (9 / 5) + 32) : undefined;
    const lowF =
      typeof lowC === "number" ? Math.round(lowC * (9 / 5) + 32) : undefined;
    const humidity =
      typeof w.main?.humidity === "number" ? `${w.main.humidity}%` : "--";
    const wind =
      typeof w.wind?.speed === "number"
        ? `${w.wind.speed} m/s`
        : "--";
    const cloudCover =
      typeof w.clouds?.all === "number" ? `${w.clouds.all}%` : null;
    const updated =
      w.dt && !isNaN(w.dt)
        ? new Date(w.dt * 1000).toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "";
    const location =
      (w.name && typeof w.name === "string" && w.name.length > 0
        ? w.name
        : "your area") +
      (w.sys && typeof w.sys.country === "string"
        ? ", " + w.sys.country
        : "");

    content = (
      <div className="cch-weather-main">
        <span
          className="cch-weather-icon"
          aria-label="weather icon"
          style={{ fontSize: "3.0rem", marginRight: 10 }}
        >
          {weatherIcon}
        </span>
        <div>
          <div className="cch-weather-temp">
            {tempF !== "--" ? `${tempF}\u00b0F` : "--"}
            <span style={{ color: "var(--cch-text-muted)", fontSize: "0.98em", marginLeft: 7 }}>
              {tempC !== "--" && `(${tempC}\u00b0C)`}
            </span>
          </div>
          <div className="cch-weather-desc" style={{ color: "var(--accent)" }}>
            {weatherDesc || weatherMain}
          </div>
          <div style={{ color: "var(--secondary)", fontSize: "0.97rem", marginTop: 4 }}>
            {location}
          </div>
          <div className="cch-weather-details" style={{ color: "var(--secondary)", gap: 13 }}>
            {highF !== undefined && (
              <span>
                <b>H:</b> {highF}\u00b0F
              </span>
            )}
            {lowF !== undefined && (
              <span>
                <b>L:</b> {lowF}\u00b0F
              </span>
            )}
            {wind && (
              <span>
                <b>Wind:</b> {wind}
              </span>
            )}
            {humidity && (
              <span>
                <b>Humidity:</b> {humidity}
              </span>
            )}
            {cloudCover && (
              <span>
                <b>Clouds:</b> {cloudCover}
              </span>
            )}
          </div>
          <div
            style={{
              color: "var(--cch-text-muted)",
              fontSize: "0.96rem",
              marginTop: 8,
            }}
          >
            Last updated: {updated}
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div
        style={{
          color: "var(--cch-text-muted)",
          textAlign: "center",
          margin: "17px 0 8px 0",
        }}
      >
        Weather information not available.
      </div>
    );
  }

  // Main render
  return (
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section
        className="cch-section cch-weather"
        style={{
          maxWidth: 470,
          margin: "0 auto",
          background: "var(--cch-card, #23243a)",
          borderRadius: "var(--cch-radius, 13px)",
          boxShadow: "var(--cch-shadow, 0 4px 12px rgba(0,0,0,0.18))",
          border: "1.5px solid var(--cch-border, rgba(255,255,255,0.1))",
        }}
      >
        <h2 className="cch-section-title" style={{ color: "var(--accent, #0000dc)" }}>
          Local Weather
        </h2>
        {content}
        <div
          style={{
            marginTop: 22,
            textAlign: "right",
            fontSize: "0.93rem",
            color: "var(--cch-text-muted)",
          }}
        >
          Data powered by{" "}
          <a
            href="https://openweathermap.org/"
            tabIndex={-1}
            style={{ color: "var(--primary, #dc0000)" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeatherMap
          </a>
        </div>
      </section>
    </div>
  );
}

export default Weather;
