import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../styles/Dashboard.css'; // Ensure you have the styles defined as mentioned previously
import WeatherPage from './WeatherPage';
const Dashboard = () => {
    const navigate = useNavigate(); // Hook for navigation
    

    // Handle navigation to Chatbot
    const handleChatbotClick = () => {
        navigate('/chatbot'); // Navigate to the Chatbot route
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Farmer Dashboard</h1>

        </div>
    );
};

export default Dashboard;
