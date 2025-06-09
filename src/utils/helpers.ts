import dailyPuzzlesJson from '../data/dailyPuzzles.json';
import {
	setSelectedWords,
	setLockedWords,
	setFeedback,
	setAttempts,
	setSolvedGroups,
} from '../store/gameSlice';

const dailyPuzzles: any[] = dailyPuzzlesJson as any[];

function getTodayDateString() {
	const now = new Date();
	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const year = now.getFullYear();
	return `${day}/${month}/${year}`;
}

const todayStr = getTodayDateString();

const todayPuzzle =
	dailyPuzzles.find((p) => p.date === todayStr) ||
	dailyPuzzles.find((p) => p.date === 'default') ||
	dailyPuzzles[0];

export const dailyPuzzle = todayPuzzle;

export function shuffle<T>(array: T[]): T[] {
	const arr = array.slice();
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export function getAllWordsFromGroupsAndWildcards(
	groups: string[][],
	wildcards: string[]
): string[] {
	const groupWords = groups.flat();
	const allWords = [...groupWords, ...(wildcards || [])];
	return Array.from(new Set(allWords));
}

export function parseGroupsFromText(
	text: string,
	groupSize: number
): string[][] {
	return text
		.split(/\n+/)
		.map((line) =>
			line
				.split(/[,;\-\s]+/)
				.map((w) => w.trim())
				.filter(Boolean)
				.slice(0, groupSize)
		)
		.filter((group) => group.length > 0);
}

export function parseGroupsFromInputs(
	inputs: string[],
	groupSize: number
): string[][] {
	return inputs.map((line) =>
		line
			.split(/[,;\-\s]+/)
			.map((w) => w.trim())
			.filter(Boolean)
			.slice(0, groupSize)
	);
}

export function getUniqueWordsFromGroups(
	groups: string[][]
): string[] {
	return Array.from(
		new Set(
			groups
				.flat()
				.map((w) => w.trim())
				.filter(Boolean)
		)
	);
}

export function buildGroupsFromWords(
	words: string[],
	groupSize: number
): string[][] {
	const groups: string[][] = [];
	for (let i = 0; i < words.length; i += groupSize) {
		groups.push(words.slice(i, i + groupSize));
	}
	return groups;
}

export function capitalizeWords(str: string): string {
	return str.replace(
		/\b\w+/g,
		(w) =>
			w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
	);
}

export function getShareUrl(): string {
	return 'https://gridRoyale.app';
}

export function getShareTitle(): string {
	return "Grid Royale: Can you solve today's grid?";
}

export function getShareText(): string {
	return 'Check out my Grid Royale result!';
}

export function copyToClipboard(
	text: string,
	setCopied?: (v: boolean) => void
) {
	if (
		typeof navigator !== 'undefined' &&
		navigator.clipboard
	) {
		navigator.clipboard.writeText(text);
		if (setCopied) {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		}
	}
}

// --- Array and Redux helpers extracted from daily.tsx ---
export function addToArray<T>(
	arr: T[],
	items: T | T[]
): T[] {
	return Array.isArray(items)
		? [...arr, ...items]
		: [...arr, items];
}

export function removeFromArray<T>(arr: T[], item: T): T[] {
	return arr.filter((x) => x !== item);
}

// These helpers expect the relevant dispatch and state to be passed in
/**
 * Sets the feedback message by dispatching setFeedback([msg]).
 * @param dispatch - Redux dispatch
 * @param msg - feedback message
 */
export function setFeedbackMsg(dispatch: any, msg: string) {
	dispatch(setFeedback([msg]));
}

/**
 * Adds words to the lockedWords array and dispatches setLockedWords action.
 * @param dispatch - Redux dispatch
 * @param lockedWords - current lockedWords array
 * @param words - word or array of words to add
 */
export function addLockedWords(
	dispatch: any,
	lockedWords: string[],
	words: string | string[]
) {
	const updated = Array.isArray(words)
		? [...lockedWords, ...words]
		: [...lockedWords, words];
	dispatch(setLockedWords(updated));
}

/**
 * Adds a group to the solvedGroups array and dispatches setSolvedGroups action.
 * @param dispatch - Redux dispatch
 * @param solvedGroups - current solvedGroups array
 * @param group - group to add
 */
export function addSolvedGroup(
	dispatch: any,
	solvedGroups: string[][],
	group: string[]
) {
	dispatch(setSolvedGroups([...solvedGroups, group]));
}

/**
 * Adds a word to the selectedWords array and dispatches setSelectedWords action.
 * @param dispatch - Redux dispatch
 * @param selectedWords - current selectedWords array
 * @param word - word to add
 */
export function addSelectedWord(
	dispatch: any,
	selectedWords: string[],
	word: string
) {
	dispatch(setSelectedWords([...selectedWords, word]));
}

/**
 * Removes a word from the selectedWords array and dispatches setSelectedWords action.
 * @param dispatch - Redux dispatch
 * @param selectedWords - current selectedWords array
 * @param word - word to remove
 */
export function removeSelectedWord(
	dispatch: any,
	selectedWords: string[],
	word: string
) {
	dispatch(
		setSelectedWords(
			selectedWords.filter((x) => x !== word)
		)
	);
}

/**
 * Clears the selectedWords array by dispatching setSelectedWords([]).
 * @param dispatch - Redux dispatch
 */
export function clearSelectedWords(dispatch: any) {
	dispatch(setSelectedWords([]));
}

/**
 * Sets the attempts value by dispatching setAttempts(value).
 * @param dispatch - Redux dispatch
 * @param value - new attempts value
 */
export function setAttemptsValue(
	dispatch: any,
	value: number
) {
	dispatch(setAttempts(value));
}

// --- Utility: Generate a 6-char alphanumeric room code ---
export function generateRoomCode() {
	return Math.random()
		.toString(36)
		.substring(2, 8)
		.toUpperCase();
}

/**
 * Scrolls a ref to the bottom (used for chat windows)
 */
export function scrollToBottom(
	ref: React.RefObject<HTMLElement | null>
) {
	if (ref.current) {
		ref.current.scrollIntoView({ behavior: 'smooth' });
	}
}

/**
 * Creates a chat message object with consistent fields
 * @param senderId - sender's user id
 * @param content - message content
 * @param type - message type (text, emoji, quickfire, etc.)
 * @param extra - any extra fields (e.g., groupId, receiverId)
 */
export function createChatMessage({
	senderId,
	content,
	type = 'text',
	extra = {},
}: {
	senderId: string;
	content: string;
	type?: string;
	extra?: Record<string, any>;
}) {
	return {
		id: Math.random().toString(36).slice(2),
		senderId,
		message: content,
		type,
		sentAt: new Date().toISOString(),
		expiresAt: '', // Always include for FriendMessage compatibility
		...extra,
	};
}

/**
 * Stub profanity filter (replace with context-aware version if available)
 */
export function filterProfanityStub(text: string) {
	return text; // No-op by default
}

// --- UI Section Toggle Helper ---
/**
 * Toggles a boolean key in an expanded/collapsed section state object.
 * Useful for expandable/collapsible UI sections (e.g., FriendsSidebar, accordions).
 * @param prev - previous expanded state object
 * @param key - key to toggle
 * @returns new expanded state object
 */
export function toggleSectionState<T extends string>(
	prev: Record<T, boolean>,
	key: T
): Record<T, boolean> {
	return { ...prev, [key]: !prev[key] };
}

// --- Matchmaking Timeout Helper ---
/**
 * Sets a matchmaking timeout and returns the timeout ID. Used for VS matchmaking fallback.
 * @param onTimeout - callback to run on timeout
 * @param ms - timeout in milliseconds (default 15000)
 * @returns timeout ID
 */
export function setMatchmakingTimeout(
	onTimeout: () => void,
	ms = 15000
): NodeJS.Timeout {
	return setTimeout(onTimeout, ms);
}

// --- Redux Action Wrappers (for challenge/remove) ---
/**
 * Returns a callback that dispatches a challenge action for a friend ID.
 * Used in FriendsSidebar and other friend-related UIs.
 */
export function makeChallengeHandler(
	dispatch: any,
	sendChallenge: any
) {
	return (id: string) => dispatch(sendChallenge(id));
}

/**
 * Returns a callback that dispatches a remove action for a friend ID.
 * Used in FriendsSidebar and other friend-related UIs.
 */
export function makeRemoveHandler(
	dispatch: any,
	removeFriend: any
) {
	return (id: string) => dispatch(removeFriend(id));
}
