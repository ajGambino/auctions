import React, { useState } from 'react';
import { useSocket } from './contexts/SocketContext';
import { useAuction } from './contexts/AuctionContext';
import Button from './components/common/Button';
import Modal from './components/common/Modal';
import Timer from './components/common/Timer';
import './index.css';

function App() {
	const { connected } = useSocket();
	const { gamePhase, playerCount, maxUsers, currentUser, message, joinGame } =
		useAuction();

	// local state for the join form
	const [username, setUsername] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [testTimer, setTestTimer] = useState(30);

	// handle form submission
	const handleJoin = (e) => {
		e.preventDefault();
		if (username.trim()) {
			joinGame(username.trim());
		}
	};

	// test functions for  components
	const testModal = () => setShowModal(true);
	const decrementTimer = () => setTestTimer(Math.max(0, testTimer - 1));

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
						{/* test new components */}
						<div className='component-test'>
							<h3>Component Tests (Phase 2)</h3>
							<div className='test-buttons'>
								<Button variant='primary' onClick={testModal}>
									Test Modal
								</Button>
								<Button variant='secondary' onClick={decrementTimer}>
									Test Timer
								</Button>
								<Button variant='success' size='small'>
									Success
								</Button>
								<Button variant='danger' disabled>
									Disabled
								</Button>
							</div>
							<Timer timeRemaining={testTimer} size='medium' />
						</div>

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
							{/* test components in lobby too */}
							<div className='lobby-actions'>
								<Button variant='secondary' onClick={testModal}>
									Test Modal
								</Button>
								<Timer timeRemaining={15} size='small' />
							</div>
						</div>
						{message && <p className='message'>{message}</p>}
					</div>
				);

			case 'game':
				return (
					<div className='screen'>
						<h2>Game In Progress</h2>
						<p>Game logic here</p>
						<Timer timeRemaining={30} size='large' />
					</div>
				);

			case 'final':
				return (
					<div className='screen'>
						<h2>Game Complete</h2>
						<p>Results here</p>
						<Button variant='success' size='large'>
							Play Again
						</Button>
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
				{/* test modal */}
				{showModal && (
					<Modal title='Test Modal' onClose={() => setShowModal(false)}>
						<p>This is a test modal! 🎉</p>
						<p>Press Escape or click outside to close.</p>
						<br />
						<Button variant='primary' onClick={() => setShowModal(false)}>
							Close Modal
						</Button>
					</Modal>
				)}
			</div>
		</div>
	);
}

export default App;
