
import { useState } from "react";
import "./WomenSafetyQuiz.css";

const questions = [
  {
    question: "কেউ রাস্তায় তোমাকে অনুসরণ করলে কী করা উচিত?",
    options: [
      "নির্জন জায়গায় চলে যাওয়া",
      "নিরাপদ ও জনবহুল জায়গায় যাওয়া",
      "তাকে অনুসরণ করা",
      "কাউকে কিছু না বলা",
    ],
    answer: 1,
    explanation:
      "জনবহুল ও নিরাপদ জায়গায় যাও এবং প্রয়োজনে বিশ্বস্ত ব্যক্তি বা পুলিশের সাহায্য নাও।",
  },
  {
    question: "জরুরি বিপদের সময় বাংলাদেশের জাতীয় জরুরি নম্বর কোনটি?",
    options: ["১০৯", "৯৯৯", "৩৩৩", "১০৯৮"],
    answer: 1,
    explanation:
      "বাংলাদেশে পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের জরুরি সহায়তার জন্য ৯৯৯ নম্বরে কল করা যায়।",
  },
  {
    question: "অপরিচিত কেউ ব্যক্তিগত তথ্য চাইলে কী করবে?",
    options: [
      "সব তথ্য দিয়ে দেবে",
      "ঠিকানা ও ফোন নম্বর জানাবে",
      "ব্যক্তিগত তথ্য শেয়ার করবে না",
      "Password দিয়ে দেবে",
    ],
    answer: 2,
    explanation:
      "অপরিচিত ব্যক্তির সঙ্গে ঠিকানা, ফোন নম্বর, Password বা ব্যক্তিগত তথ্য শেয়ার করা উচিত নয়।",
  },
  {
    question: "রাতে একা বাইরে গেলে কোনটি ভালো অভ্যাস?",
    options: [
      "কাউকে না জানিয়ে যাওয়া",
      "সম্ভব হলে নিরাপদ ও পরিচিত পথ ব্যবহার করা",
      "ফোন বন্ধ রাখা",
      "নির্জন রাস্তা বেছে নেওয়া",
    ],
    answer: 1,
    explanation:
      "পরিচিত ও আলোকিত রাস্তা ব্যবহার করো এবং বিশ্বস্ত কাউকে নিজের যাত্রার কথা জানাও।",
  },
  {
    question: "অনলাইনে অপরিচিত কেউ সন্দেহজনক Link পাঠালে কী করবে?",
    options: [
      "সঙ্গে সঙ্গে Click করবে",
      "সবার সঙ্গে Share করবে",
      "Link যাচাই না করে Click করবে না",
      "নিজের তথ্য লিখবে",
    ],
    answer: 2,
    explanation:
      "সন্দেহজনক Link থেকে প্রতারণা বা তথ্য চুরির ঝুঁকি থাকে। যাচাই না করে Link খুলবে না।",
  },
  {
    question: "কেউ তোমাকে হয়রানি করলে কী করা উচিত?",
    options: [
      "চুপ করে সব সহ্য করা",
      "বিশ্বস্ত ব্যক্তি বা উপযুক্ত কর্তৃপক্ষকে জানানো",
      "নিজেকে দোষ দেওয়া",
      "সাহায্য না চাওয়া",
    ],
    answer: 1,
    explanation:
      "হয়রানির শিকার হলে বিশ্বস্ত ব্যক্তি, পরিবার বা উপযুক্ত কর্তৃপক্ষের সাহায্য নেওয়া গুরুত্বপূর্ণ।",
  },
  {
    question: "Social Media Account নিরাপদ রাখতে কী করবে?",
    options: [
      "Password সবার সঙ্গে Share করবে",
      "সহজ Password ব্যবহার করবে",
      "শক্তিশালী Password ও Privacy Settings ব্যবহার করবে",
      "অপরিচিত সবাইকে Personal Information দেবে",
    ],
    answer: 2,
    explanation:
      "শক্তিশালী ও আলাদা Password ব্যবহার করো এবং Account-এর Privacy Settings ঠিক রাখো।",
  },
  {
    question: "কোনো বিপজ্জনক পরিস্থিতিতে পড়লে প্রথমে কী করা উচিত?",
    options: [
      "নিজেকে নিরাপদ স্থানে নেওয়ার চেষ্টা করা",
      "বিপদের জায়গায় দাঁড়িয়ে থাকা",
      "ফোন বন্ধ করা",
      "কাউকে সাহায্য করতে না বলা",
    ],
    answer: 0,
    explanation:
      "প্রথমে নিজের নিরাপত্তাকে গুরুত্ব দাও। নিরাপদ স্থানে যাও এবং প্রয়োজন হলে জরুরি সহায়তা নাও।",
  },
  {
    question: "ভ্রমণের আগে বিশ্বস্ত কাউকে কী জানানো ভালো?",
    options: [
      "শুধু পোশাকের রং",
      "গন্তব্য ও সম্ভাব্য পৌঁছানোর সময়",
      "কিছুই না",
      "শুধু Social Media Password",
    ],
    answer: 1,
    explanation:
      "গন্তব্য ও সম্ভাব্য পৌঁছানোর সময় জানালে প্রয়োজনে বিশ্বস্ত ব্যক্তি তোমার খোঁজ নিতে পারবেন।",
  },
  {
    question: "কেউ তোমাকে অনলাইনে হুমকি দিলে কী করা উচিত?",
    options: [
      "হুমকির প্রমাণ মুছে ফেলা",
      "আরও ব্যক্তিগত তথ্য পাঠানো",
      "প্রমাণ সংরক্ষণ করে বিশ্বস্ত ব্যক্তি বা কর্তৃপক্ষকে জানানো",
      "নিজের Account Password দিয়ে দেওয়া",
    ],
    answer: 2,
    explanation:
      "হুমকির Message বা Screenshot প্রমাণ হিসেবে সংরক্ষণ করো এবং বিশ্বস্ত ব্যক্তি বা উপযুক্ত কর্তৃপক্ষকে জানাও।",
  },
];

function WomenSafetyQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100;

  function selectAnswer(index) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (index === question.answer) {
      setScore((previous) => previous + 1);
    }
  }

  function nextQuestion() {
    if (currentQuestion === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer(null);
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <section className="content-card page-card safety-quiz">
        <span className="eyebrow">QUIZ COMPLETED</span>
        <div className="quiz-result">
          <div className="quiz-result-icon">🏆</div>
          <h1>Great Job!</h1>
          <p>You have completed the Women Safety Awareness Quiz.</p>

          <div className="quiz-score-circle">
            <strong>{score}/{questions.length}</strong>
            <span>Your Score</span>
          </div>

          <h2>{percentage}% Correct Answers</h2>

          <p className="quiz-result-message">
            {score >= 8
              ? "Excellent! You have good awareness about personal safety."
              : score >= 5
              ? "Good effort! Keep learning and stay aware."
              : "Keep practicing! Learning about safety can help you make informed decisions."}
          </p>

          <button className="quiz-primary-btn" onClick={restartQuiz}>
            ↻ Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="content-card page-card safety-quiz">
      <span className="eyebrow">LEARN AND STAY SAFE</span>
      <h1>Women Safety Awareness Quiz</h1>
      <p className="quiz-intro">
        Test your knowledge and learn useful safety practices.
      </p>

      <div className="quiz-progress-info">
        <strong>Question {currentQuestion + 1} of {questions.length}</strong>
        <strong>{Math.round(progress)}%</strong>
      </div>

      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="quiz-question-card">
        <span className="quiz-question-number">
          QUESTION {currentQuestion + 1}
        </span>

        <h2>{question.question}</h2>

        <div className="quiz-options">
          {question.options.map((option, index) => {
            let optionClass = "";

            if (selectedAnswer !== null) {
              if (index === question.answer) {
                optionClass = "correct";
              } else if (index === selectedAnswer) {
                optionClass = "wrong";
              }
            }

            return (
              <button
                key={index}
                className={`quiz-option ${optionClass}`}
                onClick={() => selectAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="quiz-option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
                {selectedAnswer !== null && index === question.answer && (
                  <span className="quiz-option-mark">✓</span>
                )}
                {selectedAnswer === index && index !== question.answer && (
                  <span className="quiz-option-mark">✕</span>
                )}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className="quiz-explanation">
            <strong>
              {selectedAnswer === question.answer
                ? "✓ Correct Answer!"
                : "✕ Incorrect Answer"}
            </strong>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>

      <div className="quiz-bottom">
        <span>Score: {score}/{questions.length}</span>

        <button
          className="quiz-primary-btn"
          onClick={nextQuestion}
          disabled={selectedAnswer === null}
        >
          {currentQuestion === questions.length - 1
            ? "See Result →"
            : "Next Question →"}
        </button>
      </div>

      <p className="quiz-disclaimer">
        This quiz is for awareness and learning. It does not replace
        emergency services or professional advice.
      </p>
    </section>
  );
}

export default WomenSafetyQuiz;
