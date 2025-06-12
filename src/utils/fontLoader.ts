/**
 * Loads a font dynamically using webfontloader. Supports Google Fonts and custom fonts.
 * @param fontFamily The font family name (e.g., 'Merriweather', 'Pacifico', etc.)
 * @param options Optional: { customUrl, isCustom }
 */
export function loadFont(
	fontFamily: string,
	options?: { customUrl?: string; isCustom?: boolean }
) {
	if (typeof window === 'undefined') return; // Only run in browser

	import('webfontloader').then((WebFont) => {
		if (options?.isCustom && options.customUrl) {
			WebFont.load({
				custom: {
					families: [fontFamily],
					urls: [options.customUrl],
				},
			});
		} else {
			WebFont.load({
				google: {
					families: [fontFamily],
				},
			});
		}
	});
}
