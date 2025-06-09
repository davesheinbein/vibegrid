// Centralized daily puzzle completion logic
// This module provides helpers to check, set, and retrieve daily puzzle completion status for the current user/date.
// Storage: localStorage (for demo; replace with backend API for real users)

const COMPLETION_KEY = 'dailyPuzzleCompletion';

export interface DailyCompletionRecord {
	date: string; // e.g. '09/06/2025'
	result: {
		win: boolean;
		score: number;
		attemptsLeft: number;
		burnBonus: number;
		finishTime: number; // seconds
		timestamp: number; // ms since epoch
	};
}

export function getTodayDateString(): string {
	const now = new Date();
	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const year = now.getFullYear();
	return `${day}/${month}/${year}`;
}

export function getDailyCompletion(): DailyCompletionRecord | null {
	if (typeof window === 'undefined') return null;
	const raw = localStorage.getItem(COMPLETION_KEY);
	if (!raw) return null;
	try {
		const data = JSON.parse(raw);
		if (data && data.date === getTodayDateString()) {
			return data;
		}
		return null;
	} catch {
		return null;
	}
}

export function setDailyCompletion(
	result: DailyCompletionRecord['result']
) {
	if (typeof window === 'undefined') return;
	const record: DailyCompletionRecord = {
		date: getTodayDateString(),
		result,
	};
	console.log('🚀 ~ record:', record);
	localStorage.setItem(
		COMPLETION_KEY,
		JSON.stringify(record)
	);
}

export function clearDailyCompletion() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(COMPLETION_KEY);
}

// --- Persistent Daily Puzzle Progress ---
const PROGRESS_KEY = 'dailyPuzzleProgress';

export interface DailyPuzzleProgress {
	puzzleDate: string; // 'YYYY-MM-DD'
	createdAt: string; // ISO string
	matchedGroups: string[][];
	remainingAttempts: number;
	burnedWords: string[];
	elapsedTime: number; // seconds
	completed: boolean;
	burnBonus?: number;
	// Add more fields as needed (e.g., streaks, bonuses)
}

export function saveDailyPuzzleProgress(
	progress: DailyPuzzleProgress
) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(
		PROGRESS_KEY,
		JSON.stringify(progress)
	);
}

export function getDailyPuzzleProgress(): DailyPuzzleProgress | null {
	if (typeof window === 'undefined') return null;
	const raw = localStorage.getItem(PROGRESS_KEY);
	if (!raw) return null;
	try {
		const data = JSON.parse(raw);
		// Check 7-day expiry
		if (data.createdAt) {
			const created = new Date(data.createdAt);
			const now = new Date();
			if (
				(now.getTime() - created.getTime()) /
					(1000 * 60 * 60 * 24) >
				7
			) {
				localStorage.removeItem(PROGRESS_KEY);
				return null;
			}
		}
		return data;
	} catch {
		return null;
	}
}

export function clearDailyPuzzleProgress() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(PROGRESS_KEY);
}
