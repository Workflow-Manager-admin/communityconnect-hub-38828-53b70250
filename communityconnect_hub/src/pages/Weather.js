import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
function Weather() {
  /**
   * Weather page fetching and displaying live Chennai weather from OpenWeatherMap API,
   * styled according to the dark theme.
   */
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // OpenWeatherMap Public Demo API Key (for non-production use)
  const API_KEY = "b6907d289e10d714a6e88b30761fae22"; // docs: https://openweathermap.org/current#current_JSON
  const CITY = "Chennai";
  const API_URL = `https://openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    CITY
  )}&appid=${API_KEY}&units=metric`;

  // Emoji mapping for weather (selects general icon for OWM icon code or main condition)
  const emojiForWeather = (main, icon = "") => {
    if (icon.startsWith("01")) return "☀️";
    if (icon.startsWith("02")) return "🌤️";
    if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
    if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
    if (icon.startsWith("11")) return "⛈️";
    if (icon.startsWith("13")) return "❄️";
    if (icon.startsWith("50")) return "🌫️";
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

  useEffect(() => {
    setLoading(true);
    setFetchError(null);

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch weather info");
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        setFetchError("Unable to fetch weather at the moment.");
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  let content;
  if (loading) {
    content = <div style={{color: "var(--cch-text-muted)", textAlign: "center", marginTop: 12}}>Loading weather...</div>;
  } else if (fetchError || !weather || weather.cod !== 200) {
    content = (
      <div style={{color:"var(--primary)", textAlign:"center", padding:"15px 0 8px 0", fontWeight:600}}>
        {fetchError || "Weather data unavailable."}
      </div>
    );
  } else {
    // OWM returns: main.temp (°C), main.humidity, weather[0].description, wind.speed (m/s), wind.deg, main.temp_min, main.temp_max
    const w = weather;
    const tempC = w.main?.temp;
    const tempF = tempC != null ? Math.round(tempC * (9 / 5) + 32) : null;
    const icon = emojiForWeather(w.weather[0]?.main, w.weather[0]?.icon);
    const weatherMain = w.weather[0]?.main || "";
    const weatherDesc = w.weather[0]?.description
      ? w.weather[0].description.charAt(0).toUpperCase() + w.weather[0].description.slice(1)
      : "";
    const highC = w.main?.temp_max;
    const highF = highC != null ? Math.round(highC * (9 / 5) + 32) : null;
    const lowC = w.main?.temp_min;
    const lowF = lowC != null ? Math.round(lowC * (9 / 5) + 32) : null;
    const wind = w.wind ? `${w.wind.speed} m/s` : "";
    const humidity = w.main?.humidity ? `${w.main.humidity}%` : "";
    const updated = w.dt
      ? new Date(w.dt * 1000).toLocaleString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

    content = (
      <div className="cch-weather-main">
        <span className="cch-weather-icon" aria-label="weather icon" style={{fontSize:"3rem"}}>
          {icon}
        </span>
        <div>
          <div className="cch-weather-temp">
            {tempF != null ? `${tempF}°F` : tempC != null ? `${tempC}°C` : "?"}
          </div>
          <div className="cch-weather-desc">{weatherDesc}</div>
          <div className="cch-weather-details">
            {highF != null && (
              <span>
                <b>H:</b> {highF}°F
              </span>
            )}
            {lowF != null && (
              <span>
                <b>L:</b> {lowF}°F
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
          </div>
          <div style={{ color: "var(--cch-text-muted)", fontSize: "0.99rem", marginTop: 5 }}>
            Last updated: {updated}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section className="cch-section cch-weather" style={{ maxWidth: 450, margin: "0 auto" }}>
        <h2 className="cch-section-title" style={{ color: "var(--accent)" }}>
          Weather
        </h2>
        {content}
      </section>
    </div>
  );
}

export default Weather;
