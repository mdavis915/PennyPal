import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function GoalsForm() {
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goals, setGoals] = useState([]); // Local state for storing fetched goals

  // Function to fetch goals from the server
  const fetchGoals = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/goals");
      if (!response.ok) throw new Error("Failed to fetch goals");

      const data = await response.json();
      setGoals(data); // Update state with the fetched goals
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals();
  }, []);

  // Function to create a new goal
  const handleCreateGoal = async () => {
    if (!goalName || !goalAmount) {
      alert("Please enter both goal name and amount.");
      return;
    }

    const newGoal = {
      goal_name: goalName,
      goal_amount: parseFloat(goalAmount),
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/set-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      });

      if (response.ok) {
        alert("Goal created successfully!");
        setGoalName("");
        setGoalAmount("");
        fetchGoals(); // Refresh goal list after adding a new goal
      } else {
        alert("Failed to create goal.");
      }
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  // Function to calculate the progress of each goal
  const calculateProgress = (savedAmount, goalAmount) => {
    return (savedAmount / goalAmount) * 100;
  };

  return (
    <div className="container goal-container">
      <h2>Create a New Goal</h2>

      {/* Goal Name Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Goal Name"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />
      </div>

      {/* Goal Amount Input */}
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Goal Amount"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
        />
      </div>

      <button onClick={handleCreateGoal} className="btn btn-primary">
        Set Goal
      </button>

      {/* Display Goals List */}
      <h3>My Goals</h3>
      <div className="goals-list">
        {goals.length > 0 ? (
          goals.map((goal, index) => {
            // Calculate the progress percentage
            const progress = calculateProgress(goal.saved_amount, goal.goal_amount);

            return (
              <div className="card mb-4 shadow-lg" key={index} style={{ borderRadius: "15px" }}>
                <div className="card-body">
                  <h5 className="card-title text-center text-primary">{goal.goal_name}</h5>
                  <p className="card-text text-center">
                    <strong>Goal Amount:</strong> ${goal.goal_amount}
                  </p>
                  <p className="card-text text-center">
                    <strong>Saved:</strong> ${goal.saved_amount || 0}
                  </p>

                  {/* Bootstrap Progress Bar */}
                  <div className="progress mb-2" style={{ height: "20px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: "#4caf50", // Green color for the progress bar
                      }}
                      aria-valuenow={Math.min(progress, 100)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="text-center">
                    <small className="text-muted">{Math.min(progress, 100).toFixed(2)}% completed</small>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No goals set yet.</p>
        )}
      </div>
    </div>
  );
}

export default GoalsForm;
