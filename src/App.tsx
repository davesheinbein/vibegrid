import React, { useState, useEffect } from 'react';
import { dailyPuzzle } from './data/dailyPuzzle';
import { partialMatchFeedback } from './utils/gameLogic';
import WordButton from './components/WordButton';
import FeedbackBanner from './components/FeedbackBanner';
import EndGameModal from './components/EndGameModal';
import RulesModal from './components/RulesModal';
import './App.scss';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faXTwitter,
	faMeta,
	faReddit,
	faLinkedin,
	faTiktok,
	faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';

// --- Utility: shuffle array (Fisher-Yates) ---
function shuffle<T>(array: T[]): T[] {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

function App() {
	// --- State declarations (must be at the top) ---
	const [mode, setMode] = useState<
		'startup' | 'daily' | 'custom' | 'browse'
	>('startup');
	const [showCustomModal, setShowCustomModal] =
		useState(false);
	const [selectedWords, setSelectedWords] = useState<
		string[]
	>([]);
	const [lockedWords, setLockedWords] = useState<string[]>(
		[]
	);
	const [feedback, setFeedback] = useState('');
	// --- Enhancement: track attempts left for better UX ---
	const [attemptsLeft, setAttemptsLeft] = useState(4);
	const [gameOver, setGameOver] = useState(false);
	// --- Enhancement: track solved groups for better feedback and UI ---
	const [solvedGroups, setSolvedGroups] = useState<
		string[][]
	>([]);
	const [showRules, setShowRules] = useState(false);
	const [showShare, setShowShare] = useState(false);
	// --- Enhancement: shake animation for wrong guesses ---
	const [shake, setShake] = useState(false);
	// --- Wildcard burn mechanic ---
	const [burnSuspect, setBurnSuspect] = useState<
		string | null
	>(null);
	const [burnedWildcards, setBurnedWildcards] = useState<
		string[]
	>([]);
	const [burnBonus, setBurnBonus] = useState(0);
	// --- VibeScore Calculation ---
	const [startTime] = useState(Date.now());
	const [endTime, setEndTime] = useState<number | null>(
		null
	);
	const [darkMode, setDarkMode] = useState(true);
	useEffect(() => {
		document.body.classList.toggle('dark-mode', darkMode);
	}, [darkMode]);
	const [customPuzzle, setCustomPuzzle] = useState<
		any | null
	>(null);
	const [customState, setCustomState] = useState<
		any | null
	>(null);
	const [browseMode, setBrowseMode] = useState(false);
	const [customPuzzleList, setCustomPuzzleList] = useState<
		any[]
	>([]);
	const [activePuzzle, setActivePuzzle] =
		useState<any>(dailyPuzzle);

	// --- Get grid size and group size dynamically ---
	const gridCols = activePuzzle.size?.cols || 4;
	const gridRows =
		activePuzzle.size?.rows ||
		Math.ceil(
			(activePuzzle.words?.length || 16) / gridCols
		);
	const gridWordCount = gridRows * gridCols;
	const groupCount = activePuzzle.groups?.length || 4;
	const groupSize = activePuzzle.groups?.[0]?.length || 4;
	const maxSelectable = groupSize;

	// --- State: shuffled words (dynamic count) ---
	const [shuffledWords, setShuffledWords] = useState<
		string[]
	>(() =>
		shuffle(activePuzzle.words.slice(0, gridWordCount))
	);

	// --- Update shuffledWords and reset state when activePuzzle changes ---
	useEffect(() => {
		setShuffledWords(
			shuffle(activePuzzle.words.slice(0, gridWordCount))
		);
		setSelectedWords([]);
		setLockedWords([]);
		setFeedback('');
		setAttemptsLeft(4);
		setGameOver(false);
		setSolvedGroups([]);
		setBurnSuspect(null);
		setBurnedWildcards([]);
		setBurnBonus(0);
		setEndTime(null);
	}, [activePuzzle]);

	// --- Custom Puzzle Modal with Form ---
	const CustomPuzzleModal = ({
		open,
		onClose,
	}: {
		open: boolean;
		onClose: () => void;
	}) => {
		const [title, setTitle] = useState('');
		const [rows, setRows] = useState(4);
		const [cols, setCols] = useState(5);
		const [words, setWords] = useState(''); // comma or newline separated
		const [groups, setGroups] = useState(['', '', '', '']); // 4 groups
		const [wildcards, setWildcards] = useState(''); // comma or newline separated
		const [categories, setCategories] = useState(''); // comma separated
		const [theme, setTheme] = useState('');
		const [jsonResult, setJsonResult] = useState('');
		const [saveStatus, setSaveStatus] = useState<
			string | null
		>(null);
		const [shareId, setShareId] = useState<string | null>(
			null
		);
		const [copyStatus, setCopyStatus] = useState<
			string | null
		>(null);

		if (!open) return null;

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			const wordList = words
				.split(/[\n,]+/)
				.map((w) => w.trim())
				.filter(Boolean);
			const groupArr = groups.map((g) =>
				g
					.split(/[\n,]+/)
					.map((w) => w.trim())
					.filter(Boolean)
			);
			const wildcardArr = wildcards
				.split(/[\n,]+/)
				.map((w) => w.trim())
				.filter(Boolean);
			const categoryArr = categories
				.split(',')
				.map((c) => c.trim())
				.filter(Boolean);
			const json = {
				date: new Date().toLocaleDateString('en-GB'),
				title,
				size: { rows, cols },
				words: wordList,
				groups: groupArr,
				wildcards: wildcardArr,
				categories: categoryArr,
				theme,
			};
			setJsonResult(JSON.stringify(json, null, 2));
			setSaveStatus(null);
		};

		const handleSave = async () => {
			if (!jsonResult) return;
			setSaveStatus('Saving...');
			try {
				const res = await fetch('/api/custom-grid', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: jsonResult,
				});
				if (res.ok) {
					setSaveStatus(
						'Saved! Your puzzle is now in the database.'
					);
				} else {
					setSaveStatus('Error saving puzzle.');
				}
			} catch {
				setSaveStatus('Error saving puzzle.');
			}
		};

		const handlePlayNow = () => {
			if (!jsonResult) return;
			try {
				const puzzle = JSON.parse(jsonResult);
				setCustomPuzzle(puzzle);
				setMode('custom');
				onClose();
				// Generate a shareable ID and store in localStorage
				const id = uuidv4();
				localStorage.setItem(
					'vibegrid-custom-' + id,
					JSON.stringify(puzzle)
				);
				setShareId(id);
				window.location.hash = '#/play/custom/' + id;
			} catch {
				setSaveStatus('Invalid puzzle JSON.');
			}
		};

		const handleCopyLink = () => {
			if (!shareId) return;
			const url =
				window.location.origin +
				'/#/play/custom/' +
				shareId;
			navigator.clipboard.writeText(url).then(() => {
				setCopyStatus('Link copied!');
				setTimeout(() => setCopyStatus(null), 1500);
			});
		};

		return (
			<div
				className='share-modal'
				onClick={(e) =>
					e.target === e.currentTarget && onClose()
				}
			>
				<div
					className='share-modal-content'
					style={{
						maxWidth: 520,
						background: '#fff',
						color: '#334155',
					}}
				>
					<h2>Create Your Custom VibeGrid Puzzle</h2>
					<form
						onSubmit={handleSubmit}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 12,
						}}
					>
						<label>
							Title
							<input
								type='text'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								style={{ width: '100%' }}
								placeholder='e.g. Moody Indie vs. Cursed 90s Pop'
							/>
						</label>
						<div style={{ display: 'flex', gap: 8 }}>
							<label>
								Rows
								<input
									type='number'
									min={1}
									max={10}
									value={rows}
									onChange={(e) =>
										setRows(Number(e.target.value))
									}
									style={{ width: 60 }}
									placeholder='4'
								/>
							</label>
							<label>
								Cols
								<input
									type='number'
									min={1}
									max={10}
									value={cols}
									onChange={(e) =>
										setCols(Number(e.target.value))
									}
									style={{ width: 60 }}
									placeholder='5'
								/>
							</label>
						</div>
						<label>
							Words (comma or newline separated, total: rows
							x cols)
							<textarea
								value={words}
								onChange={(e) => setWords(e.target.value)}
								rows={3}
								style={{ width: '100%' }}
								required
								placeholder={
									'Jazz, Blues, Rock, Rap, Apple, Orange, Grape, Pear, Dawn, Noon, Dusk, Midnight, Batman, Superman, Ironman, Spiderman, Banana, Cactus, Robot, Galaxy'
								}
							/>
						</label>
						{groups.map((g, i) => (
							<label key={i}>
								Group {i + 1} (comma or newline separated,{' '}
								{cols} words)
								<textarea
									value={g}
									onChange={(e) =>
										setGroups(
											groups.map((v, idx) =>
												idx === i ? e.target.value : v
											)
										)
									}
									rows={2}
									style={{ width: '100%' }}
									required
									placeholder={
										i === 0
											? 'Jazz, Blues, Rock, Rap'
											: i === 1
											? 'Apple, Orange, Grape, Pear'
											: i === 2
											? 'Dawn, Noon, Dusk, Midnight'
											: 'Batman, Superman, Ironman, Spiderman'
									}
								/>
							</label>
						))}
						<label>
							Wildcards (comma or newline separated)
							<textarea
								value={wildcards}
								onChange={(e) =>
									setWildcards(e.target.value)
								}
								rows={2}
								style={{ width: '100%' }}
								placeholder='Banana, Cactus, Robot, Galaxy'
							/>
						</label>
						<label>
							Categories (comma separated)
							<input
								type='text'
								value={categories}
								onChange={(e) =>
									setCategories(e.target.value)
								}
								style={{ width: '100%' }}
								placeholder='Moody Indie, Cursed 90s Pop Culture'
							/>
						</label>
						<label>
							Theme
							<input
								type='text'
								value={theme}
								onChange={(e) => setTheme(e.target.value)}
								style={{ width: '100%' }}
								placeholder='moody'
							/>
						</label>
						<button
							type='submit'
							className='vibegrid-submit'
							style={{ marginTop: 8 }}
						>
							Generate JSON
						</button>
					</form>
					{jsonResult && (
						<div style={{ marginTop: 16 }}>
							<h4>Your Puzzle JSON:</h4>
							<pre
								style={{
									background: '#f1f5f9',
									color: '#334155',
									padding: 12,
									borderRadius: 8,
									fontSize: 13,
									overflowX: 'auto',
								}}
							>
								{jsonResult}
							</pre>
							<div
								style={{
									display: 'flex',
									gap: 8,
									marginTop: 8,
								}}
							>
								<button
									className='vibegrid-submit'
									onClick={handleSave}
									type='button'
								>
									Save to Database
								</button>
								<button
									className='vibegrid-submit'
									onClick={handlePlayNow}
									type='button'
									style={{
										background:
											'linear-gradient(90deg,#22c55e 0%,#38bdf8 100%)',
									}}
								>
									Play Now
								</button>
								{shareId && (
									<button
										className='vibegrid-submit'
										onClick={handleCopyLink}
										type='button'
										style={{
											background:
												'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
										}}
									>
										Copy Link
									</button>
								)}
							</div>
							{copyStatus && (
								<div
									style={{ color: 'green', marginTop: 4 }}
								>
									{copyStatus}
								</div>
							)}
							{saveStatus && (
								<div
									style={{
										marginTop: 8,
										color: saveStatus.startsWith('Error')
											? 'red'
											: 'green',
									}}
								>
									{saveStatus}
								</div>
							)}
						</div>
					)}
					<button
						className='share-modal-close'
						onClick={onClose}
						style={{ marginTop: 16 }}
					>
						Close
					</button>
				</div>
			</div>
		);
	};

	// --- Animation: transition matched group words from grid to solved group ---
	// Add a class to matched words for animation, and remove them from the grid after animation completes
	const [animatingGroup, setAnimatingGroup] = useState<
		string[] | null
	>(null);
	const [pendingSolvedGroups, setPendingSolvedGroups] =
		useState<string[][]>([]);

	// When a group is solved, animate its transition
	useEffect(() => {
		if (
			solvedGroups.length > 0 &&
			pendingSolvedGroups.length < solvedGroups.length
		) {
			const newGroup =
				solvedGroups[solvedGroups.length - 1];
			setAnimatingGroup(newGroup);
			// After animation duration, add to pendingSolvedGroups
			setTimeout(() => {
				setPendingSolvedGroups((prev) => [
					...prev,
					newGroup,
				]);
				setAnimatingGroup(null);
			}, 700); // match CSS animation duration
		}
	}, [solvedGroups]);

	// Only show words in the grid that are not in any solved group (including animating group)
	const solvedWords = pendingSolvedGroups.flat();
	const animatingWords = animatingGroup || [];
	const gridWords = shuffledWords.filter(
		(word) =>
			!solvedWords.includes(word) &&
			!animatingWords.includes(word)
	);

	// --- Helper functions and variables used in hooks ---
	const isWildcard = (word: string) =>
		activePuzzle.wildcards?.includes(word);

	const confirmBurn = () => {
		if (!burnSuspect) return;
		if (isWildcard(burnSuspect)) {
			const newBurned = [...burnedWildcards, burnSuspect];
			setBurnedWildcards(newBurned);
			setLockedWords((prev) => [...prev, burnSuspect]);
			setBurnBonus(
				(prev) => prev + (attemptsLeft >= 2 ? 10 : 5)
			);
			setFeedback('🔥 Correct burn! Bonus awarded!');
			// Award extra attempt if all wildcards are burned
			if (
				activePuzzle.wildcards &&
				activePuzzle.wildcards.length > 0 &&
				activePuzzle.wildcards.every((w: string) =>
					newBurned.includes(w)
				)
			) {
				setAttemptsLeft((prev) => prev + 1);
				setFeedback(
					'🔥 All wildcards burned! Extra attempt awarded!'
				);
			}
		} else {
			setAttemptsLeft((prev) => prev - 1);
			setFeedback(
				'❌ That word belongs to a group! Penalty.'
			);
		}
		setBurnSuspect(null);
		setSelectedWords([]);
	};

	const getVibeScore = () => {
		const groups = solvedGroups.length;
		const time = endTime
			? Math.round((endTime - startTime) / 1000)
			: 0;
		const attemptsUsed = 4 - attemptsLeft;
		const correctGroups = groups * 10;
		const allGroupsNoMistakes =
			groups === 4 && attemptsUsed === 0 ? 15 : 0;
		const correctBurns =
			burnedWildcards.filter((w) => isWildcard(w)).length *
			5;
		const wrongBurns =
			(burnedWildcards.length -
				burnedWildcards.filter((w) => isWildcard(w))
					.length) *
			-5;
		const guessPenalty = attemptsUsed * -2;
		const vibeTimeBonus =
			groups === 4 && time > 0 && time <= VIBETIME_THRESHOLD
				? 10
				: 0;
		const total =
			correctGroups +
			allGroupsNoMistakes +
			correctBurns +
			wrongBurns +
			guessPenalty +
			vibeTimeBonus;
		return Math.max(0, total);
	};

	type VibeCategoryStats = {
		games: number;
		wins: number;
		totalScore: number;
		totalGroups: number;
		correctGroups: number;
		totalBurns: number;
		correctBurns: number;
		totalTime: number;
	};
	type VibeTrackerStats = Record<string, VibeCategoryStats>;

	function updateVibeTrackerStats({
		categories,
		score,
		correctGroups,
		totalGroups,
		correctBurns,
		totalBurns,
		time,
		win,
	}: {
		categories: string[];
		score: number;
		correctGroups: number;
		totalGroups: number;
		correctBurns: number;
		totalBurns: number;
		time: number;
		win: boolean;
	}) {
		const statsKey = 'vibegrid-vibetracker-stats';
		let stats: VibeTrackerStats = {};
		try {
			stats = JSON.parse(
				localStorage.getItem(statsKey) || '{}'
			);
		} catch {}
		categories.forEach((cat) => {
			if (!stats[cat]) {
				stats[cat] = {
					games: 0,
					wins: 0,
					totalScore: 0,
					totalGroups: 0,
					correctGroups: 0,
					totalBurns: 0,
					correctBurns: 0,
					totalTime: 0,
				};
			}
			stats[cat].games += 1;
			if (win) stats[cat].wins += 1;
			stats[cat].totalScore += score;
			stats[cat].totalGroups += totalGroups;
			stats[cat].correctGroups += correctGroups;
			stats[cat].totalBurns += totalBurns;
			stats[cat].correctBurns += correctBurns;
			stats[cat].totalTime += time;
		});
		localStorage.setItem(statsKey, JSON.stringify(stats));
	}

	function getVibeTrackerSummary() {
		const statsKey = 'vibegrid-vibetracker-stats';
		let stats: VibeTrackerStats = {};
		try {
			stats = JSON.parse(
				localStorage.getItem(statsKey) || '{}'
			);
		} catch {}
		const cats = dailyPuzzle.categories || ['General'];
		return cats
			.map((cat: string) => {
				const s = stats[cat];
				if (!s || s.games === 0)
					return `${cat}: No data yet.`;
				const winRate = Math.round(
					(s.wins / s.games) * 100
				);
				const burnAcc = s.totalBurns
					? Math.round(
							(s.correctBurns / s.totalBurns) * 100
					  )
					: 0;
				const avgTime = s.games
					? Math.round(s.totalTime / s.games)
					: 0;
				return `${cat}: Win Rate ${winRate}%, Burn Accuracy ${burnAcc}%, Avg Time ${Math.floor(
					avgTime / 60
				)}:${('0' + (avgTime % 60)).slice(-2)}`;
			})
			.join('\n');
	}

	const PUZZLE_CATEGORIES = dailyPuzzle.categories || [
		'General',
	];
	const VIBETIME_THRESHOLD = 90;

	// --- Event Handlers and Variables ---
	const handleWordTap = (word: string) => {
		if (lockedWords.includes(word) || gameOver) return;
		if (burnSuspect === word) {
			setBurnSuspect(null);
			return;
		}
		if (selectedWords.includes(word)) {
			setSelectedWords((prev) =>
				prev.filter((w) => w !== word)
			);
			setBurnSuspect(word);
		} else if (burnSuspect) {
			setBurnSuspect(word);
		} else if (selectedWords.length < groupSize) {
			setSelectedWords((prev) => [...prev, word]);
		}
	};

	const handleSubmit = () => {
		if (gameOver) return;
		if (selectedWords.length !== groupSize) {
			setFeedback(`Select exactly ${groupSize} words.`);
			return;
		}
		const groupMatch = dailyPuzzle.groups.find(
			(group: string[]) =>
				selectedWords.every((word) => group.includes(word))
		);
		if (
			groupMatch &&
			!solvedGroups.some((g: string[]) =>
				g.every((word) => groupMatch.includes(word))
			)
		) {
			setLockedWords((prev) => [...prev, ...selectedWords]);
			setSolvedGroups((prev) => [...prev, groupMatch]);
			setFeedback('Group locked in!');
			setSelectedWords([]);
		} else if (groupMatch) {
			setFeedback('This group is already solved.');
			setSelectedWords([]);
		} else {
			setAttemptsLeft((prev) => prev - 1);
			setFeedback(
				partialMatchFeedback(
					selectedWords,
					Object.fromEntries(
						dailyPuzzle.groups.map(
							(g: string[], i: number) => [i, g]
						)
					)
				)
			);
			setShake(true);
			setTimeout(() => setShake(false), 500);
			setSelectedWords([]);
		}
	};

	const handleRestart = () => {
		setSelectedWords([]);
		setLockedWords([]);
		setFeedback('');
		setAttemptsLeft(4);
		setGameOver(false);
		setSolvedGroups([]);
	};

	const handleRandomize = () => {
		setShuffledWords(shuffle(dailyPuzzle.words));
	};

	const handleShare = async () => {
		const text = getShareText();
		const url = getShareUrl();
		const title = getShareTitle();
		if (navigator.share) {
			try {
				await navigator.share({ title, text, url });
				return;
			} catch {}
		}
		setShowShare(true);
	};

	const getShareText = () => {
		const solved = solvedGroups.length;
		const attempts = 4 - attemptsLeft;
		const words = lockedWords.length;
		const total = gridWordCount;
		const emoji = words === total ? '🔥' : '✨';
		return `VibeGrid: ${solved}/${groupCount} groups solved in ${attempts} attempts! ${emoji} Play: https://vibegrid.app`;
	};

	const getShareUrl = () => 'https://vibegrid.app';
	const getShareTitle = () =>
		"VibeGrid: Can you solve today's grid?";

	const shareLinks = [
		{
			name: 'X',
			url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				getShareText()
			)}`,
			icon: <FontAwesomeIcon icon={faXTwitter} />,
		},
		{
			name: 'Meta',
			url: `https://www.meta.com/share?u=${encodeURIComponent(
				getShareUrl()
			)}&quote=${encodeURIComponent(getShareText())}`,
			icon: <FontAwesomeIcon icon={faMeta} />,
		},
		{
			name: 'Reddit',
			url: `https://www.reddit.com/submit?title=${encodeURIComponent(
				getShareTitle()
			)}&text=${encodeURIComponent(getShareText())}`,
			icon: <FontAwesomeIcon icon={faReddit} />,
		},
		{
			name: 'LinkedIn',
			url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
				getShareUrl()
			)}&title=${encodeURIComponent(
				getShareTitle()
			)}&summary=${encodeURIComponent(getShareText())}`,
			icon: <FontAwesomeIcon icon={faLinkedin} />,
		},
		{
			name: 'TikTok',
			url: `https://www.tiktok.com/share?url=${encodeURIComponent(
				getShareUrl()
			)}&text=${encodeURIComponent(getShareText())}`,
			icon: <FontAwesomeIcon icon={faTiktok} />,
		},
		{
			name: 'Instagram',
			url: `https://www.instagram.com/?url=${encodeURIComponent(
				getShareUrl()
			)}`,
			icon: <FontAwesomeIcon icon={faInstagram} />,
		},
	];

	// --- On mount, check for custom puzzle hash in URL ---
	useEffect(() => {
		if (window.location.hash.startsWith('#/play/custom/')) {
			const id = window.location.hash.replace(
				'#/play/custom/',
				''
			);
			const stored = localStorage.getItem(
				'vibegrid-custom-' + id
			);
			if (stored) {
				try {
					const puzzle = JSON.parse(stored);
					setCustomPuzzle(puzzle);
					setMode('custom');
					setCustomState(null); // will be initialized below
				} catch {}
			}
		}
	}, []);

	// --- Load custom puzzles for browse mode ---
	useEffect(() => {
		if (mode === 'browse') {
			const puzzles: any[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith('vibegrid-custom-')) {
					try {
						const puzzle = JSON.parse(
							localStorage.getItem(key)!
						);
						puzzles.push({
							...puzzle,
							_id: key.replace('vibegrid-custom-', ''),
						});
					} catch {}
				}
			}
			setCustomPuzzleList(puzzles);
		}
	}, [mode]);

	// --- Custom puzzle play state management ---
	useEffect(() => {
		if (mode === 'custom' && customPuzzle && !customState) {
			const puzzle = customPuzzle;
			const gridCols = puzzle.size?.cols || 4;
			const gridRows = puzzle.size?.rows || 4;
			const gridWordCount = gridRows * gridCols;
			setCustomState({
				shuffledWords: shuffle(
					puzzle.words.slice(0, gridWordCount)
				),
				selectedWords: [],
				lockedWords: [],
				feedback: '',
				attemptsLeft: 4,
				gameOver: false,
				solvedGroups: [],
				burnSuspect: null,
				burnedWildcards: [],
				shake: false,
			});
		}
	}, [mode, customPuzzle, customState]);

	// --- Browse Custom Puzzles Screen ---
	const BrowseCustomPuzzles = ({
		onBack,
		puzzles,
	}: {
		onBack: () => void;
		puzzles: any[];
	}) => {
		return (
			<div
				className='vibegrid-container'
				style={{ minHeight: '100vh', padding: 24 }}
			>
				<h1 className='vibegrid-title'>
					Browse Custom Puzzles
				</h1>
				<button
					className='vibegrid-submit'
					onClick={onBack}
					style={{ marginBottom: 16 }}
				>
					Back
				</button>
				{puzzles.length === 0 ? (
					<div style={{ marginTop: 32 }}>
						No custom puzzles found. Create one in Custom
						Puzzle Mode!
					</div>
				) : (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 16,
						}}
					>
						{puzzles.map((puzzle) => (
							<div
								key={puzzle._id}
								style={{
									border: '1px solid #e5e7eb',
									borderRadius: 8,
									padding: 16,
									background: darkMode ? '#222' : '#fff',
									color: darkMode ? '#fff' : '#222',
								}}
							>
								<div
									style={{ fontWeight: 600, fontSize: 18 }}
								>
									{puzzle.title || 'Untitled Puzzle'}
								</div>
								<div
									style={{
										fontSize: 14,
										margin: '4px 0 8px 0',
									}}
								>
									{puzzle.theme && (
										<span>Theme: {puzzle.theme} | </span>
									)}
									Words: {puzzle.words?.length || 0}
								</div>
								<button
									className='vibegrid-submit'
									onClick={() => {
										setCustomPuzzle(puzzle);
										setMode('custom');
										setCustomState(null);
									}}
									style={{ marginRight: 8 }}
								>
									Play
								</button>
								<button
									className='vibegrid-submit'
									onClick={() => {
										const url =
											window.location.origin +
											'/#/play/custom/' +
											puzzle._id;
										navigator.clipboard.writeText(url);
									}}
									style={{
										background:
											'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
									}}
								>
									Copy Link
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	// --- Custom puzzle play mode UI ---
	if (mode === 'custom' && customPuzzle && customState) {
		const puzzle = customPuzzle;
		const gridCols = puzzle.size?.cols || 4;
		const gridRows = puzzle.size?.rows || 4;
		const gridWordCount = gridRows * gridCols;
		const groupCount = puzzle.groups?.length || 4;
		const groupSize = puzzle.groups?.[0]?.length || 4;
		const {
			shuffledWords,
			selectedWords,
			lockedWords,
			feedback,
			attemptsLeft,
			gameOver,
			solvedGroups,
			burnSuspect,
			burnedWildcards,
			shake,
		} = customState;

		const setState = (patch: Partial<typeof customState>) =>
			setCustomState((prev: any) => ({
				...prev,
				...patch,
			}));
		const isWildcard = (word: string) =>
			puzzle.wildcards?.includes(word);
		const confirmBurn = () => {
			if (!burnSuspect) return;
			if (isWildcard(burnSuspect)) {
				const newBurned = [...burnedWildcards, burnSuspect];
				let extraAttempt = false;
				if (
					puzzle.wildcards &&
					puzzle.wildcards.length > 0 &&
					puzzle.wildcards.every((w: string) =>
						newBurned.includes(w)
					)
				) {
					extraAttempt = true;
				}
				setState({
					burnedWildcards: newBurned,
					lockedWords: [...lockedWords, burnSuspect],
					feedback: extraAttempt
						? '🔥 All wildcards burned! Extra attempt awarded!'
						: '🔥 Correct burn! Bonus awarded.',
					burnSuspect: null,
					selectedWords: [],
					attemptsLeft: extraAttempt
						? attemptsLeft + 1
						: attemptsLeft,
				});
			} else {
				setState({
					attemptsLeft: attemptsLeft - 1,
					feedback:
						'❌ That word belongs to a group! Penalty.',
					burnSuspect: null,
					selectedWords: [],
				});
			}
		};
		const handleWordTap = (word: string) => {
			if (lockedWords.includes(word) || gameOver) return;
			if (burnSuspect === word) {
				setState({ burnSuspect: null });
				return;
			}
			if (selectedWords.includes(word)) {
				setState({
					selectedWords: selectedWords.filter(
						(w: string) => w !== word
					),
					burnSuspect: word,
				});
			} else if (burnSuspect) {
				setState({ burnSuspect: word });
			} else if (selectedWords.length < groupSize) {
				setState({
					selectedWords: [...selectedWords, word],
				});
			}
		};
		const handleSubmit = () => {
			if (gameOver) return;
			if (selectedWords.length !== groupSize) {
				setState({
					feedback: `Select exactly ${groupSize} words.`,
				});
				return;
			}
			const groupMatch = puzzle.groups.find(
				(group: string[]) =>
					selectedWords.every((word: string) =>
						group.includes(word)
					)
			);
			if (
				groupMatch &&
				!solvedGroups.some((g: string[]) =>
					g.every((word: string) =>
						groupMatch.includes(word)
					)
				)
			) {
				setState({
					lockedWords: [...lockedWords, ...selectedWords],
					solvedGroups: [...solvedGroups, groupMatch],
					feedback: 'Group locked in!',
					selectedWords: [],
				});
			} else if (groupMatch) {
				setState({
					feedback: 'This group is already solved.',
					selectedWords: [],
				});
			} else {
				setState({
					attemptsLeft: attemptsLeft - 1,
					feedback: 'Try again!',
					shake: true,
					selectedWords: [],
				});
				setTimeout(() => setState({ shake: false }), 500);
			}
		};
		const handleRestart = () => {
			setCustomState({
				shuffledWords: shuffle(
					puzzle.words.slice(0, gridWordCount)
				),
				selectedWords: [],
				lockedWords: [],
				feedback: '',
				attemptsLeft: 4,
				gameOver: false,
				solvedGroups: [],
				burnSuspect: null,
				burnedWildcards: [],
				shake: false,
			});
		};
		const handleRandomize = () => {
			setState({ shuffledWords: shuffle(puzzle.words) });
		};
		return (
			<div className='vibegrid-container'>
				<div
					className='vibegrid-header-row'
					style={{
						display: 'flex',
						alignItems: 'center',
						marginBottom: 24,
						position: 'relative',
						minHeight: 48,
						justifyContent: 'space-between',
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<button
							className='back-icon-btn'
							onClick={() => setMode('startup')}
							aria-label='Back'
						>
							<span
								style={{
									fontSize: '1.3em',
									lineHeight: 1,
									color: '#fff',
								}}
								aria-hidden='true'
							>
								&#8592;
							</span>
						</button>
						<div style={{ marginLeft: 52 }}>
							<h1
								className='vibegrid-title'
								style={{ margin: 0 }}
							>
								{activePuzzle.title || 'VibeGrid Daily'}
							</h1>
							<div className='vibegrid-subtitle'>
								Daily Puzzle
							</div>
						</div>
					</div>
					<button
						className='rules-btn'
						onClick={() => setShowRules(true)}
						aria-label='How to Play'
						style={{ marginLeft: 'auto' }}
					>
						<svg
							className='rules-icon'
							viewBox='0 0 24 24'
							width='28'
							height='28'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<circle cx='12' cy='12' r='10' />
							<line x1='12' y1='16' x2='12' y2='12' />
							<line x1='12' y1='8' x2='12' y2='8' />
						</svg>
					</button>
				</div>
				{solvedGroups.length > 0 && (
					<div className='vibegrid-solved-groups'>
						{pendingSolvedGroups.map(
							(group: string[], idx: number) => {
								// Find the group index in the puzzle's groups array
								const groupIdx =
									activePuzzle.groups.findIndex(
										(g: string[]) =>
											g.length === group.length &&
											g.every((w: string) =>
												group.includes(w)
											)
									);
								// Always use groupLabels if present
								let groupLabel = `Group ${groupIdx + 1}`;
								if (
									activePuzzle.groupLabels &&
									Array.isArray(activePuzzle.groupLabels) &&
									activePuzzle.groupLabels[groupIdx]
								) {
									groupLabel =
										activePuzzle.groupLabels[groupIdx];
								}
								return (
									<section
										className={`vibegrid-solved-group vibegrid-solved-group-${
											['easy', 'medium', 'hard', 'expert'][
												idx
											]
										}`}
										key={idx}
										role='img'
										aria-label={`Correct group ${groupLabel}. ${group.join(
											','
										)}`}
									>
										<h3 className='vibegrid-solved-category'>
											{groupLabel}
										</h3>
										<ol className='vibegrid-solved-word-list'>
											{group.map((word: string) => (
												<li
													className='vibegrid-solved-word'
													key={word}
												>
													{word}
												</li>
											))}
										</ol>
									</section>
								);
							}
						)}
					</div>
				)}
				<div
					className='vibegrid-grid'
					style={{
						gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
						gridTemplateRows: `repeat(${gridRows}, 1fr)`,
					}}
				>
					{gridWords.map((word: string) => (
						<WordButton
							key={word}
							word={word}
							isSelected={selectedWords.includes(word)}
							isLocked={lockedWords.includes(word)}
							onClick={() => handleWordTap(word)}
							burnSuspect={burnSuspect === word}
						/>
					))}
					{/* Animate matched group words out of the grid */}
					{animatingGroup &&
						animatingGroup.map((word: string) => (
							<WordButton
								key={word + '-animating'}
								word={word}
								isSelected={false}
								isLocked={true}
								onClick={() => {}}
								className='word-btn animating-to-solved'
							/>
						))}
				</div>
				{burnSuspect && (
					<div className='burn-status-bar'>
						🔥 Burn active: <b>{burnSuspect}</b>
						<button
							className='burn-btn'
							onClick={confirmBurn}
						>
							Confirm Burn
						</button>
					</div>
				)}
				<button
					className='vibegrid-submit'
					onClick={handleSubmit}
					disabled={attemptsLeft === 0 || gameOver}
				>
					Submit Group
				</button>
				<FeedbackBanner message={feedback} />
				<div className='vibegrid-attempts-bar'>
					{[...Array(attemptsLeft > 4 ? 5 : 4)].map(
						(_, i) => (
							<span
								key={i}
								className={
									'vibegrid-attempt-dot' +
									(i >= attemptsLeft ? ' used' : '')
								}
							></span>
						)
					)}
				</div>
				<p className='vibegrid-attempts'>
					Attempts Left: {attemptsLeft}
					<button
						className='randomize-btn'
						aria-label='Randomize word order'
						onClick={handleRandomize}
						style={{
							marginLeft: 12,
							verticalAlign: 'middle',
						}}
					>
						<span
							aria-hidden='true'
							style={{
								display: 'inline-block',
								transform: 'rotate(-45deg)',
								fontSize: '1.2em',
							}}
						>
							&#x267B;
						</span>
					</button>
					<button
						className='deselect-btn'
						aria-label='Deselect all'
						onClick={() => setSelectedWords([])}
						style={{
							marginLeft: 8,
							verticalAlign: 'middle',
							padding: '0.3em 0.9em',
							fontSize: '1em',
							borderRadius: 6,
							background: '#e5e7eb',
							color: '#222',
							border: 'none',
							cursor: 'pointer',
						}}
					>
						Deselect All
					</button>
				</p>
				{gameOver && (
					<EndGameModal
						message={
							lockedWords.length === gridWordCount
								? 'You nailed it!'
								: 'Vibe check failed.'
						}
						onRestart={handleRestart}
					/>
				)}
				<button
					className='share-btn'
					onClick={handleShare}
					style={{ marginTop: 16 }}
				>
					<svg
						className='share-icon'
						width='22'
						height='22'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						style={{
							marginRight: 8,
							verticalAlign: 'middle',
						}}
					>
						<circle cx='18' cy='5' r='3' />
						<circle cx='6' cy='12' r='3' />
						<circle cx='18' cy='19' r='3' />
						<line
							x1='8.59'
							y1='13.51'
							x2='15.42'
							y2='17.49'
						/>
						<line
							x1='15.41'
							y1='6.51'
							x2='8.59'
							y2='10.49'
						/>
					</svg>
					Share
				</button>
				{showShare && (
					<div
						className='share-modal'
						onClick={(e) =>
							e.target === e.currentTarget &&
							setShowShare(false)
						}
					>
						<div className='share-modal-content'>
							<h2>Share your VibeGrid result!</h2>
							<div className='share-links-grid'>
								{(() => {
									const rows = [];
									for (
										let i = 0;
										i < shareLinks.length;
										i += 3
									) {
										rows.push(
											<div
												className='share-links-row'
												key={i}
											>
												{shareLinks
													.slice(i, i + 3)
													.map((link) => (
														<a
															href={link.url}
															target='_blank'
															rel='noopener noreferrer'
															className='share-link'
															data-platform={link.name}
															key={link.name}
														>
															<span className='share-link-icon'>
																{link.icon}
															</span>{' '}
															{link.name}
														</a>
													))}
											</div>
										);
									}
									return rows;
								})()}
							</div>
							<button
								className='share-modal-close'
								onClick={() => setShowShare(false)}
							>
								Close
							</button>
						</div>
					</div>
				)}
				<RulesModal
					open={showRules}
					onClose={() => setShowRules(false)}
				/>
			</div>
		);
	}

	// --- Startup screen UI ---
	if (mode === 'startup') {
		const getGameShareText = () =>
			'Try VibeGrid! Solve daily and custom word group puzzles. Play now: https://vibegrid.app';
		const getGameShareUrl = () => 'https://vibegrid.app';
		const getGameShareTitle = () =>
			'VibeGrid: Play the daily word grid!';
		const gameShareLinks = [
			{
				name: 'X',
				url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
					getGameShareText()
				)}`,
				icon: <FontAwesomeIcon icon={faXTwitter} />,
			},
			{
				name: 'Meta',
				url: `https://www.meta.com/share?u=${encodeURIComponent(
					getGameShareUrl()
				)}&quote=${encodeURIComponent(getGameShareText())}`,
				icon: <FontAwesomeIcon icon={faMeta} />,
			},
			{
				name: 'Reddit',
				url: `https://www.reddit.com/submit?title=${encodeURIComponent(
					getGameShareTitle()
				)}&text=${encodeURIComponent(getGameShareText())}`,
				icon: <FontAwesomeIcon icon={faReddit} />,
			},
			{
				name: 'LinkedIn',
				url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
					getGameShareUrl()
				)}&title=${encodeURIComponent(
					getGameShareTitle()
				)}&summary=${encodeURIComponent(
					getGameShareText()
				)}`,
				icon: <FontAwesomeIcon icon={faLinkedin} />,
			},
			{
				name: 'TikTok',
				url: `https://www.tiktok.com/share?url=${encodeURIComponent(
					getGameShareUrl()
				)}&text=${encodeURIComponent(getGameShareText())}`,
				icon: <FontAwesomeIcon icon={faTiktok} />,
			},
			{
				name: 'Instagram',
				url: `https://www.instagram.com/?url=${encodeURIComponent(
					getGameShareUrl()
				)}`,
				icon: <FontAwesomeIcon icon={faInstagram} />,
			},
		];
		const handleGameShare = async () => {
			const text = getGameShareText();
			const url = getGameShareUrl();
			const title = getGameShareTitle();
			if (navigator.share) {
				try {
					await navigator.share({ title, text, url });
					return;
				} catch {}
			}
			setShowShare(true);
		};
		return (
			<div
				className='vibegrid-container'
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
				}}
			>
				<h1
					className='vibegrid-title'
					style={{ marginBottom: '1.5rem' }}
				>
					VibeGrid 2.0 🎛️
				</h1>
				<h4>Build in Progress...</h4>
				{showShare && (
					<div
						className='share-modal'
						onClick={(e) =>
							e.target === e.currentTarget &&
							setShowShare(false)
						}
					>
						<div className='share-modal-content'>
							<h2>Share VibeGrid!</h2>
							<div className='share-links-grid'>
								{(() => {
									const rows = [];
									for (
										let i = 0;
										i < gameShareLinks.length;
										i += 3
									) {
										rows.push(
											<div
												className='share-links-row'
												key={i}
											>
												{gameShareLinks
													.slice(i, i + 3)
													.map((link) => (
														<a
															href={link.url}
															target='_blank'
															rel='noopener noreferrer'
															className='share-link'
															data-platform={link.name}
															key={link.name}
														>
															<span className='share-link-icon'>
																{link.icon}
															</span>{' '}
															{link.name}
														</a>
													))}
											</div>
										);
									}
									return rows;
								})()}
							</div>
							<button
								className='share-modal-close'
								onClick={() => setShowShare(false)}
							>
								Close
							</button>
						</div>
					</div>
				)}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '1.5rem',
						width: '100%',
						maxWidth: 340,
					}}
				>
					<button
						className='vibegrid-submit'
						style={{
							fontSize: '1.3rem',
							padding: '1.2rem 0',
						}}
						onClick={() => {
							setActivePuzzle(dailyPuzzle); // always get the latest daily puzzle
							setMode('daily');
						}}
					>
						Play Daily Puzzle
					</button>
					<button
						className='vibegrid-submit'
						style={{
							fontSize: '1.15rem',
							background:
								'linear-gradient(90deg,#f43f5e 0%,#facc15 100%)',
							color: '#fff',
							padding: '1.2rem 0',
						}}
						onClick={() => setShowCustomModal(true)}
					>
						🛠️ Custom Puzzle Mode
					</button>
					<button
						className='vibegrid-submit'
						style={{
							fontSize: '1.1rem',
							background:
								'linear-gradient(90deg,#38bdf8 0%,#fbbf24 100%)',
							color: '#222',
							padding: '1.1rem 0',
						}}
						onClick={() => setMode('browse')}
					>
						🔎 Browse Custom Puzzles
					</button>
					<button
						className='share-btn'
						onClick={handleGameShare}
						style={{ margin: '1.2rem auto 0.5rem auto' }}
					>
						<FontAwesomeIcon
							icon={faShareAlt}
							className='share-icon'
						/>
						Share VibeGrid
					</button>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							marginTop: '0.5rem',
						}}
					>
						<label
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 8,
								fontWeight: 600,
								fontSize: '1rem',
								cursor: 'pointer',
							}}
						>
							<input
								type='checkbox'
								checked={darkMode}
								onChange={(e) =>
									setDarkMode(e.target.checked)
								}
								style={{ marginRight: 8 }}
							/>
							🌙 Dark Mode
						</label>
					</div>
				</div>
				<CustomPuzzleModal
					open={showCustomModal}
					onClose={() => setShowCustomModal(false)}
				/>
			</div>
		);
	}

	// --- Daily puzzle play mode UI ---
	if (mode === 'daily' && activePuzzle) {
		const gridCols = activePuzzle.size?.cols || 4;
		const gridRows = activePuzzle.size?.rows || 4;
		const gridWordCount = gridRows * gridCols;
		const groupCount = activePuzzle.groups?.length || 4;
		const groupSize = activePuzzle.groups?.[0]?.length || 4;

		return (
			<div className='vibegrid-container'>
				<div
					className='vibegrid-header-row'
					style={{
						display: 'flex',
						alignItems: 'center',
						marginBottom: 24,
						position: 'relative',
						minHeight: 48,
						justifyContent: 'space-between',
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<button
							className='back-icon-btn'
							onClick={() => setMode('startup')}
							aria-label='Back'
						>
							<span
								style={{
									fontSize: '1.3em',
									lineHeight: 1,
									color: '#fff',
								}}
								aria-hidden='true'
							>
								&#8592;
							</span>
						</button>
						<div style={{ marginLeft: 52 }}>
							<h1
								className='vibegrid-title'
								style={{ margin: 0 }}
							>
								{activePuzzle.title || 'VibeGrid Daily'}
							</h1>
							<div className='vibegrid-subtitle'>
								Daily Puzzle
							</div>
						</div>
					</div>
					<button
						className='rules-btn'
						onClick={() => setShowRules(true)}
						aria-label='How to Play'
						style={{ marginLeft: 'auto' }}
					>
						<svg
							className='rules-icon'
							viewBox='0 0 24 24'
							width='28'
							height='28'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<circle cx='12' cy='12' r='10' />
							<line x1='12' y1='16' x2='12' y2='12' />
							<line x1='12' y1='8' x2='12' y2='8' />
						</svg>
					</button>
				</div>
				{solvedGroups.length > 0 && (
					<div className='vibegrid-solved-groups'>
						{pendingSolvedGroups.map(
							(group: string[], idx: number) => {
								// Find the group index in the puzzle's groups array
								const groupIdx =
									activePuzzle.groups.findIndex(
										(g: string[]) =>
											g.length === group.length &&
											g.every((w: string) =>
												group.includes(w)
											)
									);
								// Always use groupLabels if present
								let groupLabel = `Group ${groupIdx + 1}`;
								if (
									activePuzzle.groupLabels &&
									Array.isArray(activePuzzle.groupLabels) &&
									activePuzzle.groupLabels[groupIdx]
								) {
									groupLabel =
										activePuzzle.groupLabels[groupIdx];
								}
								return (
									<section
										className={`vibegrid-solved-group vibegrid-solved-group-${
											['easy', 'medium', 'hard', 'expert'][
												idx
											]
										}`}
										key={idx}
										role='img'
										aria-label={`Correct group ${groupLabel}. ${group.join(
											','
										)}`}
									>
										<h3 className='vibegrid-solved-category'>
											{groupLabel}
										</h3>
										<ol className='vibegrid-solved-word-list'>
											{group.map((word: string) => (
												<li
													className='vibegrid-solved-word'
													key={word}
												>
													{word}
												</li>
											))}
										</ol>
									</section>
								);
							}
						)}
					</div>
				)}
				<div
					className='vibegrid-grid'
					style={{
						gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
						gridTemplateRows: `repeat(${gridRows}, 1fr)`,
					}}
				>
					{gridWords.map((word: string) => (
						<WordButton
							key={word}
							word={word}
							isSelected={selectedWords.includes(word)}
							isLocked={lockedWords.includes(word)}
							onClick={() => handleWordTap(word)}
							burnSuspect={burnSuspect === word}
						/>
					))}
					{/* Animate matched group words out of the grid */}
					{animatingGroup &&
						animatingGroup.map((word: string) => (
							<WordButton
								key={word + '-animating'}
								word={word}
								isSelected={false}
								isLocked={true}
								onClick={() => {}}
								className='word-btn animating-to-solved'
							/>
						))}
				</div>
				{burnSuspect && (
					<div className='burn-status-bar'>
						🔥 Burn active: <b>{burnSuspect}</b>
						<button
							className='burn-btn'
							onClick={confirmBurn}
						>
							Confirm Burn
						</button>
					</div>
				)}
				<button
					className='vibegrid-submit'
					onClick={handleSubmit}
					disabled={attemptsLeft === 0 || gameOver}
				>
					Submit Group
				</button>
				<FeedbackBanner message={feedback} />
				<div className='vibegrid-attempts-bar'>
					{[...Array(attemptsLeft > 4 ? 5 : 4)].map(
						(_, i) => (
							<span
								key={i}
								className={
									'vibegrid-attempt-dot' +
									(i >= attemptsLeft ? ' used' : '')
								}
							></span>
						)
					)}
				</div>
				<p className='vibegrid-attempts'>
					Attempts Left: {attemptsLeft}
					<button
						className='randomize-btn'
						aria-label='Randomize word order'
						onClick={handleRandomize}
						style={{
							marginLeft: 12,
							verticalAlign: 'middle',
						}}
					>
						<span
							aria-hidden='true'
							style={{
								display: 'inline-block',
								transform: 'rotate(-45deg)',
								fontSize: '1.2em',
							}}
						>
							&#x267B;
						</span>
					</button>
					<button
						className='deselect-btn'
						aria-label='Deselect all'
						onClick={() => setSelectedWords([])}
						style={{
							marginLeft: 8,
							verticalAlign: 'middle',
							padding: '0.3em 0.9em',
							fontSize: '1em',
							borderRadius: 6,
							background: '#e5e7eb',
							color: '#222',
							border: 'none',
							cursor: 'pointer',
						}}
					>
						Deselect All
					</button>
				</p>
				{gameOver && (
					<EndGameModal
						message={
							lockedWords.length === gridWordCount
								? 'You nailed it!'
								: 'Vibe check failed.'
						}
						onRestart={handleRestart}
					/>
				)}
				<button
					className='share-btn'
					onClick={handleShare}
					style={{ marginTop: 16 }}
				>
					<svg
						className='share-icon'
						width='22'
						height='22'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						style={{
							marginRight: 8,
							verticalAlign: 'middle',
						}}
					>
						<circle cx='18' cy='5' r='3' />
						<circle cx='6' cy='12' r='3' />
						<circle cx='18' cy='19' r='3' />
						<line
							x1='8.59'
							y1='13.51'
							x2='15.42'
							y2='17.49'
						/>
						<line
							x1='15.41'
							y1='6.51'
							x2='8.59'
							y2='10.49'
						/>
					</svg>
					Share
				</button>
				{showShare && (
					<div
						className='share-modal'
						onClick={(e) =>
							e.target === e.currentTarget &&
							setShowShare(false)
						}
					>
						<div className='share-modal-content'>
							<h2>Share your VibeGrid result!</h2>
							<div className='share-links-grid'>
								{(() => {
									const rows = [];
									for (
										let i = 0;
										i < shareLinks.length;
										i += 3
									) {
										rows.push(
											<div
												className='share-links-row'
												key={i}
											>
												{shareLinks
													.slice(i, i + 3)
													.map((link) => (
														<a
															href={link.url}
															target='_blank'
															rel='noopener noreferrer'
															className='share-link'
															data-platform={link.name}
															key={link.name}
														>
															<span className='share-link-icon'>
																{link.icon}
															</span>{' '}
															{link.name}
														</a>
													))}
											</div>
										);
									}
									return rows;
								})()}
							</div>
							<button
								className='share-modal-close'
								onClick={() => setShowShare(false)}
							>
								Close
							</button>
						</div>
					</div>
				)}
				<RulesModal
					open={showRules}
					onClose={() => setShowRules(false)}
				/>
			</div>
		);
	}

	// --- Browse Custom Puzzles screen ---
	if (mode === 'browse') {
		return (
			<BrowseCustomPuzzles
				onBack={() => setMode('startup')}
				puzzles={customPuzzleList}
			/>
		);
	}

	return null;
}

export default App;
