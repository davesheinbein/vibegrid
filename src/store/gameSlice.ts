import {
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';

export interface GameState {
	selectedWords: string[];
	lockedWords: string[];
	feedback: string[];
	attempts: number;
	solvedGroups: { groupIdx: number; words: string[] }[];
	currentGroup: string[];
	isSolved: boolean;
	// Add more as needed
}

const initialState: GameState = {
	selectedWords: [],
	lockedWords: [],
	feedback: [],
	attempts: 0,
	solvedGroups: [],
	currentGroup: [],
	isSolved: false,
};

const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setSelectedWords(
			state,
			action: PayloadAction<string[]>
		) {
			state.selectedWords = action.payload;
		},
		setLockedWords(state, action: PayloadAction<string[]>) {
			state.lockedWords = action.payload;
		},
		setFeedback(state, action: PayloadAction<string[]>) {
			state.feedback = action.payload;
		},
		setAttempts(state, action: PayloadAction<number>) {
			state.attempts = action.payload;
		},
		setSolvedGroups(
			state,
			action: PayloadAction<
				{ groupIdx: number; words: string[] }[]
			>
		) {
			state.solvedGroups = action.payload;
		},
		setCurrentGroup(
			state,
			action: PayloadAction<string[]>
		) {
			state.currentGroup = action.payload;
		},
		setIsSolved(state, action: PayloadAction<boolean>) {
			state.isSolved = action.payload;
		},
		// ...other reducers as needed
	},
});

export const {
	setSelectedWords,
	setLockedWords,
	setFeedback,
	setAttempts,
	setSolvedGroups,
	setCurrentGroup,
	setIsSolved,
} = gameSlice.actions;
export default gameSlice.reducer;
