import React from 'react';
import { useSocket } from './contexts/SocketContext';
import { useAuction } from './contexts/AuctionContext';
import JoinForm from './components/lobby/JoinForm';
import WaitingRoom from './components/lobby/WaitingRoom';
import GameStatus from './components/game/GameStatus';
import Button from './components/common/Button';
import Timer from './components/common/Timer';
import UserTeam from './components/game/UserTeam';
import PlayerList from './components/auction/PlayerList';
import PlayerCard from './components/auction/PlayerCard';
import './index.css';

function App() {
	const { connected } = useSocket();
	const { gamePhase, currentUser, message, availablePlayers } = useAuction();

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

						<div className='game-layout'>
							{/* main content area */}
							<div className='game-main'>
								<div className='component-showcase'>
									<p>testing game components with mock data</p>

									{/* test different playercard sizes */}
									<div className='showcase-section'>
										<h4>playercard sizes:</h4>
										<div className='card-sizes'>
											<PlayerCard
												player={{ name: 'Small Card', position: 'QB' }}
												size='small'
											/>
											<PlayerCard
												player={{ name: 'Medium Card', position: 'RB' }}
												size='medium'
											/>
											<PlayerCard
												player={{ name: 'Large Card', position: 'WR' }}
												size='large'
											/>
										</div>
									</div>

									{/* test timer component */}
									<div className='showcase-section'>
										<h4>timer states:</h4>
										<div className='timer-states'>
											<Timer timeRemaining={30} size='small' />
											<Timer timeRemaining={10} size='medium' />
											<Timer timeRemaining={3} size='large' />
										</div>
									</div>

									{/* test playerlist */}
									<div className='showcase-section'>
										<h4>available players:</h4>
										<PlayerList
											players={availablePlayers}
											title='mock player pool'
										/>
									</div>
								</div>
							</div>

							{/* sidebar with user team */}
							<div className='game-sidebar'>
								<UserTeam />
							</div>
						</div>
					</div>
				);

			case 'final':
				return (
					<div className='screen'>
						<p>game components working</p>
						<div className='final-actions'>
							<Button
								variant='success'
								size='large'
								onClick={() => window.location.reload()}
							>
								test again
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
