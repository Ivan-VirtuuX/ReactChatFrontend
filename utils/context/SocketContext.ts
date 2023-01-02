import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socket = io('http://reactchatbackend.onrender.com');

export const SocketContext = createContext(socket);
