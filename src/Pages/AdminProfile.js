import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// Header Component
const Header = ({ onLogout }) => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10 shadow-lg">
      <h1 className="text-xl font-bold">Admin Profile</h1>
      <button
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        onClick={onLogout}
      >
        Logout
      </button>
    </header>
  );
};

// Main AdminProfile Component
function AdminProfile() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]); // State for transactions
  const [activeTab, setActiveTab] = useState('doctors'); // State for active tab
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Today's date
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/doctor/findAll`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async () => {
      const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/payment/findAll`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTransactions(data);
      filterTransactions(data, selectedDate); // Filter transactions for today's date
    };

    fetchDoctors();
    fetchTransactions();
  }, [selectedDate]);

  const filterTransactions = (transactions, date) => {
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getFullYear() === new Date(date).getFullYear() &&
        transactionDate.getMonth() === new Date(date).getMonth() &&
        transactionDate.getDate() === new Date(date).getDate()
      );
    });
    setFilteredTransactions(filtered);
  };


  const navigate=useNavigate();
  const handleLogout = () => {
    // Handle logout logic here
    // alert('Logged out');
    navigate("/")
    
  };


  
  const renderDoctors = () => (
    <div className="mt-4">
      <h2 className="text-2xl font-bold">Doctors List</h2>
      <table className="min-w-full bg-white border border-gray-300 mt-4 rounded-lg shadow-md overflow-x-auto">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Specialization</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Fee</th>
            <th className="py-2 px-4 border-b text-left">View Details</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id} className="hover:bg-gray-100 transition duration-200">
              <td className="py-2 px-4 border-b">{doctor.name}</td>
              <td className="py-2 px-4 border-b">{doctor.specialization}</td>
              <td className="py-2 px-4 border-b">{doctor.email}</td>
              <td className="py-2 px-4 border-b">{doctor.rate}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                  onClick={() => navigate(`/Doctor-Report/${doctor._id}`)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  
  const renderTransactions = () => {
    const totalAmount = filteredTransactions.reduce((sum, transaction) => {
      const discountAmount = (transaction.totalAmount * transaction.discount) / 100;
      return sum + (transaction.totalAmount - discountAmount);
    }, 0);
  
    return (
      <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mt-4">Today's Transaction</h2>
        <div className="flex justify-between items-center mt-4">
          <h3 className="text-lg font-semibold">Total Amount: ₹{totalAmount.toFixed(2)}</h3>
          <div className="flex items-center">
            <label htmlFor="datePicker" className="mr-2">Select Date:</label>
            <input
              type="date"
              id="datePicker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
        </div>
        <table className="min-w-full bg-white border border-gray-300 mt-4 rounded-lg overflow-x-auto">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="py-2 px-4 border-b text-left">Transaction ID</th>
              <th className="py-2 px-4 border-b text-left">Patient Name</th>
              <th className="py-2 px-4 border-b text-left">Doctor Name</th>
              <th className="py-2 px-4 border-b text-left">Total Amount</th>
              <th className="py-2 px-4 border-b text-left">Discount</th>
              <th className="py-2 px-4 border-b text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => {
              const discountAmount = (transaction.totalAmount * transaction.discount) / 100;
              const finalAmount = transaction.totalAmount - discountAmount;
              return (
                <tr key={transaction._id} className="hover:bg-gray-100 transition duration-200">
                  <td className="py-2 px-4 border-b">{transaction._id}</td>
                  <td className="py-2 px-4 border-b">{transaction.patientName}</td>
                  <td className="py-2 px-4 border-b">{transaction.doctorName}</td>
                  <td className="py-2 px-4 border-b">{finalAmount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{discountAmount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{new Date(transaction.date).toLocaleTimeString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Header onLogout={handleLogout} />
      <div className="mt-16">
        <nav className="flex space-x-4">
          <button
            className={`px-4 py-2 ${activeTab === 'doctors' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded transition duration-200`}
            onClick={() => setActiveTab('doctors')}
          >
            Doctors
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'transactions' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded transition duration-200`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`px-4 py-2 bg-gray-200 text-black'  rounded transition duration-200`}
            onClick={() => navigate('/Docsign')}
          >
            Add Doctors
          </button>
        </nav>
        {activeTab === 'doctors' ? renderDoctors() : renderTransactions()}
      </div>
    </div>
  );
}

export default AdminProfile;