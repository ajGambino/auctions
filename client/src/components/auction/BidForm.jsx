import React, { useState, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import Button from '../common/Button';

const BidForm = ({ currentPlayer, userBudget, timeRemaining }) => {
	const [bidAmount, setBidAmount] = useState('');
	const [bidStatus, setBidStatus] = useState(null);
	const { socket } = useSocket();

	// clear form when new player starts
	useEffect(() => {
		setBidAmount('');
		setBidStatus(null);
	}, [currentPlayer]);

	// listen for bid events
	useEffect(() => {
		if (!socket) return;

		const handleBidPlaced = (amount) => {
			setBidStatus({ type: 'success', message: `bid placed: $${amount}` });
			setBidAmount('');
		};

		const handleBidRejected = (reason) => {
			setBidStatus({ type: 'error', message: `bid rejected: ${reason}` });
		};

		socket.on('bidPlaced', handleBidPlaced);
		socket.on('bidRejected', handleBidRejected);

		return () => {
			socket.off('bidPlaced', handleBidPlaced);
			socket.off('bidRejected', handleBidRejected);
		};
	}, [socket]);

	const handleSubmit = (e) => {
		e.preventDefault();

		const amount = parseInt(bidAmount);

		// basic validation
		if (!amount || amount < 1) {
			setBidStatus({ type: 'error', message: 'enter a valid bid amount' });
			return;
		}

		if (amount > userBudget) {
			setBidStatus({ type: 'error', message: 'bid exceeds budget' });
			return;
		}

		console.log('placing bid:', amount);

		if (socket) {
			socket.emit('placeBid', { amount });
		}
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		// only allow numbers
		if (value === '' || /^\d+$/.test(value)) {
			setBidAmount(value);
			setBidStatus(null); // clear status when typing
		}
	};

	const handleQuickBid = (percentage) => {
		const amount = Math.floor(userBudget * percentage);
		setBidAmount(amount.toString());
		setBidStatus(null);
	};

	if (!currentPlayer) {
		return null;
	}

	const isTimeUp = timeRemaining <= 0;
	const maxBid = userBudget;

	return (
		<div className='bid-form-section'>
			<div className='bid-form-header'>
				<h3>place your bid</h3>
				<div className='bid-info'>
					<span>budget: ${userBudget}</span>
					<span
						className={`timer-display ${
							timeRemaining <= 5
								? 'critical'
								: timeRemaining <= 10
								? 'warning'
								: ''
						}`}
					>
						⏱️ {timeRemaining}s
					</span>
				</div>
			</div>

			<form onSubmit={handleSubmit} className='bid-form'>
				<div className='bid-input-group'>
					<span className='currency-symbol'>$</span>
					<input
						type='text'
						value={bidAmount}
						onChange={handleInputChange}
						placeholder='amount'
						className='bid-input'
						disabled={isTimeUp}
						autoFocus
						max={maxBid}
					/>
				</div>

				<Button
					type='submit'
					variant='primary'
					disabled={!bidAmount || isTimeUp || parseInt(bidAmount) > maxBid}
				>
					{isTimeUp ? "time's up!" : 'place bid'}
				</Button>
			</form>

			{/* quick bid buttons */}
			{!isTimeUp && (
				<div className='quick-bids'>
					<p className='quick-bid-label'>quick bids:</p>
					<div className='quick-bid-buttons'>
						{[0.1, 0.25, 0.5, 0.75].map((percentage) => {
							const amount = Math.floor(userBudget * percentage);
							return (
								amount > 0 && (
									<button
										key={percentage}
										onClick={() => handleQuickBid(percentage)}
										className='quick-bid-btn'
										disabled={isTimeUp}
									>
										${amount}
									</button>
								)
							);
						})}
					</div>
				</div>
			)}

			{bidStatus && (
				<div className={`bid-status ${bidStatus.type}`}>
					{bidStatus.message}
				</div>
			)}

			<div className='bid-tips'>
				<p>💡 tip: bids are hidden until time expires</p>
				<p>🏆 highest bid wins (earliest bid breaks ties)</p>
			</div>
		</div>
	);
};

export default BidForm;
