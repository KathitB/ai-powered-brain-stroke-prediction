import React, { useState } from "react";
import axios from "axios";

function UploadCTScan() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      if (!fileType.startsWith("image/")) {
        setError("Please upload a valid image file (JPG, PNG, etc.)");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CT scan image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await axios.post("http://127.0.0.1:5000/predict-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResult(response.data);
      }
    } catch (err) {
      setError("Error processing the image. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload CT Scan</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Predict"}
      </button>

      {error && <p style={{ color: "red" }}>⚠ {error}</p>}
      {result && (
        <p>
          <strong>Prediction:</strong> {result.prediction} <br />
          <strong>Confidence:</strong> {result.confidence !== null ? result.confidence.toFixed(2) : "N/A"}
        </p>
      )}
    </div>
  );
}

export default UploadCTScan;
