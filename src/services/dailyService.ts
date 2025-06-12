// Centralized daily puzzle API service
import axios from 'axios';
import {
	DailyCompletionRecord,
	DailyPuzzleProgress,
} from '../utils/dailyCompletion';

const BASE_URL = '/api/daily';

export const dailyService = {
	async getCompletion(): Promise<DailyCompletionRecord | null> {
		const res = await axios.get(`${BASE_URL}/completion`);
		return res.data;
	},
	async setCompletion(
		result: DailyCompletionRecord['result']
	): Promise<void> {
		await axios.post(`${BASE_URL}/completion`, { result });
	},
	async getProgress(): Promise<DailyPuzzleProgress | null> {
		const res = await axios.get(`${BASE_URL}/progress`);
		return res.data;
	},
	async saveProgress(
		progress: DailyPuzzleProgress
	): Promise<void> {
		await axios.post(`${BASE_URL}/progress`, progress);
	},
	async clearProgress(): Promise<void> {
		await axios.delete(`${BASE_URL}/progress`);
	},
};
