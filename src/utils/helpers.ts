// Load daily puzzles from JSON
import dailyPuzzlesJson from '../data/dailyPuzzles.json';

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

// Helper: Get all unique words from groups and wildcards
export function getAllWordsFromGroupsAndWildcards(
	groups: string[][],
	wildcards: string[]
): string[] {
	const groupWords = groups.flat();
	const allWords = [...groupWords, ...(wildcards || [])];
	return Array.from(new Set(allWords));
}

// --- Helper: Parse groups from text ---
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

// --- Helper: Parse groups from array of group input strings ---
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

// --- Helper: Flatten groups to unique word list ---
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

// --- Helper: Build groups from word list (for sync) ---
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

// --- Helper: Capitalize first letter of each word ---
export function capitalizeWords(str: string): string {
	return str.replace(
		/\b\w+/g,
		(w) =>
			w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
	);
}

// --- Share helpers ---
export function getShareUrl(): string {
	return 'https://vibegrid.app';
}

export function getShareTitle(): string {
	return "VibeGrid: Can you solve today's grid?";
}

export function getShareText(): string {
	return 'Check out my VibeGrid result!';
}

// --- Clipboard helper ---
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
