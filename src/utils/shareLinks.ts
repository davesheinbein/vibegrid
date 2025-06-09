import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faXTwitter,
	faMeta,
	faReddit,
	faLinkedin,
	faTiktok,
	faInstagram,
} from '@fortawesome/free-brands-svg-icons';

// Platform brand colors for styling share buttons/icons
const platformColors: Record<string, string> = {
	X: '#1da1f2',
	Meta: '#1877f3',
	Reddit: '#ff4500',
	LinkedIn: '#0077b5',
	TikTok: '#010101',
	Instagram: '#e1306c',
};

export interface ShareLinkConfig {
	name: string;
	url: string;
	icon: IconDefinition;
	color: string;
}

export function getShareLinks(
	type: 'url' | 'result',
	shareText: string,
	shareUrl: string,
	shareTitle: string
): ShareLinkConfig[] {
	// You can customize text/url logic per mode if needed
	return [
		{
			name: 'X',
			url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				shareText
			)}%20${encodeURIComponent(shareUrl)}`,
			icon: faXTwitter,
			color: platformColors.X,
		},
		{
			name: 'Meta',
			url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
				shareUrl
			)}&quote=${encodeURIComponent(shareText)}`,
			icon: faMeta,
			color: platformColors.Meta,
		},
		{
			name: 'Reddit',
			url: `https://www.reddit.com/submit?title=${encodeURIComponent(
				shareTitle
			)}&text=${encodeURIComponent(
				shareText + '\n' + shareUrl
			)}`,
			icon: faReddit,
			color: platformColors.Reddit,
		},
		{
			name: 'LinkedIn',
			url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
				shareUrl
			)}&title=${encodeURIComponent(
				shareTitle
			)}&summary=${encodeURIComponent(shareText)}`,
			icon: faLinkedin,
			color: platformColors.LinkedIn,
		},
		{
			name: 'TikTok',
			url: `https://www.tiktok.com/share?url=${encodeURIComponent(
				shareUrl
			)}&text=${encodeURIComponent(shareText)}`,
			icon: faTiktok,
			color: platformColors.TikTok,
		},
		{
			name: 'Instagram',
			url: `https://www.instagram.com/?url=${encodeURIComponent(
				shareUrl
			)}`,
			icon: faInstagram,
			color: platformColors.Instagram,
		},
	];
}

type ShareTemplateParams = {
	score: number;
	solved: number;
	total: number;
	attempts: number;
	time: string;
	mode: string;
	url: string;
};

const shareMessageTemplates: Array<
	(params: ShareTemplateParams) => string
> = [
	({ score, solved, total, attempts, time, mode, url }) =>
		`I just cracked ${solved}/${total} groups in ${time} on Grid Royale’s ${mode}. Think you can beat me? Prove it: ${url}`,
	({ score, solved, total, attempts, time, mode, url }) =>
		`${
			attempts === 0
				? 'Zero mistakes.'
				: `${attempts} attempt${
						attempts === 1 ? '' : 's'
				  } used.`
		} ${solved} group${
			solved === 1 ? '' : 's'
		} solved. ${time}. ${mode} domination on Grid Royale. Step up: ${url}`,
	({ score, solved, total, attempts, time, mode, url }) =>
		`Grid Royale has me hooked. ${solved}/${total} groups crushed in ${attempts} attempt${
			attempts === 1 ? '' : 's'
		}. Timer? ${time}. Bet you can’t top that: ${url}`,
	({ score, solved, total, attempts, time, mode, url }) =>
		`Today’s Grid Royale puzzle? Destroyed it. ${solved} outta ${total} groups in ${time}. Beat my time, if you dare: ${url}`,
	({ score, solved, total, attempts, time, mode, url }) =>
		`Tough grid. Tight timer. ${solved}/${total} groups cleared. Can you top my ${time} run? Get on it: ${url}`,
	({ score, solved, total, attempts, time, mode, url }) =>
		`My Grid Royale ${mode} run: ${solved}/${total} groups, ${attempts} attempts, ${time}. Try to beat me: ${url}`,
];

let shareMessageTemplateIdx = 0;

export function getPersonalizedShareText({
	score,
	solved,
	total,
	attempts,
	time,
	mode = 'Daily Puzzle',
	url = 'https://gridRoyale.app',
}: {
	score: number;
	solved: number;
	total: number;
	attempts: number;
	time: string;
	mode?: string;
	url?: string;
}): string {
	// Fallbacks for edge cases
	const safeSolved =
		typeof solved === 'number' && solved >= 0 ? solved : 0;
	const safeTotal =
		typeof total === 'number' && total > 0 ? total : 4;
	const safeAttempts =
		typeof attempts === 'number' && attempts >= 0
			? attempts
			: 0;
	const safeTime = time || '--:--';
	const safeMode = mode || 'Daily Puzzle';
	const safeUrl = url || 'https://gridRoyale.app';
	// Rotate through templates
	const template =
		shareMessageTemplates[
			shareMessageTemplateIdx % shareMessageTemplates.length
		];
	shareMessageTemplateIdx++;
	return template({
		score,
		solved: safeSolved,
		total: safeTotal,
		attempts: safeAttempts,
		time: safeTime,
		mode: safeMode,
		url: safeUrl,
	});
}
