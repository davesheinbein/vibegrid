import {
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';

export interface BrowsingState {
	puzzles: any[];
	selectedPuzzleId: string | null;
	filters: Record<string, any>;
	loading: boolean;
}

const initialState: BrowsingState = {
	puzzles: [],
	selectedPuzzleId: null,
	filters: {},
	loading: false,
};

const browsingSlice = createSlice({
	name: 'browsing',
	initialState,
	reducers: {
		setPuzzles(state, action: PayloadAction<any[]>) {
			state.puzzles = action.payload;
		},
		setSelectedPuzzleId(
			state,
			action: PayloadAction<string | null>
		) {
			state.selectedPuzzleId = action.payload;
		},
		setFilters(
			state,
			action: PayloadAction<Record<string, any>>
		) {
			state.filters = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		// ...other reducers as needed
	},
});

export const {
	setPuzzles,
	setSelectedPuzzleId,
	setFilters,
	setLoading,
} = browsingSlice.actions;
export default browsingSlice.reducer;
