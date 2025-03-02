from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Function to connect to the database
def get_db_connection():
    conn = sqlite3.connect("piggybank.db")
    conn.row_factory = sqlite3.Row  # Allows accessing columns by name
    return conn

@app.route("/")
def home():
    return "Welcome to PennyPal!"

# Route to register a new user
@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    username = data["username"]
    password = data["password"]
    
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"message": "Username already exists!"}), 400
    finally:
        conn.close()

# Route to authenticate user (login)
@app.route("/login", methods=["POST"])
def login_user():
    data = request.json
    username = data["username"]
    password = data["password"]

    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()

    if user:
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"message": "Invalid username or password!"}), 401

# Route to add a transaction (deposit towards a goal or general deposit)
@app.route("/add-transaction", methods=["POST"])
def add_transaction():
    data = request.json
    amount = data["amount"]
    note = data.get("note", "")
    goal_id = data.get("goal_id")  # Optional: if a goal is specified

    conn = get_db_connection()
    cursor = conn.cursor()

    # If a goal_id is provided, link the transaction to the goal
    if goal_id:
        # Fetch the goal to check if it exists
        cursor.execute("SELECT * FROM goals WHERE id = ?", (goal_id,))
        goal = cursor.fetchone()

        if goal is None:
            return jsonify({"message": "Goal not found!"}), 404

        # Access the 'saved_amount' directly using goal["saved_amount"]
        saved_amount = goal["saved_amount"] if "saved_amount" in goal else 0.0
        new_saved_amount = saved_amount + amount

        # Update the saved_amount for the goal
        cursor.execute("UPDATE goals SET saved_amount = ? WHERE id = ?", (new_saved_amount, goal_id))
        conn.commit()

        # Record the transaction
        cursor.execute("INSERT INTO transactions (amount, goal_id, date, note) VALUES (?, ?, datetime('now'), ?)", 
                       (amount, goal_id, note))
        conn.commit()

    else:
        # If no goal_id is provided, it's a general deposit (not linked to any goal)
        cursor.execute("INSERT INTO transactions (amount, date, note) VALUES (?, datetime('now'), ?)", (amount, note))
        conn.commit()

    conn.close()
    return jsonify({"message": "Transaction added successfully!"}), 201


# Route to fetch all transactions
@app.route("/transactions", methods=["GET"])
def get_transactions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions ORDER BY date DESC")
    transactions = cursor.fetchall()
    conn.close()

    return jsonify([dict(tx) for tx in transactions])

# Route to set a savings goal
@app.route("/set-goal", methods=["POST"])
def set_goal():
    data = request.json
    goal_name = data["goal_name"]
    goal_amount = data["goal_amount"]
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO goals (goal_name, goal_amount, saved_amount) VALUES (?, ?, ?)", 
                   (goal_name, goal_amount, 0))  # Initial saved amount is 0
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Goal set successfully!"}), 201

# ✅ New route to fetch all goals, including saved_amount
@app.route("/goals", methods=["GET"])
def get_goals():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM goals ORDER BY goal_amount DESC")  # Fetch goals ordered by amount
    goals = cursor.fetchall()
    conn.close()

    return jsonify([dict(goal) for goal in goals])  # Convert SQLite rows to dictionaries

if __name__ == "__main__":
    app.run(debug=True)
