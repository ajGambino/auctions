const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
	},
});

const gameState = {
	users: new Map(),
	maxUsers: 2,
	phase: 'waiting', // 'waiting' | 'auction' | 'complete'
	currentPlayer: null,
	currentNominator: 0,
	bids: new Map(),
	timer: null,
	timeRemaining: 30,
	playersAuctioned: 0,
};

// load players from CSV (fallback to mock data)
let playerPool = [];

function loadPlayersFromCSV() {
	try {
		// try to read from client/public/players.csv
		const csvPath = path.join(__dirname, 'client', 'public', 'players.csv');
		if (fs.existsSync(csvPath)) {
			const csvData = fs.readFileSync(csvPath, 'utf8');
			const lines = csvData.split('\n').filter((line) => line.trim());
			const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

			playerPool = lines
				.slice(1)
				.map((line, index) => {
					const values = line.split(',').map((v) => v.trim());
					return {
						id: parseInt(values[0]) || index + 1,
						name: values[1] || 'unknown player',
						position: values[2] || 'UNKNOWN',
						team: values[3] || '',
					};
				})
				.filter((player) => player.name !== 'unknown player');

			console.log(`loaded ${playerPool.length} players from CSV`);
		} else {
			throw new Error('CSV file not found');
		}
	} catch (error) {
		console.log('using fallback player data:', error.message);
		// fallback player data
		playerPool = [
			{ id: 1, name: 'Patrick Mahomes', position: 'QB', team: 'KC' },
			{ id: 2, name: 'Josh Allen', position: 'QB', team: 'BUF' },
			{ id: 3, name: 'Christian McCaffrey', position: 'RB', team: 'SF' },
			{ id: 4, name: 'Derrick Henry', position: 'RB', team: 'TEN' },
			{ id: 5, name: 'Cooper Kupp', position: 'WR', team: 'LAR' },
			{ id: 6, name: 'Davante Adams', position: 'WR', team: 'LV' },
		];
	}
}

// load players on server start
loadPlayersFromCSV();

let availablePlayers = [...playerPool];

function createUser(socketId, username) {
	return {
		id: socketId,
		username,
		budget: 100,
		team: [],
		playersOwned: 0,
	};
}

function startAuction() {
	if (gameState.users.size !== gameState.maxUsers) return;

	console.log('starting auction with', gameState.users.size, 'players');

	gameState.phase = 'auction';
	gameState.currentNominator = 0;

	// tell everyone the game started
	io.emit('gameStarted', {
		users: Array.from(gameState.users.values()),
		phase: 'auction',
	});

	// start the first nomination after a delay
	setTimeout(() => {
		requestNomination();
	}, 2000);
}

function requestNomination() {
	const userArray = Array.from(gameState.users.values());
	const nominator = userArray[gameState.currentNominator];

	console.log(`requesting nomination from ${nominator.username}`);

	// send nomination request to the nominating player
	io.to(nominator.id).emit('requestNomination', {
		availablePlayers: availablePlayers,
	});

	// tell everyone else who's nominating
	userArray.forEach((user) => {
		if (user.id !== nominator.id) {
			io.to(user.id).emit('waitingForNomination', {
				nominator: nominator.username,
			});
		}
	});
}

function startBidding(player) {
	console.log(`starting bidding for ${player.name}`);

	gameState.currentPlayer = player;
	gameState.timeRemaining = 30;
	gameState.bids.clear();

	// tell everyone bidding started
	io.emit('biddingStarted', {
		player: player,
		timeRemaining: gameState.timeRemaining,
	});

	// start countdown timer
	gameState.timer = setInterval(() => {
		gameState.timeRemaining--;
		io.emit('timerUpdate', gameState.timeRemaining);

		if (gameState.timeRemaining <= 0) {
			endBidding();
		}
	}, 1000);
}

function endBidding() {
	clearInterval(gameState.timer);

	let winner = null;
	let winningBid = 0;
	let earliestBidTime = null;

	// find highest bid with timestamp tiebreaker
	for (const [userId, bidData] of gameState.bids) {
		if (
			bidData.amount > winningBid ||
			(bidData.amount === winningBid && bidData.timestamp < earliestBidTime)
		) {
			winningBid = bidData.amount;
			winner = gameState.users.get(userId);
			earliestBidTime = bidData.timestamp;
		}
	}

	if (winner) {
		console.log(
			`${winner.username} won ${gameState.currentPlayer.name} for $${winningBid}`
		);

		// assign player to winner
		winner.budget -= winningBid;
		winner.playersOwned++;
		winner.team.push({
			...gameState.currentPlayer,
			cost: winningBid,
		});

		// remove player from available pool
		availablePlayers = availablePlayers.filter(
			(p) => p.id !== gameState.currentPlayer.id
		);
		gameState.playersAuctioned++;

		io.emit('playerWon', {
			player: gameState.currentPlayer,
			winner: winner.username,
			winningBid: winningBid,
			updatedUsers: Array.from(gameState.users.values()),
		});
	} else {
		console.log(`no bids for ${gameState.currentPlayer.name}`);
		io.emit('noBids', {
			player: gameState.currentPlayer,
		});
	}

	// check if auction is complete
	if (availablePlayers.length === 0) {
		endAuction();
	} else {
		// move to next nominator
		gameState.currentNominator =
			(gameState.currentNominator + 1) % gameState.maxUsers;
		setTimeout(() => {
			requestNomination();
		}, 3000);
	}
}

function endAuction() {
	console.log('auction complete!');
	gameState.phase = 'complete';

	io.emit('auctionComplete', {
		finalTeams: Array.from(gameState.users.values()),
	});
}

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

		if (gameState.phase !== 'waiting') {
			socket.emit('joinFailed', { message: 'game in progress' });
			return;
		}

		// add user to game
		const user = createUser(socket.id, data.username);
		gameState.users.set(socket.id, user);

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

		// simple game start when 2 players join (just     // start auction if we have enough players
		if (gameState.users.size === gameState.maxUsers) {
			startAuction();
		}
	});

	// handle player nomination
	socket.on('nominatePlayer', (data) => {
		const user = gameState.users.get(socket.id);
		const userArray = Array.from(gameState.users.values());
		const nominator = userArray[gameState.currentNominator];

		// validate nominator
		if (!user || user.id !== nominator.id) {
			console.log('invalid nominator');
			return;
		}

		const player = availablePlayers.find((p) => p.id === data.playerId);
		if (!player) {
			console.log('invalid player');
			return;
		}

		startBidding(player);
	});

	// handle bid placement
	socket.on('placeBid', (data) => {
		const user = gameState.users.get(socket.id);
		if (!user || gameState.phase !== 'auction' || !gameState.currentPlayer) {
			return;
		}

		const bidAmount = data.amount;

		// basic validation
		if (bidAmount < 1 || bidAmount > user.budget) {
			socket.emit('bidRejected', 'invalid bid amount');
			return;
		}

		console.log(
			`${user.username} bid $${bidAmount} on ${gameState.currentPlayer.name}`
		);

		// store bid with timestamp
		gameState.bids.set(socket.id, {
			amount: bidAmount,
			timestamp: Date.now(),
		});

		socket.emit('bidPlaced', bidAmount);
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

			// handle mid-game disconnection
			if (
				gameState.phase === 'auction' &&
				gameState.users.size < gameState.maxUsers
			) {
				clearInterval(gameState.timer);
				io.emit('userLeft', `${user.username} left the game`);
			}
		}
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Ready for connections from http://localhost:5173`);
});
