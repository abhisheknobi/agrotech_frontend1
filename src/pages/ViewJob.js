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
            const response = await axios.get(`${BACKEND_URL}/api/auth/getAllJobPostings`);
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

    const handleApply = async (id) => {
        Swal.fire({
            title: "Alert",
            text: "Do you wish to apply for this job",
            icon: "info",
            confirmButtonText: "YES",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const response = axios.post(`${BACKEND_URL}/api/auth/applyForJob/${id}`);
                    Swal.fire({
                        title: "Success",
                        text: "Application for job initiated successfully",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }
                catch (error) {
                    console.error("Error Applying for job:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Error Applying for job. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            }
        });
    };

    const handleSwal = async () => {
        Swal.fire({
            title: "Alert",
            text: "A job offer has already been approved",
            icon: "info",
            confirmButtonText: "OK!",
            showCancelButton: false,
        });
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
                            <th style={tableHeaderStyle}>contactinfo</th>
                            <th style={tableHeaderStyle}>Description</th>
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
                                <td style={tableCellStyle}>{formatDecimal(jobs.amount)}</td>
                                <td style={tableCellStyle}>{formatDate(jobs.date)}</td>
                                <td style={tableCellStyle}>{jobs.contactinfo}</td>
                                <td style={tableCellStyle}>{jobs.description}</td>
                                <td style={tableCellStyle}>
                                    {jobs.applicationStatus === 0 ? (
                                        <span className="badge badge-info" style={{ borderRadius: "4px", padding: "5px 10px" }}>Not Applied</span>
                                    ) : jobs.applicationStatus === 1 ? (
                                        <span className="badge badge-success" style={{ borderRadius: "4px", padding: "5px 10px" }}>Applied</span>
                                    ) : jobs.applicationStatus === 3 ? (
                                        <span className="badge badge-primary" style={{ borderRadius: "4px", padding: "5px 10px" }}>Rejected</span>
                                    ) : (
                                        <span className="badge badge-secondory" style={{ borderRadius: "4px", padding: "5px 10px" }}> Not Applied</span>
                                    )}
                                </td>

                                <td style={tableCellStyle}>
                                    {jobs.countStatus === 1 ? (
                                        <button
                                            style={{
                                                background: "#dc3545",
                                                color: "white",
                                                border: "none",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                cursor: jobs.applicationStatus === 3 ? "not-allowed" : "pointer",
                                                opacity: jobs.applicationStatus === 3 ? 0.6 : 1, // Dim the button when disabled
                                            }}
                                            onClick={() => handleSwal()}
                                            disabled={jobs.applicationStatus === 3}
                                        >
                                            Apply
                                        </button>
                                    ) : (
                                        <button
                                            style={{
                                                background: "#dc3545",
                                                color: "white",
                                                border: "none",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                cursor: jobs.applicationStatus === 3 ? "not-allowed" : "pointer",
                                                opacity: jobs.applicationStatus === 3 ? 0.6 : 1, // Dim the button when disabled
                                            }}
                                            onClick={() => handleApply(jobs._id)}
                                            disabled={jobs.applicationStatus === 3}
                                        >
                                            Apply
                                        </button>
                                    )}
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Message */}
            {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
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

