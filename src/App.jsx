import React, { useMemo, useState } from "react";

export default function TripApp() {
  const [tab, setTab] = useState("people");

  const [members, setMembers] = useState(["Amit", "John"]);
  const [name, setName] = useState("");

  const [photos, setPhotos] = useState([]);

  const [expenses, setExpenses] = useState([
    { title: "Stay", amount: 300 },
    { title: "Fuel", amount: 120 },
  ]);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const [cars, setCars] = useState([
    { driver: "Amit", seats: 4, passengers: "John" },
  ]);
  const [carDriver, setCarDriver] = useState("");
  const [carSeats, setCarSeats] = useState("");
  const [carPassengers, setCarPassengers] = useState("");

  const [stay, setStay] = useState([
    { place: "Cabin", date: "Jun 14", time: "3:00 PM" },
  ]);
  const [stayPlace, setStayPlace] = useState("");
  const [stayDate, setStayDate] = useState("");
  const [stayTime, setStayTime] = useState("");

  const [timeline, setTimeline] = useState([
    { time: "Fri 8:00 AM", task: "Leave Atlanta" },
    { time: "Fri 1:00 PM", task: "Check-in Cabin" },
  ]);
  const [timelineTime, setTimelineTime] = useState("");
  const [timelineTask, setTimelineTask] = useState("");

  const [comments, setComments] = useState([
    { name: "Admin", text: "Welcome to the trip planner!" },
  ]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");

  const totalBudget = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses]
  );

  const split = members.length
    ? (totalBudget / members.length).toFixed(2)
    : "0.00";

  const categoryTotals = useMemo(() => {
    const totals = {};
    expenses.forEach((item) => {
      totals[item.title] =
        (totals[item.title] || 0) + Number(item.amount || 0);
    });
    return totals;
  }, [expenses]);

  const addMember = () => {
    if (!name.trim()) return;
    setMembers([...members, name.trim()]);
    setName("");
  };

  const removeMember = (i) => {
    setMembers(members.filter((_, index) => index !== i));
  };

  const addExpense = () => {
    if (!expenseTitle || !expenseAmount) return;
    setExpenses([
      ...expenses,
      {
        title: expenseTitle,
        amount: Number(expenseAmount),
      },
    ]);
    setExpenseTitle("");
    setExpenseAmount("");
  };

  const removeExpense = (i) => {
    setExpenses(expenses.filter((_, index) => index !== i));
  };

  const uploadPhotos = (e) => {
    const files = [...e.target.files].map((file) =>
      URL.createObjectURL(file)
    );
    setPhotos([...photos, ...files]);
  };

  const removePhoto = (i) => {
    setPhotos(photos.filter((_, index) => index !== i));
  };

  const addCar = () => {
    if (!carDriver || !carSeats) return;
    setCars([
      ...cars,
      {
        driver: carDriver,
        seats: carSeats,
        passengers: carPassengers,
      },
    ]);
    setCarDriver("");
    setCarSeats("");
    setCarPassengers("");
  };

  const removeCar = (i) => {
    setCars(cars.filter((_, index) => index !== i));
  };

  const addStay = () => {
    if (!stayPlace) return;
    setStay([
      ...stay,
      {
        place: stayPlace,
        date: stayDate,
        time: stayTime,
      },
    ]);
    setStayPlace("");
    setStayDate("");
    setStayTime("");
  };

  const removeStay = (i) => {
    setStay(stay.filter((_, index) => index !== i));
  };

  const addTimeline = () => {
    if (!timelineTime || !timelineTask) return;
    setTimeline([
      ...timeline,
      {
        time: timelineTime,
        task: timelineTask,
      },
    ]);
    setTimelineTime("");
    setTimelineTask("");
  };

  const removeTimeline = (i) => {
    setTimeline(timeline.filter((_, index) => index !== i));
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments([
      ...comments,
      {
        name: commentName || "Guest",
        text: commentText,
      },
    ]);
    setCommentName("");
    setCommentText("");
  };

  const removeComment = (i) => {
    setComments(comments.filter((_, index) => index !== i));
  };

  const btn = {
    padding: "12px 18px",
    borderRadius: 999,
    border: "1px solid #dbeafe",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
  };

  const card = {
    background: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginTop: 18,
    border: "1px solid #e5e7eb",
  };

  const input = {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    minWidth: 180,
  };

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "Arial, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: 44, marginBottom: 6 }}>
        🏕️ Red River Gorge Trip 2026
      </h1>

      <p style={{ color: "#475569" }}>
        Live planner • mobile ready • group collaboration
      </p>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          margin: "24px 0",
        }}
      >
        {[
          "people",
          "budget",
          "photos",
          "stay",
          "cars",
          "timeline",
          "comments",
          "guide",
          "public",
        ].map((item) => (
          <button
            key={item}
            style={btn}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "people" && (
        <div style={card}>
          <h2>👥 People</h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              style={input}
              placeholder="Add member"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button style={btn} onClick={addMember}>
              Add
            </button>
          </div>

          <ul>
            {members.map((member, i) => (
              <li key={i} style={{ margin: "10px 0" }}>
                {member}{" "}
                <button onClick={() => removeMember(i)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "budget" && (
        <div style={card}>
          <h2>💰 Total Budget: ${totalBudget}</h2>
          <h3>Per Person Split: ${split}</h3>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              style={input}
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
            >
              <option value="">Select Category</option>
              <option>Stay</option>
              <option>Food</option>
              <option>Activities</option>
              <option>Fuel</option>
              <option>Other</option>
            </select>

            <input
              style={input}
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />

            <button style={btn} onClick={addExpense}>
              Add
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            {Object.entries(categoryTotals).map(([key, value]) => (
              <p key={key}>
                {key}: ${value} total → $
                {(value / members.length).toFixed(2)} each
              </p>
            ))}
          </div>

          <ul>
            {expenses.map((item, i) => (
              <li key={i}>
                {item.title} - ${item.amount}{" "}
                <button onClick={() => removeExpense(i)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "photos" && (
        <div style={card}>
          <h2>📸 Photos</h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={uploadPhotos}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(140px,1fr))",
              gap: 12,
              marginTop: 16,
            }}
          >
            {photos.map((photo, i) => (
              <div key={i}>
                <img
                  src={photo}
                  alt=""
                  style={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
                <button onClick={() => removePhoto(i)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "stay" && (
        <div style={card}>
          <h2>🏡 Stay</h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              style={input}
              placeholder="Place"
              value={stayPlace}
              onChange={(e) => setStayPlace(e.target.value)}
            />
            <input
              style={input}
              placeholder="Date"
              value={stayDate}
              onChange={(e) => setStayDate(e.target.value)}
            />
            <input
              style={input}
              placeholder="Time"
              value={stayTime}
              onChange={(e) => setStayTime(e.target.value)}
            />

            <button style={btn} onClick={addStay}>
              Add
            </button>
          </div>

          {stay.map((item, i) => (
            <p key={i}>
              {item.place} • {item.date} • {item.time}{" "}
              <button onClick={() => removeStay(i)}>
                Delete
              </button>
            </p>
          ))}
        </div>
      )}

      {tab === "cars" && (
        <div style={card}>
          <h2>🚗 Cars</h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              style={input}
              placeholder="Driver"
              value={carDriver}
              onChange={(e) => setCarDriver(e.target.value)}
            />
            <input
              style={input}
              placeholder="Seats"
              value={carSeats}
              onChange={(e) => setCarSeats(e.target.value)}
            />
            <input
              style={input}
              placeholder="Passengers"
              value={carPassengers}
              onChange={(e) => setCarPassengers(e.target.value)}
            />

            <button style={btn} onClick={addCar}>
              Add
            </button>
          </div>

          {cars.map((car, i) => (
            <p key={i}>
              {car.driver} • Seats {car.seats} •{" "}
              {car.passengers}{" "}
              <button onClick={() => removeCar(i)}>
                Delete
              </button>
            </p>
          ))}
        </div>
      )}

      {tab === "timeline" && (
        <div style={card}>
          <h2>🕒 Timeline</h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              style={input}
              placeholder="Time"
              value={timelineTime}
              onChange={(e) => setTimelineTime(e.target.value)}
            />

            <input
              style={input}
              placeholder="Activity"
              value={timelineTask}
              onChange={(e) => setTimelineTask(e.target.value)}
            />

            <button style={btn} onClick={addTimeline}>
              Add
            </button>
          </div>

          {timeline.map((item, i) => (
            <p key={i}>
              <b>{item.time}</b> - {item.task}{" "}
              <button onClick={() => removeTimeline(i)}>
                Delete
              </button>
            </p>
          ))}
        </div>
      )}

      {tab === "comments" && (
        <div style={card}>
          <h2>💬 Comments</h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              style={input}
              placeholder="Name"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
            />

            <input
              style={input}
              placeholder="Comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            <button style={btn} onClick={addComment}>
              Add
            </button>
          </div>

          {comments.map((item, i) => (
            <p key={i}>
              <b>{item.name}:</b> {item.text}{" "}
              <button onClick={() => removeComment(i)}>
                Delete
              </button>
            </p>
          ))}
        </div>
      )}

      {tab === "guide" && (
        <div style={card}>
          <h2>🗺️ Travel Dashboard</h2>

          <p>📍 Sky Bridge</p>
          <p>📍 Natural Bridge</p>
          <p>📍 Chimney Top Rock</p>
          <p>🌦️ Slade, KY Weather</p>
          <p>🧭 Google Maps Route</p>
        </div>
      )}

      {tab === "public" && (
        <div style={card}>
          <h2>🌍 Public Share</h2>

          <p>Members: {members.length}</p>
          <p>Total Budget: ${totalBudget}</p>
          <p>Split Each: ${split}</p>
        </div>
      )}
    </div>
  );
}
