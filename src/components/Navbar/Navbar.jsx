import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../images/logo.png';
import axios from 'axios';
import { BACKEND_URL } from '../../config';

const Navbar = ({ isLoggedIn, onLogout }) => {

  // Function to handle navigation using window.location
  const navigate = (path) => {
    window.location.href = path;
  };

  const [UserTypeID, setUserTypeID] = useState([]);
  useEffect(() => {
    let interval;
    const fetchUserDetails = async () => {
      try {
        if (isLoggedIn) {
          const response = await axios.get(`${BACKEND_URL}/api/auth/getUserDetails`);
          console.log(response.data);
          setUserTypeID(response.data);
        }
      } catch (error) {
        console.error("Error fetching admin users:", error);
      }
    };
    // Initial fetch
    fetchUserDetails();

    // Set interval only if the user is logged in
    if (isLoggedIn) {
      interval = setInterval(fetchUserDetails, 20000);
    }

    // Cleanup function to clear interval when the component unmounts
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoggedIn]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Agriculture Logo" style={{ height: '30px' }} />
      </div>
      <ul className="nav-links">
        {isLoggedIn ? (
          UserTypeID === 1 ? (
            <>
              <li><a href="/expertConsult">Expert Consult</a></li>
            </>
          ) : (
            <>
              <li><a href="/weatherForecast">Dashboard</a></li>
              <li><a href="/expenseTrackerDashboard">Expense Tracker</a></li>
              <li><a href="/expertConsult">Expert Consult</a></li>
              <li><a href="/jobsBoard">Jobs Portal</a></li>
              <li><a href="/Crophealth">AI Crop Doctor</a></li>
              <li><a href="/rentalPage">RentalPage</a></li>
              <li><a href="/notifications">Notifications</a></li>
            </>

          )
        ) : (
          <>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Our Services</a></li>
          </>
        )}
        
      </ul>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={onLogout}>LogOut</button>
        ) : (
          <>
            {/* Use the navigate function on button clicks */}
            <button className="login-btn" onClick={() => navigate('/Login')}>Login</button>
            <button className="signup-btn" onClick={() => navigate('/Signup')}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
