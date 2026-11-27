
import { useState } from "react";

function LegalGuide() {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const rights = [
    {
      title: "Right to Safety",
      description:
        "Every woman has the right to live free from violence, threats, harassment and abuse.",
    },
    {
      title: "Right to Dignity",
      description:
        "Every woman deserves respect and should not face discrimination or humiliation.",
    },
    {
      title: "Right to Privacy",
      description:
        "Personal information, photos and private communications should be protected.",
    },
    {
      title: "Right to Report",
      description:
        "Women can seek help and report incidents of harassment or violence to appropriate authorities.",
    },
  ];

  const harassmentGuides = [
    {
      title: "Cyber Harassment",
      details:
        "If someone threatens, blackmails or harasses you online, save messages, screenshots and account details. Avoid responding to threats and report the account.",
    },
    {
      title: "Stalking",
      details:
        "If someone repeatedly follows or watches you without consent, record dates, times and locations. Stay near trusted people and seek help.",
    },
    {
      title: "Sexual Harassment",
      details:
        "If someone behaves in an unwanted sexual or inappropriate way, prioritize your safety, preserve available evidence and consider reporting the incident.",
    },
    {
      title: "Domestic Violence",
      details:
        "If you experience violence or threats at home, try to reach a safe place and seek help from a trusted person or appropriate support organization.",
    },
  ];

  const complaintSteps = [
    "Write down what happened, including date, time and location.",
    "Describe the incident clearly and honestly.",
    "Keep relevant screenshots, messages, photographs or documents.",
    "Identify the appropriate authority or organization for your complaint.",
    "Submit your complaint and keep a copy or reference number.",
    "Follow up on the complaint when it is safe to do so.",
  ];

  const evidenceTips = [
    "Take screenshots of threatening messages and conversations.",
    "Keep original photos, videos and documents unchanged.",
    "Record the date, time and details of each incident.",
    "Save relevant URLs, usernames and account information.",
    "Store backup copies somewhere secure.",
    "Do not share sensitive evidence publicly without considering your safety and privacy.",
  ];

  const faqs = [
    {
      question: "What should I do if someone harasses me online?",
      answer:
        "Save available evidence, block or report the account if safe, and seek help from a trusted person or appropriate authority.",
    },
    {
      question: "Can I report harassment without publicizing my identity?",
      answer:
        "You can ask the relevant authority about confidential reporting options. Rules and procedures may vary.",
    },
    {
      question: "What evidence should I preserve?",
      answer:
        "Relevant messages, screenshots, dates, times, URLs, photographs and other original records may be useful.",
    },
    {
      question: "What if I am afraid to make a complaint?",
      answer:
        "Your safety comes first. Consider speaking with a trusted person or qualified support organization before deciding what to do.",
    },
  ];

  const cardStyle = {
    background: "#fff",
    padding: "18px",
    borderRadius: "12px",
    marginBottom: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  };

  const headingStyle = {
    color: "#294b3a",
    marginBottom: "15px",
  };

  return (
    <section className="content-card">
      <h2 style={headingStyle}>Women Rights & Legal Guide</h2>

      <p>
        Learn about women's rights, harassment awareness,
        complaint procedures and evidence preservation.
      </p>

      <h3 style={headingStyle}>1. Know Your Rights</h3>

      {rights.map((item, index) => (
        <div style={cardStyle} key={index}>
          <h4>{item.title}</h4>
          <p>{item.description}</p>
        </div>
      ))}

      <h3 style={headingStyle}>2. Harassment Guide</h3>

      {harassmentGuides.map((item, index) => (
        <div style={cardStyle} key={index}>
          <h4>{item.title}</h4>
          <p>{item.details}</p>
        </div>
      ))}

      <h3 style={headingStyle}>3. How to File a Complaint</h3>

      <div style={cardStyle}>
        <ol>
          {complaintSteps.map((step, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <h3 style={headingStyle}>4. Evidence Guide</h3>

      <div style={cardStyle}>
        <ul>
          {evidenceTips.map((tip, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <h3 style={headingStyle}>5. Frequently Asked Questions</h3>

      {faqs.map((faq, index) => (
        <div style={cardStyle} key={index}>
          <button
            type="button"
            onClick={() =>
              setActiveFAQ(activeFAQ === index ? null : index)
            }
            style={{
              width: "100%",
              padding: "10px",
              background: "#e8f0eb",
              color: "#294b3a",
              border: "none",
              borderRadius: "8px",
              textAlign: "left",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {faq.question}
          </button>

          {activeFAQ === index && (
            <p style={{ marginTop: "12px" }}>{faq.answer}</p>
          )}
        </div>
      ))}

      <p style={{ color: "#777", fontSize: "13px" }}>
        Note: This guide provides general educational information,
        not professional legal advice. Laws and complaint procedures
        may change. Seek qualified legal assistance for your situation.
      </p>
    </section>
  );
}

export default LegalGuide;
