import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import '../styles/Signup.css';


const Workersignup = () => {
  const [name, setName] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [password, setPassword] = useState();
  const navigate = (path) => {
    window.location.href = path;
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // to prevent default submission
    axios.post(`${BACKEND_URL}/api/auth/Workersignup`, {
      name, phoneNo, password
    }).then(result => {
      alert('User registered Successfully!');
      navigate('/Login')
      console.log(result);
    })
      .catch(err => {
        console.log(err);
        alert('Error in registering User!');
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Worker Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              placeholder="Name"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              placeholder="Phone no"
              id="phone"
              name="phone"
              value={phoneNo}
              onChange={(e) => {
                const phone = e.target.value;
                if (phone.length <= 10 && /^\d*$/.test(phone)) {
                  setPhoneNo(phone);  // Only update if input is valid
                }
              }}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Workersignup;
