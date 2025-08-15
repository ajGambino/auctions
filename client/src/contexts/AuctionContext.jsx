import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

const AuctionContext = createContext();

// custom hook to use auction data
export const useAuction = () => {
	const context = useContext(AuctionContext);
	if (!context) {
		throw new Error('useAuction must be used within an AuctionProvider');
	}
	return context;
};

// provider component
export const AuctionProvider = ({ children }) => {
	// simple state..expand this later
	const [gamePhase, setGamePhase] = useState('join'); // 'join' | 'lobby' | 'game' | 'final'
	const [playerCount, setPlayerCount] = useState(0);
	const [maxUsers, setMaxUsers] = useState(6);
	const [currentUser, setCurrentUser] = useState(null);
	const [message, setMessage] = useState('');

	const { socket } = useSocket();

	// socket event listeners
	useEffect(() => {
		if (!socket) return;

		console.log('Setting up auction event listeners');

		socket.on('joinSuccess', (data) => {
			console.log('Join successful:', data.message);
			setMessage(data.message);
			setPlayerCount(data.playerCount);
			setGamePhase('lobby');
		});

		socket.on('joinFailed', (data) => {
			console.log('Join failed:', data.message);
			setMessage(data.message);
		});

		socket.on('playerCountUpdate', (data) => {
			console.log('Player count update:', data.playerCount);
			setPlayerCount(data.playerCount);
			setMaxUsers(data.maxUsers);
		});

		// cleanup listeners when component unmounts
		return () => {
			socket.off('joinSuccess');
			socket.off('joinFailed');
			socket.off('playerCountUpdate');
		};
	}, [socket]);

	// action functions
	const joinGame = (username) => {
		if (!socket) {
			console.error('No socket connection');
			return;
		}

		console.log('Attempting to join game as:', username);
		setCurrentUser({ username });
		socket.emit('join', { username });
	};

	// provide to child components
	const value = {
		// state
		gamePhase,
		playerCount,
		maxUsers,
		currentUser,
		message,

		// actions
		joinGame,
	};

	return (
		<AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
	);
};
