// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Updated import for Routes
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Chatbot from "./components/Chatbot";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Workersignup from "./pages/Workersignup";
import RentalSystem from "./pages/RentalSystem";
import AddEquipment from "./pages/AddEquipment";
import ViewEquipment from "./pages/ViewEquipment";
import Notifications from "./pages/Notifications";
import Service from "./pages/Service";
import Choose from "./pages/Choose";
import CropDisease from "./pages/CropDisease";
import AgriculturalNews from "./pages/AgricultureNews";
import ExpenseTrackerDashboard from "./pages/ExpenseTrackerDashboard";
import AddIncomeExpense from "./pages/addIncomeExpense";
import WeatherPage from "./pages/WeatherPage";
import FertilizerRecommendation from "./components/FertilizerRecommendation";
import ExpertConsult from "./pages/ExpertConsult";
import CropRecommendation from "./pages/CropRecommendation";
import JobsBoard from "./pages/jobsBoard";
import AddJobs from "./pages/AddJobs";
import ViewJob from "./pages/ViewJob";
import ViewApplicants from "./pages/ViewApplicants";
import './styles/App.css'

const App = ({ setIsLoggedIn }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/weatherForecast" element={<WeatherPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/services" element={<Service />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/Crophealth" element={<CropDisease />} />
        <Route path="/Signup" element={<Signup />} />
        <Route
          path="/Login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/Workersignup" element={<Workersignup />} />
        <Route path="/rentalPage" element={<RentalSystem />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/addEquipment" element={<AddEquipment />} />
        <Route path="/viewEquipment" element={<ViewEquipment />} />
        <Route path="/news" element={<AgriculturalNews />} />
        <Route path="/expenseTrackerDashboard" element={<ExpenseTrackerDashboard />} />
        <Route path="/addIncomeExpense" element={<AddIncomeExpense />} />
        <Route path="/recommend-fertilizer" element={<FertilizerRecommendation />} />
        <Route path="/expertConsult" element={<ExpertConsult />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route path="/jobsBoard" element={<JobsBoard />} />
        <Route path="/addJobs" element={<AddJobs/>} />
        <Route path="/viewJob" element={<ViewJob/>} />
        <Route path="/viewApplicants" element={<ViewApplicants/>} />

        {/* Add more routes as needed */}
      </Routes>
      {/* <Chatbot/> */}
    </Router>
  );
};

export default App;
