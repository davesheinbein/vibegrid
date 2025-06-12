import axios from 'axios';
import { Progression } from '../types/api';

export async function getProgression(): Promise<Progression> {
	const res = await axios.get('/api/progression');
	return res.data;
}
