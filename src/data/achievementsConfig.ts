export type AchievementTier =
	| 'bronze'
	| 'silver'
	| 'gold'
	| 'platinum'
	| 'secret';

export interface AchievementDef {
	id: string;
	label: string; // unique key, matches backend
	name: string;
	description: string;
	icon: string; // path to SVG or emoji
	category: string;
	tier?: AchievementTier;
	secret?: boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
	// 🥇 Daily Puzzle Achievements
	{
		id: 'first_solve',
		label: 'First Solve',
		name: 'First Solve',
		description: 'Solve your first daily puzzle.',
		icon: '/icons/achievements/first_solve.svg',
		category: 'Daily Puzzle',
		tier: 'bronze',
	},
	{
		id: 'daily_streak_3',
		label: 'Daily Streak Novice',
		name: 'Daily Streak Novice',
		description: 'Solve 3 daily puzzles in a row.',
		icon: '/icons/achievements/streak_3.svg',
		category: 'Daily Puzzle',
		tier: 'bronze',
	},
	{
		id: 'daily_streak_5',
		label: 'Daily Enthusiast',
		name: 'Daily Enthusiast',
		description: '5-day daily puzzle streak.',
		icon: '/icons/achievements/streak_5.svg',
		category: 'Daily Puzzle',
		tier: 'silver',
	},
	{
		id: 'daily_streak_10',
		label: 'Daily Devotee',
		name: 'Daily Devotee',
		description: '10-day daily puzzle streak.',
		icon: '/icons/achievements/streak_10.svg',
		category: 'Daily Puzzle',
		tier: 'gold',
	},
	{
		id: 'daily_streak_30',
		label: 'Daily Champ',
		name: 'Daily Champ',
		description: '30-day daily puzzle streak.',
		icon: '/icons/achievements/streak_30.svg',
		category: 'Daily Puzzle',
		tier: 'platinum',
	},
	{
		id: 'no_mistakes',
		label: 'No Mistakes',
		name: 'No Mistakes',
		description:
			'Solve a daily puzzle with zero failed attempts.',
		icon: '/icons/achievements/no_mistakes.svg',
		category: 'Daily Puzzle',
		tier: 'silver',
	},
	// ... (Add more for each category as needed)
	// 🎲 Secret / Easter Egg Achievements
	{
		id: 'secret_keeper',
		label: 'Secret Keeper',
		name: 'Secret Keeper',
		description: 'Hide a puzzle with a 90% fail rate.',
		icon: '/icons/achievements/secret.svg',
		category: 'Secret',
		tier: 'secret',
		secret: true,
	},
];
