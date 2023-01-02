import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socket = io('https://reactchatbackend.onrender.com');

export const SocketContext = createContext(socket);
