import { useState, useEffect } from 'react';

export const usePlayerData = () => {
	const [players, setPlayers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadPlayers = async () => {
			try {
				console.log('loading players from CSV...');

				// fetch CSV from public folder
				const response = await fetch('/players.csv');
				if (!response.ok) {
					throw new Error('failed to load players.csv');
				}

				const csvText = await response.text();

				// CSV parsing (papaparse?)
				const lines = csvText.split('\n').filter((line) => line.trim());
				const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

				// expected headers: id, name, position, team
				const playerData = lines
					.slice(1)
					.map((line, index) => {
						const values = line.split(',').map((v) => v.trim());

						return {
							id: parseInt(values[0]) || index + 1, // use index as fallback ID
							name: values[1] || 'unknown player',
							position: values[2] || 'UNKNOWN',
							team: values[3] || '',
						};
					})
					.filter((player) => player.name !== 'unknown player'); // filter out invalid rows

				console.log(`loaded ${playerData.length} players from CSV`);
				setPlayers(playerData);
				setLoading(false);
			} catch (err) {
				console.error('error loading players:', err);
				setError(err.message);
				setLoading(false);

				// fallback to mock data if CSV fails
				const mockPlayers = [
					{ id: 1, name: 'Patrick Mahomes', position: 'QB', team: 'KC' },
					{ id: 2, name: 'Josh Allen', position: 'QB', team: 'BUF' },
					{ id: 3, name: 'Christian McCaffrey', position: 'RB', team: 'SF' },
					{ id: 4, name: 'Derrick Henry', position: 'RB', team: 'TEN' },
					{ id: 5, name: 'Cooper Kupp', position: 'WR', team: 'LAR' },
					{ id: 6, name: 'Davante Adams', position: 'WR', team: 'LV' },
				];
				setPlayers(mockPlayers);
			}
		};

		loadPlayers();
	}, []);

	return { players, loading, error };
};
