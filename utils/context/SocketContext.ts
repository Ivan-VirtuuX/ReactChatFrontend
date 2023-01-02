import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socket = io('https://reactchatbackend-production.up.railway.app');

export const SocketContext = createContext(socket);
