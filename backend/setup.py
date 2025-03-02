import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect("piggybank.db")
cursor = conn.cursor()

# Create a table to store transactions
cursor.execute("""
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    note TEXT
)
""")

# Create a table to store the user's savings goal
cursor.execute("""
CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_name TEXT NOT NULL,  -- Added goal_name column
    goal_amount REAL NOT NULL
)
""")

# Create a table to store users
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
""")

# Commit and close connection
conn.commit()
conn.close()

print("Database setup complete! 🎉")
