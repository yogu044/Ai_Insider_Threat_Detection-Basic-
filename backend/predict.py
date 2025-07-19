import pandas as pd
import pickle

model = pickle.load(open("model.pkl", "rb"))

df = pd.read_csv("../dataset.csv")


action_map = {"login": 1, "access_file": 2, "delete_file": 3}
df["action_code"] = df["Action"].map(action_map)

df["login_hour"] = pd.to_datetime(df["Timestamp"]).dt.hour

X = df[["login_hour", "action_code"]]


df["prediction"] = model.predict(X)
df["threat"] = df["prediction"].map({-1: "Potential Threat", 1: "Normal"})

print(df[["Name", "Action", "Timestamp", "threat"]])
