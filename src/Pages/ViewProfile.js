import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 px-6 shadow-md fixed top-0 w-full z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <div>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/patientLogin")}
                className="bg-white text-blue-700 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 px-6 space-y-8">
        {/* Patient Profile Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-6">
          {/* <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            className="rounded-full border-2 border-gray-300 w-20 h-20"
          /> */}
          <div>
            <h2 className="text-2xl font-bold">{patient.name}</h2>
            <p className="text-gray-600">{patient.email}</p>
            <p className="text-gray-600 font-medium">Wallet Balance: ₹{patient.walletBalance}</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200 bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-6 text-left text-gray-800 font-medium border-b">
                      Date
                    </th>
                    <th className="py-3 px-6 text-left text-gray-800 font-medium border-b">
                      Doctor
                    </th>
                    <th className="py-3 px-6 text-left text-gray-800 font-medium border-b">
                      Total Amount
                    </th>
                    <th className="py-3 px-6 text-left text-gray-800 font-medium border-b">
                      Discount
                    </th>
                    <th className="py-3 px-6 text-left text-gray-800 font-medium border-b">
                      Paid
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-6 border-b">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
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
