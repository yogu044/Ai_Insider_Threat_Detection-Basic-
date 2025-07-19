import requests


test_users = [
    {"name": "Yogesh", "action": "login", "timestamp": "2025-04-26 03:15:00"},   
    {"name": "Anita", "action": "access_file", "timestamp": "2025-04-26 14:30:00"},
    {"name": "Vikram", "action": "delete_file", "timestamp": "2025-04-26 02:45:00"}, 
    {"name": "Neha", "action": "login", "timestamp": "2025-04-26 12:00:00"},       
]


for user in test_users:
    response = requests.post("http://127.0.0.1:5000/predict", json=user)
    print(f"Input: {user}")
    print(f"Server Response: {response.json()}\n")
