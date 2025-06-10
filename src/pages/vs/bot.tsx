import React from 'react';
import { useRouter } from 'next/router';
import { VSBotGame } from '../../components/ui-kit/grids';
import { UserSettingsContext } from '../../components/ui-kit/providers/UserSettingsProvider';

// Demo puzzle for now; in real app, fetch or generate based on query params
const demoPuzzle = {
	title: 'VS Puzzle',
	size: { rows: 4, cols: 4 },
	groups: [
		['cat', 'dog', 'lion', 'tiger'],
		['apple', 'orange', 'grape', 'pear'],
		['red', 'blue', 'green', 'yellow'],
		['car', 'bus', 'train', 'plane'],
	],
	wildcards: [],
};

const VSBotPage: React.FC = () => {
	const router = useRouter();
	const {
		difficulty = 'easy',
		userId = 'me',
		matchId = 'vs-bot',
	} = router.query;
	// Optionally: fetch puzzle based on difficulty
	// Optionally: get userId from session

	return (
		<VSBotGame
			puzzle={demoPuzzle}
			botDifficulty={difficulty as any}
			userId={userId as string}
			matchId={matchId as string}
		/>
	);
};

export default VSBotPage;
