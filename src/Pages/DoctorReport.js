import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Header Component
const Header = ({ onLogout }) => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10 shadow-lg">
      <h1 className="text-xl font-bold">Doctor Report</h1>
      <button
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        onClick={onLogout}
      >
        Logout
      </button>
    </header>
  );
};

// Main DoctorReport Component
function DoctorReport() {
    const [selectedDate, setSelectedDate] = useState(() => {
        const localDate = new Date();
        const offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000); // Adjust for timezone offset
        return offsetDate.toISOString().split('T')[0];
      });
      
  const { doctorId } = useParams();
  const [payments, setPayments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Today's date
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/doctor/findById/${doctorId}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setDoctor(data); // Set doctor details
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/payment/findbyDoctorId/${doctorId}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setPayments(data.data);
          filterPayments(data.data, selectedDate); // Filter payments for today's date
        } else {
          setPayments([]);
        }
      } catch (error) {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
    fetchPayments();
  }, [doctorId, selectedDate]);

  const filterPayments = (payments, date) => {
    const filtered = payments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate.getFullYear() === new Date(date).getFullYear() &&
        paymentDate.getMonth() === new Date(date).getMonth() &&
        paymentDate.getDate() === new Date(date).getDate()
      );
    });
    setFilteredPayments(filtered);

    // Calculate total amount for the day
    const total = filtered.reduce((sum, payment) => {
      const discountAmount = (payment.totalAmount * payment.discount) / 100;
      const finalAmount = payment.totalAmount - discountAmount;
      return sum + finalAmount;
    }, 0);
    setTotalAmount(total);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Header onLogout={handleLogout} />
      <div className="mt-16">
        {doctor && (
          <div className="bg-gradient-to-r from-white to-blue-100 p-6 rounded-lg shadow-lg flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-blue-800">{doctor.name}</h2>
              <p className="text-gray-600 text-lg">{doctor.specialization}</p>
              <p className="text-gray-600">Email: {doctor.email}</p>
              <p className="text-gray-600">Rate: ${doctor.rate}</p>
              <p className="mt-4 text-gray-700">{doctor.description}</p>
            </div>
            <img
              src={doctor.imageUrl || "https://via.placeholder.com/150"}
              alt={doctor.name}
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
          </div>
        )}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-800">Today's Bookings</h2>
          <div>
            <label htmlFor="datePicker" className="mr-2">Select Date:</label>
            <input
              type="date"
              id="datePicker"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                filterPayments(payments, e.target.value);
              }}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
        </div>
        {filteredPayments.length > 0 ? (
          <>
            <div className="bg-blue-50 p-4 rounded-lg shadow-md mt-6">
              <h3 className="text-lg font-semibold text-blue-600">
                Total Amount : {totalAmount.toFixed(2)}
              </h3>
            </div>
            <table className="min-w-full bg-white border border-gray-300 mt-4 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                <tr>
                  <th className="py-2 px-4 border-b">Transaction ID</th>
                  <th className="py-2 px-4 border-b">Patient Name</th>
                  <th className="py-2 px-4 border-b">Doctor Name</th>
                  <th className="py-2 px-4 border-b">Total Amount</th>
                  <th className="py-2 px-4 border-b">Discount</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const discountAmount = (payment.totalAmount * payment.discount) / 100;
                  const finalAmount = payment.totalAmount - discountAmount;
                  return (
                    <tr key={payment._id} className="hover:bg-gray-100 transition duration-200">
                      <td className="py-2 px-4 border-b">{payment._id}</td>
                      <td className="py-2 px-4 border-b">{payment.patientName}</td>
                      <td className="py-2 px-4 border-b">{payment.doctorName}</td>
                      <td className="py-2 px-4 border-b">{finalAmount.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{discountAmount.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{new Date(payment.date).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <h2 className="text-xl font-semibold text-gray-600 mt-6">No Payment History Available</h2>
        )}
      </div>
    </div>
  );
}

export default DoctorReport;
