import axios from 'axios';

export const fetchHealth = async () => {
	const res = await axios.get('/api/health');
	return res.data;
};
