import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

function PatientLogin() {
  const [formData, setFormData] = useState({ email: 'kumarsonu94047@gmail.com', password: '123456' });
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_ROOT_API_URL}/auth/patientLogin`, formData);
      setUser(response.data.patient);
      localStorage.setItem('user', JSON.stringify(response.data.patient));
      alert('Logged in successfully!');
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error logging in');
    }
  };

  const handleSignUp = () => {
    navigate('/patientSignup'); 
  };

  const handleAdminLogin = () => {
    navigate('/adminLogin'); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-white text-2xl font-bold">Patient Login</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition text-white duration-200"
        >
          Home
        </button>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
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
                placeholder="kumarsonu94047@gmail.com"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="123456"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {passwordVisible ? (
                  <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12l3 3m0-6l-3 3m-6 0l-3-3m0 6l3-3" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a9 9 0 0 1 18 0c0 4.97-4.03 9-9 9S3 13.97 3 9zM9 9l3-3m0 6l-3-3" />
                  </svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-4"
            >
              Login
            </button>
          </form>
          <button
            onClick={handleSignUp}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4"
          >
            New User? Create an Account
          </button>
          <button
            onClick={handleAdminLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientLogin;
