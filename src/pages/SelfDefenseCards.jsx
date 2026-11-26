
import { useState, useEffect } from "react";

const lessons = [
  {
    title: "নিজের আশপাশ সম্পর্কে সচেতন থাকো",
    category: "Safety Basics",
    icon: "👀",
    content:
      "রাস্তায় চলার সময় আশপাশ খেয়াল রাখো। ফোনের দিকে অতিরিক্ত মনোযোগ দিও না। অপরিচিত বা সন্দেহজনক পরিস্থিতি বুঝতে চেষ্টা করো।",
    advice: "সচেতন থাকাই নিরাপত্তার প্রথম ধাপ।",
  },
  {
    title: "বিপদ বুঝলে নিরাপদ জায়গায় যাও",
    category: "Personal Safety",
    icon: "🏃‍♀️",
    content:
      "কোনো জায়গায় অস্বস্তি বা বিপদ মনে হলে দ্রুত জনবহুল, আলোযুক্ত বা নিরাপদ স্থানে চলে যাও।",
    advice: "নিজের নিরাপত্তাকে সবসময় অগ্রাধিকার দাও।",
  },
  {
    title: "জোরে সাহায্য চাও",
    category: "Emergency Response",
    icon: "📢",
    content:
      "কেউ বিরক্ত করলে বা বিপদে ফেললে জোরে সাহায্য চাও। আশপাশের মানুষকে নির্দিষ্টভাবে সাহায্য করতে বলো।",
    advice: "প্রয়োজনে চিৎকার করে মনোযোগ আকর্ষণ করো।",
  },
  {
    title: "জরুরি নম্বর মনে রাখো",
    category: "Emergency Response",
    icon: "☎️",
    content:
      "বাংলাদেশে জরুরি সহায়তার জন্য ৯৯৯ নম্বরে কল করা যায়। প্রয়োজনীয় নম্বর ফোনে Save করে রাখো।",
    advice: "জরুরি নম্বর: 999",
  },
  {
    title: "বিশ্বস্ত কাউকে জানাও",
    category: "Personal Safety",
    icon: "🤝",
    content:
      "কোথাও একা গেলে বিশ্বস্ত পরিবারের সদস্য বা বন্ধুকে গন্তব্য এবং পৌঁছানোর সম্ভাব্য সময় জানিয়ে রাখো।",
    advice: "বিশ্বস্ত মানুষের সঙ্গে যোগাযোগ রাখো।",
  },
  {
    title: "অপরিচিত ব্যক্তির কাছ থেকে সতর্ক থাকো",
    category: "Safety Basics",
    icon: "⚠️",
    content:
      "অপরিচিত কারও দেওয়া খাবার, পানীয় বা অপ্রয়োজনীয় সাহায্য গ্রহণের ক্ষেত্রে সতর্ক থাকো। নিজের সিদ্ধান্তকে গুরুত্ব দাও।",
    advice: "অস্বস্তি হলে বিনয়ের সঙ্গে না বলতে পারো।",
  },
  {
    title: "ফোন চার্জ রাখো",
    category: "Travel Safety",
    icon: "🔋",
    content:
      "বাইরে যাওয়ার আগে ফোন চার্জ করে নাও। প্রয়োজনে Power Bank সঙ্গে রাখো এবং জরুরি যোগাযোগের ব্যবস্থা রাখো।",
    advice: "ফোনের চার্জ তোমার জরুরি যোগাযোগের জন্য গুরুত্বপূর্ণ।",
  },
  {
    title: "অনলাইন তথ্য সুরক্ষিত রাখো",
    category: "Digital Safety",
    icon: "🔒",
    content:
      "নিজের ঠিকানা, লাইভ লোকেশন, পাসওয়ার্ড বা ব্যক্তিগত তথ্য অপরিচিত কারও সঙ্গে শেয়ার করো না।",
    advice: "শক্তিশালী পাসওয়ার্ড ব্যবহার করো।",
  },
  {
    title: "অস্বস্তিকর পরিস্থিতিতে নিজের সীমা জানাও",
    category: "Personal Safety",
    icon: "✋",
    content:
      "কেউ অনাকাঙ্ক্ষিত আচরণ করলে স্পষ্টভাবে না বলো। প্রয়োজনে সেখান থেকে সরে গিয়ে বিশ্বস্ত কারও সাহায্য নাও।",
    advice: "তোমার সম্মতি এবং ব্যক্তিগত সীমা গুরুত্বপূর্ণ।",
  },
  {
    title: "প্রয়োজনে প্রশিক্ষণ নাও",
    category: "Self-Defense",
    icon: "🥋",
    content:
      "যোগ্য প্রশিক্ষকের কাছ থেকে আত্মরক্ষার মৌলিক কৌশল শিখতে পারো। নিয়মিত অনুশীলন আত্মবিশ্বাস বাড়াতে সাহায্য করে।",
    advice: "প্রতিরোধের চেয়ে নিরাপদে সরে আসাকে অগ্রাধিকার দাও।",
  },
];

function SelfDefenseCards() {
  const [current, setCurrent] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("selfDefenseFavorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  const lesson = lessons[current];
  const isFavorite = favorites.includes(current);

  useEffect(() => {
    localStorage.setItem(
      "selfDefenseFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  function toggleFavorite() {
    setFavorites((previous) =>
      previous.includes(current)
        ? previous.filter((item) => item !== current)
        : [...previous, current]
    );
  }

  function previousCard() {
    setCurrent((previous) =>
      previous === 0 ? lessons.length - 1 : previous - 1
    );
  }

  function nextCard() {
    setCurrent((previous) =>
      previous === lessons.length - 1 ? 0 : previous + 1
    );
  }

  return (
    <section className="content-card page-card defense-page">
      <span className="eyebrow">LEARN AND STAY SAFE</span>
      <h1>Self-Defense Learning Cards</h1>

      <p>
        সহজ কিছু নিরাপত্তা বিষয় শিখে নিজের সচেতনতা ও আত্মবিশ্বাস বাড়াও।
      </p>

      <div className="defense-progress">
        <div>
          <strong>Learning Progress</strong>
          <span>
            {current + 1} / {lessons.length}
          </span>
        </div>

        <div className="defense-progress-track">
          <div
            className="defense-progress-fill"
            style={{
              width: `${((current + 1) / lessons.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="defense-card">
        <div className="defense-card-top">
          <span className="defense-category">
            {lesson.category}
          </span>

          <span className="defense-number">
            Card {current + 1}
          </span>
        </div>

        <div className="defense-icon">{lesson.icon}</div>

        <h2>{lesson.title}</h2>

        <p>{lesson.content}</p>

        <div className="defense-advice">
          <strong>💡 Remember:</strong>
          <p>{lesson.advice}</p>
        </div>

        <button
          className="defense-favorite"
          onClick={toggleFavorite}
        >
          {isFavorite ? "♥ Saved to Favorites" : "♡ Save to Favorites"}
        </button>
      </div>

      <div className="defense-navigation">
        <button onClick={previousCard}>
          ← Previous
        </button>

        <button onClick={nextCard}>
          Next →
        </button>
      </div>

      <div className="defense-favorite-count">
        <span>♥</span> Saved Favorites: {favorites.length}
      </div>

      {favorites.length > 0 && (
        <div className="defense-saved-list">
          <h3>Your Favorite Cards</h3>

          {favorites
            .slice()
            .sort((a, b) => a - b)
            .map((index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
              >
                {lessons[index].icon} {lessons[index].title} →
              </button>
            ))}
        </div>
      )}
    </section>
  );
}

export default SelfDefenseCards;
