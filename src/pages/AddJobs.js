import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { BACKEND_URL } from '../config';
const AddJobs = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isBladeOpen, setIsBladeOpen] = useState(false);
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
            const response = await axios.get(`${BACKEND_URL}/api/auth/getJobPostings`);
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

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/auth/deleteJobPosting/${id}`);
            Swal.fire({
                title: "Success",
                text: "Job posting deleted successfully!",
                icon: "success",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload(); // Reloads the page only after the user clicks "OK"
                }
            });
        } catch (error) {
            console.error("Error deleting Job posting:", error);
            Swal.fire({
                title: "Error",
                text: "Error deleting Job posting. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
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
                    paddingTop: "80px"
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

                    {/* Post a Job  Button */}
                    <button
                        style={{
                            background: "#007bff",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                        onClick={() => setIsBladeOpen(true)}
                    >
                        Post a Job
                    </button>
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
                            <th style={tableHeaderStyle}>Amount</th>
                            <th style={tableHeaderStyle}>End Date</th>
                            <th style={tableHeaderStyle}>Contact Info</th>
                            <th style={tableHeaderStyle}>Description</th>
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
                                <td style={tableCellStyle}>{formatDecimal(jobs.amount)}</td>
                                <td style={tableCellStyle}>{formatDate(jobs.date)}</td>
                                <td style={tableCellStyle}>{jobs.contactinfo}</td>
                                <td style={tableCellStyle}>{jobs.description}</td>
                                <td style={tableCellStyle}>
                                    <button
                                        style={{
                                            background: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleDelete(jobs._id)} // Pass the transaction ID
                                    >
                                        Delete
                                    </button>
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
                            <h3>Post a Job</h3>
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

                        <div style={{ marginBottom: "15px" }}>
                            <label>Job Title</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Jobd Type</label>
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleInputChange}
                                style={inputStyle}
                            >
                                <option value="">Select</option>
                                <option value="1">Maual Job</option>
                                <option value="2">Office Job</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Amount per hour</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>End Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Contact Info</label>
                            <textarea name="contactinfo" value={formData.contactinfo} onChange={handleInputChange}></textarea>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>Discription</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
                        </div>

                        <button
                            style={{
                                background: "#007bff",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={handleSave} // Save the transaction
                        >
                            Save
                        </button>
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

export default AddJobs;

