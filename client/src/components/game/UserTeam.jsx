import React from 'react';
import { useAuction } from '../../contexts/AuctionContext';
import PlayerCard from '../auction/PlayerCard';

const UserTeam = () => {
	const { currentUser } = useAuction();

	if (!currentUser) {
		return null;
	}

	const { username, budget, team, playersOwned } = currentUser;

	// group players by position for organized display
	const groupPlayersByPosition = (players) => {
		const groups = { QB: [], RB: [], WR: [], TE: [] };
		players.forEach((player) => {
			if (groups[player.position]) {
				groups[player.position].push(player);
			}
		});
		return groups;
	};

	const groupedTeam = groupPlayersByPosition(team);

	return (
		<div className='user-team'>
			<div className='team-header'>
				<h3>your team</h3>
				<div className='team-stats'>
					<div className='stat'>
						<span className='stat-label'>budget:</span>
						<span className='stat-value budget'>${budget}</span>
					</div>
					<div className='stat'>
						<span className='stat-label'>players:</span>
						<span className='stat-value players'>{playersOwned}/6</span>
					</div>
				</div>
			</div>

			<div className='team-roster'>
				{['QB', 'RB', 'WR', 'TE'].map((position) => (
					<div key={position} className='position-section'>
						<div className='position-header'>
							<h4>{position}</h4>
							<span className='position-count'>
								({groupedTeam[position].length}/{position === 'WR' ? '2' : '1'})
							</span>
						</div>

						<div className='position-players'>
							{groupedTeam[position].length > 0 ? (
								groupedTeam[position].map((player) => (
									<PlayerCard
										key={player.id}
										player={player}
										size='small'
										showCost={true}
									/>
								))
							) : (
								<div className='empty-slot'>
									<div className='empty-slot-content'>
										<span className='empty-icon'>📋</span>
										<span className='empty-text'>no {position} yet</span>
									</div>
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{/* team summary */}
			<div className='team-summary'>
				<div className='summary-item'>
					<span className='summary-label'>total spent:</span>
					<span className='summary-value'>${100 - budget}</span>
				</div>
				<div className='summary-item'>
					<span className='summary-label'>remaining budget:</span>
					<span className='summary-value'>${budget}</span>
				</div>
			</div>
		</div>
	);
};

export default UserTeam;
