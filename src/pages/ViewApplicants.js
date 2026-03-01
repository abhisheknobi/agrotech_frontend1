import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { BACKEND_URL } from '../config';
const ViewJob = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isBladeOpen, setIsBladeOpen] = useState(false);
    const [workHistory, setWorkHistory] = useState([]);
    const [formData, setFormData] = useState({
        jobTitle: "",
        jobType: "",
        amount: "",
        date: "",
        description: "",
    });
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [dateRange, setDateRange] = useState({ from: "", to: "" });

    useEffect(() => {
        // Fetch transactions when the component loads
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/auth/getAllApplicantList`);
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/postJob`, formData);
            Swal.fire({
                title: "Success",
                text: "Job posted successfully!",
                icon: "success",
                confirmButtonText: "OK",
            });
            console.log(response.data);
            setIsBladeOpen(false);
            setFormData({
                jobTitle: "",
                jobType: "",
                amount: "",
                date: "",
                description: "",
            });
            fetchTransactions();
        } catch (error) {
            console.error("Error posting job:", error);
            Swal.fire({
                title: "Error",
                text: "Error posting job. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleApply = async (id,uid) => {
        Swal.fire({
            title: "Alert",
            text: "Do you wish to approve this applicant",
            icon: "info",
            confirmButtonText: "YES",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const response = axios.post(`${BACKEND_URL}/api/auth/approveAppliant/${id}/${uid}`);
                    Swal.fire({
                        title: "Success",
                        text: "Applicant has been approved",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }
                catch (error) {
                    console.error("Error approving applicant:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Error approving applicant. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            }
        });
    };

    const handleReject = async (id,uid) => {
        Swal.fire({
            title: "Alert",
            text: "Do you wish to reject this applicant",
            icon: "info",
            confirmButtonText: "YES",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const response = axios.post(`${BACKEND_URL}/api/auth/rejectAppliant/${id}/${uid}`);
                    Swal.fire({
                        title: "Success",
                        text: "Applicant has been rejected",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }
                catch (error) {
                    console.error("Error rejecting applicant:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Error rejecting  applicant. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            }
        });
    };

    const handleRelive = async (id,uid) => {
        Swal.fire({
            title: "Alert",
            text: "Do you wish to relive this applicant",
            icon: "info",
            confirmButtonText: "YES",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const response = axios.post(`${BACKEND_URL}/api/auth/reliveAppliant/${id}/${uid}`);
                    Swal.fire({
                        title: "Success",
                        text: "Applicant has been relived",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }
                catch (error) {
                    console.error("Error releiving applicant:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Error releving applicant. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            }
        });
    };

    const handleHistory = async (id) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/auth/getWorkHistory/${id}`);
            setWorkHistory(response.data || []);  // Ensure it's always an array
            setIsBladeOpen(true);
        } catch (error) {
            console.error("Error fetching work history:", error);
            setWorkHistory([]); // Fallback to an empty array to prevent crashes
        }
    };



    const handleDateRangeChange = (e) => {
        const { name, value } = e.target;
        setDateRange({ ...dateRange, [name]: value });
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;

        return (
            transaction.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!fromDate || transactionDate >= fromDate) &&
            (!toDate || transactionDate <= toDate)
        );
    });
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Transaction Report", 20, 10);
        const tableData = filteredTransactions.map((transaction, index) => [
            index + 1,
            transaction.jobTitle,
            transaction.jobType === 1 ? "Manual" : "Office",
            formatDecimal(transaction.amount),
            transaction.description,
            formatDate(transaction.date),
        ]);
        doc.autoTable({
            head: [["SL.NO", "Job Name", "Job Type", "Amount", "Description", "Date"]],
            body: tableData,
        });
        doc.save("Job Postings.pdf");
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredTransactions.map((transaction) => ({
                "Job Title": transaction.jobTitle,
                "Job Type": transaction.jobType === 1 ? "Manual" : "Office",
                Amount: formatDecimal(transaction.amount),
                "Job Description": transaction.description,
                Date: formatDate(transaction.date),
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, "Job Postings.xlsx");
    };
    return (
        <div style={{ padding: "20px", position: "relative" }}>
            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    paddingTop: "80px",
                }}
            >
                {/* Top Bar */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                        alignItems: "center",
                        
                    }}
                >
                    {/* Search Bar and Buttons */}
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                            type="text"
                            placeholder="Search by Job Title"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                width: "250px",
                            }}
                        />
                        <label>From: </label>
                        <input
                            type="date"
                            name="from"
                            value={dateRange.from}
                            onChange={handleDateRangeChange}
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                        />
                        <label>To: </label>
                        <input
                            type="date"
                            name="to"
                            value={dateRange.to}
                            onChange={handleDateRangeChange}
                            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                        />
                        <button
                            style={{
                                background: "#007bff",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={exportToPDF}
                        >
                            PDF
                        </button>
                        <button
                            style={{
                                background: "#28a745",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={exportToExcel}
                        >
                            Excel
                        </button>
                    </div>
                </div>

                {/* Table */}
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>SL.NO</th>
                            <th style={tableHeaderStyle}>Job Title</th>
                            <th style={tableHeaderStyle}>Job Type</th>
                            <th style={tableHeaderStyle}>Applicant Name</th>
                            <th style={tableHeaderStyle}>Contact Number</th>
                            <th style={tableHeaderStyle}>Applicant Email</th>
                            <th style={tableHeaderStyle}>Status</th>
                            <th style={tableHeaderStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((jobs, index) => (
                            <tr key={jobs.id}>
                                <td style={tableCellStyle}>{index + 1}</td>
                                <td style={tableCellStyle}>{jobs.jobTitle}</td>
                                <td style={tableCellStyle}>
                                    {jobs.jobype === 1 ? "Manual" : "Officer"}
                                </td>
                                <td style={tableCellStyle}>{jobs.applicantName}</td>
                                <td style={tableCellStyle}>{jobs.contactNumber}</td>
                                <td style={tableCellStyle}>{jobs.applicantEmail}</td>
                                <td style={tableCellStyle}>
                                    {jobs.status === 1 ? (
                                        <span className="badge badge-info" style={{ borderRadius: "4px", padding: "5px 10px" }}>Applied</span>
                                    ) : jobs.status === 2 ? (
                                        <span className="badge badge-success" style={{ borderRadius: "4px", padding: "5px 10px" }}>Accepted</span>
                                    ) : jobs.status === 3? (
                                        <span className="badge badge-primary" style={{ borderRadius: "4px", padding: "5px 10px" }}>Rejected</span>
                                    ) : (
                                        <span className="badge badge-secondory" style={{ borderRadius: "4px", padding: "5px 10px" }}> Not Applied</span>
                                    )}
                                </td>

                                <td style={tableCellStyle}>
                                    {jobs.status === 2 ? (
                                        <button
                                            style={{
                                                background: "#dc3545",
                                                color: "white",
                                                border: "none",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleRelive(jobs.jobID,jobs.userID)}
                                        >
                                            Relive Applicant
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                style={{
                                                    background: "#28a745", // Changed color to distinguish Apply button
                                                    color: "white",
                                                    border: "none",
                                                    padding: "5px 10px",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    marginRight: "5px",
                                                }}
                                                onClick={() => handleApply(jobs.jobID,jobs.userID)} // Pass the job ID
                                            >
                                                Approve
                                            </button>

                                            <button
                                                style={{
                                                    background: "#dc4321",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "5px 10px",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    marginRight: "5px",
                                                }}
                                                onClick={() => handleReject(jobs.jobID,jobs.userID)} // Use handleReject instead of handleApply
                                            >
                                                Reject
                                            </button>
                                            <button
                                                style={{
                                                    background: "#28a745", // Changed color to distinguish Apply button
                                                    color: "white",
                                                    border: "none",
                                                    padding: "5px 10px",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    marginRight: "5px",
                                                }}
                                                onClick={() => handleHistory(jobs.applicantID)} // Pass the job ID
                                            >
                                                History
                                            </button>
                                        </>
                                    )}

                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Message */}
            {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}

            {/* Sliding Blade */}
            {isBladeOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        right: "0",
                        width: "450px",
                        height: "100%",
                        background: "#f8f9fa",
                        boxShadow: "-2px 0 6px rgba(0,0,0,0.1)",
                        overflowY: "auto",
                        zIndex: 1050,
                    }}
                >
                    {/* Card Container */}
                    <div
                        style={{
                            background: "white",
                            margin: "10px",
                            padding: "30px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        {/* Close Button */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <h2 className="text-xl font-bold p-4">Work History</h2>
                            <button
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    fontSize: "18px",
                                    cursor: "pointer",
                                    color: "black",
                                }}
                                onClick={() => setIsBladeOpen(false)} // Close the blade
                            >
                                ✖
                            </button>
                        </div>


                        <div className="p-4">
                            {workHistory.length === 0 ? (
                                <p>No history found.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {workHistory.map((history) => (
                                        <li key={history._id} className="border-l-4 border-blue-500 pl-4">
                                            <h3 className="font-semibold">{history.jobTitle}</h3>
                                            <p><strong>Farm:</strong> {history.farmName}</p>
                                            <p><strong>Email:</strong> {history.farmEmail}</p>
                                            <p><strong>Phone:</strong> {history.farmPhone}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

const tableHeaderStyle = {
    borderBottom: "2px solid #ddd",
    textAlign: "left",
    padding: "10px",
};

const tableCellStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
};

const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
};

const formatDecimal = (value) => {
    return parseFloat(value).toFixed(2);
};

const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
};

export default ViewJob;

