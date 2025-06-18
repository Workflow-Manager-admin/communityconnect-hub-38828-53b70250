import React from "react";

// PUBLIC_INTERFACE
function Emergency() {
  /**
   * Emergency contacts rendered in compact, modern dark mode card.
   */
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
    <div className="cch-content" style={{ paddingTop: 50 }}>
      <section className="cch-section" style={{ maxWidth: 490, margin: "0 auto" }}>
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
    </div>
  );
}

export default Emergency;
