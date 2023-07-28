import React, { useEffect } from "react";
import useUserStore from "@/store/useUserStore";

const UserData = () => {
  const userData = useUserStore((state) => state.userData);
  const setUserData = useUserStore((state) => state.setUserData);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_HOST}auth/profile`, {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
          console.log("userData", userData);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return null;
  }

  return userData;
};

export default UserData;
