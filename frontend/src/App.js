import React, { useState } from "react";
import UploadCTScan from "./components/UploadCTScan";
import EnterStats from "./components/EnterStats.js";
import "./styles.css"; // Import CSS for styling

function App() {
  const [choice, setChoice] = useState(null);

  return (
    <div className="app-container">
      <h1>Brain Stroke Prediction</h1>
      <div className="button-container">
        <button onClick={() => setChoice("image")}>Upload CT Scan</button>
        <button onClick={() => setChoice("stats")}>Enter Medical Data</button>
      </div>

      {/* Render components based on choice */}
      {choice === "image" && <UploadCTScan />}
      {choice === "stats" && <EnterStats />}

      {/* Show a message if no option is selected */}
      {!choice && <p>Please choose an option above.</p>}
    </div>
  );
}

export default App;
