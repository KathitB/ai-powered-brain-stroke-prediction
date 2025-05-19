import React, { useState } from "react";
import axios from "axios";

function EnterStats() {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    hypertension: "",
    heart_disease: "",
    ever_married: "",
    work_type: "",
    Residence_type: "",
    avg_glucose_level: "",
    bmi: "",
    smoking_status: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict-data", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Enter Medical Data</h2>

      {/* Gender */}
      <label>Gender:</label>
      <select name="gender" onChange={handleChange}>
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      {/* Age */}
      <label>Age:</label>
      <input name="age" type="number" placeholder="Age" onChange={handleChange} />

      {/* Hypertension */}
      <label>Hypertension:</label>
      <select name="hypertension" onChange={handleChange}>
        <option value="">Select</option>
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>

      {/* Heart Disease */}
      <label>Heart Disease:</label>
      <select name="heart_disease" onChange={handleChange}>
        <option value="">Select</option>
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>

      {/* Ever Married */}
      <label>Ever Married:</label>
      <select name="ever_married" onChange={handleChange}>
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

      {/* Work Type */}
      <label>Work Type:</label>
      <select name="work_type" onChange={handleChange}>
        <option value="">Select</option>
        <option value="Private">Private</option>
        <option value="Self-employed">Self-employed</option>
        <option value="Govt_job">Govt Job</option>
        <option value="Children">Children</option>
        <option value="Never_worked">Never worked</option>
      </select>

      {/* Residence Type */}
      <label>Residence Type:</label>
      <select name="Residence_type" onChange={handleChange}>
        <option value="">Select</option>
        <option value="Urban">Urban</option>
        <option value="Rural">Rural</option>
      </select>

      {/* Average Glucose Level */}
      <label>Avg Glucose Level:</label>
      <input name="avg_glucose_level" type="number" placeholder="Glucose Level" onChange={handleChange} />

      {/* BMI */}
      <label>BMI:</label>
      <input name="bmi" type="number" placeholder="BMI" onChange={handleChange} />

      {/* Smoking Status */}
      <label>Smoking Status:</label>
      <select name="smoking_status" onChange={handleChange}>
        <option value="">Select</option>
        <option value="smokes">Smokes</option>
        <option value="formerly smoked">Formerly Smoked</option>
        <option value="never smoked">Never Smoked</option>
        <option value="Unknown">Unknown</option>
      </select>

      {/* Submit Button */}
      <button onClick={handleSubmit}>Predict</button>

      {/* Display Prediction Result */}
      {result && (
        <p>
          Prediction: {result.prediction} (Confidence: {result.confidence?.toFixed(2) || "N/A"})
        </p>
      )}
    </div>
  );
}

export default EnterStats;
