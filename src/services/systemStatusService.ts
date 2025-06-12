// Centralized system status/health API service
import axios from 'axios';

export const systemStatusService = {
	async getBackendHealth() {
		const res = await axios.get('/api/health');
		return res.data;
	},
	async getDbHealth() {
		const res = await axios.get('/api/health/db');
		return res.data;
	},
	async checkApiEndpoint(
		url: string,
		method: 'get' | 'post' = 'get',
		data?: any
	) {
		if (method === 'post') {
			const res = await axios.post(url, data || {});
			return res.data;
		} else {
			const res = await axios.get(url);
			return res.data;
		}
	},
};
