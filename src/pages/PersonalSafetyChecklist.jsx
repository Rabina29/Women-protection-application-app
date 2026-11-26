
import { useEffect, useState } from "react";
import "./PersonalSafetyChecklist.css";

const initialTasks = [
  {
    id: 1,
    title: "Phone is fully charged",
    description: "Make sure your phone has enough battery.",
  },
  {
    id: 2,
    title: "Emergency numbers are saved",
    description: "Keep important helpline numbers available.",
  },
  {
    id: 3,
    title: "Trusted contacts are ready",
    description: "Make sure your emergency contacts are saved.",
  },
  {
    id: 4,
    title: "Travel route is planned",
    description: "Know your destination and preferred route.",
  },
  {
    id: 5,
    title: "Family or friend is informed",
    description: "Tell someone you trust about your journey.",
  },
  {
    id: 6,
    title: "Location sharing is ready",
    description: "Be prepared to share your location if needed.",
  },
  {
    id: 7,
    title: "Important belongings are secured",
    description: "Check your bag, money and necessary documents.",
  },
];

function PersonalSafetyChecklist() {
  const [checkedTasks, setCheckedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("personalSafetyChecklist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "personalSafetyChecklist",
      JSON.stringify(checkedTasks)
    );
  }, [checkedTasks]);

  const completed = checkedTasks.length;
  const progress = Math.round(
    (completed / initialTasks.length) * 100
  );

  function toggleTask(id) {
    setCheckedTasks((previous) =>
      previous.includes(id)
        ? previous.filter((taskId) => taskId !== id)
        : [...previous, id]
    );
  }

  function resetChecklist() {
    setCheckedTasks([]);
  }

  return (
    <section className="content-card page-card checklist-page">
      <span className="eyebrow">PERSONAL SAFETY TOOL</span>

      <h1>Personal Safety Checklist</h1>

      <p className="checklist-intro">
        Before going outside, complete these simple safety checks.
        Your safety always comes first!
      </p>

      <div className="checklist-progress">
        <div className="progress-info">
          <strong>Your Preparation</strong>
          <strong>{progress}%</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p>
          {completed} of {initialTasks.length} tasks completed
        </p>
      </div>

      <div className="checklist-items">
        {initialTasks.map((task) => {
          const isChecked = checkedTasks.includes(task.id);

          return (
            <label
              className={`checklist-item ${
                isChecked ? "completed" : ""
              }`}
              key={task.id}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleTask(task.id)}
              />

              <span className="checklist-text">
                <strong>{task.title}</strong>
                <small>{task.description}</small>
              </span>

              <span className="checklist-check">
                {isChecked ? "✓" : ""}
              </span>
            </label>
          );
        })}
      </div>

      {completed === initialTasks.length && (
        <div className="checklist-success">
          ✓ All safety checks completed! Stay safe.
        </div>
      )}

      <button
        className="checklist-reset"
        onClick={resetChecklist}
      >
        ↻ Reset Checklist
      </button>
    </section>
  );
}

export default PersonalSafetyChecklist;
