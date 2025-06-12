import axios from 'axios';
import { Puzzle } from '../types/api';

export const fetchCustomPuzzles = async (
	tab: string,
	user?: { email: string }
): Promise<Puzzle[]> => {
	let url = '';
	if (tab === 'mine' && user) {
		url = `/api/custom-puzzles?creatorId=${encodeURIComponent(
			user.email
		)}`;
	} else {
		url = '/api/custom-puzzles/public';
	}
	const res = await axios.get(url);
	return res.data;
};
