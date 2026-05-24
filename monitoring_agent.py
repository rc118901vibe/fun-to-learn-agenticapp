import pandas as pd
import smtplib
import schedule
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Your email settings
SENDER_EMAIL = "tamalika.chakraborty@gmail.com"
SENDER_PASSWORD = "koqm ajyj fqap ntft"
RECEIVER_EMAIL = "tamalika.chakraborty@capgemini.com"

def monitor_errors():
    print(f"[{datetime.now()}] Monitoring errors...")

    try:
        errors_df = pd.read_csv("errors.csv")
        categories_df = pd.read_csv("categories.csv")
    except Exception as e:
        print(f"Error reading files: {e}")
        return

    # Merge errors with categories
    merged = errors_df.merge(
        categories_df,
        left_on="short_message",
        right_on="error_type",
        how="left"
    )

    # Find high priority errors
    high_priority = merged[merged["priority"] == "Real-Prio High"]

    if len(high_priority) > 0:
        print(f"Found {len(high_priority)} high priority errors! Sending email...")
        send_alert_email(high_priority)
    else:
        print("No high priority errors found.")

def send_alert_email(high_priority_errors):
    try:
        # Build email body
        body = f"""
        <h2>🚨 High Priority Errors Detected!</h2>
        <p>The following high priority errors were found:</p>
        <table border="1" cellpadding="5">
            <tr>
                <th>Date</th>
                <th>Employee ID</th>
                <th>Error Type</th>
                <th>Message</th>
                <th>Priority</th>
            </tr>
        """

        for _, row in high_priority_errors.iterrows():
            body += f"""
            <tr>
                <td>{row['date']}</td>
                <td>{row['emp_id']}</td>
                <td>{row['error_type']}</td>
                <td>{row['long_message']}</td>
                <td style="color:red"><b>{row['priority']}</b></td>
            </tr>
            """

        body += "</table>"

        # Create email
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🚨 Alert: {len(high_priority_errors)} High Priority Errors Detected"
        msg["From"] = SENDER_EMAIL
        msg["To"] = RECEIVER_EMAIL
        msg.attach(MIMEText(body, "html"))

        # Send email
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())

        print(f"[{datetime.now()}] Alert email sent successfully!")

    except Exception as e:
        print(f"Error sending email: {e}")

# Run immediately once
monitor_errors()

# Then run every 5 minutes
#schedule.every(5).minutes.do(monitor_errors)
schedule.every().day.at("21:10").do(monitor_errors)

print("Monitoring agent running... Press Ctrl+C to stop")
while True:
    schedule.run_pending()
    time.sleep(1)