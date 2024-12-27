import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

function ViewProfile() {
  const { patientId } = useParams();
  const [payments, setPayments] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentResponse, patientResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_ROOT_API_URL}/payment/findbyPatient/${patientId}`),
          fetch(`${process.env.REACT_APP_ROOT_API_URL}/patient/findPatient/${patientId}`),
        ]);

        if (!paymentResponse.ok || !patientResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const paymentData = await paymentResponse.json();
        const patientData = await patientResponse.json();

        setPayments(paymentData.data);
        setPatient(patientData.patient);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white">
    {/* Header */}
    <header className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 text-white py-4 px-6 shadow-lg fixed top-0 w-full z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wide">Patient Dashboard</h1>
        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-800 px-5 py-2 rounded-full hover:bg-gray-100 shadow-md transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/patientLogin")}
              className="bg-white text-blue-800 px-5 py-2 rounded-full hover:bg-gray-100 shadow-md transition-transform transform hover:scale-105"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  
    {/* Main Content */}
    <div className="pt-24 px-6 space-y-10">
      {/* Patient Profile Card */}
      <div className="bg-white shadow-xl rounded-lg p-6 flex items-center space-x-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-4 rounded-full">
          <FontAwesomeIcon icon={faUser} className="text-white text-4xl" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{patient.name}</h2>
          <p className="text-gray-600">{patient.email}</p>
          <p className="text-blue-700 font-medium text-lg mt-2">
            Wallet Balance: ₹{patient.walletBalance}
          </p>
        </div>
      </div>
  
      {/* Payments Table */}
      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Payment History</h2>
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="hidden md:table min-w-full border-collapse border border-gray-200 bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                  <th className="py-3 px-6 text-left font-medium border-b">Date</th>
                  <th className="py-3 px-6 text-left font-medium border-b">Doctor</th>
                  <th className="py-3 px-6 text-left font-medium border-b">Total Amount</th>
                  <th className="py-3 px-6 text-left font-medium border-b">Discount</th>
                  <th className="py-3 px-6 text-left font-medium border-b">Paid</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr
                    key={payment._id}
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-6 border-b">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="py-3 px-6 border-b">{payment.doctorName}</td>
                    <td className="py-3 px-6 border-b">₹{payment.totalAmount}</td>
                    <td className="py-3 px-6 border-b">{payment.discount}%</td>
                    <td className="py-3 px-6 border-b">
                      ₹{((payment.totalAmount * (100 - payment.discount)) / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
  
            {/* Cards for mobile view */}
            <div className="block md:hidden space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="border border-gray-200 rounded-lg p-4 shadow-md bg-gradient-to-br from-white to-blue-50"
                >
                  <p className="text-gray-700 font-semibold">
                    <strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 font-semibold">
                    <strong>Doctor:</strong> {payment.doctorName}
                  </p>
                  <p className="text-gray-700 font-semibold">
                    <strong>Total Amount:</strong> ₹{payment.totalAmount}
                  </p>
                  <p className="text-gray-700 font-semibold">
                    <strong>Discount:</strong> {payment.discount}%
                  </p>
                  <p className="text-blue-700 font-semibold">
                    <strong>Paid:</strong> ₹{((payment.totalAmount * (100 - payment.discount)) / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-600 text-center">No payments found for this patient.</div>
        )}
      </div>
    </div>
  </div>
  
  );
}

export default ViewProfile;
