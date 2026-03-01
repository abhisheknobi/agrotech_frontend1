import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';

const ExpenseTrackerDashboard = () => {
  const navigate = useNavigate();
  const [topExpenses, setTopExpenses] = useState([]);
  const [topIncome, setTopIncome] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const cardStyle = {
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
  };

  const handleAddClick = () => {
    navigate('/addIncomeExpense');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/dashboardData`, {
          params: {
            fromDate: fromDate || new Date().toISOString().split('T')[0],
            toDate: toDate || new Date().toISOString().split('T')[0],
          },
        });
        const { topExpenses, topIncome } = response.data;
        setTopExpenses(topExpenses);
        setTopIncome(topIncome);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (fromDate && toDate) {
      fetchData();
    }
  }, [fromDate, toDate]);

  // Aligning categories for line and bar charts
  const allCategories = [...new Set([...topExpenses.map(e => e.category), ...topIncome.map(i => i.category)])];
  const incomeData = allCategories.map(category => {
    const income = topIncome.find(i => i.category === category);
    return income ? income.amount : 0;
  });
  const expenseData = allCategories.map(category => {
    const expense = topExpenses.find(e => e.category === category);
    return expense ? expense.amount : 0;
  });

  return (
    <div style={{ backgroundColor: '#f4f4f4', padding: '40px' }}>
      <div style={{ ...cardStyle, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Expense Tracker Dashboard</h1>
          <button
            onClick={handleAddClick}
            style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
          >
            Add Income / Expense
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>From:</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', marginLeft: '10px' }} />
          <label style={{ marginLeft: '20px' }}>To:</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', marginLeft: '10px' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
          <div style={{ ...cardStyle, width: '40%' }}>
            <h2>Expense Distribution</h2>
            <Chart options={{ labels: topExpenses.map(e => e.category), title: { text: 'Expense Distribution', align: 'center' } }} series={topExpenses.map(e => e.amount)} type="pie" />
          </div>
          <div style={{ ...cardStyle, width: '40%' }}>
            <h2>Income Distribution</h2>
            <Chart options={{ labels: topIncome.map(i => i.category), title: { text: 'Income Distribution', align: 'center' } }} series={topIncome.map(i => i.amount)} type="pie" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
          <div style={{ ...cardStyle, width: '100%' }}>
            <h2>Income vs Expense Comparison</h2>
            <Chart
              options={{ chart: { id: 'income-expense-comparison' }, xaxis: { categories: allCategories }, title: { text: 'Income vs Expense', align: 'center' } }}
              series={[{ name: 'Income', data: incomeData }, { name: 'Expense', data: expenseData }]}
              type="line"
              height="350"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
          <div style={{ ...cardStyle, width: '100%' }}>
            <h2>Income vs Expense Bar Comparison</h2>
            <Chart
              options={{ chart: { id: 'income-expense-bar-comparison' }, xaxis: { categories: allCategories }, title: { text: 'Income vs Expense Bar Comparison', align: 'center' } }}
              series={[{ name: 'Income', data: incomeData }, { name: 'Expense', data: expenseData }]}
              type="bar"
              height="350"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTrackerDashboard;
