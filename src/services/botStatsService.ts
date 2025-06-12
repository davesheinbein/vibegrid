import axios from 'axios';

export const postBotStats = async (
	botDifficulty: string,
	update: any
) => {
	const res = await axios.post(
		`/api/bot-stats/${botDifficulty}`,
		update
	);
	return res.data;
};
