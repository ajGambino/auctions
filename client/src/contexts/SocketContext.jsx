import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

// custom hook to use the socket
export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
};

// socket provider
export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		console.log('Connecting to server...');

		const newSocket = io('http://localhost:3000');

		// connection event handlers
		newSocket.on('connect', () => {
			console.log('Connected to server!');
			setConnected(true);
		});

		newSocket.on('disconnect', () => {
			console.log('Disconnected from server');
			setConnected(false);
		});

		newSocket.on('connect_error', (error) => {
			console.error('Connection error:', error);
		});

		setSocket(newSocket);

		// cleanup function
		return () => {
			console.log('Cleaning up socket connection');
			newSocket.close();
		};
	}, []);

	// provide to child components
	const value = {
		socket,
		connected,
	};

	return (
		<SocketContext.Provider value={value}>{children}</SocketContext.Provider>
	);
};
