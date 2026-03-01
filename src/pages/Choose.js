// src/component/Choose.js
import React, { useState } from 'react';
import '../styles/Choose.css';
import farmerImage from '../components/images/farmer.png'; // Correct path
import customerImage from '../components/images/cust-removebg-preview.png'; // Import the image for the second box
import workerImage from '../components/images/work-removebg-preview.png'; // Correct path for worker image

const navigate = (path) => {
    window.location.href = path;
  };

const Choose = () => { // Accept setCurrentPage as a prop
  const [selectedIndex, setSelectedIndex] = useState(null); // Track the selected index

  // Function to select a box and navigate to SignUp for Farmer
  const toggleSelect = (index) => {
    setSelectedIndex(index); // Set the selected index to the current one
    if (index === 0) { // If Farmer is selected (index 0)
      navigate('/SignUp'); // Navigate to Sign Up page
    }
    else if(index === 1) {
      navigate('Workersignup');
    }
    else if(index === 2) {
      navigate('/adminSignup');
    }
  };

  const labels = ['Farmer', 'Customer', 'Worker']; // Labels for each box
  const images = [farmerImage, customerImage, workerImage]; // Image paths

  return (
    <div className="container">
      <h2 className="title">Choose Your Path in Agriculture</h2>
      <div className="box-container">
        {labels.map((label, index) => (
          <div key={index} className="box-wrapper">
            <div className="label">{label}</div>
            <div
              className={`box ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => toggleSelect(index)} // Call toggleSelect on click
            >
              {images[index] && (
                <img src={images[index]} alt={label} className="box-image" />
              )}
              <div className="select-button">
                {selectedIndex === index && <div className="inner-circle" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Choose;
