import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { URL } from 'url';
import Modal from 'react-modal';

const PongMain: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [qrCodeURL, setQrCodeUrl] = useState<string | null>(null);
    const [isQrCodeModalOpen, setQrCodeModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const response = await fetch('http://localhost:3000/auth/profile', {
                  credentials: 'include',
                });
                if (response.ok) {
                  const userData = await response.json();
                  console.log('response', userData);
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
        const response = await fetch('http://localhost:3000/auth/logout', {
                  credentials: 'include',
          });
        console.log('logout response', response);
        router.push('/login');
      } catch (error) {
        setError('Error loggin out');
      }
    };

    // useEffect(() => {
      const enable2fa = async () => {
        try {
          const response = await axios.get('http://localhost:3000/auth/2fa', {
            withCredentials: true,
            responseType: 'blob',
          });
          const qrCodeBlob = new Blob([response.data], { type: 'image/png' });
          const qrCodeURL = URL.createObjectURL(qrCodeBlob as any);
          setQrCodeUrl(qrCodeURL);
          setQrCodeModalOpen(true);
        } catch (error) {
          setError('Error enabling 2FA');
        }
      };
      // enable2fa();
    // }, []);

    return (
      <div>
        { error ? (
          <div>{error}</div>
        ) : user ? (
          <div>
            <h1>Welcome to Pong Main Page</h1>
            <button className="logout-button" onClick={logout}>Logout</button>
            {/* <button className="enable-2fa" onClick={enable2fa}>Enable 2fa</button> */}
              <style jsx> 
              {`
                .logout-button {
                  float: right;
                }
              `}
              </style>
              <h2>User Profile:</h2>
              <img src={user.avatar} alt="User Avatar" style={{ width: '200px', height: '200px'}} />
              <p>Id: {user.id} </p>
              <p>Intra_uid: {user.intra_uid} </p>
              <p>Username: {user.username} </p>
              <p>Online: {user.online ? 'online' : 'offline'} </p>
          </div>
          
        ) : (
          <div>Loading...</div>
        )}
        <Modal 
          isOpen={isQrCodeModalOpen}
          onRequestClose={() => setQrCodeModalOpen(false)}
          contentLabel="QR Code Modal"
          >
            <button onClick={() => setQrCodeModalOpen(false)}>Close</button>
            {qrCodeURL && <img src={qrCodeURL} alt="QR Code"/>}
        </Modal>
      </div>
    );
};

export default PongMain;
