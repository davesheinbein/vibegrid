import React, { useState, useEffect } from 'react';
import { dailyPuzzle } from './data/dailyPuzzle';
import { partialMatchFeedback } from './utils/gameLogic';
import { shuffle } from './utils/helpers';
import WordButton from './components/WordButton';
import FeedbackBanner from './components/FeedbackBanner';
import EndGameModal from './components/EndGameModal';
import RulesModal from './components/RulesModal';
import SignInModal from './components/SignInModal';
import StatisticsModal from './components/StatisticsModal';
import CustomPuzzleModal from './components/CustomPuzzleModal';
import BrowseCustomPuzzles from './pages/BrowseCustomPuzzles';
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
import {
	faShareAlt,
	faChartBar,
} from '@fortawesome/free-solid-svg-icons';

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
	const [showStats, setShowStats] = useState(false);
	const [user, setUser] = useState<null | {
		name: string;
		email: string;
		photoUrl?: string;
	}>({
		name: 'Jane Doe',
		email: 'jane@example.com',
		photoUrl: '',
	}); // set to null to simulate logged out
	const [dailyCompleted, setDailyCompleted] =
		useState(true); // set to false to simulate not completed
	const [showSignInModal, setShowSignInModal] =
		useState(false);

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
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<button
							className='rules-btn'
							aria-label='Statistics'
							onClick={() => setShowStats(true)}
							style={{ marginRight: 8 }}
						>
							<FontAwesomeIcon
								icon={faChartBar}
								className='rules-icon'
							/>
						</button>
						<button
							className='rules-btn'
							onClick={() => setShowRules(true)}
							aria-label='How to Play'
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
				{showStats && (
					<StatisticsModal
						open={showStats}
						onClose={() => setShowStats(false)}
						user={user}
						setUser={setUser}
						dailyCompleted={dailyCompleted}
					/>
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
						onClick={() => setShowSignInModal(true)}
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
					setCustomPuzzle={setCustomPuzzle}
					setMode={setMode}
				/>
				<SignInModal
					open={showSignInModal}
					onClose={() => {
						setShowSignInModal(false);
						setMode('daily');
					}}
					onSignIn={() => {
						// --- Google OAuth wireframe ---
						setUser({
							name: 'Jane Doe',
							email: 'jane@example.com',
						});
						setShowSignInModal(false);
						setMode('daily');
					}}
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
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<button
							className='rules-btn'
							aria-label='Statistics'
							onClick={() => setShowStats(true)}
							style={{ marginRight: 8 }}
						>
							<FontAwesomeIcon
								icon={faChartBar}
								className='rules-icon'
							/>
						</button>
						<button
							className='rules-btn'
							onClick={() => setShowRules(true)}
							aria-label='How to Play'
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
				{showStats && (
					<StatisticsModal
						open={showStats}
						onClose={() => setShowStats(false)}
						user={user}
						setUser={setUser}
						dailyCompleted={dailyCompleted}
					/>
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
				setCustomPuzzle={setCustomPuzzle}
				setMode={setMode}
				setCustomState={setCustomState}
			/>
		);
	}

	return null;
}

// --- Sign In Modal Component ---
// (moved to ./components/SignInModal.tsx)

// --- Statistics Modal Component ---
// (moved to ./components/StatisticsModal.tsx)

export default App;
