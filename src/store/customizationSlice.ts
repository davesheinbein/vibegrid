import {
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';

export interface CustomizationItem {
	id: string;
	type: 'theme' | 'emoji' | 'font';
	name: string;
	equipped: boolean;
}

const initialState = {
	themes: [
		{
			id: 'theme1',
			type: 'theme',
			name: 'Light',
			equipped: true,
		},
		{
			id: 'theme2',
			type: 'theme',
			name: 'Dark',
			equipped: false,
		},
		{
			id: 'theme3',
			type: 'theme',
			name: 'Oceanic',
			equipped: false,
		},
		{
			id: 'theme4',
			type: 'theme',
			name: 'Sunset',
			equipped: false,
		},
	],
	emoji: [
		{
			id: 'emoji1',
			type: 'emoji',
			name: 'Party',
			equipped: true,
		},
		{
			id: 'emoji2',
			type: 'emoji',
			name: 'Happy',
			equipped: false,
		},
		{
			id: 'emoji3',
			type: 'emoji',
			name: 'Sad',
			equipped: false,
		},
	],
	font: [
		{
			id: 'font1',
			type: 'font',
			name: 'Helvetica',
			equipped: false,
		},
		{
			id: 'font2',
			type: 'font',
			name: 'Comic Sans',
			equipped: false,
		},
		{
			id: 'font3',
			type: 'font',
			name: 'Futura',
			equipped: false,
		},
		{
			id: 'font4',
			type: 'font',
			name: 'Avenir',
			equipped: false,
		},
		{
			id: 'font5',
			type: 'font',
			name: 'Gotham',
			equipped: false,
		},
		{
			id: 'font6',
			type: 'font',
			name: 'Roboto',
			equipped: false,
		},
	],
	borders: [
		// Add border items here
	],
	background: [
		// Add background items here
	],
	misc: [
		// Add misc items here
	],
};

const customizationSlice = createSlice({
	name: 'customization',
	initialState,
	reducers: {
		equipItem: (state, action: PayloadAction<string>) => {
			const itemId = action.payload;
			// Find the category and index of the item
			let foundCategory: keyof typeof state | null = null;
			let foundIndex = -1;
			for (const category of Object.keys(state) as Array<
				keyof typeof state
			>) {
				const idx = state[category].findIndex(
					(item: any) => item.id === itemId
				);
				if (idx !== -1) {
					foundCategory = category;
					foundIndex = idx;
					break;
				}
			}
			if (!foundCategory || foundIndex === -1) return;
			// Unequip all in the same category
			state[foundCategory].forEach((item: any) => {
				item.equipped = false;
			});
			// Equip the selected item
			state[foundCategory][foundIndex].equipped = true;
		},
	},
});

export const { equipItem } = customizationSlice.actions;
export default customizationSlice.reducer;
