
import useUserStore from "@/store/useUserStore";
import { loadWebFont } from "pixi.js";
import { useState, createContext, useContext, use, useEffect, ReactNode } from "react";
import { io, Socket } from 'socket.io-client';

type SocketContextType = Socket<any, any> | null;

type SocketProviderProps = {
    children: ReactNode;
};

  
export const SocketContext = createContext<SocketContextType>(null);

export const SocketProvider =  ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<SocketContextType>(null);
    const [userData, setUserData] = useUserStore((state) => [
        state.userData,
        state.setUserData,
      ]);
    
    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_NEST_HOST}`);
        socket.on('connect', () => {
            console.log('Connected to socket server', socket.id);
        });
        setSocket(socket);
        window.addEventListener('beforeunload', () => {
            socket.disconnect();
        });
        return () => {
            socket.disconnect();
            window.removeEventListener('beforeunload', () => {});
        }
    }, []);

    useEffect(() => {
        if (userData) {
            console.log('Joining room', userData.id);
            socket?.emit('join', userData.id);
        }
        return () => {
            socket?.emit('leave-room', userData?.id);
        }
    }, [userData]);

    const handleUserActivity = () => {
        socket?.emit('activity');
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleUserActivity);
        document.addEventListener('keydown', handleUserActivity);
        socket?.on('online-status-changed', (isOnline: boolean) => {
            console.log('online-status-changed', isOnline);
            // setUserData((prevUserData: UserData) => ({ 
            //     ...prevUserData,
            //     online: isOnline,
            // }));
            
        });
    
        return () => {
          document.removeEventListener('mousemove', handleUserActivity);
          document.removeEventListener('keydown', handleUserActivity);
        };
    // }, [socket]);
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
