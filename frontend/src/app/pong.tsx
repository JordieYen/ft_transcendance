import React, { useEffect, useState } from 'react';

const PongMain: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async(userId: string) => {
            try {
                const response = await fetch(`http://localhost:3000/users/name/${userId}`);
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.log('Error fetching user data:', error);
            }
        };
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        if (userId)
            fetchUser(userId);
    }, []);

    return (
        <div>
            <h1>Welcome to the Pong Main Page!</h1>
            {
                user && (
                    <div>
                        <h2>User Information: </h2>
                        <img src={user.avatar} alt="User Avatar"/>
                        <p>ID: {user.id}</p>
                        <p>Username:  {user.username}</p>

                    </div>
            )}
        </div>
    );
};

export default PongMain;
