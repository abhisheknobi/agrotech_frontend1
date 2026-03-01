import React from "react";
import { Link } from 'react-router-dom';
import "../styles/Service.css"; // CSS file for styling
import sampleImage from "../components/images/card.png"; // Replace with your main image path

const Service = () => {
  const navigate = (path) => {
      window.location.href = path;
  }
  return (
    <div className="image-container">
      <div className="image-overlay"></div>
      <img src={sampleImage} alt="Centered" className="centered-image" />

      <div className="small-container">
        <div>
          <div className="small-box box-1"></div>
          <div className="small-box-text" onClick={() => navigate("/Login")}>Weather Forecast</div>
        </div>
        <div>
          <div className="small-box box-2">
            <Link to="/news"></Link>
          </div>
          <div className="small-box-text">Agricultural News</div>
        </div>
        <div>
          <div className="small-box box-3"></div>
          <div className="small-box-text">Expense Tracker</div>
        </div>
        <div>
          <div className="small-box box-4"></div>
          <div className="small-box-text">Equipment Rental</div>
        </div>
        <div>
          <div className="small-box box-5"></div>
          <div className="small-box-text">Crop Recommendation</div>
        </div>
        <div>
          <div className="small-box box-6"></div>
          <div className="small-box-text">Fertilizer Recommendation</div>
        </div>
        <div>
          <div className="small-box box-7"></div>
          <div className="small-box-text">Crop Disease AI</div>
        </div>
        <div>
          <div className="small-box box-8"></div>
          <div className="small-box-text">Expert Consultation</div>
        </div>
        <div>
          <div className="small-box box-9"></div>
          <div className="small-box-text">Job Portal</div>
        </div>
        <div>
          <div className="small-box box-10"></div>
          <div className="small-box-text">AI Chatbot</div>
        </div>
      </div>

      {/* Content sections */}
      <div className="content-section">
        <h2>Services Provided</h2>
        <p>
          These are the services offered by Agrotech, carefully designed to
          support and empower farmers at every stage of the agricultural
          process. From real-time weather forecasts and crop health advice to
          financial tools and direct communication with experts, our goal is to
          provide a platform that fosters growth, efficiency, and
          sustainability. We're here to help you achieve success in every
          season.
        </p>
      </div>

      <div className="content-section">
        <footer className="footer">
          <div className="footer-section">
            <h3>About</h3>
            <p>
              Agrotech supports farmers with tools for weather updates, crop
              health, financial management, and expert advice, promoting
              efficient, sustainable agriculture.
            </p>
          </div>
          <div className="footer-section">
            <h3>Links</h3>
            <ul>
              <li>About Us</li>
              <li>Services</li>
              <li>Case</li>
              <li>Request Pickup</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Get In Touch</h3>
            <p><i className="fas fa-envelope"></i> Email: example@info.com</p>
            <p><i className="fas fa-phone"></i> Phone: 333 686 0000</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Service;
