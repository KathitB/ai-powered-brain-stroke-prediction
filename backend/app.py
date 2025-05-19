from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import joblib
from PIL import Image
import os
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load models at startup
cnn_model_path = "models/trial_model_1.h5"
rf_model_path = "models/random_forest_model.pkl"
feature_columns_path = "models/expected_columns.pkl"

# Load CNN Model
if os.path.exists(cnn_model_path):
    cnn_model = tf.keras.models.load_model(cnn_model_path)
else:
    cnn_model = None

# Load Random Forest Model & Feature Columns
if os.path.exists(rf_model_path) and os.path.exists(feature_columns_path):
    rf_model = joblib.load(rf_model_path)
    feature_columns = joblib.load(feature_columns_path)
else:
    rf_model = None
    feature_columns = []

@app.route("/")
def home():
    return jsonify({"message": "Brain Stroke Prediction API Running"})

# 🔹 Route for processing CT scan images
@app.route("/predict-image", methods=["POST"])
def predict_image():
    try:
        if cnn_model is None:
            return jsonify({"error": "CNN model not found!"}), 500

        file = request.files["image"]
        img = Image.open(file).convert("RGB")  # Convert to RGB (3 channels)
        
        # Resize to match model input
        img = img.resize((254, 254))  
        img_array = np.array(img) / 255.0  # Normalize
        
        # Ensure correct shape
        img_array = img_array.reshape(1, 254, 254, 3)

        # Debugging: Check shape
        print("Image shape:", img_array.shape)

        # Predict
        prediction = cnn_model.predict(img_array)
        confidence = float(prediction[0][0])  # Extract probability
        
        # 🔹 Adjusted threshold
        threshold = 0.2  
        predicted_class = "Stroke" if confidence > threshold else "Normal"

        # Debugging: Print confidence score
        print(f"Confidence Score: {confidence}")

        return jsonify({"prediction": predicted_class, "confidence": round(confidence, 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔹 Route for processing statistical data
@app.route("/predict-data", methods=["POST"])
def predict_data():
    try:
        if rf_model is None or not feature_columns:
            return jsonify({"error": "Random Forest model or feature columns not found!"}), 500

        data = request.json

        # Ensure all required fields are present
        required_fields = [
            "gender", "age", "hypertension", "heart_disease", "ever_married",
            "work_type", "Residence_type", "avg_glucose_level", "bmi", "smoking_status"
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Convert input JSON to DataFrame
        input_df = pd.DataFrame([data])

        # Convert categorical features into one-hot encoding
        categorical_columns = ['gender', 'ever_married', 'work_type', 'Residence_type', 'smoking_status']
        input_df = pd.get_dummies(input_df, columns=categorical_columns)

        # Align input with trained model's expected features
        missing_cols = set(feature_columns) - set(input_df.columns)
        for col in missing_cols:
            input_df[col] = 0  # Add missing columns with default value 0

        input_df = input_df[feature_columns]  # Ensure correct column order

        # Make prediction
        prediction_prob = rf_model.predict_proba(input_df)[0][1]  # Probability of stroke
        
        # 🔹 Stroke risk threshold
        threshold = 0.3
        predicted_class = "Stroke Risk" if prediction_prob > threshold else "Low Risk"

        return jsonify({"prediction": predicted_class, "confidence": round(prediction_prob, 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
