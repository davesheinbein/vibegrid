// Example achievements config for VibeGrid
// Add or edit achievements here; criteria is JSON for flexible logic
module.exports = [
	// 1. Daily Puzzle Achievements
	{
		label: 'First Solve',
		description:
			'Unlock when a user solves their first daily puzzle.',
		icon: 'star',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_solved',
			count: 1,
		},
	},
	{
		label: 'Daily Streak Novice',
		description:
			'Complete 3 daily puzzles in a row without missing a day.',
		icon: 'fire',
		criteria: {
			type: 'streak',
			key: 'dailyStreak',
			target: 3,
		},
	},
	{
		label: 'Daily Streak Expert',
		description:
			'Maintain a 7-day daily puzzle winning streak.',
		icon: 'flame',
		criteria: {
			type: 'streak',
			key: 'dailyStreak',
			target: 7,
		},
	},
	{
		label: 'Lightning Solver',
		description:
			'Solve any daily puzzle in under 30 seconds.',
		icon: 'zap',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_fast',
			seconds: 30,
		},
	},
	{
		label: 'Perfect Game',
		description:
			'Solve all 4 groups without any incorrect attempts.',
		icon: 'gem',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_perfect',
		},
	},
	{
		label: 'Daily Rookie',
		description: 'Solve your first daily puzzle',
		icon: 'star',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_solved',
			count: 1,
		},
	},
	{
		label: 'Daily Enthusiast',
		description:
			'Solve daily puzzles for 5 consecutive days',
		icon: 'fire',
		criteria: {
			type: 'streak',
			key: 'dailyStreak',
			target: 5,
		},
	},
	{
		label: 'Daily Devotee',
		description: '10-day winning streak on daily puzzles',
		icon: 'flame',
		criteria: {
			type: 'streak',
			key: 'dailyStreak',
			target: 10,
		},
	},
	{
		label: 'Daily Champ',
		description: '30-day winning streak (legendary status)',
		icon: 'crown',
		criteria: {
			type: 'streak',
			key: 'dailyStreak',
			target: 30,
		},
	},
	{
		label: 'No Mistakes',
		description:
			'Solve daily puzzle with zero failed attempts',
		icon: 'gem',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_perfect',
		},
	},
	{
		label: 'Speed Demon',
		description: 'Solve daily puzzle in under 20 seconds',
		icon: 'zap',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_fast',
			seconds: 20,
		},
	},
	{
		label: 'Close Call',
		description:
			'Solve daily puzzle with only 1 attempt left',
		icon: 'alert',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_close_call',
		},
	},
	{
		label: 'Persistence',
		description:
			'Solve daily puzzle after failing the first attempt',
		icon: 'repeat',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_persistence',
		},
	},
	{
		label: 'Wildcard Master',
		description:
			'Use every wildcard successfully in a daily puzzle',
		icon: 'magic',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_all_wildcards',
		},
	},
	{
		label: 'Daily Comeback',
		description:
			'Solve a daily puzzle after unlocking only 1 group at first',
		icon: 'comeback',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_comeback',
		},
	},

	// 2. Custom Puzzle Achievements
	{
		label: 'Puzzle Creator',
		description:
			'Create and publish your first custom puzzle.',
		icon: 'pencil',
		criteria: {
			type: 'event',
			event: 'custom_puzzle_created',
			count: 1,
		},
	},
	{
		label: 'Puzzle Architect',
		description: 'Publish 5 custom puzzles.',
		icon: 'blueprint',
		criteria: {
			type: 'progress',
			key: 'customPuzzlesPublished',
			target: 5,
		},
	},
	{
		label: 'Community Favorite',
		description:
			'Have a custom puzzle rated 4+ stars by at least 10 different users.',
		icon: 'star',
		criteria: {
			type: 'event',
			event: 'custom_puzzle_popular',
			rating: 4,
			raters: 10,
		},
	},
	{
		label: 'First Builder',
		description: 'Create your first custom puzzle',
		icon: 'pencil',
		criteria: {
			type: 'event',
			event: 'custom_puzzle_created',
			count: 1,
		},
	},
	{
		label: 'Puzzle Workshop',
		description: 'Publish 5 custom puzzles',
		icon: 'blueprint',
		criteria: {
			type: 'progress',
			key: 'customPuzzlesPublished',
			target: 5,
		},
	},
	{
		label: 'Puzzle Architect',
		description: 'Publish 20 custom puzzles',
		icon: 'building',
		criteria: {
			type: 'progress',
			key: 'customPuzzlesPublished',
			target: 20,
		},
	},
	{
		label: 'Puzzle Legend',
		description: 'Publish 50 custom puzzles',
		icon: 'trophy',
		criteria: {
			type: 'progress',
			key: 'customPuzzlesPublished',
			target: 50,
		},
	},
	{
		label: 'Community Star',
		description:
			'Have a puzzle favorited by 10 different users',
		icon: 'star',
		criteria: {
			type: 'event',
			event: 'custom_puzzle_favorited',
			count: 10,
		},
	},
	{
		label: 'Critic’s Choice',
		description:
			'Your puzzle rates 4+ stars from at least 20 players',
		icon: 'award',
		criteria: {
			type: 'event',
			event: 'custom_puzzle_popular',
			rating: 4,
			raters: 20,
		},
	},
	{
		label: 'Explorer',
		description:
			'Play 20 custom puzzles from different creators',
		icon: 'compass',
		criteria: {
			type: 'progress',
			key: 'uniqueAuthorsPlayed',
			target: 20,
		},
	},
	{
		label: 'Favorite Collector',
		description:
			'Favorite 50 puzzles (daily + custom combined)',
		icon: 'heart',
		criteria: {
			type: 'progress',
			key: 'puzzlesFavorited',
			target: 50,
		},
	},
	{
		label: 'Creative Genius',
		description:
			'Create a custom puzzle that is solved 100 times',
		icon: 'lightbulb',
		criteria: {
			type: 'event',
			event: 'custom_puzzle_solved',
			count: 100,
		},
	},
	{
		label: 'Secret Keeper',
		description:
			'Create a puzzle that stumps 90% of players who try it',
		icon: 'lock',
		criteria: {
			type: 'event',
			event: 'custom_puzzle_stump',
			percent: 90,
		},
	},

	// 3. VS Multiplayer Achievements
	{
		label: 'First Blood',
		description: 'Win your first multiplayer match.',
		icon: 'sword',
		criteria: { type: 'event', event: 'vs_win', count: 1 },
	},
	{
		label: 'Underdog Comeback',
		description:
			'Win a match after trailing behind in solved groups.',
		icon: 'arrow-up',
		criteria: { type: 'event', event: 'vs_comeback_win' },
	},
	{
		label: 'Multiplayer Master',
		description: 'Win 10 multiplayer matches.',
		icon: 'trophy',
		criteria: {
			type: 'progress',
			key: 'vsWins',
			target: 10,
		},
	},
	{
		label: 'Quick Draw',
		description:
			'Win a multiplayer match within 60 seconds.',
		icon: 'clock',
		criteria: {
			type: 'event',
			event: 'vs_win_fast',
			seconds: 60,
		},
	},
	{
		label: 'Social Competitor',
		description:
			'Play a multiplayer match with a friend from your friend list.',
		icon: 'users',
		criteria: { type: 'event', event: 'vs_with_friend' },
	},
	{
		label: 'First Duel',
		description: 'Play your first VS multiplayer match',
		icon: 'swords',
		criteria: {
			type: 'event',
			event: 'vs_played',
			count: 1,
		},
	},
	{
		label: 'First Victory',
		description: 'Win your first VS multiplayer match',
		icon: 'trophy',
		criteria: { type: 'event', event: 'vs_win', count: 1 },
	},
	{
		label: 'Champion',
		description: 'Win 10 multiplayer matches',
		icon: 'medal',
		criteria: {
			type: 'progress',
			key: 'vsWins',
			target: 10,
		},
	},
	{
		label: 'Dominating Streak',
		description: 'Win 5 multiplayer matches in a row',
		icon: 'fire',
		criteria: {
			type: 'streak',
			key: 'vsWinStreak',
			target: 5,
		},
	},
	{
		label: 'Comeback Kid',
		description:
			'Win after being behind by 2 or more groups',
		icon: 'comeback',
		criteria: {
			type: 'event',
			event: 'vs_comeback_win',
			groupsBehind: 2,
		},
	},
	{
		label: 'Quick Victory',
		description: 'Win a match in under 30 seconds',
		icon: 'zap',
		criteria: {
			type: 'event',
			event: 'vs_win_fast',
			seconds: 30,
		},
	},
	{
		label: 'Matchmaker',
		description:
			'Play 10 matches via matchmaking (random opponents)',
		icon: 'users',
		criteria: {
			type: 'progress',
			key: 'vsMatchmakingPlayed',
			target: 10,
		},
	},
	{
		label: 'Room Master',
		description:
			'Host and complete 10 matches via room code',
		icon: 'key',
		criteria: {
			type: 'progress',
			key: 'vsRoomHosted',
			target: 10,
		},
	},
	{
		label: 'Social Warrior',
		description: 'Win a match against a friend',
		icon: 'user-friends',
		criteria: { type: 'event', event: 'vs_win_friend' },
	},
	{
		label: 'MVP',
		description:
			'Get the highest number of solved groups in a multiplayer match',
		icon: 'star',
		criteria: { type: 'event', event: 'vs_mvp' },
	},
	{
		label: 'Tactician',
		description:
			'Win a match without using any hints or wildcards',
		icon: 'brain',
		criteria: { type: 'event', event: 'vs_win_no_hints' },
	},

	// 4. Social & Interaction Achievements
	{
		label: 'Social Starter',
		description: 'Send your first friend request.',
		icon: 'user-plus',
		criteria: {
			type: 'event',
			event: 'friend_request_sent',
			count: 1,
		},
	},
	{
		label: 'Friendly Network',
		description: 'Reach 10 accepted friends.',
		icon: 'network',
		criteria: {
			type: 'progress',
			key: 'friendsAccepted',
			target: 10,
		},
	},
	{
		label: 'Chatty',
		description: 'Send 100 direct messages.',
		icon: 'message',
		criteria: {
			type: 'progress',
			key: 'messagesSent',
			target: 100,
		},
	},
	{
		label: 'Group Guru',
		description: 'Create or join 3 different group chats.',
		icon: 'group',
		criteria: {
			type: 'progress',
			key: 'groupChats',
			target: 3,
		},
	},
	{
		label: 'New Friend',
		description: 'Send a friend request',
		icon: 'user-plus',
		criteria: {
			type: 'event',
			event: 'friend_request_sent',
			count: 1,
		},
	},
	{
		label: 'Friendly Network',
		description: 'Reach 10 accepted friends',
		icon: 'network',
		criteria: {
			type: 'progress',
			key: 'friendsAccepted',
			target: 10,
		},
	},
	{
		label: 'Social Butterfly',
		description: 'Have 50 friends',
		icon: 'butterfly',
		criteria: {
			type: 'progress',
			key: 'friendsAccepted',
			target: 50,
		},
	},
	{
		label: 'Conversationalist',
		description: 'Send 100 direct messages',
		icon: 'message',
		criteria: {
			type: 'progress',
			key: 'messagesSent',
			target: 100,
		},
	},
	{
		label: 'Chat Groupie',
		description: 'Create or join 5 group chats',
		icon: 'group',
		criteria: {
			type: 'progress',
			key: 'groupChats',
			target: 5,
		},
	},
	{
		label: 'Supporter',
		description:
			'Send 10 friend requests that get accepted',
		icon: 'handshake',
		criteria: {
			type: 'progress',
			key: 'friendRequestsAccepted',
			target: 10,
		},
	},
	{
		label: 'Popular Player',
		description: 'Receive 50 friend requests',
		icon: 'user-friends',
		criteria: {
			type: 'progress',
			key: 'friendRequestsReceived',
			target: 50,
		},
	},
	{
		label: 'Helper',
		description:
			'Send hints or challenges during multiplayer matches',
		icon: 'question',
		criteria: {
			type: 'progress',
			key: 'hintsSent',
			target: 10,
		},
	},
	{
		label: 'Notifier',
		description:
			'Respond to 20 notifications within 1 hour',
		icon: 'bell',
		criteria: {
			type: 'progress',
			key: 'notificationsResponded',
			target: 20,
			withinHours: 1,
		},
	},

	// 5. General & Miscellaneous Achievements
	{
		label: 'Dedicated Player',
		description:
			'Play 100 total puzzles (daily + custom + multiplayer).',
		icon: 'infinity',
		criteria: {
			type: 'progress',
			key: 'totalPuzzlesPlayed',
			target: 100,
		},
	},
	{
		label: 'Comeback Kid',
		description:
			'Win a puzzle or match after using all your attempts.',
		icon: 'refresh',
		criteria: { type: 'event', event: 'comeback_win' },
	},
	{
		label: 'Explorer',
		description:
			'Play puzzles created by at least 10 different authors.',
		icon: 'compass',
		criteria: {
			type: 'progress',
			key: 'uniqueAuthorsPlayed',
			target: 10,
		},
	},
	{
		label: 'Collector',
		description: 'Favorite 20 different puzzles.',
		icon: 'heart',
		criteria: {
			type: 'progress',
			key: 'puzzlesFavorited',
			target: 20,
		},
	},
	{
		label: 'Puzzle Addict',
		description: 'Play 100 total puzzles',
		icon: 'infinity',
		criteria: {
			type: 'progress',
			key: 'totalPuzzlesPlayed',
			target: 100,
		},
	},
	{
		label: 'Completionist',
		description: 'Solve 500 total puzzles',
		icon: 'check',
		criteria: {
			type: 'progress',
			key: 'totalPuzzlesSolved',
			target: 500,
		},
	},
	{
		label: 'Lucky Guess',
		description:
			'Solve a group with a first-try guess 10 times',
		icon: 'dice',
		criteria: {
			type: 'progress',
			key: 'firstTryGroupSolves',
			target: 10,
		},
	},
	{
		label: 'Strategist',
		description:
			'Solve a puzzle using only 2 attempts or less',
		icon: 'chess',
		criteria: {
			type: 'event',
			event: 'puzzle_solved_few_attempts',
			attempts: 2,
		},
	},
	{
		label: 'Tenacious',
		description:
			'Solve a puzzle after all attempts were exhausted on the first try',
		icon: 'repeat',
		criteria: {
			type: 'event',
			event: 'puzzle_solved_after_fail',
		},
	},
	{
		label: 'Unstoppable',
		description:
			'Win 20 matches or puzzles in a row (daily + multiplayer combined)',
		icon: 'rocket',
		criteria: {
			type: 'streak',
			key: 'winStreak',
			target: 20,
		},
	},
	{
		label: 'Collector',
		description: 'Favorite 100 puzzles total',
		icon: 'heart',
		criteria: {
			type: 'progress',
			key: 'puzzlesFavorited',
			target: 100,
		},
	},
	{
		label: 'Multi-Tasker',
		description:
			'Play daily, custom, and VS modes within 24 hours',
		icon: 'tasks',
		criteria: {
			type: 'event',
			event: 'all_modes_played',
			withinHours: 24,
		},
	},
	{
		label: 'Explorer',
		description: 'Play puzzles from 50 unique authors',
		icon: 'compass',
		criteria: {
			type: 'progress',
			key: 'uniqueAuthorsPlayed',
			target: 50,
		},
	},
	{
		label: 'Wildcard Wizard',
		description: 'Use every wildcard type in 10 puzzles',
		icon: 'magic',
		criteria: {
			type: 'progress',
			key: 'wildcardsUsedAllTypes',
			target: 10,
		},
	},

	// 6. Technical/Engagement Achievements
	{
		label: 'Early Bird',
		description:
			'Play a daily puzzle within the first hour it’s released',
		icon: 'sun',
		criteria: {
			type: 'event',
			event: 'daily_puzzle_early',
			withinMinutes: 60,
		},
	},
	{
		label: 'Night Owl',
		description:
			'Play a puzzle between 12 AM and 4 AM local time',
		icon: 'moon',
		criteria: {
			type: 'event',
			event: 'puzzle_night_owl',
			betweenHours: [0, 4],
		},
	},
	{
		label: 'Bug Hunter',
		description: 'Report a verified bug',
		icon: 'bug',
		criteria: {
			type: 'event',
			event: 'bug_reported',
			verified: true,
		},
	},
	{
		label: 'Beta Tester',
		description: 'Play a new game mode during beta testing',
		icon: 'flask',
		criteria: { type: 'event', event: 'beta_mode_played' },
	},
	{
		label: 'PWA User',
		description:
			'Play the game on mobile via the Progressive Web App',
		icon: 'mobile',
		criteria: { type: 'event', event: 'pwa_user' },
	},

	// 7. Secret/Easter Egg Achievements
	{
		label: 'The Collector',
		description:
			'Find all hidden “easter egg” words in puzzles',
		icon: 'egg',
		criteria: {
			type: 'event',
			event: 'easter_egg_found',
			all: true,
		},
		secret: true,
	},
	{
		label: 'Master of Shadows',
		description: 'Solve a puzzle with the timer paused',
		icon: 'ghost',
		criteria: {
			type: 'event',
			event: 'puzzle_solved_paused',
		},
		secret: true,
	},
	{
		label: 'Phantom Solver',
		description:
			'Solve a puzzle without making a single selection visible',
		icon: 'eye-slash',
		criteria: {
			type: 'event',
			event: 'puzzle_solved_stealth',
		},
		secret: true,
	},
	{
		label: 'Whisperer',
		description:
			'Unlock a hidden in-game message or puzzle',
		icon: 'comment',
		criteria: {
			type: 'event',
			event: 'hidden_message_found',
		},
		secret: true,
	},

	// 8. Achievement Meta-Achievements
	{
		label: 'Achiever',
		description: 'Unlock 10 achievements',
		icon: 'medal',
		criteria: { type: 'meta', unlocked: 10 },
	},
	{
		label: 'Veteran',
		description: 'Unlock 25 achievements',
		icon: 'medal',
		criteria: { type: 'meta', unlocked: 25 },
	},
	{
		label: 'Legend',
		description: 'Unlock 50 achievements',
		icon: 'crown',
		criteria: { type: 'meta', unlocked: 50 },
	},
	{
		label: 'Completionist',
		description: 'Unlock all achievements in the game',
		icon: 'trophy',
		criteria: { type: 'meta', unlocked: 'all' },
	},
];
