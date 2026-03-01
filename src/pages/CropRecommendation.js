import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CropRecommendation.css";
import { ML_API_URL } from '../config';

const CropRecommendation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
  });

  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (value === "") {
      setFormData({ ...formData, [name]: value });
      return;
    }
    if (!/^[\d.]*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSuggestions(null);

    try {
      const formattedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
      );

      const response = await fetch(`${ML_API_URL}/predict-crop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setResult(data.predicted_crop);

      const tips = await fetchCropTips(data.predicted_crop);
      setSuggestions(tips);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult("Error predicting crop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Crop Tips from AI Assistant
  const fetchCropTips = async (crop) => {
    if (!crop) return;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant specialized in agriculture. 
                Provide 5 practical farming tips for growing "${crop}". The points should be small and concise , avoid using bold highlighting`
                }
              ]
            }
          ]
        }
      );

      const aiResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate tips for this crop.";

      return aiResponse.split("\n");
    } catch (error) {
      console.error("Error fetching crop tips:", error);
      return ["Error retrieving suggestions. Please try again later."];
    }
  };



  const navigateToFertilizer = () => {
    navigate(`/recommend-fertilizer?Nitrogen=${formData.Nitrogen}&Phosphorous=${formData.phosphorus}&Potassium=${formData.potassium}&Temperature=${formData.temperature}&Humidity=${formData.humidity}&Crop=${result}`);
  };

  return (
    <div className="crop-rec-wrapper">
      <div className="crop-recom-container">
        <h2>Crop Recommendation System</h2>
        <form onSubmit={handleSubmit} className="crop-form">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          ))}
          <button type="submit" disabled={loading}>{loading ? "Predicting..." : "Predict Crop"}</button>
        </form>
        {result && (
          <div className="result-container">
            <h3>Recommended Crop: {result}</h3>
            {suggestions ? <ul>{suggestions.map((tip, index) => <li key={index}>{tip}</li>)}</ul> : <p>Loading suggestions...</p>}
            <button onClick={navigateToFertilizer} disabled={!result}>Get AI Recommended Fertilizer</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;
