import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Header Component
const Header = ({ onLogout }) => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Login</h1>
      <button
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        onClick={onLogout}
      >
        Logout
      </button>
    </header>
  );
};

// Main DoctorLogin Component
function DoctorLogin() {
  const [formData, setFormData] = useState({ email: 'vishalsharma@gmail.com', password: '123456' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_ROOT_API_URL}/auth/doctorLogin`, formData);
      alert("Logged in successfully!");
      navigate('/adminProfile'); 
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error logging in');
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
    alert('Logged out');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header onLogout={handleLogout} />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-green-500">Admin Login</h1>
          {message && <div className="mb-4 text-center text-red-500">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-4"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;
