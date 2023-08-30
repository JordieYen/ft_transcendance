import useUserStore, { UserData } from "@/store/useUserStore";
import { loadWebFont } from "pixi.js";
import {
  useState,
  createContext,
  useContext,
  use,
  useEffect,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = Socket<any, any> | null;

type SocketProviderProps = {
  children: ReactNode;
};

export const SocketContext = createContext<SocketContextType>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<SocketContextType>(null);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_NEST_HOST}`);
    socket.on("connect", () => {
      console.log("Connected to socket server", socket.id);
    });
    setSocket(socket);
    const disconnectSocket = () => {
      if (userData?.id) {
        socket.emit("leave-room", userData.id);
      }
      socket.disconnect();
    };
    window.addEventListener("beforeunload", () => {
      disconnectSocket;
    });
    return () => {
      disconnectSocket;
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  useEffect(() => {
    if (userData.id) {
      // console.log("Joining room", userData.id);
      socket?.emit("join", userData.id);
    }
  }, [userData.id]);

  const handleUserActivity = () => {
    socket?.emit("activity");
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);
    // socket?.on('online-status-changed', (isOnline: boolean) => {
    //     console.log('online-status-changed', isOnline);
    //     setUserData({ ...userData, online: isOnline });
    // });
    return () => {
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
