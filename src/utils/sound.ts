// sound.ts
// Simple sound effect utility for UI cues

const soundMap: Record<string, string> = {
	emote: '/sounds/emote-pop.mp3',
	botTaunt: '/sounds/bot-taunt.mp3',
	botThinking: '/sounds/bot-thinking.mp3',
};

export function playSound(key: keyof typeof soundMap) {
	const url = soundMap[key];
	if (!url) return;
	const audio = new Audio(url);
	audio.volume = 0.18;
	audio.play();
}

// Optionally preload sounds
export function preloadSounds() {
	Object.values(soundMap).forEach((url) => {
		const audio = new Audio(url);
		audio.volume = 0;
		audio.load();
	});
}
