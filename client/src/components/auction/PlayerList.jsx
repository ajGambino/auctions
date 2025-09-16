import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import { useSocket } from '../../contexts/SocketContext';
import Button from '../common/Button';

const PlayerList = ({ availablePlayers = [], isNominationPhase = false }) => {
	const [selectedPlayer, setSelectedPlayer] = useState(null);
	const [isNominating, setIsNominating] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedPosition, setSelectedPosition] = useState('ALL');
	const { socket } = useSocket();

	const handlePlayerSelect = (player) => {
		if (!isNominationPhase) return;
		setSelectedPlayer(player);
		console.log('selected player:', player.name);
	};

	const handleNominate = () => {
		if (!selectedPlayer || !socket || !isNominationPhase) return;

		console.log('nominating player:', selectedPlayer.name);
		setIsNominating(true);

		socket.emit('nominatePlayer', { playerId: selectedPlayer.id });

		// reset state after nomination
		setTimeout(() => {
			setIsNominating(false);
			setSelectedPlayer(null);
		}, 1000);
	};

	// filter players based on search and position
	const filteredPlayers = availablePlayers.filter((player) => {
		const matchesSearch =
			player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			player.position.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesPosition =
			selectedPosition === 'ALL' || player.position === selectedPosition;
		return matchesSearch && matchesPosition;
	});

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

	const groupedPlayers = groupPlayersByPosition(filteredPlayers);
	const positions = ['ALL', 'QB', 'RB', 'WR', 'TE'];
	const displayPositions =
		selectedPosition === 'ALL' ? ['QB', 'RB', 'WR', 'TE'] : [selectedPosition];

	if (!availablePlayers.length) {
		return (
			<div className='player-list-section'>
				<h3>no players available</h3>
				<p>all players have been drafted!</p>
			</div>
		);
	}

	return (
		<div className='player-list-section'>
			<div className='player-list-header'>
				<h3>{isNominationPhase ? 'nominate a player' : 'available players'}</h3>
				<p>
					{isNominationPhase
						? 'choose a player to put up for auction'
						: `${availablePlayers.length} players available`}
				</p>
			</div>

			{/* search and filter controls */}
			<div className='player-controls'>
				<div className='search-container'>
					<input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder='search players...'
						className='player-search'
					/>
					<span className='search-icon'>🔍</span>
				</div>

				<div className='position-filters'>
					{positions.map((position) => (
						<button
							key={position}
							onClick={() => setSelectedPosition(position)}
							className={`position-filter ${
								selectedPosition === position ? 'active' : ''
							}`}
						>
							{position}
						</button>
					))}
				</div>
			</div>

			{/* scrollable player list */}
			<div className='player-list-container'>
				{filteredPlayers.length === 0 ? (
					<div className='no-results'>
						<p>no players found matching "{searchTerm}"</p>
						<button
							onClick={() => {
								setSearchTerm('');
								setSelectedPosition('ALL');
							}}
							className='clear-filters'
						>
							clear filters
						</button>
					</div>
				) : (
					<div className='player-groups'>
						{displayPositions.map(
							(position) =>
								groupedPlayers[position] &&
								groupedPlayers[position].length > 0 && (
									<div key={position} className='position-group'>
										<h4 className='position-header'>
											{position}s ({groupedPlayers[position].length})
										</h4>
										<div className='player-grid'>
											{groupedPlayers[position].map((player) => (
												<PlayerCard
													key={player.id}
													player={player}
													isSelected={selectedPlayer?.id === player.id}
													onClick={
														isNominationPhase ? handlePlayerSelect : null
													}
													size='small'
													className={isNominationPhase ? 'selectable' : ''}
												/>
											))}
										</div>
									</div>
								)
						)}
					</div>
				)}
			</div>

			{/* nomination actions (only show during nomination phase) */}
			{isNominationPhase && (
				<div className='nomination-actions'>
					{selectedPlayer && (
						<div className='selected-player-info'>
							<p>
								selected: <strong>{selectedPlayer.name}</strong> (
								{selectedPlayer.position})
							</p>
						</div>
					)}

					<Button
						onClick={handleNominate}
						disabled={!selectedPlayer || isNominating}
						variant='primary'
						size='large'
					>
						{isNominating ? 'nominating...' : 'nominate player'}
					</Button>
				</div>
			)}
		</div>
	);
};

export default PlayerList;
