import {
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

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

const initialState: CustomizationState = {
	themes: [
		{
			id: 'neon-pulse',
			name: 'Neon Pulse',
			label: 'Neon Pulse',
			equipped: false,
			color: '#FF00FF',
			bg: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
			font: '#fff',
			swatchType: 'gradient',
			description: 'Futuristic cyber neon',
		},
		{
			id: 'pastel-bloom',
			name: 'Pastel Bloom',
			label: 'Pastel Bloom',
			equipped: false,
			color: '#FFDFE3',
			bg: 'linear-gradient(135deg, #FFDFE3 0%, #B3E5FC 100%)',
			font: '#222',
			swatchType: 'gradient',
			description: 'Soft pastel candy tones',
		},
		{
			id: 'synthwave-grid',
			name: 'Synthwave Grid',
			label: 'Synthwave Grid',
			equipped: false,
			color: '#FF7ED4',
			bg: 'linear-gradient(135deg, #FF7ED4 0%, #6C5CE7 100%)',
			font: '#fff',
			swatchType: 'gradient',
			description: 'Retro 80s arcade',
		},
		{
			id: 'noir-void',
			name: 'Noir Void',
			label: 'Noir Void',
			equipped: false,
			color: '#121212',
			bg: '#121212',
			font: '#F5F5F5',
			swatchType: 'solid',
			description: 'Monochrome chic',
		},
		{
			id: 'sunset-fade',
			name: 'Sunset Fade',
			label: 'Sunset Fade',
			equipped: false,
			color: '#FF5F6D',
			bg: 'linear-gradient(135deg, #FF5F6D 0%, #FFE29F 100%)',
			font: '#222',
			swatchType: 'gradient',
			description: 'Warm sunset gradient',
		},
		{
			id: 'emerald-circuit',
			name: 'Emerald Circuit',
			label: 'Emerald Circuit',
			equipped: false,
			color: '#00FF7F',
			bg: 'linear-gradient(135deg, #00FF7F 0%, #003300 100%)',
			font: '#fff',
			swatchType: 'gradient',
			description: 'Hacker green tones',
		},
		{
			id: 'aurora-dream',
			name: 'Aurora Dream',
			label: 'Aurora Dream',
			equipped: false,
			color: '#9F79EE',
			bg: 'linear-gradient(135deg, #9F79EE 0%, #F8F8FF 100%)',
			font: '#222',
			swatchType: 'gradient',
			description: 'Ethereal blues/purples',
		},
		{
			id: 'cyber-nova',
			name: 'Cyber Nova',
			label: 'Cyber Nova',
			equipped: false,
			color: '#FFD93D',
			bg: 'linear-gradient(135deg, #FFD93D 0%, #00F0FF 100%)',
			font: '#222',
			swatchType: 'gradient',
			description: 'High-contrast alien-core',
		},
		{
			id: 'ghostlight-mist',
			name: 'Ghostlight Mist',
			label: 'Ghostlight Mist',
			equipped: false,
			color: '#B7C4CF',
			bg: 'linear-gradient(135deg, #B7C4CF 0%, #1C2541 100%)',
			font: '#fff',
			swatchType: 'gradient',
			description: 'Foggy blues and greys',
		},
		{
			id: 'solar-flare',
			name: 'Solar Flare',
			label: 'Solar Flare',
			equipped: false,
			color: '#FFA41B',
			bg: 'linear-gradient(135deg, #FFA41B 0%, #FF5154 100%)',
			font: '#fff',
			swatchType: 'gradient',
			description: 'Vibrant oranges and reds',
		},
		{
			id: 'voidwave',
			name: 'Voidwave',
			label: 'Voidwave',
			equipped: false,
			color: '#1E1E2F',
			bg: 'linear-gradient(135deg, #1E1E2F 0%, #ABFFE0 100%)',
			font: '#ABFFE0',
			swatchType: 'gradient',
			description: 'Ultra dark with cyan',
		},
		{
			id: 'velvet-eclipse',
			name: 'Velvet Eclipse',
			label: 'Velvet Eclipse',
			equipped: false,
			color: '#370617',
			bg: 'linear-gradient(135deg, #370617 0%, #AB83A1 100%)',
			font: '#fff',
			swatchType: 'gradient',
			description: 'Deep moody purples',
		},
		{
			id: 'chill-breeze',
			name: 'Chill Breeze',
			label: 'Chill Breeze',
			equipped: false,
			color: '#E0F7FA',
			bg: 'linear-gradient(135deg, #E0F7FA 0%, #00796B 100%)',
			font: '#222',
			swatchType: 'gradient',
			description: 'Calm ocean air palette',
		},
		{
			id: 'bubblegum-pop',
			name: 'Bubblegum Pop',
			label: 'Bubblegum Pop',
			equipped: false,
			color: '#FF6F91',
			bg: 'linear-gradient(135deg, #FF6F91 0%, #FFCCF9 100%)',
			font: '#222',
			swatchType: 'gradient',
			description: 'Playful pink + teal',
		},
		{
			id: 'pixel-kingdom',
			name: 'Pixel Kingdom',
			label: 'Pixel Kingdom',
			equipped: false,
			color: '#A8E6CF',
			bg: 'linear-gradient(135deg, #A8E6CF 0%, #FF8C94 100%)',
			font: '#222',
			swatchType: 'gradient',
			description: 'Gameboy pastel grid',
		},
		{
			id: 'space-milkshake',
			name: 'Space Milkshake',
			label: 'Space Milkshake',
			equipped: false,
			color: '#6E44FF',
			bg: 'linear-gradient(135deg, #6E44FF 0%, #A6FFCB 100%)',
			font: '#fff',
			swatchType: 'gradient',
			description: 'Cosmic, dreamy violet/green',
		},
		{
			id: 'minimal-light',
			name: 'Minimal Light',
			label: 'Minimal Light',
			equipped: true,
			color: '#FFFFFF',
			bg: '#FFFFFF',
			font: '#222222',
			swatchType: 'solid',
			description: 'Clean, uncluttered, modern.',
		},
	],
	emote: [
		{
			id: 'fire',
			name: 'Fire',
			description: 'Drop a 🔥 when you’re vibing.',
			equipped: true,
			type: 'emoji',
		},
		{
			id: 'clap',
			name: 'Clap',
			description: 'Applaud a great solve 👏.',
			equipped: false,
			type: 'emoji',
		},
		{
			id: 'eyes',
			name: 'Eyes',
			description: '👀 Spot something sneaky?',
			equipped: false,
			type: 'emoji',
		},
		{
			id: 'skull',
			name: 'Skull',
			description: 'When a guess is *dead wrong* 💀.',
			equipped: false,
			type: 'emoji',
		},
		{
			id: '100',
			name: 'Hundred',
			description: 'That was 100% clean 💯.',
			equipped: false,
			type: 'emoji',
		},
		{
			id: 'laugh',
			name: 'Laugh',
			description: 'Absolute comedy moment 😂.',
			equipped: false,
			type: 'emoji',
		},
		{
			id: 'mindblown',
			name: 'Mind Blown',
			description: 'When a move is galaxy brain 🤯.',
			equipped: false,
			type: 'emoji',
		},
		{
			id: 'vibes',
			name: 'Vibe Check',
			description: 'The vibes are immaculate ✨.',
			equipped: false,
			type: 'emoji',
		},
		{
			id: 'trophy',
			name: 'Trophy',
			description: 'Win secured 🏆.',
			equipped: false,
			type: 'emoji',
		},
		{
			id: 'shrug',
			name: 'Shrug',
			description: '¯\\_(ツ)_/¯ when you guess wildly.',
			equipped: false,
			type: 'emoji',
		},
	],
	font: [
		{
			id: 'arcade-bold',
			name: 'Arcade Bold',
			description: 'Pixel Bold: Retro arcade style',
			equipped: true,
			style: 'font-family: "Press Start 2P", monospace;',
		},
		{
			id: 'serif-classic',
			name: 'Serif Classic',
			description: 'Serif Elegant: Newspaper header',
			equipped: false,
			style: 'font-family: "Merriweather", serif;',
		},
		{
			id: 'clean-sans',
			name: 'Clean Sans',
			description: 'Modern Sans: Rounded, minimalist',
			equipped: false,
			style: 'font-family: "Inter", sans-serif;',
		},
		{
			id: 'groovy-script',
			name: 'Groovy Script',
			description: '70s Script: Flowing retro',
			equipped: false,
			style: 'font-family: "Pacifico", cursive;',
		},
		{
			id: 'cyber-mono',
			name: 'Cyber Mono',
			description: 'Monospaced: Terminal text',
			equipped: false,
			style: 'font-family: "Fira Mono", monospace;',
		},
		{
			id: 'vapor-display',
			name: 'Vapor Display',
			description: 'Display Futuristic: Large uppercase',
			equipped: false,
			style: 'font-family: "Orbitron", sans-serif;',
		},
		{
			id: 'dyslexic-friendly',
			name: 'Dyslexic Friendly',
			description:
				'Accessibility Sans: OpenDyslexic or similar',
			equipped: false,
			style:
				'font-family: "OpenDyslexic", Arial, sans-serif;',
		},
		{
			id: 'rounded-bubble',
			name: 'Rounded Bubble',
			description: 'Sans Rounded: Friendly UI type',
			equipped: false,
			style: 'font-family: "Quicksand", sans-serif;',
		},
		{
			id: 'elegant-narrow',
			name: 'Elegant Narrow',
			description: 'Condensed Serif: Classy and sleek',
			equipped: false,
			style: 'font-family: "Playfair Display", serif;',
		},
		{
			id: 'minimal-thin',
			name: 'Minimal Thin',
			description: 'Ultra-light Sans: Airy and spacious',
			equipped: false,
			style:
				'font-family: "Montserrat", sans-serif; font-weight: 200;',
		},
	],
	borders: [
		{
			id: 'clean-edge',
			name: 'Clean Edge',
			description: '1px solid low-opacity: Subtle, flat',
			equipped: true,
			style: 'solid',
		},
		{
			id: 'glow-pulse',
			name: 'Glow Pulse',
			description: 'Animated outer glow: Neon pulse',
			equipped: false,
			style: 'glow',
		},
		{
			id: 'gradient-sweep',
			name: 'Gradient Sweep',
			description:
				'Linear animated gradient: Shifting colors',
			equipped: false,
			style: 'gradient',
		},
		{
			id: 'pixel-frame',
			name: 'Pixel Frame',
			description: '4px pixel corners: 8-bit retro',
			equipped: false,
			style: 'pixel',
		},
		{
			id: 'static-flicker',
			name: 'Static Flicker',
			description: 'Glitch flicker: Occasional color jumps',
			equipped: false,
			style: 'flicker',
		},
		{
			id: 'holo-outline',
			name: 'Holo Outline',
			description:
				'Iridescent border: Light spectrum shimmer',
			equipped: false,
			style: 'holo',
		},
		{
			id: 'double-ring',
			name: 'Double Ring',
			description:
				'Inner and outer rings: Framed UI pieces',
			equipped: false,
			style: 'double',
		},
		{
			id: 'fuzzy-soft-edge',
			name: 'Fuzzy Soft Edge',
			description: 'Light blur border: Dreamy, soft glow',
			equipped: false,
			style: 'fuzzy',
		},
		{
			id: 'dash-stroke',
			name: 'Dash Stroke',
			description: 'Dashed line: Hand-drawn effect',
			equipped: false,
			style: 'dashed',
		},
		{
			id: 'shadow-drop',
			name: 'Shadow Drop',
			description:
				'Simple shadow frame: Elevated, card-like',
			equipped: false,
			style: 'shadow',
		},
	],
	background: [
		{
			id: 'gradient-horizon',
			name: 'Gradient Horizon',
			description: 'Animated Gradient: Sunrise hues',
			equipped: true,
			type: 'animated',
			bg: 'linear-gradient(270deg, #FFDEE9 0%, #B5FFFC 100%)',
		},
		{
			id: 'starfield-nebula',
			name: 'Starfield Nebula',
			description: 'Static Image: Pastel space fog',
			equipped: false,
			type: 'image',
			bg: 'url(/images/starfield-nebula.jpg)',
		},
		{
			id: 'retro-grid-floor',
			name: 'Retro Grid Floor',
			description: 'CSS Grid Animation: Neon pink and blue',
			equipped: false,
			type: 'animated',
			bg: 'linear-gradient(135deg, #FF7ED4 0%, #6C5CE7 100%)',
		},
		{
			id: 'glass-frost',
			name: 'Glass Frost',
			description: 'Glassmorphism: White and blur',
			equipped: false,
			type: 'glass',
			bg: 'rgba(255,255,255,0.7)',
		},
		{
			id: 'dark-waves',
			name: 'Dark Waves',
			description: 'Animated Waves: Deep blue gradients',
			equipped: false,
			type: 'animated',
			bg: 'linear-gradient(135deg, #1C2541 0%, #274690 100%)',
		},
		{
			id: 'aurora-curtains',
			name: 'Aurora Curtains',
			description: 'Shifting Gradient: Blue/green bands',
			equipped: false,
			type: 'animated',
			bg: 'linear-gradient(135deg, #9F79EE 0%, #00FF7F 100%)',
		},
		{
			id: 'paper-texture',
			name: 'Paper Texture',
			description: 'Light Beige Static: Warm natural',
			equipped: false,
			type: 'static',
			bg: '#F8F8FF',
		},
		{
			id: 'seasonal-spooky-night',
			name: 'Seasonal: Spooky Night',
			description: 'Static Image: Purple dusk with bats',
			equipped: false,
			type: 'image',
			bg: 'url(/images/spooky-night.jpg)',
		},
		{
			id: 'void-core',
			name: 'Void Core',
			description: 'Solid Black: Pure darkness',
			equipped: false,
			type: 'solid',
			bg: '#000',
		},
		{
			id: 'pastel-daydream',
			name: 'Pastel Daydream',
			description: 'Subtle Gradient: Soft pink-blue',
			equipped: false,
			type: 'gradient',
			bg: 'linear-gradient(135deg, #FFDFE3 0%, #B3E5FC 100%)',
		},
		{
			id: 'minimal-white',
			name: 'Minimal White',
			description: 'Flat: Crisp clean white',
			equipped: false,
			type: 'solid',
			bg: '#fff',
		},
		{
			id: 'pixel-plains',
			name: 'Pixel Plains',
			description: '8-bit landscape: Game-inspired',
			equipped: false,
			type: 'image',
			bg: 'url(/images/pixel-plains.png)',
		},
	],
};

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
			state[category] = state[category].map((item) => ({
				...item,
				equipped: item.id === id,
			}));
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
		? state.themes.find((t) => t.equipped)
		: undefined;

export const selectEquippedFont = (
	state: CustomizationState | any
) =>
	state && Array.isArray(state.font)
		? state.font.find((f) => f.equipped)
		: undefined;
export const selectEquippedBorder = (
	state: CustomizationState
) => state.borders.find((b) => b.equipped);
export const selectEquippedBackground = (
	state: CustomizationState
) => state.background.find((b) => b.equipped);
export const selectEquippedEmote = (
	state: CustomizationState
) => state.emote.find((e) => e.equipped);

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
