import {
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';

export interface Achievement {
	id: string;
	name: string;
	description: string;
	unlocked: boolean;
	unlockedAt?: string;
}

export interface AchievementsState {
	achievements: Achievement[];
}

const initialState: AchievementsState = {
	achievements: [],
};

const achievementsSlice = createSlice({
	name: 'achievements',
	initialState,
	reducers: {
		setAchievements(
			state,
			action: PayloadAction<Achievement[]>
		) {
			state.achievements = action.payload;
		},
		unlockAchievement(
			state,
			action: PayloadAction<string>
		) {
			const achievement = state.achievements.find(
				(a) => a.id === action.payload
			);
			if (achievement) {
				achievement.unlocked = true;
				achievement.unlockedAt = new Date().toISOString();
			}
		},
		// ...other reducers as needed
	},
});

export const { setAchievements, unlockAchievement } =
	achievementsSlice.actions;
export default achievementsSlice.reducer;
