import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Import global styles

const Home = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState("");

    const handleSelection = (option) => {
        setSelectedOption(option);
        if (option === "image") {
            navigate("/upload-image");
        } else if (option === "data") {
            navigate("/enter-data");
        }
    };

    return (
        <div className="home-container">
            <h1>Brain Stroke Prediction</h1>
            <p>Select an option to proceed:</p>

            <div className="options-container">
                <button className="option-button" onClick={() => handleSelection("image")}>
                    Upload CT Scan Image
                </button>
                <button className="option-button" onClick={() => handleSelection("data")}>
                    Enter Medical Data
                </button>
            </div>
        </div>
    );
};

export default Home;
