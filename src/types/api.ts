// --- User & Profile Types ---
export interface User {
	id: string;
	username: string;
	email?: string;
	photoUrl?: string;
	createdAt?: string;
	lastActive?: string;
	isAdmin?: boolean;
	banned?: boolean;
	stats?: PlayerStats;
	xp?: number;
	level?: number;
	tutorialCompleted?: boolean;
	notificationPrefs?: any;
	equippedThemeId?: string;
	equippedFontId?: string;
	equippedEmojiPackId?: string;
	equippedSoundPackId?: string;
	equippedTitleId?: string;
	equippedFrameId?: string;
	equippedBurnTrailId?: string;
	coins?: number;
	premiumCurrency?: number;
	profileThemes?: UserProfileTheme[];
	profileBadges?: UserProfileBadge[];
}

export interface PlayerStats {
	total_matches_played: number;
	vs_bot_matches_played: number;
	vs_multiplayer_matches_played: number;
	win_count: number;
	loss_count: number;
	perfect_puzzles: number;
	longest_streak: number;
	current_streak: number;
	average_solve_time: number;
	mistake_rate: number;
	favorite_category: string;
	last_played_at: string;
	join_date: string;
}

export interface UserProfileTheme {
	id: string;
	userId: string;
	theme: string;
	unlockedAt: string;
}

export interface UserProfileBadge {
	id: string;
	userId: string;
	badge: string;
	unlockedAt: string;
}

// --- Friends & Chat ---
export interface Friend {
	id: string;
	username: string;
	online: boolean;
	division?: string;
	tier?: string;
	photoUrl?: string;
	lastActive?: string;
}

export interface FriendRequest {
	id: string;
	from: Friend;
	to: Friend;
	status: 'pending' | 'accepted' | 'declined' | 'blocked';
	createdAt: string;
}

export interface FriendMessage {
	id: string;
	senderId: string;
	receiverId?: string;
	groupId?: string;
	message: string;
	sentAt: string;
	expiresAt?: string;
	system?: boolean;
}

export interface Group {
	id: string;
	name: string;
	memberIds: string[];
}

export interface GroupChat {
	id: string;
	name: string;
	createdById: string;
	createdAt: string;
	members: GroupMember[];
	messages: Message[];
}

export interface GroupMember {
	id: string;
	groupId: string;
	userId: string;
	joinedAt: string;
}

export interface Message {
	id: string;
	senderId: string;
	receiverId?: string;
	groupId?: string;
	message: string;
	sentAt: string;
	system?: boolean;
}

// --- Puzzle & Match ---
export interface Puzzle {
	id: string;
	title: string;
	authorId: string;
	groups: any; // TODO: type this
	wildcards: any;
	isDaily: boolean;
	date?: string;
	rating?: number;
	favorites?: number;
	createdAt?: string;
	type?: string;
	approved?: boolean;
	matches?: Match[];
	comments?: PuzzleComment[];
}

export interface PuzzleComment {
	id: string;
	puzzleId: string;
	userId: string;
	comment: string;
	createdAt: string;
}

export interface Match {
	id: string;
	player1Id: string;
	player2Id: string;
	puzzleId: string;
	state: string;
	winnerId?: string;
	startedAt: string;
	endedAt?: string;
	type?: string;
	botName?: string;
	botDifficulty?: string;
	botAvatar?: string;
	puzzle?: Puzzle;
	winner?: User;
}

// --- Achievements & Progression ---
export type AchievementTier =
	| 'bronze'
	| 'silver'
	| 'gold'
	| 'platinum'
	| 'secret';

export interface AchievementDef {
	id: string;
	label: string;
	name: string;
	description: string;
	icon: string;
	category: string;
	tier?: AchievementTier;
	secret?: boolean;
}

export interface Achievement {
	id: string;
	label: string;
	description: string;
	icon?: string;
	unlockedAt?: string;
	unlocked?: boolean;
	tier?: AchievementTier;
	category?: string;
}

export interface UserAchievement {
	id: string;
	userId: string;
	achievementId: string;
	unlockedAt: string;
	achievement: Achievement;
}

export interface Progression {
	levels: number[];
	rewards: { level: number; reward: string }[];
}

// --- Leaderboards ---
export interface LeaderboardEntry {
	rank: number;
	user: string;
	score: number;
	photoUrl?: string;
	stats?: PlayerStats;
}

// --- Customization ---
export interface CustomizationItem {
	id: string;
	type: string; // e.g. 'theme', 'font', etc.
	name: string;
	description?: string;
	rarity?: string;
	price?: number;
	premiumPrice?: number;
	previewUrl?: string;
	isSeasonal?: boolean;
	isExclusive?: boolean;
	availableAt?: string;
	expiresAt?: string;
}

export interface UserCustomization {
	id: string;
	userId: string;
	itemId: string;
	acquiredAt: string;
	via?: string;
	item: CustomizationItem;
}

export interface UserLoadout {
	id: string;
	userId: string;
	name: string;
	themeId?: string;
	fontId?: string;
	emojiPackId?: string;
	soundPackId?: string;
	titleId?: string;
	frameId?: string;
	burnTrailId?: string;
	createdAt: string;
	updatedAt: string;
}

// --- Bot Stats ---
export interface BotStats {
	id: string;
	userId: string;
	botDifficulty: string;
	completed: number;
	winCount: number;
	lossCount: number;
	winPercentage: number;
	currentStreak: number;
	maxStreak: number;
	perfectPuzzles: number;
	totalPoints: number;
	fastestWinTime?: number;
	averageMatchTime?: number;
	groupsSolvedFirst: number;
	botOutsolvedFirst: number;
	threeMistakeFails: number;
	totalWordsGuessed: number;
	totalMistakes: number;
	accuracyPercentage: number;
	mostGuessedWord?: string;
	mostCommonTheme?: string;
	dramaticComebacks: number;
	clutchWins: number;
	cleanSweeps: number;
	multiPerfects: number;
	averageMistakesPerMatch: number;
	createdAt: string;
	updatedAt: string;
}

// --- Notifications ---
export interface Notification {
	id: string;
	message?: string;
	type: 'system' | 'friend' | 'achievement' | 'custom';
	read?: boolean;
	createdAt: string;
	content?: string;
}

// --- Misc ---
export interface AnalyticsGlobal {
	userCount: number;
	matchCount: number;
	puzzleCount: number;
}

export interface UploadResponse {
	success: boolean;
	url: string;
}
