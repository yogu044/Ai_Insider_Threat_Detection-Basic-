import pandas as pd
from sklearn.ensemble import IsolationForest
import pickle

df = pd.read_csv("../dataset.csv")


action_map = {"login": 1, "access_file": 2, "delete_file": 3}
df["action_code"] = df["Action"].map(action_map).fillna(0).astype(int)  

df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors='coerce')  
df["login_hour"] = df["Timestamp"].dt.hour


df = df.dropna(subset=["login_hour", "action_code"])

X = df[["login_hour", "action_code"]]
model = IsolationForest(contamination=0.2, random_state=42)
model.fit(X)


pickle.dump(model, open("model.pkl", "wb"))
print("✅ Trained and saved model.pkl")
