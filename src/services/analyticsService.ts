import axios from 'axios';

export const fetchGlobalAnalytics = async () => {
	const res = await axios.get('/api/analytics/global');
	return res.data;
};
