import React from 'react';
import { useSocket } from './contexts/SocketContext';
import { useAuction } from './contexts/AuctionContext';
import JoinForm from './components/lobby/JoinForm';
import WaitingRoom from './components/lobby/WaitingRoom';
import GameStatus from './components/game/GameStatus';
import Button from './components/common/Button';
import Timer from './components/common/Timer';
import './index.css';

function App() {
	const { connected } = useSocket();
	const { gamePhase, currentUser } = useAuction();

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
				return <JoinForm />;

			case 'lobby':
				return <WaitingRoom />;

			case 'game':
				return (
					<div className='screen'>
						<GameStatus />
						<div className='game-content'>
							<h2>🎮 Auction Starting Soon</h2>
							<p>get ready to bid on players!</p>
							<Timer timeRemaining={30} size='large' />
							<div className='game-actions'>
								<Button variant='primary' size='large'>
									Ready to Bid
								</Button>
							</div>
						</div>
					</div>
				);

			case 'final':
				return (
					<div className='screen'>
						<h2>🏆 Auction Complete</h2>
						<p>great job! here are the results...</p>
						<div className='final-actions'>
							<Button
								variant='success'
								size='large'
								onClick={() => window.location.reload()}
							>
								Play Again
							</Button>
						</div>
					</div>
				);

			default:
				return (
					<div className='screen'>
						<h2>⚠️ Unknown State</h2>
						<p>something went wrong. please refresh the page.</p>
						<Button
							variant='secondary'
							onClick={() => window.location.reload()}
						>
							Refresh Page
						</Button>
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
						<span>Connected • {currentUser?.username || 'Not joined'}</span>
					</div>
				</div>

				{renderScreen()}
			</div>
		</div>
	);
}

export default App;
