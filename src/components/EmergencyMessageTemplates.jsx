
import { useState } from "react";
import "./EmergencyMessageTemplates.css";

const messages = [
  {
    category: "Emergency",
    title: "I Need Immediate Help",
    message: "I am in danger. Please call me immediately. I need your help."
  },
  {
    category: "Travel",
    title: "Travel Safety",
    message: "I am travelling now. Please stay available and check on me."
  },
  {
    category: "Personal Safety",
    title: "Feeling Unsafe",
    message: "I am feeling unsafe. Please contact me as soon as possible."
  },
  {
    category: "Location",
    title: "Location Update",
    message: "I have reached my destination safely. Thank you for checking on me."
  },
  {
    category: "Emergency",
    title: "Please Contact My Family",
    message: "I need assistance. Please contact my family or trusted emergency contact."
  }
];

function EmergencyMessageTemplates() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyMessage = async (message, index) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedIndex(index);
    } catch (error) {
      alert("Unable to copy. Please copy the message manually.");
    }
  };

  return (
    <div className="emergency-messages">
      <h1>Emergency Message Templates</h1>

      <p className="message-intro">
        Ready-to-use messages for emergency and safety situations.
      </p>

      {messages.map((item, index) => (
        <div className="emergency-message-card" key={index}>
          <small>{item.category}</small>

          <h3>{item.title}</h3>

          <p>{item.message}</p>

          <button
            onClick={() => copyMessage(item.message, index)}
          >
            {copiedIndex === index ? "Copied!" : "Copy Message"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default EmergencyMessageTemplates;
