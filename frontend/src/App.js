import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    action: "",
    timestamp: "",
  });
  const [loading, setLoading] = useState(false);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [threatPrediction, setThreatPrediction] = useState(null);

  const formatTimestamp = (datetimeLocalValue) => {
    const date = new Date(datetimeLocalValue);
    const pad = (n) => String(n).padStart(2, "0");

    const formatted =
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    return formatted;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        timestamp: formatTimestamp(formData.timestamp),
      };

      const response = await axios.post("http://127.0.0.1:5000/predict", payload);

      setRecentPredictions(prev => [
        {
          name: formData.name,
          action: formData.action,
          timestamp: payload.timestamp,
          threat: response.data.threat,
        },
        ...prev.slice(0, 4),
      ]);

      setThreatPrediction(response.data.threat);
    } catch (error) {
      console.error("Prediction error:", error);
      setThreatPrediction("Error in prediction, please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex flex-col items-center p-6 space-y-8">
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <center>
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">
          🕵️ Insider Threat Detection
        </h2>
        </center>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        
          <div className="flex flex-col">
            <center>
            <label className="text-left text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            </center>
          </div>
          <br></br>

          
          <div className="flex flex-col">
            <center>
            <label className="text-left text-gray-700 font-medium mb-1">Action</label>
            <select
              name="action"
              value={formData.action}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select an action</option>
              <option value="login">Login</option>
              <option value="access_file">Access File</option>
              <option value="delete_file">Delete File</option>
            </select>
            </center>
          </div>
          <br></br>

          
          <div className="flex flex-col">
            <center>
            <label className="text-left text-gray-700 font-medium mb-1">Timestamp</label>
            <input
              type="datetime-local"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleChange}
              step="1"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            </center>
          </div>
          <br></br>
          <center>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300 mt-4"
          >
            Predict
          </button>
          </center>
        </form>
        <br></br>

        
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        <center>
        {!loading && threatPrediction && (
          <div className={`mt-6 p-4 rounded-lg font-semibold text-lg text-center
            ${threatPrediction === "Potential Threat" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}
          `}>
            Threat Prediction: {threatPrediction}
          </div>
        )}
        </center>
      </div>

      
      
      {recentPredictions.length > 0 && (
        <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-2xl mt-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">📋 Recent Predictions</h3>
          <ul className="space-y-3">
            {recentPredictions.map((item, index) => (
              <li key={index} className="bg-gray-50 flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-x-3 font-semibold text-gray-700">
                  <span>{item.name}</span>
                  <span>-</span>
                  <span>{item.action.replace("_", " ")}</span>
                  <span>-</span>
                  <span>{item.timestamp.slice(11, 16)}</span>
                  <span>-</span>
                  <span className={`${item.threat === "Potential Threat" ? "text-red-600" : "text-green-600"}`}>
                    {item.threat}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
    </div>
  );
}

export default App;
