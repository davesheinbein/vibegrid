// Load daily puzzles from JSON
import dailyPuzzlesJson from './dailyPuzzles.json';

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
