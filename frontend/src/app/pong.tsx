import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const PongMain: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const response = await fetch('http://localhost:3000/auth/profile', {
                  credentials: 'include',
                });
                if (response.ok) {
                  const userData = await response.json();
                  setUser(userData);
                } else {
                throw new Error('User not found');
                }
            } catch (error) {
                console.log('Error fetching user data:', error);
                setError('Error fetching user data');
            }
        };
       
        fetchUser();
    }, []);

    const logout = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/logout');
        router.push('/login');
      } catch (error) {
        setError('Error loggin out');
      }
    }

    return (
      <div>
        { error ? (
          <div>{error}</div>
        ) : user ? (
          <div>
            <h1>Welcome to Pong Main Page</h1>
            <button className="logout-button" onClick={logout}>Logout</button>
              <style jsx> 
              {`
                .logout-button {
                  float: right;
                }
              `}
              </style>
              <h2>User Profile:</h2>
              <img src={user.avatar} alt="User Avatar" />
              <p>Id: {user.id} </p>
              <p>Username: {user.username} </p>
          </div>
          
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
};

export default PongMain;
