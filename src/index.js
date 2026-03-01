import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Navbar from './components/Navbar/Navbar';
import Chatbot from './components/Chatbot';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Check if token exists

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    setIsLoggedIn(false); // Update state
    window.location.href = '/'; // Redirect to home
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {isLoggedIn && <Chatbot />}
      <App setIsLoggedIn={setIsLoggedIn} />
    </>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
