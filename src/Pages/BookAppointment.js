import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function BookAppointment() {
  const { doctorId, patientId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [isDiscountApplicable, setIsDiscountApplicable] = useState(true);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/patientLogin");
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ROOT_API_URL}/doctor/findById/${doctorId}`
        );
        setDoctor(response.data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ROOT_API_URL}/payment/findPair/${patientId}/${doctorId}`
        );
        setAppointmentHistory(response.data.data || []);
        setIsDiscountApplicable(!response.data.data.length);
      } catch (error) {
        console.error("Error fetching appointment history:", error);
      }
    };

    fetchDoctor();
    fetchAppointments();
  }, [doctorId, patientId]);

  const handleBookAppointment = async () => {
    try {
      const totalAmount = doctor?.rate || 0;
      const discount = isDiscountApplicable ? 40 : 0;
      const discountedAmount = totalAmount * (1 - discount / 100);
  
      // Check if wallet balance is sufficient
      if (user?.walletBalance < discountedAmount) {
        alert("Insufficient wallet balance to book the appointment.");
        return;
      }
  
      // Book the appointment
      const response = await axios.post(`${process.env.REACT_APP_ROOT_API_URL}/payment/make`, {
        patientName: user?.name,
        doctorName: doctor?.name,
        patientId,
        doctorId,
        totalAmount,
        discount,
      });
  
      if (response.status === 201) {
        // Update wallet balance
        const updatedWalletResponse = await axios.get(
          `${process.env.REACT_APP_ROOT_API_URL}/patient/update/${patientId}/${discountedAmount}`
        );
  
        if (updatedWalletResponse.status === 200) {
          alert("Appointment booked successfully!");
          setIsDiscountApplicable(false);
          setAppointmentHistory((prev) => [...prev, response.data.data]);
  
          // Update user state with new wallet balance
          const updatedUser = { ...user, walletBalance: updatedWalletResponse.data.walletBalance };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          alert("Failed to update wallet balance.");
        }
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book the appointment.");
    }
  };
  

  if (!doctor) {
    return <div className="text-center text-lg text-gray-600">Loading...</div>;
  }

  function handleViewProfile(id){
    navigate(`/patientProfile/${id}`);
  
    }
  

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center">
      <header className="bg-blue-700 text-white py-4 px-6 flex justify-between items-center shadow-md w-full">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <div className="relative group">
          <button className="flex items-center space-x-2">
            {user && (
              <span className="hidden sm:flex items-center space-x-1 mx-6">
                <i className="fas fa-wallet text-yellow-400"></i>
                <span className="text-xl">₹ {user.walletBalance}</span>
              </span>
            )}
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="rounded-full h-10 w-10 border-2 border-white"
            />
            <span className="hidden sm:block">{user ? user.name : "Guest"}</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {user ? (
              <>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                
                onClick={() =>handleViewProfile(user._id)}>
                  View Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </>
            ) : (
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleLogin}
              >
                Login
              </a>
            )}
          </div>
        </div>
      </header>

      <div
  className="bg-white shadow-lg rounded-lg max-w-full w-full mt-6 p-6 flex flex-col md:flex-row"
>
  {/* Doctor Image */}
  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 self-center md:self-start">
    <img
      src={doctor.imageUrl}
      alt={doctor.name}
      className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-2 border-blue-500"
    />
  </div>

  {/* Doctor Details */}
  <div className="flex flex-col flex-1">
    <div className="text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">
      {doctor.name}
    </div>
    <p className="text-gray-600 mb-1 font-medium text-center md:text-left">
      {doctor.specialization}
    </p>
    <p className="text-gray-600 italic text-center md:text-left">
      {doctor.degree}
    </p>
    <p className="text-gray-700 mt-4 text-center md:text-left">
      {doctor.description}
    </p>
    <p className="text-lg font-semibold text-gray-800 mt-4 text-center md:text-left">
      Consultation Fee: <span className="text-blue-600">₹{doctor.rate}</span>
    </p>
    {isDiscountApplicable && (
      <p className="mt-2 text-sm text-green-600 font-bold text-center md:text-left">
        Special Offer: 40% Discount Available on first appointment!
      </p>
    )}
    <button
      onClick={handleBookAppointment}
      className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
    >
      Book Appointment
    </button>
  </div>
</div>


      {appointmentHistory.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg max-w-full w-full mt-6 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Appointment History</h3>
          <div className="grid gap-4">
            {appointmentHistory.map((appointment) => (
              <div
                key={appointment._id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-800 font-semibold">
                      Total Paid: ₹{((appointment.totalAmount * (100 - appointment.discount)) / 100).toFixed(2)}
                    </p>
                  </div>
                  {appointment.discount > 0 && (
                    <div className="text-green-600 font-semibold text-sm">
                      Discount Applied: {appointment.discount}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;
