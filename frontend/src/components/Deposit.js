import React, { useState, useEffect } from "react";

function TransactionForm() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isDeposit, setIsDeposit] = useState(true); // Toggle between deposit/withdraw
  const [goals, setGoals] = useState([]); // Goals list
  const [selectedGoal, setSelectedGoal] = useState(""); // Selected goal

  // Fetch goals from the server
  const fetchGoals = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/goals");
      if (!response.ok) throw new Error("Failed to fetch goals");

      const data = await response.json();
      setGoals(data); // Set the fetched goals
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleTransaction = async () => {
    if (isDeposit && !selectedGoal) {
      alert("Please select a goal to deposit towards.");
      return;
    }

    const transaction = {
      amount: isDeposit ? parseFloat(amount) : -parseFloat(amount), // Negative for withdrawals
      note,
      goal_id: isDeposit ? selectedGoal : null, // Only include goal_id for deposits
    };

    const response = await fetch("http://127.0.0.1:5000/add-transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });

    if (response.ok) {
      alert(`${isDeposit ? "Deposit" : "Withdrawal"} Successful!`);
      setAmount("");
      setNote("");
      if (isDeposit) {
        setSelectedGoal(""); // Reset goal selection after deposit
      }
    } else {
      alert(`${isDeposit ? "Deposit" : "Withdrawal"} Failed`);
    }
  };

  return (
    <div className="transaction-container">
      <h2>{isDeposit ? "Enter an amount to deposit" : "Enter an amount to withdraw"}</h2>

      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button className={isDeposit ? "active" : ""} onClick={() => setIsDeposit(true)}>Deposit</button>
        <button className={!isDeposit ? "active" : ""} onClick={() => setIsDeposit(false)}>Withdraw</button>
      </div>

      {/* Amount Input */}
      <div className="input-group">
        <span className="currency-symbol">$</span>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="transaction-input"
        />
      </div>

      {/* Note Input */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Add a note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="transaction-input"
        />
      </div>

      {/* Goal Selection (Only shown for deposits) */}
      {isDeposit && (
        <div className="input-group">
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="transaction-input"
          >
            <option value="">Select a Goal</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.goal_name} - ${goal.goal_amount}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleTransaction} className={isDeposit ? "deposit-button" : "withdraw-button"}>
        {isDeposit ? "Deposit" : "Withdraw"}
      </button>
    </div>
  );
}

export default TransactionForm;
