import React from "react";

// PUBLIC_INTERFACE
function Events() {
  /**
   * Modern list of demo community events in dark mode.
   */
  const events = [
    {
      title: "Chennai Book Fair",
      date: "2024-06-08",
      place: "YMCA Grounds, Nandanam",
      description: "One of India's largest book fairs offering a wide variety of books, workshops, and author meet-and-greets. Great for bibliophiles!",
    },
    {
      title: "Marina Beach Clean-Up Drive",
      date: "2024-06-09",
      place: "Marina Beach",
      description: "Join volunteers in keeping Chennai’s iconic beach clean. All are welcome; materials provided on site.",
    },
    {
      title: "Margazhi Music Festival",
      date: "2024-06-12",
      place: "Music Academy, T.T.K. Road",
      description: "Carnatic concerts and classical performances as part of the famed Chennai December Season, now extending into June!",
    },
    {
      title: "Startup Chennai Networking",
      date: "2024-06-15",
      place: "Tidel Park, Rajiv Gandhi Salai",
      description: "Meet Chennai’s growing startup community, enjoy lightning talks, and grow your local network.",
    },
    {
      title: "South Indian Food Fest",
      date: "2024-06-18",
      place: "Express Avenue Mall",
      description: "Savor authentic South Indian cuisine at this unique festival, featuring popular dishes from across Tamil Nadu.",
    },
    {
      title: "Heritage Photowalk: Mylapore",
      date: "2024-06-20",
      place: "Kapaleeshwarar Temple, Mylapore",
      description: "Explore the historic lanes and landmarks of Mylapore, guided by a local historian. Bring your camera!",
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
