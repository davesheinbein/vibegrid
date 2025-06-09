// VS Mode Bot Utility for Grid Royale
// Supports: easy, medium, hard, legendary

export type BotDifficulty =
	| 'easy'
	| 'medium'
	| 'hard'
	| 'legendary';

export interface PuzzleState {
	words: string[];
	groups: string[][]; // Solution groups
	guesses: string[][]; // Previous guesses
	solvedGroups: string[][];
	wildcards: string[];
	attemptsLeft: number;
	// Add more as needed
}

export interface BotMove {
	guess: string[]; // The group of words to guess
	burn?: boolean; // Whether to burn a wildcard
}

// --- Bot Logic for Each Difficulty ---

function getRandomElements<T>(arr: T[], n: number): T[] {
	const shuffled = arr
		.slice()
		.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
}

function easyBot(state: PuzzleState): BotMove {
	// Random guess, frequent mistakes, random burns
	const guess = getRandomElements(state.words, 4);
	const burn =
		Math.random() < 0.3 && state.wildcards.length > 0;
	return { guess, burn };
}

function mediumBot(state: PuzzleState): BotMove {
	// Some logic: try to avoid obvious repeats, but still makes mistakes
	const usedWords = new Set(state.solvedGroups.flat());
	const available = state.words.filter(
		(w) => !usedWords.has(w)
	);
	let guess: string[];
	if (Math.random() < 0.7) {
		// Try to group by similarity (naive: first 4 unused)
		guess = available.slice(0, 4);
	} else {
		// Random guess
		guess = getRandomElements(available, 4);
	}
	const burn =
		Math.random() < 0.15 && state.wildcards.length > 0;
	return { guess, burn };
}

function hardBot(state: PuzzleState): BotMove {
	// Pattern detection: try to find a real group, rare mistakes
	const usedWords = new Set(state.solvedGroups.flat());
	for (const group of state.groups) {
		if (group.every((w) => !usedWords.has(w))) {
			// Try to guess a real group
			return { guess: group, burn: false };
		}
	}
	// If no group found, rare random guess
	const guess = getRandomElements(
		state.words.filter((w) => !usedWords.has(w)),
		4
	);
	const burn =
		Math.random() < 0.05 && state.wildcards.length > 0;
	return { guess, burn };
}

function legendaryBot(state: PuzzleState): BotMove {
	// Near-perfect logic: always finds a real group if possible
	const usedWords = new Set(state.solvedGroups.flat());
	for (const group of state.groups) {
		if (group.every((w) => !usedWords.has(w))) {
			return { guess: group, burn: false };
		}
	}
	// If no group left, burn only if wildcards exist
	if (state.wildcards.length > 0) {
		return { guess: [], burn: true };
	}
	// Otherwise, random guess as fallback
	return {
		guess: getRandomElements(
			state.words.filter((w) => !usedWords.has(w)),
			4
		),
		burn: false,
	};
}

export function getBotMove(
	difficulty: BotDifficulty,
	state: PuzzleState
): BotMove {
	switch (difficulty) {
		case 'easy':
			return easyBot(state);
		case 'medium':
			return mediumBot(state);
		case 'hard':
			return hardBot(state);
		case 'legendary':
			return legendaryBot(state);
		default:
			return easyBot(state);
	}
}

/**
 * Simulates the bot playing the puzzle to completion, returning its solved groups, attempts left, and time taken.
 * Used in VSBotGame.tsx for bot progress display.
 */
export async function runVSBot(
	puzzle: {
		groups: string[][];
		wildcards?: string[];
		words?: string[];
	},
	difficulty: BotDifficulty
): Promise<{
	solvedGroups: string[][];
	attemptsLeft: number;
	timeMs: number;
}> {
	// Generate words array if not present
	const words =
		puzzle.words && Array.isArray(puzzle.words)
			? [...puzzle.words]
			: [
					...(puzzle.groups ? puzzle.groups.flat() : []),
					...(puzzle.wildcards || []),
			  ];
	const state: PuzzleState = {
		words,
		groups: puzzle.groups,
		guesses: [],
		solvedGroups: [],
		wildcards: [...(puzzle.wildcards || [])],
		attemptsLeft: 4,
	};
	const solvedGroups: string[][] = [];
	let attemptsLeft = 4;
	const start = Date.now();
	while (
		solvedGroups.length < puzzle.groups.length &&
		attemptsLeft > 0
	) {
		const move = getBotMove(difficulty, {
			...state,
			solvedGroups,
			attemptsLeft,
		});
		if (move.guess.length === 0 && move.burn) {
			// Burn a wildcard if available
			if (state.wildcards.length > 0) {
				state.wildcards.pop();
			}
			attemptsLeft--;
			continue;
		}
		const groupMatch = puzzle.groups.find((group) =>
			move.guess.every((word) => group.includes(word))
		);
		if (
			groupMatch &&
			!solvedGroups.some((g) =>
				g.every((word) => groupMatch.includes(word))
			)
		) {
			solvedGroups.push(groupMatch);
			// Remove solved words from available words
			state.words = state.words.filter(
				(w) => !groupMatch.includes(w)
			);
		} else {
			attemptsLeft--;
		}
		state.guesses.push(move.guess);
	}
	const timeMs = Date.now() - start;
	return {
		solvedGroups,
		attemptsLeft,
		timeMs,
	};
}
