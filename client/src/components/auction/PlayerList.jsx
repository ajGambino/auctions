import React from 'react';
import PlayerCard from './PlayerCard';

const PlayerList = ({ players = [], title = 'available players' }) => {
	// group players by position for better display
	const groupPlayersByPosition = (players) => {
		return players.reduce((groups, player) => {
			const position = player.position;
			if (!groups[position]) {
				groups[position] = [];
			}
			groups[position].push(player);
			return groups;
		}, {});
	};

	if (!players.length) {
		return (
			<div className='player-list-section'>
				<h3>no players available</h3>
				<p>all players have been drafted!</p>
			</div>
		);
	}

	const groupedPlayers = groupPlayersByPosition(players);
	const positions = ['QB', 'RB', 'WR', 'TE'];

	return (
		<div className='player-list-section'>
			<div className='player-list-header'>
				<h3>{title}</h3>
				<p>total players: {players.length}</p>
			</div>

			<div className='player-groups'>
				{positions.map(
					(position) =>
						groupedPlayers[position] && (
							<div key={position} className='position-group'>
								<h4 className='position-header'>
									{position}s ({groupedPlayers[position].length})
								</h4>
								<div className='player-grid'>
									{groupedPlayers[position].map((player) => (
										<PlayerCard key={player.id} player={player} size='small' />
									))}
								</div>
							</div>
						)
				)}
			</div>
		</div>
	);
};

export default PlayerList;
