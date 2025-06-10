import React, { useState } from 'react';

export interface UserSettings {
	chatEnabled: boolean;
	profanityFilter: boolean;
	notificationsEnabled: boolean;
	theme?: string; // theme name
	vsModeCustom?: {
		playerColor?: string;
		enemyColor?: string;
		playerBg?: string;
		enemyBg?: string;
		boardBg?: string;
		font?: string;
		border?: string;
		// Add emoji, font, etc. as needed
	};
}

const defaultSettings: UserSettings = {
	chatEnabled: true,
	profanityFilter: true,
	notificationsEnabled: true,
};

export const UserSettingsContext = React.createContext<{
	settings: UserSettings;
	setSettings: (s: UserSettings) => void;
}>({
	settings: defaultSettings,
	setSettings: () => {},
});

export const UserSettingsProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [settings, setSettings] = useState<UserSettings>(
		() => {
			if (typeof window !== 'undefined') {
				const saved = localStorage.getItem('userSettings');
				if (saved) return JSON.parse(saved);
			}
			return defaultSettings;
		}
	);

	const updateSettings = (s: UserSettings) => {
		setSettings(s);
		if (typeof window !== 'undefined') {
			localStorage.setItem(
				'userSettings',
				JSON.stringify(s)
			);
		}
	};

	return (
		<UserSettingsContext.Provider
			value={{ settings, setSettings: updateSettings }}
		>
			{children}
		</UserSettingsContext.Provider>
	);
};

// Simple profanity filter utility (replace with a real library for production)
export function filterProfanity(text: string): string {
	// Replace common bad words with **** (expand as needed)
	return text.replace(
		/\b(fuck|shit|bitch|asshole|damn|crap|dick|piss|bastard|slut|whore|cock|cunt|fag|nigger|retard)\b/gi,
		'****'
	);
}
