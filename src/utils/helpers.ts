// Helper and utility functions for VibeGrid
// Place shared logic, formatting, and data manipulation helpers here.

// Example: Fisher-Yates shuffle (move from App.tsx)
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

// Add more helpers as needed...
