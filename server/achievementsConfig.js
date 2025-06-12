/**
 * @typedef {'bronze'|'silver'|'gold'|'platinum'|'secret'} AchievementTier
 */

/**
 * @typedef {Object} AchievementDef
 * @property {string} id
 * @property {string} label
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {string} category
 * @property {AchievementTier=} tier
 * @property {boolean=} secret
 */

module.exports = [
	// 📚 Core Gameplay Achievements
	{
		label: 'First Taste',
		description: 'Complete your first puzzle.',
		icon: 'star',
		criteria: {
			type: 'event',
			event: 'puzzle_completed',
			count: 1,
		},
	},
	{
		label: 'Streak Starter',
		description: 'Win 3 puzzles in a row.',
		icon: 'fire',
		criteria: {
			type: 'streak',
			key: 'winStreak',
			target: 3,
		},
	},
	{
		label: 'Word Whisperer',
		description:
			'Solve a puzzle with no incorrect guesses.',
		icon: 'magic',
		criteria: {
			type: 'event',
			event: 'puzzle_perfect',
			attemptsUsed: 0,
		},
	},
	{
		label: 'Burn, Baby, Burn',
		description: 'Burn your first wildcard.',
		icon: 'flame',
		criteria: {
			type: 'event',
			event: 'wildcard_burned',
			count: 1,
		},
	},
	{
		label: 'Too Hot to Handle',
		description: 'Burn 5 wildcards in a single puzzle.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'wildcard_burned',
			count: 5,
			singlePuzzle: true,
		},
	},
	{
		label: 'Clutch Comeback',
		description: 'Win with only 1 attempt remaining.',
		icon: 'alert',
		criteria: {
			type: 'event',
			event: 'puzzle_won_clutch',
			attemptsLeft: 1,
		},
	},
	{
		label: 'On Fire',
		description: 'Win 5 puzzles in a row.',
		icon: 'fire',
		criteria: {
			type: 'streak',
			key: 'winStreak',
			target: 5,
		},
	},
	{
		label: 'Serial Burner',
		description: 'Burn 10 words in a single puzzle.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'word_burned',
			count: 10,
			singlePuzzle: true,
		},
	},
	{
		label: 'No Second Chances',
		description: 'Win a puzzle without burning any words.',
		icon: 'gem',
		criteria: {
			type: 'event',
			event: 'puzzle_won_no_burns',
		},
	},
	{
		label: 'Perfect Game',
		description:
			'Solve all groups with full attempts remaining.',
		icon: 'gem',
		criteria: {
			type: 'event',
			event: 'puzzle_perfect',
			attemptsLeft: 'max',
		},
	},

	// 🎯 Burn Mechanic Achievements
	{
		label: 'Risk Taker',
		description: 'Burn 3 non-wildcards in one puzzle.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'nonwildcard_burned',
			count: 3,
			singlePuzzle: true,
		},
	},
	{
		label: 'Pyromaniac',
		description: 'Burn 20 total words.',
		icon: 'fire',
		criteria: {
			type: 'progress',
			key: 'wordsBurned',
			target: 20,
		},
	},
	{
		label: 'Wildcard Hunter',
		description: 'Burn 5 wildcards in a row.',
		icon: 'flame',
		criteria: {
			type: 'event',
			event: 'wildcard_burned_streak',
			count: 5,
		},
	},
	{
		label: 'Inferno',
		description: 'Burn 50 total wildcards.',
		icon: 'fire',
		criteria: {
			type: 'progress',
			key: 'wildcardsBurned',
			target: 50,
		},
	},
	{
		label: 'Burnt Out',
		description:
			'Lose a game by burning too many non-wildcards.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'lost_by_burn',
			nonwildcards: true,
		},
	},

	// 📈 Scoring Achievements
	{
		label: 'Hundred Club',
		description: 'Score 100 points in a game.',
		icon: 'trophy',
		criteria: {
			type: 'event',
			event: 'score_achieved',
			score: 100,
		},
	},
	{
		label: 'Score Chaser',
		description: 'Hit a 200-point game.',
		icon: 'trophy',
		criteria: {
			type: 'event',
			event: 'score_achieved',
			score: 200,
		},
	},
	{
		label: 'Maxed Out',
		description:
			'Achieve the highest possible score on a puzzle.',
		icon: 'crown',
		criteria: { type: 'event', event: 'score_maxed' },
	},
	{
		label: 'Burn Bonus King',
		description:
			'Earn 50 points from burn bonuses in a game.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'burn_bonus',
			points: 50,
		},
	},
	{
		label: 'Efficiency Expert',
		description: 'Win with 5+ attempts remaining.',
		icon: 'zap',
		criteria: {
			type: 'event',
			event: 'puzzle_won',
			attemptsLeft: 5,
		},
	},

	// 🏆 Streak & Progression Achievements
	{
		label: 'New Routine',
		description:
			'Complete the daily puzzle 7 days in a row.',
		icon: 'calendar',
		criteria: {
			type: 'streak',
			key: 'dailyStreak',
			target: 7,
		},
	},
	{
		label: 'Habit Formed',
		description: '14-day daily streak.',
		icon: 'calendar',
		criteria: {
			type: 'streak',
			key: 'dailyStreak',
			target: 14,
		},
	},
	{
		label: 'Loyal Player',
		description: 'Play 30 consecutive daily puzzles.',
		icon: 'calendar',
		criteria: {
			type: 'streak',
			key: 'dailyStreak',
			target: 30,
		},
	},
	{
		label: 'Completionist',
		description: 'Complete 50 different puzzles.',
		icon: 'check',
		criteria: {
			type: 'progress',
			key: 'puzzlesCompleted',
			target: 50,
		},
	},
	{
		label: 'Addicted',
		description: 'Play 100 total games.',
		icon: 'infinity',
		criteria: {
			type: 'progress',
			key: 'gamesPlayed',
			target: 100,
		},
	},

	// 🌐 Community & Custom Puzzle Achievements
	{
		label: 'Explorer',
		description: 'Play your first custom puzzle.',
		icon: 'compass',
		criteria: {
			type: 'event',
			event: 'custom_puzzle_played',
			count: 1,
		},
	},
	{
		label: 'Puzzle Collector',
		description: 'Play 10 custom puzzles.',
		icon: 'compass',
		criteria: {
			type: 'progress',
			key: 'customPuzzlesPlayed',
			target: 10,
		},
	},
	{
		label: 'Community Hero',
		description: 'Create your first custom puzzle.',
		icon: 'pencil',
		criteria: {
			type: 'event',
			event: 'custom_puzzle_created',
			count: 1,
		},
	},
	{
		label: 'Curation Master',
		description:
			'Have 5 of your custom puzzles completed by others.',
		icon: 'star',
		criteria: {
			type: 'progress',
			key: 'customPuzzlesCompletedByOthers',
			target: 5,
		},
	},
	{
		label: 'Word Artisan',
		description: 'Create 10 custom puzzles.',
		icon: 'pencil',
		criteria: {
			type: 'progress',
			key: 'customPuzzlesCreated',
			target: 10,
		},
	},

	// 📊 Statistics & Milestone Achievements
	{
		label: 'Word Scholar',
		description: 'Play puzzles in 10 different categories.',
		icon: 'book',
		criteria: {
			type: 'progress',
			key: 'categoriesPlayed',
			target: 10,
		},
	},
	{
		label: 'Curious Cat',
		description:
			'Check the StatisticsModal for the first time.',
		icon: 'search',
		criteria: {
			type: 'event',
			event: 'stats_modal_opened',
			count: 1,
		},
	},
	{
		label: 'Know Thyself',
		description: 'Check your stats 10 times.',
		icon: 'search',
		criteria: {
			type: 'progress',
			key: 'statsChecked',
			target: 10,
		},
	},
	{
		label: 'Obsessive Tracker',
		description: 'Reach 100 total games played.',
		icon: 'infinity',
		criteria: {
			type: 'progress',
			key: 'gamesPlayed',
			target: 100,
		},
	},
	{
		label: 'Collector’s Obsession',
		description: 'Unlock 50 achievements.',
		icon: 'trophy',
		criteria: { type: 'meta', unlocked: 50 },
	},

	// 🎲 Random/Hidden Achievements
	{
		label: 'Word Out of Place',
		description:
			'Select a word that doesn’t belong 10 times in a game.',
		icon: 'question',
		criteria: {
			type: 'event',
			event: 'wrong_word_selected',
			count: 10,
			singlePuzzle: true,
		},
	},
	{
		label: 'Lucky Guess',
		description: 'Accidentally find a correct group.',
		icon: 'dice',
		criteria: { type: 'event', event: 'lucky_group_found' },
	},
	{
		label: 'Speed Demon',
		description: 'Finish a puzzle in under 60 seconds.',
		icon: 'zap',
		criteria: {
			type: 'event',
			event: 'puzzle_completed_fast',
			seconds: 60,
		},
	},
	{
		label: 'Slow Burn',
		description:
			'Take over 10 minutes to complete a puzzle.',
		icon: 'clock',
		criteria: {
			type: 'event',
			event: 'puzzle_completed_slow',
			seconds: 600,
		},
	},
	{
		label: 'Wildcard Waste',
		description: 'Burn a wildcard with no attempts left.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'wildcard_burned_no_attempts',
		},
	},

	// 🎨 Themed & Easter Egg Achievements
	{
		label: 'Animal Instinct',
		description:
			'Complete a puzzle with animal-themed groups.',
		icon: 'paw',
		criteria: {
			type: 'event',
			event: 'animal_theme_completed',
		},
	},
	{
		label: 'Food Fight',
		description: 'Finish a food category puzzle.',
		icon: 'utensils',
		criteria: {
			type: 'event',
			event: 'food_theme_completed',
		},
	},
	{
		label: 'Mind Games',
		description: 'Win a puzzle with a psychology theme.',
		icon: 'brain',
		criteria: {
			type: 'event',
			event: 'psychology_theme_completed',
		},
	},
	{
		label: 'Movie Buff',
		description: 'Complete a film-themed puzzle.',
		icon: 'film',
		criteria: {
			type: 'event',
			event: 'movie_theme_completed',
		},
	},
	{
		label: 'Music Maestro',
		description: 'Solve a music-related puzzle.',
		icon: 'music',
		criteria: {
			type: 'event',
			event: 'music_theme_completed',
		},
	},

	// 🎮 Game Mode Achievements
	{
		label: 'Classic Conqueror',
		description: 'Win 5 Classic Mode games.',
		icon: 'gamepad',
		criteria: {
			type: 'progress',
			key: 'classicWins',
			target: 5,
		},
	},
	{
		label: 'Daily Devotee',
		description: '10 Daily Puzzle wins.',
		icon: 'calendar',
		criteria: {
			type: 'progress',
			key: 'dailyWins',
			target: 10,
		},
	},
	{
		label: 'Custom King',
		description: 'Win 10 custom puzzles.',
		icon: 'crown',
		criteria: {
			type: 'progress',
			key: 'customWins',
			target: 10,
		},
	},
	{
		label: 'Endurance Runner',
		description: 'Complete a puzzle with 10+ groups.',
		icon: 'running',
		criteria: {
			type: 'event',
			event: 'puzzle_completed_large',
			groups: 10,
		},
	},
	{
		label: 'Tiny Triumph',
		description: 'Win a puzzle with only 2 groups.',
		icon: 'star',
		criteria: {
			type: 'event',
			event: 'puzzle_completed_small',
			groups: 2,
		},
	},

	// 🔥 Burn Challenge Achievements
	{
		label: 'Wildfire',
		description: 'Burn 3 wildcards back-to-back.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'wildcard_burned_streak',
			count: 3,
		},
	},
	{
		label: 'Unlucky Strike',
		description: 'Burn 5 non-wildcards in one game.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'nonwildcard_burned',
			count: 5,
			singlePuzzle: true,
		},
	},
	{
		label: 'Selective Burner',
		description: 'Burn exactly 1 word in a game.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'word_burned_exact',
			count: 1,
			singlePuzzle: true,
		},
	},
	{
		label: 'Clean Sweep',
		description: 'Burn all wildcards in a puzzle.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'all_wildcards_burned',
			singlePuzzle: true,
		},
	},
	{
		label: 'Double or Nothing',
		description:
			'Burn 2 wildcards with 1 attempt remaining and win.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'double_wildcard_burned_clutch',
			attemptsLeft: 1,
		},
	},

	// 👑 Leaderboard & Social Achievements
	{
		label: 'Bragging Rights',
		description: 'Share your score via the Share Modal.',
		icon: 'share',
		criteria: { type: 'event', event: 'score_shared' },
	},
	{
		label: 'Social Starter',
		description: 'Add your first friend.',
		icon: 'user-plus',
		criteria: {
			type: 'event',
			event: 'friend_added',
			count: 1,
		},
	},
	{
		label: 'Chatty Player',
		description:
			'Send a message through InMatchChatWindow.',
		icon: 'comment',
		criteria: {
			type: 'event',
			event: 'inmatch_message_sent',
			count: 1,
		},
	},
	{
		label: 'Top 10',
		description: 'Reach top 10 on the daily leaderboard.',
		icon: 'trophy',
		criteria: { type: 'event', event: 'leaderboard_top10' },
	},
	{
		label: 'Top of the World',
		description: 'Get #1 on the leaderboard.',
		icon: 'crown',
		criteria: { type: 'event', event: 'leaderboard_1st' },
	},

	// 🎭 Gameplay Style Achievements
	{
		label: 'The Gambler',
		description: 'Burn more than you group.',
		icon: 'dice',
		criteria: { type: 'event', event: 'gambler_playstyle' },
	},
	{
		label: 'The Analyst',
		description:
			'Check the RulesModal 5 times in one game.',
		icon: 'book',
		criteria: {
			type: 'event',
			event: 'rules_modal_checked',
			count: 5,
			singlePuzzle: true,
		},
	},
	{
		label: 'The Minimalist',
		description:
			'Solve a puzzle using the fewest possible actions.',
		icon: 'leaf',
		criteria: { type: 'event', event: 'minimalist_win' },
	},
	{
		label: 'The Perfectionist',
		description:
			'Play a puzzle until you win without mistakes.',
		icon: 'gem',
		criteria: { type: 'event', event: 'perfectionist_win' },
	},
	{
		label: 'The Daredevil',
		description: 'Play without checking the rules.',
		icon: 'bolt',
		criteria: { type: 'event', event: 'daredevil_play' },
	},

	// 📅 Time-Based Achievements
	{
		label: 'Night Owl',
		description: 'Win a game between midnight and 4AM.',
		icon: 'moon',
		criteria: {
			type: 'event',
			event: 'night_owl_win',
			betweenHours: [0, 4],
		},
	},
	{
		label: 'Morning Glory',
		description: 'Win a game before 8AM.',
		icon: 'sun',
		criteria: {
			type: 'event',
			event: 'morning_win',
			beforeHour: 8,
		},
	},
	{
		label: 'Weekend Warrior',
		description: 'Complete a daily puzzle on a Sunday.',
		icon: 'calendar',
		criteria: {
			type: 'event',
			event: 'weekend_warrior',
			day: 0,
		},
	},
	{
		label: 'Daily Grind',
		description: 'Play 5 consecutive days.',
		icon: 'calendar',
		criteria: {
			type: 'streak',
			key: 'dailyStreak',
			target: 5,
		},
	},
	{
		label: 'Year of Puzzles',
		description: 'Complete 365 games.',
		icon: 'calendar',
		criteria: {
			type: 'progress',
			key: 'gamesPlayed',
			target: 365,
		},
	},

	// ⚡ Speedrun Achievements
	{
		label: 'Lightning Fast',
		description: 'Win in under 30 seconds.',
		icon: 'zap',
		criteria: {
			type: 'event',
			event: 'puzzle_completed_fast',
			seconds: 30,
		},
	},
	{
		label: 'Quick Thinker',
		description: 'Win in under 1 minute.',
		icon: 'zap',
		criteria: {
			type: 'event',
			event: 'puzzle_completed_fast',
			seconds: 60,
		},
	},
	{
		label: 'Steady Hand',
		description:
			'Complete a puzzle without rapid clicking.',
		icon: 'hand',
		criteria: { type: 'event', event: 'steady_hand_win' },
	},
	{
		label: 'Finger Fury',
		description: 'Select words rapidly without pause.',
		icon: 'bolt',
		criteria: { type: 'event', event: 'finger_fury' },
	},
	{
		label: 'Slow and Steady',
		description: 'Finish a puzzle taking over 15 minutes.',
		icon: 'clock',
		criteria: {
			type: 'event',
			event: 'puzzle_completed_slow',
			seconds: 900,
		},
	},

	// 🎖️ Loss & Recovery Achievements
	{
		label: 'Bitter End',
		description: 'Lose with 1 word left.',
		icon: 'skull',
		criteria: {
			type: 'event',
			event: 'lost_with_one_word',
		},
	},
	{
		label: 'Try, Try Again',
		description: 'Lose 3 games in a row.',
		icon: 'repeat',
		criteria: {
			type: 'streak',
			key: 'lossStreak',
			target: 3,
		},
	},
	{
		label: 'Bounce Back',
		description: 'Win after a loss.',
		icon: 'arrow-up',
		criteria: { type: 'event', event: 'bounce_back_win' },
	},
	{
		label: 'Phoenix',
		description:
			'Lose your first game, then win the next 5.',
		icon: 'fire',
		criteria: {
			type: 'event',
			event: 'phoenix_win',
			afterLoss: 1,
			winStreak: 5,
		},
	},
	{
		label: 'Doomed Decision',
		description: 'Burn the final wildcard, then lose.',
		icon: 'skull',
		criteria: { type: 'event', event: 'doomed_decision' },
	},

	// 📦 Miscellaneous Fun Achievements
	{
		label: 'First Blood',
		description: 'Make your first incorrect guess.',
		icon: 'droplet',
		criteria: {
			type: 'event',
			event: 'first_incorrect_guess',
			count: 1,
		},
	},
	{
		label: 'Pattern Breaker',
		description:
			'Solve a puzzle with non-obvious groupings.',
		icon: 'puzzle-piece',
		criteria: { type: 'event', event: 'pattern_breaker' },
	},
	{
		label: 'Curiosity Killed the Cat',
		description: 'Open every modal in one game.',
		icon: 'cat',
		criteria: {
			type: 'event',
			event: 'all_modals_opened',
			singlePuzzle: true,
		},
	},
	{
		label: 'Social Butterfly',
		description: 'Chat with 5 different players.',
		icon: 'butterfly',
		criteria: {
			type: 'progress',
			key: 'playersChatted',
			target: 5,
		},
	},
	{
		label: 'Silent Type',
		description: 'Win a multiplayer game without chatting.',
		icon: 'mute',
		criteria: { type: 'event', event: 'silent_win' },
	},

	// 🌟 Lifetime Milestone Achievements
	{
		label: 'Wordsmith',
		description: 'Solve 500 total groups.',
		icon: 'book',
		criteria: {
			type: 'progress',
			key: 'groupsSolved',
			target: 500,
		},
	},
	{
		label: 'Burn Veteran',
		description: 'Burn 500 words lifetime.',
		icon: 'fire',
		criteria: {
			type: 'progress',
			key: 'wordsBurned',
			target: 500,
		},
	},
	{
		label: 'Puzzle Master',
		description: 'Complete 1,000 games.',
		icon: 'trophy',
		criteria: {
			type: 'progress',
			key: 'gamesPlayed',
			target: 1000,
		},
	},
	{
		label: 'Wildcard Slayer',
		description: 'Burn 1,000 wildcards.',
		icon: 'fire',
		criteria: {
			type: 'progress',
			key: 'wildcardsBurned',
			target: 1000,
		},
	},
	{
		label: 'Legendary Streak',
		description: '50 consecutive daily wins.',
		icon: 'crown',
		criteria: {
			type: 'streak',
			key: 'dailyStreak',
			target: 50,
		},
	},

	// 💎 Rare Achievements
	{
		label: 'Lucky Streak',
		description: '10 wins without a single loss.',
		icon: 'star',
		criteria: {
			type: 'streak',
			key: 'winStreak',
			target: 10,
		},
	},
	{
		label: 'Master of Themes',
		description:
			'Win a puzzle in every available category.',
		icon: 'palette',
		criteria: {
			type: 'progress',
			key: 'categoriesWon',
			target: 'all',
		},
	},
	{
		label: 'Insomniac',
		description:
			'Play between 2AM-4AM for 5 nights straight.',
		icon: 'moon',
		criteria: {
			type: 'streak',
			key: 'nightOwlStreak',
			target: 5,
		},
	},
	{
		label: 'Underdog Victory',
		description: 'Win a game when behind on leaderboard.',
		icon: 'arrow-up',
		criteria: { type: 'event', event: 'underdog_win' },
	},
	{
		label: 'Silent Assassin',
		description: 'Top score without burning a single word.',
		icon: 'skull',
		criteria: { type: 'event', event: 'silent_assassin' },
	},
];
