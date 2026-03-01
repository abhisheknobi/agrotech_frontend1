import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import '../styles/Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmail = /^\S+@\S+\.\S+$/.test(identifier);
    const isPhoneNo = /^\d{10}$/.test(identifier);

    if (!isEmail && !isPhoneNo) {
      alert('Invalid email or phone number format.');
      return;
    }

    try {
      let response;

      // Login API call
      response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: identifier,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token); // Store token

      // Fetch user details after login
      const userDetailsResponse = await axios.get(
        `${BACKEND_URL}/api/auth/getUserDetails`
      );

      const userTypeID = userDetailsResponse.data;
      console.log("UserTypeID:", userTypeID);

      setIsLoggedIn(true);

      // Redirect based on userTypeID
      if (userTypeID === 1) {
        alert('Admin Login Successful!');
        navigate('/expertConsult');
      } else {
        alert('User Login Successful!');
        navigate('/weatherForecast');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier">Email/Phone No:</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
