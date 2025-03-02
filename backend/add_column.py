import sqlite3

# Connect to the database
conn = sqlite3.connect('piggybank.db')
cursor = conn.cursor()

# Add the current_progress column to the goals table
cursor.execute("ALTER TABLE goals ADD COLUMN saved_amount REAL DEFAULT 0")

# Commit the changes and close the connection
conn.commit()
conn.close()

print("current_progress column added to goals table.")
