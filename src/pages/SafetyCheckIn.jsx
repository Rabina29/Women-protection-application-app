
import { useEffect, useState } from "react";

function SafetyCheckIn() {
  const [minutes, setMinutes] = useState("10");
  const [phone, setPhone] = useState("");
  const [endTime, setEndTime] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [expired, setExpired] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!endTime || expired || completed) return;

    const updateTimer = () => {
      const seconds = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setRemaining(seconds);

      if (seconds <= 0) {
        setExpired(true);
        setEndTime(null);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, expired, completed]);

  function startTimer() {
    setExpired(false);
    setCompleted(false);

    const duration = Number(minutes) * 60;
    setRemaining(duration);
    setEndTime(Date.now() + duration * 1000);
  }

  function stopTimer() {
    setEndTime(null);
    setRemaining(0);
    setCompleted(true);
    setExpired(false);
  }

  function resetTimer() {
    setEndTime(null);
    setRemaining(0);
    setCompleted(false);
    setExpired(false);
  }

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #dce5d7",
    borderRadius: "14px",
    padding: "24px",
    maxWidth: "650px",
    margin: "0 auto",
    color: "#35483a"
  };

  const buttonStyle = {
    background: "#35483a",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    margin: "6px"
  };

  return (
    <section style={cardStyle}>
      <span style={{ fontSize: "35px" }}>⏱️</span>

      <h1>Safety Check-in Timer</h1>

      <p>
        Set a timer when going somewhere. Check in before
        the timer ends to confirm that you are safe.
      </p>

      {!endTime && !expired && !completed && (
        <>
          <label>
            <strong>Select Timer Duration</strong>
          </label>

          <select
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              margin: "12px 0",
              borderRadius: "8px"
            }}
          >
            <option value="5">5 Minutes</option>
            <option value="10">10 Minutes</option>
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">60 Minutes</option>
          </select>

          <label>
            <strong>Trusted Contact Phone (Optional)</strong>
          </label>

          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              margin: "12px 0"
            }}
          />

          <button style={buttonStyle} onClick={startTimer}>
            Start Check-in
          </button>
        </>
      )}

      {endTime && (
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <h2>Time Remaining</h2>

          <div style={{ fontSize: "55px", fontWeight: "bold" }}>
            {formatTime(remaining)}
          </div>

          <p>Press the button below when you are safe.</p>

          <button
            style={{ ...buttonStyle, background: "#287a45" }}
            onClick={stopTimer}
          >
            ✓ I'm Safe
          </button>

          <button
            style={{ ...buttonStyle, background: "#777" }}
            onClick={resetTimer}
          >
            Cancel Timer
          </button>
        </div>
      )}

      {completed && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ color: "green" }}>✓ Check-in Successful!</h2>
          <p>You confirmed that you are safe.</p>
          <button style={buttonStyle} onClick={resetTimer}>
            Start Again
          </button>
        </div>
      )}

      {expired && (
        <div
          style={{
            background: "#fff0f0",
            border: "1px solid #c62840",
            padding: "18px",
            borderRadius: "10px",
            marginTop: "20px"
          }}
        >
          <h2 style={{ color: "#c62840" }}>
            ⚠️ Check-in Time Expired!
          </h2>

          <p>
            You did not confirm your safety before the timer ended.
            Please contact someone you trust.
          </p>

          {phone && (
            <a href={`tel:${phone}`} style={buttonStyle}>
              Call Trusted Contact
            </a>
          )}

          <a href="tel:999" style={buttonStyle}>
            Call Emergency 999
          </a>

          <button style={buttonStyle} onClick={resetTimer}>
            Start Again
          </button>
        </div>
      )}

      <p style={{ fontSize: "12px", color: "#777", marginTop: "25px" }}>
        Note: This feature displays an alert on the website.
        It does not automatically send SMS, call contacts,
        or notify emergency services.
      </p>
    </section>
  );
}

export default SafetyCheckIn;
