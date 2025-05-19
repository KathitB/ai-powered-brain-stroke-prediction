import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prediction, confidence, riskFactors, type } = location.state || {};

  // Function to download results as a PDF
  const downloadPDF = () => {
    const input = document.getElementById("result-container");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("Stroke_Prediction_Result.pdf");
    });
  };

  return (
    <div className="container">
      <div id="result-container" className="result-card">
        <h2>Prediction Result</h2>
        <p>
          <strong>Type of Prediction:</strong> {type === "image" ? "CT Scan (CNN)" : "Statistical Data (Random Forest)"}
        </p>
        <p>
          <strong>Prediction:</strong> {prediction}
        </p>
        {confidence && (
          <p>
            <strong>Confidence Score:</strong> {(confidence * 100).toFixed(2)}%
          </p>
        )}

        {riskFactors && (
          <>
            <h3>Risk Factor Breakdown</h3>
            <Bar
              data={{
                labels: Object.keys(riskFactors),
                datasets: [
                  {
                    label: "Risk Score",
                    data: Object.values(riskFactors),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </>
        )}

        <div className="buttons">
          <button onClick={() => navigate("/")} className="btn">
            Go Back
          </button>
          <button onClick={downloadPDF} className="btn btn-download">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
