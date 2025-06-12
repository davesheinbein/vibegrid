import axios from 'axios';
import { LeaderboardEntry } from '../types/api';

export async function getLeaderboards(): Promise<
	LeaderboardEntry[]
> {
	const res = await axios.get('/api/leaderboards');
	return res.data;
}
