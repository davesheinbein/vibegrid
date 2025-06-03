export const dailyPuzzle = {
	words: [
		'Jazz',
		'Blues',
		'Rock',
		'Rap',
		'Apple',
		'Orange',
		'Grape',
		'Pear',
		'Dawn',
		'Noon',
		'Dusk',
		'Midnight',
		'Batman',
		'Superman',
		'Ironman',
		'Spiderman',
		// Wildcards (not part of any group)
		'Banana',
		'Cactus',
		'Robot',
		'Galaxy',
	],
	groups: {
		group1: ['Jazz', 'Blues', 'Rock', 'Rap'],
		group2: ['Apple', 'Orange', 'Grape', 'Pear'],
		group3: ['Dawn', 'Noon', 'Dusk', 'Midnight'],
		group4: ['Batman', 'Superman', 'Ironman', 'Spiderman'],
	},
	wildcards: ['Banana', 'Cactus', 'Robot', 'Galaxy'], // At least 4 wildcards for 4x4 grid
	categories: ['Moody Indie', 'Cursed 90s Pop Culture'], // Example categories for VibeScore
};
