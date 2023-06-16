
import { useState, createContext, useContext, use, useEffect, ReactNode } from "react";
import { io, Socket } from 'socket.io-client';

type SocketContextType = Socket<any, any> | null;

type SocketProviderProps = {
    children: ReactNode;
};

  
export const SocketContext = createContext<SocketContextType>(null);

export const SocketProvider =  ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<SocketContextType>(null);

    useEffect(() => {
        const socket = io('http://localhost:3000');
        socket.on('connect', () => {
            console.log('Connected to socket server', socket.id);
        });
        setSocket(socket);
        return () => {
            socket.disconnect();
        }
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
