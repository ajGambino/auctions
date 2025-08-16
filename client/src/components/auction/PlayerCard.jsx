import React from 'react';

const PlayerCard = ({
	player,
	size = 'medium',
	className = '',
	showCost = false,
}) => {
	// get position color for styling
	const getPositionColor = (position) => {
		switch (position) {
			case 'QB':
				return 'position-qb';
			case 'RB':
				return 'position-rb';
			case 'WR':
				return 'position-wr';
			case 'TE':
				return 'position-te';
			default:
				return 'position-default';
		}
	};

	// build css classes
	const getCardClasses = () => {
		const baseClasses = 'player-card';
		const sizeClass = `player-card-${size}`;
		const positionClass = getPositionColor(player.position);

		return [baseClasses, sizeClass, positionClass, className]
			.filter(Boolean)
			.join(' ');
	};

	return (
		<div className={getCardClasses()}>
			<div className='player-info'>
				<div className='player-name'>{player.name}</div>
				<div className='player-position'>{player.position}</div>
			</div>

			{showCost && player.cost && (
				<div className='player-cost'>${player.cost}</div>
			)}
		</div>
	);
};

export default PlayerCard;
