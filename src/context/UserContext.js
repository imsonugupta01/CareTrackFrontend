import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
        console(".")
        } else {
          setUser(null); 
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    fetchUser();
  }, []); 

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {!loading ? children : <div>Loading...</div>}
    </UserContext.Provider>
  );
};
