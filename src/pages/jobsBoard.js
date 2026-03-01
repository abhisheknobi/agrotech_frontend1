import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/RentalSystem.css";
import { BACKEND_URL } from '../config';
import rentalImage from "../components/images/Job_posting.png";
import addEquipmentImage from "../components/images/Job_Posting1.jpg";
import applicantsImage from "../components/images/applicants.jpg"; // Add an image for applicants

const JobsBoard = () => {
    const navigate = useNavigate();
    const [hasApplicants, setHasApplicants] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/isApplicantAvailable`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    console.log("No applicants found or error in API.");
                    return;
                }

                const data = await response.json();
                if (data.length > 0) {
                    setHasApplicants(true);
                }
            } catch (error) {
                console.error("Error fetching applicants:", error);
            }
        };

        if (token) {
            fetchApplicants();
        }
    }, [token]);

    return (
        <div className="rental-system-container">
            <h2>Welcome to the world of Opportunities!</h2>
            <div className="card-container">
                <div className="card" onClick={() => navigate("/addJobs")}>
                    <img src={addEquipmentImage} alt="Upload Equipment" className="card-image" />
                    <h3>Post a job</h3>
                    <p>Post a job to find potential applicants</p>
                </div>
                <div className="card" onClick={() => navigate("/viewJob")}>
                    <img src={rentalImage} alt="Rent Equipment" className="card-image" />
                    <h3>Job Seeker</h3>
                    <p>List all jobs that were posted</p>
                </div>
                {hasApplicants && (
                    <div className="card" onClick={() => navigate("/viewApplicants")}>
                        <img src={applicantsImage} alt="Applicants" className="card-image" />
                        <h3>Applicants</h3>
                        <p>View applicants for your job posts</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobsBoard;
