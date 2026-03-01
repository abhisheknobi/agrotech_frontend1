import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import '../styles/FertilizerRecommendation.css';
import { ML_API_URL } from '../config';

export default function FertilizerRecommendation() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [soilTypes, setSoilTypes] = useState([
    "Sandy", "Loamy", "Black", "Red", "Clayey"
  ]);
  const [cropTypes, setCropTypes] = useState([
    "Maize",
    "Sugarcane",
    "Cotton",
    "Tobacco",
    "Paddy",
    "Barley",
    "Wheat",
    "Millets",
    "Oil seeds",
    "Pulses",
    "Ground Nuts",
    "jute",
    "papaya",
    "orange",
    "mungbean",
    "pomegranate",
    "watermelon",
    "mango",
    "apple",
    "grapes",
    "rice",
    "mothbeans",
    "coffee",
    "chickpea",
    "coconut",
    "blackgram",
    "lentil",
    "pigeonpeas",
    "muskmelon",
    "kidneybeans",
    "banana"
  ]);

  const [formData, setFormData] = useState({
    Temperature: queryParams.get("Temperature") || "",
    Humidity: queryParams.get("Humidity") || "",
    Moisture: "",
    "Soil Type": queryParams.get("SoilType") || "",
    "Crop Type": queryParams.get("Crop") || "",
    Nitrogen: queryParams.get("Nitrogen") || "",
    Potassium: queryParams.get("Potassium") || "",
    Phosphorous: queryParams.get("Phosphorous") || "",
  });

  const [fertilizer, setFertilizer] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data being sent is: ", formData);
      const response = await axios.post(`${ML_API_URL}/predict-fertilizer`, formData);
      console.log(response.data);
      setFertilizer(response.data.fertilizer);
    } catch (error) {
      console.error("Error fetching prediction", error);
    }
  };

  return (
    <div className="container">
      <h2>Fertilizer Recommendation</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="Temperature" placeholder="Temperature" value={formData.Temperature} onChange={handleChange} required />
        <input type="number" name="Humidity" placeholder="Humidity" value={formData.Humidity} onChange={handleChange} required />
        <input type="number" name="Moisture" placeholder="Moisture" value={formData.Moisture} onChange={handleChange} required />

        <select name="Soil Type" value={formData["Soil Type"]} onChange={handleChange} required>
          <option value="">Select Soil Type</option>
          {soilTypes.map((soil) => <option key={soil} value={soil}>{soil}</option>)}
        </select>

        <select name="Crop Type" value={formData["Crop Type"]} onChange={handleChange} required>
          <option value="">Select Crop Type</option>
          {cropTypes.map((crop) => <option key={crop} value={crop}>{crop.toUpperCase()}</option>)}
        </select>

        <input type="number" name="Nitrogen" placeholder="Nitrogen" value={formData.Nitrogen} onChange={handleChange} required />
        <input type="number" name="Potassium" placeholder="Potassium" value={formData.Potassium} onChange={handleChange} required />
        <input type="number" name="Phosphorous" placeholder="Phosphorous" value={formData.Phosphorous} onChange={handleChange} required />

        <button type="submit">Predict Fertilizer</button>
      </form>

      {fertilizer && <h3>Recommended Fertilizer: {fertilizer}</h3>}
    </div>
  );
}
