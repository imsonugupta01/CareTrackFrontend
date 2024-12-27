import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

function DoctorSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    degree: "",
    specialization: "",
    rate: "",
    description: "",
    password: "",
    image: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObject = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObject.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ROOT_API_URL}/auth/doctorSignup`,
        formDataObject,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error signing up");
    }
  };

  const handleLogout = () => {
    // Implement logout logic here, e.g., clearing auth tokens, redirecting, etc.
    alert("Logged out successfully!");
  };

  const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-white text-2xl font-bold">Add Doctor</h1>
        <button
         onClick={() => navigate("/adminProfile")}

          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition text-white duration-200"
        >
          Home
        </button>
      </header>

      {/* Signup Form */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-6">
        {message && (
          <div className="mb-4 text-center text-red-500">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Degree
            </label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rate
            </label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-md hover:from-green-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
          >
            submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default DoctorSignup;
