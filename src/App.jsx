import React, { useState, useMemo } from "react";

export default function App() {
  const [members, setMembers] = useState(["Amit", "John"]);
  const [name, setName] = useState("");

  const [expenses, setExpenses] = useState([
    { title: "Cabin", amount: 300 },
    { title: "Fuel", amount: 120 },
  ]);

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const [tab, setTab] = useState("people");

  const total = useMemo(
    () => expenses.reduce((a, b) => a + Number(b.amount), 0),
    [expenses]
  );

  const addMember = () => {
    if (!name) return;
    setMembers([...members, name]);
    setName("");
  };

  const addExpense = () => {
    if (!expenseTitle || !expenseAmount) return;
    setExpenses([
      ...expenses,
      { title: expenseTitle, amount: Number(expenseAmount) },
    ]);
    setExpenseTitle("");
    setExpenseAmount("");
  };

  const btn = {
    padding: "10px 18px",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    borderRadius: "8px",
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Red River Gorge Trip 2026</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {["people", "budget", "photos", "stay", "cars", "timeline", "public"].map(
          (t) => (
            <button key={t} style={btn} onClick={() => setTab(t)}>
              {t}
            </button>
          )
        )}
      </div>

      {tab === "people" && (
        <>
          <input
            placeholder="Add member"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={addMember}>Add</button>

          <ul>
            {members.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </>
      )}

      {tab === "budget" && (
        <>
          <h2>Total: ${total}</h2>

          <input
            placeholder="Expense"
            value={expenseTitle}
            onChange={(e) => setExpenseTitle(e.target.value)}
          />
          <input
            placeholder="Amount"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <button onClick={addExpense}>Add</button>

          <ul>
            {expenses.map((e, i) => (
              <li key={i}>
                {e.title} - ${e.amount}
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "photos" && <h2>Photos Section</h2>}
      {tab === "stay" && <h2>Cabin Stay Details</h2>}
      {tab === "cars" && <h2>Carpool Plan</h2>}
      {tab === "timeline" && <h2>Trip Timeline</h2>}
      {tab === "public" && <h2>Share Public Page</h2>}
    </div>
  );
}
