import { useState, useEffect } from "react";
import useUserStore from "@/store/useUserStore";

const useFetchUserData = () => {
  const setUserData = useUserStore((state) => state.setUserData);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_HOST}/auth/profile`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  return fetchUserData;

};

export default useFetchUserData;
