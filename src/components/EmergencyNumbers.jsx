
import { useState } from "react";
import "./EmergencyNumbers.css";

const emergencyNumbers = [
  {
    name: "National Emergency Service",
    nameBn: "জাতীয় জরুরি সেবা",
    number: "999",
    description: "Police, Fire Service and Ambulance",
  },
  {
    name: "Women and Children Helpline",
    nameBn: "নারী ও শিশু সহায়তা",
    number: "109",
    description: "Support for women and children",
  },
  {
    name: "Child Helpline",
    nameBn: "শিশু সহায়তা",
    number: "1098",
    description: "Help and protection for children",
  },
];

function EmergencyNumbers() {
  const [search, setSearch] = useState("");

  const filteredNumbers = emergencyNumbers.filter((item) =>
    `${item.name} ${item.nameBn} ${item.number}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="emergency-section" id="emergency">
      <div className="emergency-heading">
        <span className="emergency-label">EMERGENCY SUPPORT</span>
        <h2>Emergency Numbers</h2>
        <p>Find important emergency contact numbers quickly.</p>
      </div>

      <input
        className="emergency-search"
        type="text"
        placeholder="Search by name or number..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="emergency-list">
        {filteredNumbers.map((item) => (
          <div className="emergency-card" key={item.number}>
            <div className="emergency-info">
              <h3>{item.name}</h3>
              <p>{item.nameBn}</p>
              <small>{item.description}</small>
              <strong>{item.number}</strong>
            </div>

            <a className="emergency-call" href={`tel:${item.number}`}>
              Call
            </a>
          </div>
        ))}
      </div>

      {filteredNumbers.length === 0 && (
        <p className="emergency-empty">No numbers found.</p>
      )}
    </section>
  );
}

export default EmergencyNumbers;
