from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
from datetime import datetime
from pymongo import MongoClient 

app = Flask(__name__)
CORS(app)


model = pickle.load(open("model.pkl", "rb"))


action_map = {"login": 1, "access_file": 2, "delete_file": 3}

client = MongoClient("mongodb://localhost:27017/")  
db = client["insider_threat_db"]
alerts_collection = db["alerts"]

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    try:
        name = data["name"]
        action = data["action"].lower().replace(" ", "_")
        timestamp = data["timestamp"]

        
        login_time = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
        login_hour = login_time.hour
        action_code = action_map.get(action, 0)

        
        features = pd.DataFrame([[login_hour, action_code]],
                                columns=["login_hour", "action_code"])

        
        prediction = model.predict(features)[0]
        threat = "Potential Threat" if prediction == -1 else "Normal"

        
        alerts_collection.insert_one({
            "name": name,
            "action": action,
            "timestamp": timestamp,
            "threat": threat,
            "created_at": datetime.utcnow()
        })

        return jsonify({"name": name, "threat": threat})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
