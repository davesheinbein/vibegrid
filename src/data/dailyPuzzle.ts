export const dailyPuzzle = {
	title: 'Moody Indie vs. Cursed 90s Pop',
	size: { rows: 4, cols: 5 }, // Example: 4 rows x 5 columns (20 words)
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
		// Removed 'Pizza' to make 20 words
	],
	groups: [
		['Jazz', 'Blues', 'Rock', 'Rap'],
		['Apple', 'Orange', 'Grape', 'Pear'],
		['Dawn', 'Noon', 'Dusk', 'Midnight'],
		['Batman', 'Superman', 'Ironman', 'Spiderman'],
	],
	wildcards: [
		'Banana',
		'Cactus',
		'Robot',
		'Galaxy',
		// Removed 'Pizza'
	],
	categories: ['Moody Indie', 'Cursed 90s Pop Culture'],
	theme: 'moody',
};
