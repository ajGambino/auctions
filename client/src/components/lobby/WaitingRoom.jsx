import React from 'react';
import { useAuction } from '../../contexts/AuctionContext';
import Button from '../common/Button';

const WaitingRoom = () => {
	const { playerCount, maxUsers, currentUser, message } = useAuction();

	const isRoomFull = playerCount >= maxUsers;
	const playersNeeded = maxUsers - playerCount;

	return (
		<div className='screen'>
			<div className='waiting-room'>
				<h2>Waiting for Players</h2>

				<div className='lobby-status'>
					<div className='player-count-display'>
						<div className='count-circle'>
							<span className='current-count'>{playerCount}</span>
							<span className='separator'>/</span>
							<span className='max-count'>{maxUsers}</span>
						</div>
						<p className='count-label'>Players Connected</p>
					</div>

					<div className='status-message'>
						{isRoomFull ? (
							<div className='ready-status'>
								<span className='status-icon'></span>
								<h3>All players connected!</h3>
								<p>Game starting soon...</p>
							</div>
						) : (
							<div className='waiting-status'>
								<span className='status-icon'>⏳</span>
								<h3>
									Waiting for {playersNeeded} more player
									{playersNeeded !== 1 ? 's' : ''}...
								</h3>
								<p>Share this link with a friend to join</p>
							</div>
						)}
					</div>
				</div>

				{currentUser && (
					<div className='user-welcome'>
						<div className='welcome-card'>
							<h4>Welcome to the auction!</h4>
							<p>
								<strong>{currentUser.username}</strong>, you're ready to bid!
							</p>
							<div className='user-stats'>
								<div className='stat'>
									<span className='stat-value'>$100</span>
									<span className='stat-label'>Starting Budget</span>
								</div>
								<div className='stat'>
									<span className='stat-value'>30s</span>
									<span className='stat-label'>Per Bid</span>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className='waiting-actions'>
					<Button
						variant='secondary'
						size='medium'
						onClick={() => window.location.reload()}
					>
						Leave Game
					</Button>

					<Button
						variant='primary'
						size='medium'
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
							alert('Link copied! Share with a friend.');
						}}
					>
						Copy Link
					</Button>
				</div>

				{message && <div className='lobby-message'>{message}</div>}

				<div className='waiting-animation'>
					<div className='dots'>
						<span></span>
						<span></span>
						<span></span>
					</div>
					<p>Waiting for players to join...</p>
				</div>
			</div>
		</div>
	);
};

export default WaitingRoom;
