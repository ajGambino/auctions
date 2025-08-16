import React from 'react';
import { useAuction } from '../../contexts/AuctionContext';

const GameStatus = () => {
	const { currentUser, gamePhase } = useAuction();

	if (gamePhase !== 'game' || !currentUser) {
		return null;
	}

	return (
		<div className='game-status'>
			<div className='status-header'>
				<div className='game-info'>
					<h2>Auction In Progress</h2>
					<p>Blind bidding auction - may the best bidder win!</p>
				</div>

				<div className='user-info'>
					<div className='user-card'>
						<h4>{currentUser.username}</h4>
						<div className='user-stats'>
							<div className='stat'>
								<span className='stat-label'>Budget:</span>
								<span className='stat-value budget'>$100</span>
							</div>
							<div className='stat'>
								<span className='stat-label'>Players:</span>
								<span className='stat-value players'>0/6</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='game-phase-indicator'>
				<div className='phase-status'>
					<span className='phase-icon'>🎮</span>
					<span className='phase-text'>Game in progress</span>
				</div>
			</div>
		</div>
	);
};

export default GameStatus;
