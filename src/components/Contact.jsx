
import { useEffect, useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("");

  // Logged-in user's email
  const userEmail = localStorage.getItem("userEmail");
  console.log("Logged-in Email:", userEmail);

  // Load saved contacts
  const loadContacts = async () => {
    if (!userEmail) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/contacts/${encodeURIComponent(userEmail)}`
      );

      const data = await response.json();

      if (response.ok) {
  setContacts(Array.isArray(data) ? data : data.contacts || []);
} else {
  setMessage("Failed to load contacts.");
}
    } catch (error) {
      setMessage("Could not load contacts.");
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Save contact
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userEmail) {
      setMessage("Please login first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          name,
          phone,
          relationship,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Contact saved successfully!");
        setName("");
        setPhone("");
        setRelationship("");
        loadContacts();
      } else {
        setMessage(data.message || "Failed to save contact.");
      }
    } catch (error) {
      setMessage("Server connection failed.");
    }
  };

  return (
    <section className="content-card">
      <h2>Emergency Contacts</h2>
      <p>Add your trusted emergency contacts.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Contact Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Relationship"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
        />

        <button type="submit">Save Contact</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Saved Contacts</h3>

      {contacts.length === 0 ? (
        <p>No contacts saved yet.</p>
      ) : (
        contacts.map((contact) => (
          <div key={contact._id}>
            <strong>{contact.name}</strong>
            <p>{contact.phone}</p>
            <small>{contact.relationship}</small>
            <a href={`sms:${contact.phone}?body=${encodeURIComponent("I am in danger. Please help me immediately.")}`}>
  <button type="button">Quick SMS</button>
</a>
          </div>
        ))
      )}
    </section>
  );
}

export default Contact;
