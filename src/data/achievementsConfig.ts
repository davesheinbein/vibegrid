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
	// 🎯 Daily Puzzle Achievements
	{
		id: 'daily_rookie',
		label: 'Daily Rookie',
		name: 'Daily Rookie',
		description: 'Solve your first daily puzzle',
		icon: '🎯',
		category: 'Daily Puzzle',
		tier: 'bronze',
	},
	{
		id: 'daily_enthusiast',
		label: 'Daily Enthusiast',
		name: 'Daily Enthusiast',
		description: '5-day winning streak',
		icon: '🎯',
		category: 'Daily Puzzle',
		tier: 'silver',
	},
	{
		id: 'daily_devotee',
		label: 'Daily Devotee',
		name: 'Daily Devotee',
		description: '10-day winning streak',
		icon: '🎯',
		category: 'Daily Puzzle',
		tier: 'gold',
	},
	{
		id: 'daily_champ',
		label: 'Daily Champ',
		name: 'Daily Champ',
		description: '30-day winning streak',
		icon: '🎯',
		category: 'Daily Puzzle',
		tier: 'platinum',
	},
	{
		id: 'no_mistakes',
		label: 'No Mistakes',
		name: 'No Mistakes',
		description:
			'Solve a daily puzzle with zero wrong attempts',
		icon: '✅',
		category: 'Daily Puzzle',
		tier: 'silver',
	},
	{
		id: 'speed_demon',
		label: 'Speed Demon',
		name: 'Speed Demon',
		description: 'Solve under 20 sec',
		icon: '⚡',
		category: 'Daily Puzzle',
		tier: 'silver',
	},
	{
		id: 'close_call',
		label: 'Close Call',
		name: 'Close Call',
		description: 'Win with only 1 attempt left',
		icon: '⏳',
		category: 'Daily Puzzle',
		tier: 'bronze',
	},
	{
		id: 'persistence',
		label: 'Persistence',
		name: 'Persistence',
		description: 'Win after missing first guess',
		icon: '🔁',
		category: 'Daily Puzzle',
		tier: 'bronze',
	},
	{
		id: 'wildcard_master',
		label: 'Wildcard Master',
		name: 'Wildcard Master',
		description: 'Use every wildcard',
		icon: '🃏',
		category: 'Daily Puzzle',
		tier: 'silver',
	},
	{
		id: 'daily_comeback',
		label: 'Daily Comeback',
		name: 'Daily Comeback',
		description:
			'Win after only unlocking 1 group initially',
		icon: '🔄',
		category: 'Daily Puzzle',
		tier: 'gold',
	},
	{
		id: 'lightning_solver',
		label: 'Lightning Solver',
		name: 'Lightning Solver',
		description: 'Solve under 30 sec',
		icon: '⚡',
		category: 'Daily Puzzle',
		tier: 'silver',
	},
	{
		id: 'perfect_game',
		label: 'Perfect Game',
		name: 'Perfect Game',
		description: 'Solve all 4 groups with no mistakes',
		icon: '🏅',
		category: 'Daily Puzzle',
		tier: 'gold',
	},

	// 🧩 Custom Puzzle Achievements
	{
		id: 'first_builder',
		label: 'First Builder',
		name: 'First Builder',
		description: 'Publish your first custom puzzle',
		icon: '🧩',
		category: 'Custom Puzzle',
		tier: 'bronze',
	},
	{
		id: 'puzzle_workshop',
		label: 'Puzzle Workshop',
		name: 'Puzzle Workshop',
		description: 'Publish 5 custom puzzles',
		icon: '🧩',
		category: 'Custom Puzzle',
		tier: 'silver',
	},
	{
		id: 'puzzle_architect',
		label: 'Puzzle Architect',
		name: 'Puzzle Architect',
		description: 'Publish 20 puzzles',
		icon: '🧩',
		category: 'Custom Puzzle',
		tier: 'gold',
	},
	{
		id: 'puzzle_legend',
		label: 'Puzzle Legend',
		name: 'Puzzle Legend',
		description: 'Publish 50 puzzles',
		icon: '🧩',
		category: 'Custom Puzzle',
		tier: 'platinum',
	},
	{
		id: 'community_star',
		label: 'Community Star',
		name: 'Community Star',
		description: 'Custom puzzle favorited by 10 users',
		icon: '⭐',
		category: 'Custom Puzzle',
		tier: 'silver',
	},
	{
		id: 'critics_choice',
		label: 'Critic’s Choice',
		name: 'Critic’s Choice',
		description: 'Puzzle rated 4+ stars by 20 players',
		icon: '🌟',
		category: 'Custom Puzzle',
		tier: 'gold',
	},
	{
		id: 'explorer_custom',
		label: 'Explorer',
		name: 'Explorer',
		description: 'Play 20 distinct user-created puzzles',
		icon: '🧭',
		category: 'Custom Puzzle',
		tier: 'silver',
	},
	{
		id: 'favorite_collector',
		label: 'Favorite Collector',
		name: 'Favorite Collector',
		description: 'Favorite 50 puzzles (any type)',
		icon: '💖',
		category: 'Custom Puzzle',
		tier: 'gold',
	},
	{
		id: 'creative_genius',
		label: 'Creative Genius',
		name: 'Creative Genius',
		description: 'Custom puzzle solved 100 times',
		icon: '🎨',
		category: 'Custom Puzzle',
		tier: 'platinum',
	},
	{
		id: 'secret_keeper',
		label: 'Secret Keeper',
		name: 'Secret Keeper',
		description:
			'Craft a puzzle that stumps 90% of players',
		icon: '🕵️‍♂️',
		category: 'Custom Puzzle',
		tier: 'secret',
		secret: true,
	},

	// ⚔️ VS Multiplayer Achievements
	{
		id: 'first_duel',
		label: 'First Duel',
		name: 'First Duel',
		description: 'Play first multiplayer match',
		icon: '⚔️',
		category: 'VS Multiplayer',
		tier: 'bronze',
	},
	{
		id: 'first_victory',
		label: 'First Victory',
		name: 'First Victory',
		description: 'Win your first multiplayer match',
		icon: '🏆',
		category: 'VS Multiplayer',
		tier: 'bronze',
	},
	{
		id: 'champion',
		label: 'Champion',
		name: 'Champion',
		description: 'Win 10 multiplayer matches',
		icon: '🏆',
		category: 'VS Multiplayer',
		tier: 'silver',
	},
	{
		id: 'dominating_streak',
		label: 'Dominating Streak',
		name: 'Dominating Streak',
		description: '5 wins in a row',
		icon: '🔥',
		category: 'VS Multiplayer',
		tier: 'gold',
	},
	{
		id: 'comeback_kid',
		label: 'Comeback Kid',
		name: 'Comeback Kid',
		description: 'Win after trailing',
		icon: '🔄',
		category: 'VS Multiplayer',
		tier: 'silver',
	},
	{
		id: 'quick_victory',
		label: 'Quick Victory',
		name: 'Quick Victory',
		description: 'Win under 30 sec',
		icon: '⚡',
		category: 'VS Multiplayer',
		tier: 'silver',
	},
	{
		id: 'matchmaker',
		label: 'Matchmaker',
		name: 'Matchmaker',
		description: 'Play 10 matches with randoms',
		icon: '🤝',
		category: 'VS Multiplayer',
		tier: 'bronze',
	},
	{
		id: 'room_master',
		label: 'Room Master',
		name: 'Room Master',
		description: 'Host 10 room-code matches',
		icon: '🏠',
		category: 'VS Multiplayer',
		tier: 'silver',
	},
	{
		id: 'social_warrior',
		label: 'Social Warrior',
		name: 'Social Warrior',
		description: 'Win against a friend',
		icon: '👥',
		category: 'VS Multiplayer',
		tier: 'silver',
	},
	{
		id: 'mvp',
		label: 'MVP',
		name: 'MVP',
		description: 'Most solved groups in a match',
		icon: '⭐',
		category: 'VS Multiplayer',
		tier: 'gold',
	},
	{
		id: 'tactician',
		label: 'Tactician',
		name: 'Tactician',
		description: 'Win with no hints/wildcards',
		icon: '🧠',
		category: 'VS Multiplayer',
		tier: 'gold',
	},

	// 🤖 VS Bot Achievements
	{
		id: 'vs_bot_victory',
		label: 'VS Bot Victory',
		name: 'VS Bot Victory',
		description: 'Win any bot match',
		icon: '🤖',
		category: 'VS Bot',
		tier: 'bronze',
	},
	{
		id: 'bot_clean_sweep',
		label: 'Bot Clean Sweep',
		name: 'Bot Clean Sweep',
		description: 'Win without mistakes',
		icon: '🧹',
		category: 'VS Bot',
		tier: 'silver',
	},
	{
		id: 'bot_slayer',
		label: 'Bot Slayer',
		name: 'Bot Slayer',
		description: '10 wins against bot',
		icon: '🤖',
		category: 'VS Bot',
		tier: 'gold',
	},
	{
		id: 'bot_challenger',
		label: 'Bot Challenger',
		name: 'Bot Challenger',
		description: 'Challenge bot on Hard',
		icon: '💪',
		category: 'VS Bot',
		tier: 'gold',
	},
	{
		id: 'legend_slayer',
		label: 'Legend Slayer',
		name: 'Legend Slayer',
		description: 'Beat Legendary bot',
		icon: '🏅',
		category: 'VS Bot',
		tier: 'platinum',
	},
	{
		id: 'bot_streak',
		label: 'Bot Streak',
		name: 'Bot Streak',
		description: '5 wins in row vs bot',
		icon: '🔥',
		category: 'VS Bot',
		tier: 'gold',
	},

	// 👥 Social & Interaction Achievements
	{
		id: 'social_starter',
		label: 'Social Starter',
		name: 'Social Starter',
		description: 'Send first friend request',
		icon: '👋',
		category: 'Social',
		tier: 'bronze',
	},
	{
		id: 'friendly_network',
		label: 'Friendly Network',
		name: 'Friendly Network',
		description: 'Reach 10 friends',
		icon: '👥',
		category: 'Social',
		tier: 'silver',
	},
	{
		id: 'social_butterfly',
		label: 'Social Butterfly',
		name: 'Social Butterfly',
		description: 'Reach 50 friends',
		icon: '🦋',
		category: 'Social',
		tier: 'gold',
	},
	{
		id: 'conversationalist',
		label: 'Conversationalist',
		name: 'Conversationalist',
		description: 'Send 100 DMs',
		icon: '💬',
		category: 'Social',
		tier: 'silver',
	},
	{
		id: 'chat_groupie',
		label: 'Chat Groupie',
		name: 'Chat Groupie',
		description: 'Join/create 5 group chats',
		icon: '👥',
		category: 'Social',
		tier: 'silver',
	},
	{
		id: 'supporter',
		label: 'Supporter',
		name: 'Supporter',
		description: '10 accepted requests',
		icon: '🤝',
		category: 'Social',
		tier: 'silver',
	},
	{
		id: 'popular_player',
		label: 'Popular Player',
		name: 'Popular Player',
		description: 'Receive 50 friend requests',
		icon: '🌟',
		category: 'Social',
		tier: 'gold',
	},
	{
		id: 'notifier',
		label: 'Notifier',
		name: 'Notifier',
		description: 'Respond to 20 notifications within 1 hr',
		icon: '🔔',
		category: 'Social',
		tier: 'silver',
	},

	// 🧠 General Gameplay Achievements
	{
		id: 'puzzle_addict',
		label: 'Puzzle Addict',
		name: 'Puzzle Addict',
		description: 'Play 100 puzzles',
		icon: '🧠',
		category: 'General',
		tier: 'silver',
	},
	{
		id: 'completionist',
		label: 'Completionist',
		name: 'Completionist',
		description: 'Solve 500 puzzles',
		icon: '🏆',
		category: 'General',
		tier: 'platinum',
	},
	{
		id: 'lucky_guess',
		label: 'Lucky Guess',
		name: 'Lucky Guess',
		description: 'First-try group guess 10 times',
		icon: '🍀',
		category: 'General',
		tier: 'silver',
	},
	{
		id: 'strategist',
		label: 'Strategist',
		name: 'Strategist',
		description: 'Solve in ≤2 attempts',
		icon: '♟️',
		category: 'General',
		tier: 'silver',
	},
	{
		id: 'tenacious',
		label: 'Tenacious',
		name: 'Tenacious',
		description:
			'Solve after exhausting attempts initially',
		icon: '💪',
		category: 'General',
		tier: 'gold',
	},
	{
		id: 'unstoppable',
		label: 'Unstoppable',
		name: 'Unstoppable',
		description: 'Win 20 consecutive puzzles/matches',
		icon: '🔥',
		category: 'General',
		tier: 'platinum',
	},
	{
		id: 'collector',
		label: 'Collector',
		name: 'Collector',
		description: 'Favorite 100 puzzles',
		icon: '📚',
		category: 'General',
		tier: 'platinum',
	},
	{
		id: 'multi_tasker',
		label: 'Multi-Tasker',
		name: 'Multi-Tasker',
		description: 'Play all modes in 24 hr',
		icon: '🔄',
		category: 'General',
		tier: 'gold',
	},
	{
		id: 'explorer',
		label: 'Explorer',
		name: 'Explorer',
		description: 'Play puzzles from 50 unique creators',
		icon: '🧭',
		category: 'General',
		tier: 'gold',
	},
	{
		id: 'wildcard_wizard',
		label: 'Wildcard Wizard',
		name: 'Wildcard Wizard',
		description: 'Use wildcards in 10 puzzles',
		icon: '🃏',
		category: 'General',
		tier: 'silver',
	},

	// 🏆 Meta & Milestone Achievements
	{
		id: 'achiever',
		label: 'Achiever',
		name: 'Achiever',
		description: 'Unlock 10 achievements',
		icon: '🏅',
		category: 'Meta',
		tier: 'bronze',
	},
	{
		id: 'veteran',
		label: 'Veteran',
		name: 'Veteran',
		description: 'Unlock 25 achievements',
		icon: '🏅',
		category: 'Meta',
		tier: 'silver',
	},
	{
		id: 'legend',
		label: 'Legend',
		name: 'Legend',
		description: 'Unlock 50 achievements',
		icon: '🏅',
		category: 'Meta',
		tier: 'gold',
	},
	{
		id: 'completionist_meta',
		label: 'Completionist',
		name: 'Completionist',
		description: 'Unlock all achievements',
		icon: '🏆',
		category: 'Meta',
		tier: 'platinum',
	},

	// 🕗 Timing & Engagement Achievements
	{
		id: 'early_bird',
		label: 'Early Bird',
		name: 'Early Bird',
		description: 'Play daily within first hour',
		icon: '🌅',
		category: 'Timing',
		tier: 'silver',
	},
	{
		id: 'night_owl',
		label: 'Night Owl',
		name: 'Night Owl',
		description: 'Play between midnight–4 AM',
		icon: '🌙',
		category: 'Timing',
		tier: 'silver',
	},
	{
		id: 'pwa_user',
		label: 'PWA User',
		name: 'PWA User',
		description: 'Play via Progressive Web App on mobile',
		icon: '📱',
		category: 'Timing',
		tier: 'silver',
	},
	{
		id: 'session_master',
		label: 'Session Master',
		name: 'Session Master',
		description: 'Spend 1 hour+ in a session',
		icon: '⏰',
		category: 'Timing',
		tier: 'gold',
	},
	{
		id: 'time_spender',
		label: 'Time Spender',
		name: 'Time Spender',
		description: '100 hours total playtime',
		icon: '⏳',
		category: 'Timing',
		tier: 'platinum',
	},

	// 🧰 Technical & Social Achievements
	{
		id: 'bug_hunter',
		label: 'Bug Hunter',
		name: 'Bug Hunter',
		description: 'Report verified bug',
		icon: '🔧',
		category: 'Technical',
		tier: 'silver',
	},
	{
		id: 'beta_tester',
		label: 'Beta Tester',
		name: 'Beta Tester',
		description: 'Play a feature in beta',
		icon: '🧪',
		category: 'Technical',
		tier: 'silver',
	},
	{
		id: 'helper',
		label: 'Helper',
		name: 'Helper',
		description: 'Send 10 hints/challenges',
		icon: '🤝',
		category: 'Technical',
		tier: 'silver',
	},

	// 🕵️‍♂️ Secret / Easter Egg Achievements
	{
		id: 'the_collector',
		label: 'The Collector',
		name: 'The Collector',
		description: 'Find hidden easter egg words',
		icon: '🥚',
		category: 'Secret',
		tier: 'secret',
		secret: true,
	},
	{
		id: 'master_of_shadows',
		label: 'Master of Shadows',
		name: 'Master of Shadows',
		description: 'Solve with timer paused',
		icon: '🌑',
		category: 'Secret',
		tier: 'secret',
		secret: true,
	},
	{
		id: 'phantom_solver',
		label: 'Phantom Solver',
		name: 'Phantom Solver',
		description: 'Solve silently',
		icon: '👻',
		category: 'Secret',
		tier: 'secret',
		secret: true,
	},
	{
		id: 'whisperer',
		label: 'Whisperer',
		name: 'Whisperer',
		description: 'Unlock hidden message',
		icon: '🤫',
		category: 'Secret',
		tier: 'secret',
		secret: true,
	},

	// 📈 VS Bot Extra Tiers
	{
		id: 'easy_bot_challenger',
		label: 'Easy Bot Challenger',
		name: 'Easy Bot Challenger',
		description: 'Win Easy',
		icon: '🤖',
		category: 'VS Bot',
		tier: 'bronze',
	},
	{
		id: 'medium_bot_challenger',
		label: 'Medium Bot Challenger',
		name: 'Medium Bot Challenger',
		description: 'Win Medium',
		icon: '🤖',
		category: 'VS Bot',
		tier: 'silver',
	},
	{
		id: 'hard_bot_challenger',
		label: 'Hard Bot Challenger',
		name: 'Hard Bot Challenger',
		description: 'Win Hard',
		icon: '🤖',
		category: 'VS Bot',
		tier: 'gold',
	},
	{
		id: 'legendary_bot_challenger',
		label: 'Legendary Bot Challenger',
		name: 'Legendary Bot Challenger',
		description: 'Win Legendary',
		icon: '🤖',
		category: 'VS Bot',
		tier: 'platinum',
	},
	{
		id: 'bot_speedster',
		label: 'Bot Speedster',
		name: 'Bot Speedster',
		description: 'Beat bot under 30 sec',
		icon: '⚡',
		category: 'VS Bot',
		tier: 'silver',
	},

	// 🎙️ Champion Streak Variants
	{
		id: 'streak_starter',
		label: 'Streak Starter',
		name: 'Streak Starter',
		description: '3-day daily streak',
		icon: '🥉',
		category: 'Daily Puzzle',
		tier: 'bronze',
	},
	{
		id: 'streak_god',
		label: 'Streak God',
		name: 'Streak God',
		description: '30-day streak',
		icon: '🏆',
		category: 'Daily Puzzle',
		tier: 'platinum',
	},
	{
		id: 'streak_master',
		label: 'Streak Master',
		name: 'Streak Master',
		description: 'Legendary streak (50+)',
		icon: '🏅',
		category: 'Daily Puzzle',
		tier: 'platinum',
	},

	// 📦 Social Interaction Variants
	{
		id: 'popular_puzzle',
		label: 'Popular Puzzle',
		name: 'Popular Puzzle',
		description: 'Your puzzle favorited by 100 players',
		icon: '🌟',
		category: 'Custom Puzzle',
		tier: 'platinum',
	},
	{
		id: 'guide',
		label: 'Guide',
		name: 'Guide',
		description: 'Send 50 rematch invites',
		icon: '📨',
		category: 'Social',
		tier: 'gold',
	},

	// 🏅 Custom Puzzle Extra
	{
		id: 'critics_icon',
		label: 'Critic’s Icon',
		name: 'Critic’s Icon',
		description: 'Puzzle rated 5 stars',
		icon: '🌟',
		category: 'Custom Puzzle',
		tier: 'platinum',
	},
	{
		id: 'top_creator',
		label: 'Top Creator',
		name: 'Top Creator',
		description: 'Puzzle in top 10% popular',
		icon: '🏆',
		category: 'Custom Puzzle',
		tier: 'platinum',
	},

	// 🥇 Speed & Precision Achievements (all modes)
	{
		id: 'ultra_quick',
		label: 'Ultra Quick',
		name: 'Ultra Quick',
		description: 'Solve any puzzle in ≤10 sec',
		icon: '⚡',
		category: 'General',
		tier: 'gold',
	},
	{
		id: 'perfect_series',
		label: 'Perfect Series',
		name: 'Perfect Series',
		description: 'Three mistake-free solves in row',
		icon: '✅',
		category: 'General',
		tier: 'gold',
	},

	// 🧩 Granular Stats Achievements
	{
		id: 'hopic',
		label: 'Hopic',
		name: 'Hopic',
		description: '100 daily puzzle completions',
		icon: '🎯',
		category: 'Daily Puzzle',
		tier: 'gold',
	},
	{
		id: 'custom_champion',
		label: 'Custom Champion',
		name: 'Custom Champion',
		description: '100 custom puzzles completed',
		icon: '🧩',
		category: 'Custom Puzzle',
		tier: 'gold',
	},

	// 🛡️ Defensive / Recovery
	{
		id: 'comeback_master',
		label: 'Comeback Master',
		name: 'Comeback Master',
		description: '3 comeback wins',
		icon: '🛡️',
		category: 'General',
		tier: 'gold',
	},
	{
		id: 'resilient',
		label: 'Resilient',
		name: 'Resilient',
		description: 'Win after 3+ misses',
		icon: '🛡️',
		category: 'General',
		tier: 'silver',
	},

	// 🏛️ Social Planner
	{
		id: 'room_host',
		label: 'Room Host',
		name: 'Room Host',
		description: 'Host 50 matches',
		icon: '🏛️',
		category: 'VS Multiplayer',
		tier: 'gold',
	},
	{
		id: 'room_veteran',
		label: 'Room Veteran',
		name: 'Room Veteran',
		description: 'Host 200 matches',
		icon: '🏛️',
		category: 'VS Multiplayer',
		tier: 'platinum',
	},

	// ☄️ Seasonal / Rare
	{
		id: 'holiday_special',
		label: 'Holiday Special',
		name: 'Holiday Special',
		description: 'Complete themed puzzle',
		icon: '☃️',
		category: 'Seasonal',
		tier: 'secret',
		secret: true,
	},
	{
		id: 'victor_of_the_age',
		label: 'Victor of the Age',
		name: 'Victor of the Age',
		description: 'Win during special event',
		icon: '🏆',
		category: 'Seasonal',
		tier: 'secret',
		secret: true,
	},

	// 🎮 Competitive Tiers
	{
		id: 'tournament_rookie',
		label: 'Tournament Rookie',
		name: 'Tournament Rookie',
		description: 'Participate in 3 tourney matches',
		icon: '🎮',
		category: 'Competitive',
		tier: 'bronze',
	},
	{
		id: 'tournament_champion',
		label: 'Tournament Champion',
		name: 'Tournament Champion',
		description: 'Win a tourney',
		icon: '🏆',
		category: 'Competitive',
		tier: 'gold',
	},

	// 🏆 Ultimate Meta
	{
		id: 'vibe_lord',
		label: 'Vibe Lord',
		name: 'Vibe Lord',
		description: 'Achieve the top daily score',
		icon: '👑',
		category: 'Meta',
		tier: 'platinum',
	},
	{
		id: 'achievement_collector',
		label: 'Achievement Collector',
		name: 'Achievement Collector',
		description: 'Unlock all achievements',
		icon: '🏆',
		category: 'Meta',
		tier: 'platinum',
	},
];
