import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

//   Fetch user data when the app loads and when token changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
        console(".")
        } else {
          setUser(null); // No token, set user to null
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        setUser(null);
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchUser();
  }, []); // Run only once when component mounts

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {!loading ? children : <div>Loading...</div>}
    </UserContext.Provider>
  );
};
