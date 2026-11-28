
import { useState } from "react";
import "./HelpFAQ.css";

function HelpFAQ() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Account",
      question: "How can I create an account?",
      answer: "Go to the Register page, enter your name, email and password, then submit the form."
    },
    {
      category: "Account",
      question: "How can I login to my account?",
      answer: "Open the Login page and enter your registered email and password."
    },
    {
      category: "Emergency",
      question: "How can I get emergency help?",
      answer: "Visit the Emergency Numbers section to find important emergency contact numbers."
    },
    {
      category: "Emergency",
      question: "How can I use emergency contacts?",
      answer: "Save your trusted family members or friends as emergency contacts so you can find their numbers quickly."
    },
    {
      category: "Safety",
      question: "What is the Safety Checklist?",
      answer: "The Safety Checklist provides useful safety steps that can help you stay aware and prepared."
    },
    {
      category: "Complaint",
      question: "How can I submit a complaint?",
      answer: "Go to the Transport Complaint section, enter the incident details and submit your complaint."
    },
    {
      category: "Community",
      question: "How can I share a post?",
      answer: "Open the Community section and follow the available instructions to create a post."
    },
    {
      category: "Legal",
      question: "Where can I find legal information?",
      answer: "Visit the Legal Guide section to learn about women's rights and legal support information."
    }
  ];

  const categories = [
    "All",
    "Account",
    "Emergency",
    "Safety",
    "Complaint",
    "Community",
    "Legal"
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="help-faq">
      <div className="faq-header">
        <h1>Help & FAQ</h1>
        <p>Find answers to your questions about our application.</p>
      </div>

      <input
        type="text"
        className="faq-search"
        placeholder="Search your question..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpenIndex(null);
        }}
      />

      <div className="faq-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? "active" : ""}
            onClick={() => {
              setActiveCategory(category);
              setOpenIndex(null);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <button
                className="faq-question"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                <span>{openIndex === index ? "−" : "+"}</span>
              </button>

              {openIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="faq-empty">
            No questions found. Please try another search.
          </p>
        )}
      </div>
    </div>
  );
}

export default HelpFAQ;
