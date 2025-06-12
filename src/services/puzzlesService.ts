import axios from 'axios';
import { Puzzle } from '../types/api';

export const fetchPuzzles = async (): Promise<Puzzle[]> => {
	const res = await axios.get('/api/puzzles');
	return res.data;
};

export const approvePuzzle = async (
	puzzleId: string
): Promise<void> => {
	await axios.post('/api/admin/approve-puzzle', {
		puzzleId,
	});
};

export const deletePuzzle = async (
	puzzleId: string
): Promise<void> => {
	await axios.delete(`/api/puzzles/${puzzleId}`);
};

export const createPuzzle = async (
	puzzle: any
): Promise<any> => {
	const res = await axios.post('/api/puzzles', puzzle);
	return res.data;
};
