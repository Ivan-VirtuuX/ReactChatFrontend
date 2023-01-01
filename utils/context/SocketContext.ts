import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socket = io(`https://reactchatbackend.onrender.com:${process.env.PORT}`);

export const SocketContext = createContext(socket);
