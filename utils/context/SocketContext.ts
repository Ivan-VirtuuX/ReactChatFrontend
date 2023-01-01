import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socket = io('https://reactchatbackend.onrender.com:8888');

export const SocketContext = createContext(socket);
