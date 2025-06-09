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

const initialState: CustomizationItem[] = [
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
		id: 'font5',
		type: 'font',
		name: 'Roboto',
		equipped: false,
	},
];

const customizationSlice = createSlice({
	name: 'customization',
	initialState,
	reducers: {
		equipItem: (state, action: PayloadAction<string>) => {
			const itemId = action.payload;
			const itemToEquip = state.find(
				(item) => item.id === itemId
			);
			if (!itemToEquip) return;
			// Unequip all of the same type
			state.forEach((item) => {
				if (item.type === itemToEquip.type)
					item.equipped = false;
			});
			itemToEquip.equipped = true;
		},
	},
});

export const { equipItem } = customizationSlice.actions;
export default customizationSlice.reducer;
