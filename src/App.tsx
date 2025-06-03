import React, { useState, useEffect } from 'react';
import { dailyPuzzle } from './data/dailyPuzzle';
import {
	checkGroupValidity,
	partialMatchFeedback,
} from './utils/gameLogic';
import WordButton from './components/WordButton';
import FeedbackBanner from './components/FeedbackBanner';
import EndGameModal from './components/EndGameModal';
import RulesModal from './components/RulesModal';
import { ReactComponent as InfoIcon } from './logo.svg'; // Use logo.svg as placeholder for rules icon
import './App.scss';

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
		'startup' | 'daily' | 'custom'
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

	// --- Get grid size and group size dynamically ---
	const gridCols = 4;
	const gridRows = Math.ceil(
		dailyPuzzle.words.length / gridCols
	);
	const gridWordCount = gridRows * gridCols;
	const groupCount = dailyPuzzle.groups?.length || 4;
	const groupSize = dailyPuzzle.groups?.[0]?.length || 4;
	const maxSelectable = groupSize;

	// --- State: shuffled words (dynamic count) ---
	const [shuffledWords, setShuffledWords] = useState<
		string[]
	>(() =>
		shuffle(dailyPuzzle.words.slice(0, gridWordCount))
	);

	// --- Custom Puzzle Modal Placeholder ---
	const CustomPuzzleModal = ({
		open,
		onClose,
	}: {
		open: boolean;
		onClose: () => void;
	}) => {
		if (!open) return null;
		return (
			<div
				className='share-modal'
				onClick={(e) =>
					e.target === e.currentTarget && onClose()
				}
			>
				<div className='share-modal-content'>
					<h2>Custom Puzzle Creator 🛠️</h2>
					<p>
						Build and play your own VibeGrid puzzle! (Coming
						soon)
					</p>
					<button
						className='share-modal-close'
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		);
	};

	// --- Helper functions and variables used in hooks ---
	const isWildcard = (word: string) =>
		dailyPuzzle.wildcards?.includes(word);

	const confirmBurn = () => {
		if (!burnSuspect) return;
		if (isWildcard(burnSuspect)) {
			setBurnedWildcards((prev) => [...prev, burnSuspect]);
			setLockedWords((prev) => [...prev, burnSuspect]);
			setBurnBonus(
				(prev) => prev + (attemptsLeft >= 2 ? 10 : 5)
			);
			setFeedback('🔥 Correct burn! Bonus awarded.');
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
			.map((cat) => {
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
		const groupMatch = dailyPuzzle.groups.find((group) =>
			selectedWords.every((word) => group.includes(word))
		);
		if (
			groupMatch &&
			!solvedGroups.some((g) =>
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
						dailyPuzzle.groups.map((g, i) => [i, g])
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

	const getShareText = () => {
		const solved = solvedGroups.length;
		const attempts = 4 - attemptsLeft;
		return `VibeGrid: ${solved}/4 groups solved in ${attempts} attempts! ${
			lockedWords.length === 16 ? '🔥' : 'Try it yourself!'
		} https://vibegrid.app`;
	};

	const handleShare = async () => {
		const text = getShareText();
		if (navigator.share) {
			try {
				await navigator.share({ text });
				return;
			} catch {}
		}
		setShowShare(true);
	};

	const shareLinks = [
		{
			name: 'X',
			url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				getShareText()
			)}`,
			icon: '🐦',
		},
		{
			name: 'Facebook',
			url: `https://www.facebook.com/sharer/sharer.php?u=https://vibegrid.app&quote=${encodeURIComponent(
				getShareText()
			)}`,
			icon: '📘',
		},
		{
			name: 'Reddit',
			url: `https://www.reddit.com/submit?title=VibeGrid&text=${encodeURIComponent(
				getShareText()
			)}`,
			icon: '👽',
		},
		{
			name: 'LinkedIn',
			url: `https://www.linkedin.com/sharing/share-offsite/?url=https://vibegrid.app`,
			icon: '💼',
		},
	];

	// --- All hooks must be called unconditionally (move all useEffect here) ---
	useEffect(() => {
		if (lockedWords.length === 16 || attemptsLeft === 0) {
			setEndTime(Date.now());
			const timer = setTimeout(
				() => setGameOver(true),
				500
			);
			return () => clearTimeout(timer);
		}
	}, [lockedWords.length, attemptsLeft]);

	useEffect(() => {
		if (!gameOver && selectedWords.length > 0) {
			const lastSelected =
				selectedWords[selectedWords.length - 1];
			const el = document.querySelector(
				`[data-word='${lastSelected}']`
			);
			if (el) (el as HTMLElement).focus();
		}
	}, [selectedWords, gameOver]);

	useEffect(() => {
		setShuffledWords(
			shuffle(dailyPuzzle.words.slice(0, gridWordCount))
		);
		// eslint-disable-next-line
	}, [gridWordCount]);

	useEffect(() => {
		const ungrouped = dailyPuzzle.words.filter(
			(w) =>
				!lockedWords.includes(w) &&
				!burnedWildcards.includes(w)
		);
		if (
			ungrouped.length === 1 &&
			burnSuspect === ungrouped[0] &&
			!gameOver
		) {
			confirmBurn();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lockedWords, burnedWildcards, burnSuspect, gameOver]);

	useEffect(() => {
		if (gameOver && endTime) {
			const groups = solvedGroups.length;
			const totalGroups = groupCount;
			const time = Math.round((endTime - startTime) / 1000);
			const correctBurns = burnedWildcards.filter((w) =>
				isWildcard(w)
			).length;
			const totalBurns = burnedWildcards.length;
			const win = lockedWords.length === gridWordCount;
			const score = getVibeScore();
			updateVibeTrackerStats({
				categories: dailyPuzzle.categories || ['General'],
				score,
				correctGroups: groups,
				totalGroups,
				correctBurns,
				totalBurns,
				time,
				win,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameOver, endTime]);

	// --- Reset state when switching modes (must be before any return) ---
	useEffect(() => {
		if (mode === 'daily') {
			setSelectedWords([]);
			setLockedWords([]);
			setFeedback('');
			setAttemptsLeft(4);
			setGameOver(false);
			setSolvedGroups([]);
			setShuffledWords(
				shuffle(dailyPuzzle.words.slice(0, gridWordCount))
			);
		}
		// eslint-disable-next-line
	}, [mode]);

	// --- Startup screen UI ---
	if (mode === 'startup') {
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
						onClick={() => setMode('daily')}
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
				</div>
				<CustomPuzzleModal
					open={showCustomModal}
					onClose={() => setShowCustomModal(false)}
				/>
			</div>
		);
	}

	return (
		<div className='vibegrid-container'>
			{/* Add a floating custom puzzle button (🛠️) in daily mode only */}
			{mode === 'daily' && (
				<button
					style={{
						position: 'fixed',
						bottom: 24,
						right: 24,
						zIndex: 100,
						background:
							'linear-gradient(90deg,#f43f5e 0%,#facc15 100%)',
						color: '#fff',
						border: 'none',
						borderRadius: '50%',
						width: 56,
						height: 56,
						fontSize: 32,
						boxShadow: '0 2px 12px 0 rgba(244,63,94,0.15)',
						cursor: 'pointer',
					}}
					aria-label='Create or play a custom puzzle'
					onClick={() => setShowCustomModal(true)}
				>
					🛠️
				</button>
			)}
			<CustomPuzzleModal
				open={showCustomModal}
				onClose={() => setShowCustomModal(false)}
			/>
			<div className='vibegrid-header'>
				<div>
					<h1 className='vibegrid-title'>VibeGrid 🎛️</h1>
					<div className='vibegrid-subtitle'>
						Can you feel the connection?
					</div>
				</div>
				<button
					className='rules-btn'
					aria-label='Game Rules'
					onClick={() => setShowRules(true)}
				>
					<InfoIcon className='rules-icon' />
				</button>
			</div>

			{/* Enhancement: Show solved groups visually for clarity */}
			{solvedGroups.length > 0 && (
				<div className='vibegrid-solved-groups'>
					{solvedGroups.map((group, idx) => (
						<div
							className='vibegrid-solved-group'
							key={idx}
						>
							{group.map((word) => (
								<span
									className='vibegrid-solved-word'
									key={word}
								>
									{word}
								</span>
							))}
						</div>
					))}
				</div>
			)}

			<div
				className='vibegrid-grid'
				style={{
					gridTemplateColumns: `repeat(4, 1fr)`,
					gridTemplateRows: `repeat(${gridRows}, 1fr)`,
				}}
			>
				{shuffledWords.map((word) => (
					<WordButton
						key={word}
						word={word}
						isSelected={selectedWords.includes(word)}
						isLocked={lockedWords.includes(word)}
						onClick={() => handleWordTap(word)}
						data-word={word}
						className={
							'word-btn' +
							(selectedWords.includes(word)
								? ' selected'
								: lockedWords.includes(word)
								? ' locked'
								: '') +
							(burnSuspect === word
								? ' burn-suspect'
								: '') +
							(shake && selectedWords.includes(word)
								? ' shake'
								: '')
						}
						burnSuspect={burnSuspect === word}
					/>
				))}
			</div>
			{/* Burn status bar */}
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
				{[...Array(4)].map((_, i) => (
					<span
						key={i}
						className={
							'vibegrid-attempt-dot' +
							(i >= attemptsLeft ? ' used' : '')
						}
					></span>
				))}
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
			</p>

			<button
				className='share-btn'
				onClick={handleShare}
				aria-label='Share your score'
			>
				<span className='share-icon'>🚀</span> Share
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
						<h3>Share your score</h3>
						<div className='share-links'>
							{shareLinks.map((link) => (
								<a
									key={link.name}
									href={link.url}
									target='_blank'
									rel='noopener noreferrer'
									className='share-link'
								>
									<span className='share-link-icon'>
										{link.icon}
									</span>{' '}
									{link.name}
								</a>
							))}
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

			{gameOver && (
				<EndGameModal
					message={
						lockedWords.length === gridWordCount
							? `You nailed it! 🔥\nVibeScore: ${getVibeScore()}\nCategories: ${PUZZLE_CATEGORIES.join(
									', '
							  )}\n\nVibeTracker:\n${getVibeTrackerSummary()}`
							: `Vibe check failed.\nVibeScore: ${getVibeScore()}\nCategories: ${PUZZLE_CATEGORIES.join(
									', '
							  )}\n\nVibeTracker:\n${getVibeTrackerSummary()}`
					}
					onRestart={handleRestart}
				/>
			)}
		</div>
	);
}

export default App;
