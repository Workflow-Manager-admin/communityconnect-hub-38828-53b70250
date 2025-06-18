import React from "react";

// PUBLIC_INTERFACE
function Events() {
  /**
   * Modern list of demo community events in dark mode.
   */
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
  return (
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section className="cch-section cch-events" style={{ maxWidth: 540, margin: "0 auto" }}>
        <h2 className="cch-section-title" style={{ color: "var(--secondary)" }}>
          Local Events
        </h2>
        <ul className="cch-events-list">
          {events.map((ev, idx) => (
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
    </div>
  );
}

export default Events;
