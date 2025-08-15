const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
	},
});

// track connected users
const gameState = {
	users: new Map(),
	maxUsers: 2,
};

// socket connection handling
io.on('connection', (socket) => {
	console.log('User connected:', socket.id);

	// handle user joining
	socket.on('join', (data) => {
		console.log('User wants to join:', data.username);

		//  validation
		if (gameState.users.size >= gameState.maxUsers) {
			socket.emit('joinFailed', { message: 'Game is full' });
			return;
		}

		// add user to game
		gameState.users.set(socket.id, {
			id: socket.id,
			username: data.username,
		});

		socket.emit('joinSuccess', {
			message: `Welcome ${data.username}!`,
			playerCount: gameState.users.size,
		});

		io.emit('playerCountUpdate', {
			playerCount: gameState.users.size,
			maxUsers: gameState.maxUsers,
		});

		console.log(
			`${data.username} joined. Players: ${gameState.users.size}/${gameState.maxUsers}`
		);
	});

	// handle disconnection
	socket.on('disconnect', () => {
		const user = gameState.users.get(socket.id);
		if (user) {
			console.log('User disconnected:', user.username);
			gameState.users.delete(socket.id);

			io.emit('playerCountUpdate', {
				playerCount: gameState.users.size,
				maxUsers: gameState.maxUsers,
			});
		}
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Ready for connections from http://localhost:5173`);
});
