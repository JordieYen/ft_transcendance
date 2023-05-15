import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

const PongMain: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const response = await fetch('http://localhost:3000/auth/status', {
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

    // useEffect(() => {
    //     const fetchUser = async () => {
    //       try {
    //         const session = await getSession();
    //         if (session && session.user) {
    //           setUser(session.user);
    //         } else {
    //           console.log('User not found in session');
    //         }
    //       } catch (error) {
    //         console.log('Error fetching user data:', error);
    //       }
    //     };
    
    //     fetchUser();
    // }, []);

    return (
      <div>
        { error ? (
          <div>{error}</div>
        ) : user ? (
          <div>
            <h1>Welcome to Pong Main Page</h1>
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
