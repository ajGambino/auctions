import React from 'react';

const Timer = ({ timeRemaining, className = '', size = 'large' }) => {
	// determine timer status based on time remaining
	const getTimerStatus = () => {
		if (timeRemaining <= 5) return 'critical';
		if (timeRemaining <= 10) return 'warning';
		return 'normal';
	};

	// build css classes
	const getTimerClasses = () => {
		const baseClasses = 'timer';
		const statusClass = `timer-${getTimerStatus()}`;
		const sizeClass = `timer-${size}`;

		return [baseClasses, statusClass, sizeClass, className]
			.filter(Boolean)
			.join(' ');
	};

	return (
		<div className={getTimerClasses()}>
			<div className='timer-display'>{timeRemaining}</div>
			<div className='timer-label'>seconds</div>
		</div>
	);
};

export default Timer;
