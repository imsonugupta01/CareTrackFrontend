import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
// import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
// import BookAppointment from "./BookAppointment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faUser } from "@fortawesome/free-regular-svg-icons";


function AllDoctors() {
  // const { user,setUser } = useContext(UserContext);
  const [doctors, setDoctors] = useState([]);
  const [filteredSpecialization, setFilteredSpecialization] = useState("All");


const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
});

 useEffect(()=>{
   console.log(user)
  })
 

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ROOT_API_URL}/doctor/findAll`
        );
        setDoctors(response.data);
      } catch (err) {
        console.log("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, []);

  const BookAppointmentt= (id)=>
  {

    if(!user){
      alert("please login first to book appointment")
      navigate("/patientLogin")
    }
    else
     navigate(`/BookAppointment/${id}/${user._id}`)
  }

  const uniqueSpecializations = [
    "All",
    ...new Set(doctors.map((doc) => doc.specialization)),
  ];
  const navigate=useNavigate()
  const handleLogin=()=>{
    navigate("/patientLogin")
  }
  const [history, setHistory] = useState([]);


   
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    setUser(null);
    setHistory([]);
    navigate("/");
  };

  const filteredDoctors =
    filteredSpecialization === "All"
      ? doctors
      : doctors.filter((doc) => doc.specialization === filteredSpecialization);

 function handleViewProfile(id){
  navigate(`/patientProfile/${id}`);

  }


  return (
    <div className="flex flex-col bg-gray-100">
   
    <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md relative z-20">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <div className="relative group">
        <button className="flex items-center space-x-2">
          {user && (
            <span className="hidden sm:flex items-center space-x-1 mx-3">



             <span className="text-xl bg-white text-blue-600 px-3  rounded-lg shadow-sm border border-gray-200">
  ₹ {user.walletBalance}
</span>

            </span>
          )}
          <span className="hidden sm:block">{user ? user.name : "Guest"}</span>
          {/* <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="rounded-full h-10 w-10 border-2 border-white"
          /> */}
          <FontAwesomeIcon
                className="rounded-full h-4 w-10 border-5 border-white"
                icon={faUser}
            />
        </button>
  
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
          {user && (
            <>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => handleViewProfile(user._id)}
              >
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
          )}
          {!user && (
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
  

<div className="w-full h-auto bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 flex items-center justify-center text-white relative overflow-hidden shadow-lg py-6 sm:py-0">
  {/* Background Image */}
  <div className="absolute inset-0 opacity-50 bg-[url('https://source.unsplash.com/1600x900/?healthcare,doctor')] bg-cover bg-center"></div>
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
  {/* Text Content */}
  <div className="z-10 text-center px-4 sm:px-6 max-w-full sm:max-w-3xl">
    <h2 className="text-lg sm:text-3xl font-extrabold drop-shadow-md mb-3">
      Get Discount up to 40% On Your First Appointment!
    </h2>
    <p className="text-sm sm:text-lg font-medium mb-4 drop-shadow-sm">
      Book now and start your journey to better health with our top-rated doctors.
    </p>
    <button className="px-4 py-2 my-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg shadow hover:shadow-xl transform hover:scale-105 transition">
      Book Now
    </button>
  </div>
</div>

  
  
    <nav className="bg-white h-auto shadow-md py-3 px-6">
      <div className="sm:flex hidden space-x-4">
        {uniqueSpecializations.map((spec, index) => (
          <button
            key={index}
            onClick={() => setFilteredSpecialization(spec)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ease-in-out duration-300 ${
              filteredSpecialization === spec
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>
   
      <div className="sm:hidden">
        <select
          className="w-full px-4 py-2 rounded-lg bg-gray-200 focus:ring-2 focus:ring-blue-600"
          onChange={(e) => setFilteredSpecialization(e.target.value)}
        >
          {uniqueSpecializations.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>
    </nav>
  
  
    <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
  {filteredDoctors.map((doctor) => (
    <div
      key={doctor._id}
      className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105 border border-gray-200"
    >
   
      <div className="relative w-full h-64 sm:h-72">
        <img
          src={doctor.imageUrl}
          alt={doctor.name}
          className="w-full h-full object-cover object-top rounded-t-xl"
        />
        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-medium shadow">
          {doctor.specialization}
        </div>
      </div>
    
      <div className="p-4 sm:p-6 space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          {doctor.name}
        </h3>
        <div className="flex items-center gap-2">
         
          <span className="text-sm text-gray-600">{doctor.degree}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600">Fee:</span>
          <span className="text-lg font-bold text-green-600">
            ₹ {doctor.rate}
          </span>
        </div>
        <button
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 text-sm font-medium"
          onClick={() => BookAppointmentt(doctor._id)}
        >
          Book Appointment
        </button>
      </div>
    </div>
  ))}
</main>

  </div>
  
  );
}

export default AllDoctors;
