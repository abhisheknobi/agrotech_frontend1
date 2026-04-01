import React, { useState } from 'react';
import '../styles/CropDisease.css';
import axios from 'axios';
import { FaUserDoctor } from "react-icons/fa6";
import { GEMINI_API, ML_API_URL } from '../config';

const CropDisease = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState([]);
  const [disease, setDisease] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setMessage([]);
      setDisease('');
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(`${ML_API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { predicted_class, confidence } = response.data;
      const [crop, ...diseaseParts] = predicted_class.split(' ');
      const detectedDisease = diseaseParts.join(' ');

      setDisease(detectedDisease); // Store disease name for prevention methods

      const formattedResult = `Crop: ${crop}, Predicted: ${detectedDisease.toLowerCase() === 'healthy' ? 'Healthy' : detectedDisease
        } (Confidence: ${(confidence * 100).toFixed(2)}%)`;

      setResult(formattedResult);
      setError(null);
    } catch (err) {
      setError('Error predicting the disease. Please try again.');
      setResult(null);
    }
  };

  const fetchPreventionMethods = async () => {
    if (!disease) {
      setError('No disease detected yet. Predict first!');
      return;
    }

    if (disease.toLowerCase() === 'healthy') {
      setMessage([{ text: "The crop is healthy. No prevention methods needed!", sender: 'ai' }]);
      return;
    }

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API}`,
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        data: {
          contents: [{ parts: [{ text: `Provide exactly 5 prevention methods for ${disease}, in clear bullet points.No need any text in bold` }] }],
        },
      });

      const aiResponseText = response.data.candidates[0].content.parts[0].text;

      setMessage([{ text: aiResponseText, sender: 'ai' }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessage([{ text: "Sorry, I couldn't get a response from the AI.", sender: 'ai' }]);
    }
  };

  return (
    <div className='crop-disease-container'>
      <div className="disease-form">
        <h1><FaUserDoctor /> Crop Disease Detection</h1>
        <div className="upload-section">
          <input type="file" onChange={handleFileChange} accept="image/*" />
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Selected Preview" />
            </div>
          )}
          <button className="predict-button" onClick={handlePredict}>Predict Disease</button>
        </div>
        {result && <div className="result">{result}</div>}
        {error && <div className="error">{error}</div>}
        {result && (
          <button className="ai-button" onClick={fetchPreventionMethods}>
            Get Prevention Methods
          </button>
        )}
        {message.length > 0 && (
          <div className="ai-messages">
            <h3>Possible Prevention Methods:</h3>
            <ul>
              {message[0].text.split('\n').map((line, index) => (
                <li key={index} className="message">{line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

  );
};

export default CropDisease;
