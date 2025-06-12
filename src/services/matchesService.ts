import axios from 'axios';
import { Match } from '../types/api';

export const fetchMatches = async (): Promise<Match[]> => {
	const res = await axios.get('/api/matches');
	return res.data;
};
