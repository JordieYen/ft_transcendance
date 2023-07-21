import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext<any>(null);

export const UseUserContext = ({ children }: UserProviderProps) => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_HOST}/auth/profile`, {
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
  if (!userData) {
    return <div>User not found</div>;
  }
  // return userData;
  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};

const UserData = () => {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchUserData(signal);

    return () => {
      controller.abort();
    };
  }, []);

  const fetchUserData = async (signal: AbortSignal) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_HOST}/auth/profile`, {
        credentials: "include",
        // mode: 'no-cors',
        signal: signal,
      });
      if (response.ok) {
        const userData = await response.json();
        // if (!userData) {
        //     router.push('/login');
        // }
        setUserData(userData);
        console.log("userData", userData);
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.log("Error fetching user data:", error);
        // router.push('/login');
      }
    }
  };

  if (!userData) {
    return null;
  }
  return userData;
};

export default UserData;
