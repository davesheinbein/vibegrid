import {
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

// Import customization data from JSON
import customizationsData from '../data/customizations.json';

export interface ThemeItem {
	id: string;
	name: string;
	label: string;
	equipped: boolean;
	color: string;
	bg: string;
	font: string;
	swatchType: 'solid' | 'gradient';
	description: string;
}

export interface EmoteItem {
	id: string;
	name: string;
	description: string;
	equipped: boolean;
	type: 'static' | 'animated' | 'text' | 'mixed';
}

export interface FontItem {
	id: string;
	name: string;
	description: string;
	equipped: boolean;
	style: string;
}

export interface BorderItem {
	id: string;
	name: string;
	description: string;
	equipped: boolean;
	style: string;
}

export interface BackgroundItem {
	id: string;
	name: string;
	description: string;
	equipped: boolean;
	type: 'solid' | 'gradient' | 'image' | 'animated';
	bg: string;
}

export interface CustomizationState {
	themes: ThemeItem[];
	emote: EmoteItem[];
	font: FontItem[];
	borders: BorderItem[];
	background: BackgroundItem[];
}

// Use imported JSON data as initial state
const initialState: CustomizationState =
	customizationsData as CustomizationState;

const customizationSlice = createSlice({
	name: 'customization',
	initialState,
	reducers: {
		equipItem: (
			state,
			action: PayloadAction<{
				id: string;
				category: keyof CustomizationState;
			}>
		) => {
			const { id, category } = action.payload;
			switch (category) {
				case 'themes':
					state.themes = state.themes.map((item) => ({
						...item,
						equipped: item.id === id,
					}));
					break;
				case 'emote':
					state.emote = state.emote.map((item) => ({
						...item,
						equipped: item.id === id,
					}));
					break;
				case 'font':
					state.font = state.font.map((item) => ({
						...item,
						equipped: item.id === id,
					}));
					break;
				case 'borders':
					state.borders = state.borders.map((item) => ({
						...item,
						equipped: item.id === id,
					}));
					break;
				case 'background':
					state.background = state.background.map(
						(item) => ({
							...item,
							equipped: item.id === id,
						})
					);
					break;
				default:
					break;
			}
		},
		// Optionally add setInventory to load items from backend
		setInventory: (
			state,
			action: PayloadAction<Partial<CustomizationState>>
		) => {
			Object.assign(state, action.payload);
		},
	},
});

// Selector helpers
export const selectEquippedTheme = (
	state: CustomizationState | any
) =>
	state && Array.isArray(state.themes)
		? state.themes.find((t: ThemeItem) => t.equipped)
		: undefined;

export const selectEquippedFont = (
	state: CustomizationState | any
) =>
	state && Array.isArray(state.font)
		? state.font.find((f: FontItem) => f.equipped)
		: undefined;
export const selectEquippedBorder = (
	state: CustomizationState
) => state.borders.find((b: BorderItem) => b.equipped);
export const selectEquippedBackground = (
	state: CustomizationState
) =>
	state.background.find((b: BackgroundItem) => b.equipped);
export const selectEquippedEmote = (
	state: CustomizationState
) => state.emote.find((e: EmoteItem) => e.equipped);

// Selector for the active theme's palette (for ThemePaletteProvider)
export const selectActivePalette = createSelector(
	[selectEquippedTheme],
	(equipped) => {
		if (!equipped)
			return {
				primary: '#2563eb',
				secondary: '#ef4444',
				accent: '#8000FF',
				background: '#fff',
				text: '#222',
			};
		return {
			primary: equipped.color || '#2563eb',
			secondary: '#ef4444',
			accent: '#8000FF',
			background: equipped.bg || '#fff',
			text: equipped.font || '#222',
		};
	}
);

export const { equipItem, setInventory } =
	customizationSlice.actions;
export default customizationSlice.reducer;
