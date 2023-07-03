import { use, useEffect, useState } from "react";

const UserProfile = (userId: number) => {
    const [userData, setUserData] = useState<any>(null);
    
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetchUserProfileData(signal);
    
        return () => {
          controller.abort();
        };
    }, []);

    const fetchUserProfileData = async (signal: AbortSignal) => {
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                credentials: "include",
                signal: signal,
            });
            if (response.ok) {
                const userData = await response.json();
                setUserData(userData);
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    }
    if (!userData) {
        return null;
    }
    return userData;

}

export default UserProfile;
