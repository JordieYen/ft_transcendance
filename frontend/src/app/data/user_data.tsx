import { useEffect, useState } from "react"

const UserData = () => {
    const [ userData, setUserData ] = useState<any>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/profile', {
                credentials: 'include',
            });
            if (response.ok) {
                const userData = await response.json();
                setUserData(userData);
                console.log('userData', userData);
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.log('Error fetching user data:', error);
        }
    }; 
    if (!userData) {
        return null;
    }
    return userData;
}

export default UserData;
