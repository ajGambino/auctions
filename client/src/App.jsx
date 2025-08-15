import React, { useState } from 'react';
import { useSocket } from './contexts/SocketContext';
import { useAuction } from './contexts/AuctionContext';
import './index.css';

function App() {
	const { connected } = useSocket();
	const { gamePhase, playerCount, maxUsers, currentUser, message, joinGame } =
		useAuction();

	// local state for the join form
	const [username, setUsername] = useState('');

	// handle form submission
	const handleJoin = (e) => {
		e.preventDefault();
		if (username.trim()) {
			joinGame(username.trim());
		}
	};

	// show connection status
	if (!connected) {
		return (
			<div className='app'>
				<div className='container'>
					<h1>Blind Auctions</h1>
					<div className='status'>
						<p>Connecting to server...</p>
					</div>
				</div>
			</div>
		);
	}

	// render different screens based on game phase
	const renderScreen = () => {
		switch (gamePhase) {
			case 'join':
				return (
					<div className='screen'>
						<h2>Join the Auction</h2>
						<form onSubmit={handleJoin} className='join-form'>
							<input
								type='text'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder='Enter your username'
								maxLength='20'
								required
								className='username-input'
							/>
							<button type='submit' className='join-button'>
								Join Game
							</button>
						</form>
						{message && <p className='message'>{message}</p>}
					</div>
				);

			case 'lobby':
				return (
					<div className='screen'>
						<h2>Waiting for Players</h2>
						<div className='lobby-info'>
							<div className='player-count'>
								<span className='count'>{playerCount}</span>
								<span className='separator'>/</span>
								<span className='total'>{maxUsers}</span>
							</div>
							<p>Players in lobby</p>

							{currentUser && (
								<p className='welcome'>
									Welcome, <strong>{currentUser.username}</strong>!
								</p>
							)}

							<p className='waiting-text'>
								{playerCount < maxUsers
									? `Waiting for ${maxUsers - playerCount} more players...`
									: 'Game will start soon!'}
							</p>
						</div>
						{message && <p className='message'>{message}</p>}
					</div>
				);

			case 'game':
				return (
					<div className='screen'>
						<h2>Game In Progress</h2>
						<p>Game logic here</p>
					</div>
				);

			case 'final':
				return (
					<div className='screen'>
						<h2>Game Complete</h2>
						<p>Results here</p>
					</div>
				);

			default:
				return (
					<div className='screen'>
						<h2>Unknown State</h2>
						<p>Something went wrong...</p>
					</div>
				);
		}
	};

	return (
		<div className='app'>
			<div className='container'>
				<div className='header'>
					<h1>Blind Auction</h1>
					<div className='status'>
						<span className='status-indicator connected'>🟢</span>
						<span>Connected to server</span>
					</div>
				</div>

				{renderScreen()}
			</div>
		</div>
	);
}

export default App;
