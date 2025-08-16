import React, { useState } from 'react';
import { useAuction } from '../../contexts/AuctionContext';
import Button from '../common/Button';

const JoinForm = () => {
	const [username, setUsername] = useState('');
	const [isJoining, setIsJoining] = useState(false);
	const { joinGame, message } = useAuction();

	const handleSubmit = (e) => {
		e.preventDefault();

		// validation
		const trimmedUsername = username.trim();
		if (!trimmedUsername) {
			return;
		}

		if (trimmedUsername.length < 2) {
			alert('Username must be at least 2 characters');
			return;
		}

		console.log('🚀 joining game as:', trimmedUsername);
		setIsJoining(true);
		joinGame(trimmedUsername);

		// reset joining state after delay (in case join fails)
		setTimeout(() => setIsJoining(false), 3000);
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		// only allow alphanumeric and spaces
		if (/^[a-zA-Z0-9\s]*$/.test(value)) {
			setUsername(value);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleSubmit(e);
		}
	};

	return (
		<div className='screen'>
			<div className='join-form-container'>
				<h2>Join the Auction</h2>
				<p className='join-description'>
					Enter your username to join a 2-player blind auction
				</p>

				<form onSubmit={handleSubmit} className='join-form'>
					<div className='input-group'>
						<input
							type='text'
							value={username}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							placeholder='Enter your username'
							maxLength='20'
							disabled={isJoining}
							className='username-input'
							autoFocus
							required
						/>
						<div className='input-hint'>
							2-20 characters, letters and numbers only
						</div>
					</div>

					<Button
						type='submit'
						size='large'
						disabled={
							!username.trim() || isJoining || username.trim().length < 2
						}
					>
						{isJoining ? 'Joining...' : 'Join Game'}
					</Button>
				</form>

				{message && (
					<div
						className={`join-message ${
							message.includes('full') ? 'error' : 'info'
						}`}
					>
						{message}
					</div>
				)}

				<div className='join-info'>
					<h3>How it works:</h3>
					<ul>
						<li>🎯 Blind auction format</li>
						<li>👥 6 players compete</li>
						<li>💰 $100 budget each</li>
						<li>⏱️ 30 seconds per bid</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default JoinForm;
