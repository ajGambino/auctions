import React from 'react';
import { useAuction } from '../../contexts/AuctionContext';

const GameStatus = () => {
	const { currentUser, gamePhase, message } = useAuction();

	if (gamePhase !== 'game' || !currentUser) {
		return null;
	}

	return (
		<div className='game-status'>
			<div className='status-header'>
				<div className='game-info'>
					<h2>Auction In Progress</h2>
					<p>Blind bidding auction</p>
				</div>

				<div className='user-info'>
					<div className='user-card'>
						<h4>{currentUser.username}</h4>
						<div className='user-stats'>
							<div className='stat'>
								<span className='stat-label'>Budget:</span>
								<span className='stat-value budget'>${currentUser.budget}</span>
							</div>
							<div className='stat'>
								<span className='stat-label'>Players:</span>
								<span className='stat-value players'>
									{currentUser.playersOwned}/6
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='game-phase-indicator'>
				<div className='phase-status'>
					<span className='phase-text'>{message}</span>
				</div>
			</div>
		</div>
	);
};

export default GameStatus;
