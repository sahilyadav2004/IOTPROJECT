
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const timeRef = useRef(null);
  const dateInputRef = useRef(null);
  const tInputRef = useRef(null);
  const btnRef = useRef(null);
  const contanRef = useRef(null);
  const [alarms, setAlarms] = useState([]);
  const maxAlarms = 7;

  useEffect(() => {
    const updateTime = () => {
      const curr = new Date();
      let hrs = curr.getHours();
      let min = String(curr.getMinutes()).padStart(2, "0");
      let sec = String(curr.getSeconds()).padStart(2, "0");
      let period = "AM";

      if (hrs >= 12) {
        period = "PM";
        if (hrs > 12) {
          hrs -= 12;
        }
      }
      hrs = String(hrs).padStart(2, "0");
      if (timeRef.current) {
        timeRef.current.textContent = `${hrs}:${min}:${sec} ${period}`;
      }
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const alarmSetFunction = () => {
    const now = new Date();
    const selectedDate = new Date(dateInputRef.current.value + "T" + tInputRef.current.value);

    if (selectedDate <= now) {
      alert("Invalid time. Please select a future date and time.");
      return;
    }

    if (alarms.some(alarm => alarm.date.getTime() === selectedDate.getTime())) {
      alert("You cannot set multiple alarms for the same time.");
      return;
    }

    if (alarms.length < maxAlarms) {
      const timeUntilAlarm = selectedDate - now;
      const newAlarm = { date: selectedDate, timeout: setTimeout(() => alert("Time to wake up!"), timeUntilAlarm) };

      setAlarms(prevAlarms => [...prevAlarms, newAlarm]);
      const alarmDiv = document.createElement("div");
      alarmDiv.classList.add("alarm");
      alarmDiv.innerHTML = `
        <span>${selectedDate.toLocaleString()}</span>
        <button class="delete-alarm">Delete</button>
      `;

      alarmDiv.querySelector(".delete-alarm").addEventListener("click", () => {
        alarmDiv.remove();
        clearTimeout(newAlarm.timeout);
        setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm !== newAlarm));
      });

      contanRef.current.appendChild(alarmDiv);
    } else {
      alert("You can only set a maximum of 3 alarms.");
    }
  };

  return (
    <div className="body">
      <div className="clock">
        <h1>A Smart Alarm Clock</h1>
        <div className="time" id="time" ref={timeRef}>
          00:00:00
        </div>
        <div className="input-row">
          <div className="input-field">
            <label htmlFor="alarmDate">Select Date:</label>
            <input type="date" id="alarmDate" ref={dateInputRef} className="alarm-input" />
          </div>
          <div className="input-field">
            <label htmlFor="alarmTime">Select Time:</label>
            <input type="time" id="alarmTime" ref={tInputRef} className="alarm-input" />
          </div>
          <button id="setAlarm" ref={btnRef} onClick={alarmSetFunction}>Set Alarm</button>
        </div>
        <div className="alarms" id="alarms" ref={contanRef}></div>
      </div>
    </div>
  );
}

export default App;
