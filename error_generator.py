import pandas as pd
import random
import schedule
import time
from datetime import datetime

# Error types that match our categories.csv
error_types = [
    ("Job Title Error", "Job Title Mismatch detected for employee"),
    ("Cascade Profile Error", "Cascade Profile sync failed for employee"),
    ("System Error", "Critical system failure detected for employee"),
    ("Access Error", "Access denied when processing employee"),
    ("Data Error", "Data mismatch found for employee"),
    ("Config Error", "Configuration issue detected for employee"),
]

def generate_errors():
    print(f"[{datetime.now()}] Generating errors...")
    
    # Generate 3-6 random errors
    num_errors = random.randint(3, 6)
    new_rows = []
    
    for _ in range(num_errors):
        error = random.choice(error_types)
        emp_id = f"EMP{random.randint(100000, 999999)}"
        new_rows.append({
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "emp_id": emp_id,
            "long_message": f"{error[1]} {emp_id} in the system",
            "short_message": error[0]
        })
    
    # Read existing errors
    try:
        df = pd.read_csv("errors.csv")
    except:
        df = pd.DataFrame(columns=["date", "emp_id", "long_message", "short_message"])
    
    # Add new errors
    new_df = pd.DataFrame(new_rows)
    df = pd.concat([df, new_df], ignore_index=True)
    
    # Save back to CSV
    df.to_csv("errors.csv", index=False)
    print(f"[{datetime.now()}] Added {num_errors} errors to errors.csv")

# Run immediately once
generate_errors()

# Then run every 5 minutes
schedule.every(5).minutes.do(generate_errors)

print("Error generator running... Press Ctrl+C to stop")
while True:
    schedule.run_pending()
    time.sleep(1)