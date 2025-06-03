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
	// --- State: shuffled words ---
	const [shuffledWords, setShuffledWords] = useState<
		string[]
	>(() => shuffle(dailyPuzzle.words));

	// Use useEffect to avoid repeated setTimeout calls on every render
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

	// --- Enhancement: focus management for accessibility ---
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

	// --- Always mix group and wildcard words together ---
	useEffect(() => {
		setShuffledWords(shuffle(dailyPuzzle.words));
		// eslint-disable-next-line
	}, []);

	const handleWordClick = (word: string) => {
		if (lockedWords.includes(word) || gameOver) return;
		setSelectedWords((prev) => {
			if (prev.includes(word)) {
				// Deselect if already selected
				return prev.filter((w) => w !== word);
			} else if (prev.length < 4) {
				// Select if under 4
				return [...prev, word];
			} else {
				// At max, do not allow more than 4
				return prev;
			}
		});
	};

	const handleSubmit = () => {
		if (gameOver) return;
		if (selectedWords.length !== 4) {
			setFeedback('Select exactly 4 words.');
			return;
		}

		const groupMatch = Object.values(
			dailyPuzzle.groups
		).find((group) =>
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
					dailyPuzzle.groups
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

	// --- Enhancement: keyboard navigation for accessibility ---
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLDivElement>
	) => {
		if (gameOver) return;
		if (e.key === 'Enter' || e.key === ' ') {
			const word = e.currentTarget.textContent || '';
			if (word) handleWordClick(word);
		}
	};

	// --- Enhancement: Share functionality ---
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

	const isWildcard = (word: string) =>
		dailyPuzzle.wildcards?.includes(word);

	// --- Double-tap/burn suspect logic ---
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
		} else if (selectedWords.length < 4) {
			setSelectedWords((prev) => [...prev, word]);
		}
	};

	// --- Burn action: called when burnSuspect is confirmed ---
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

	// --- Pro Mode: auto-burn if only one word left and in burn mode ---
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

	// --- VibeScore Calculation (Full Breakdown) ---
	const VIBETIME_THRESHOLD = 90; // seconds for 4x4
	const PUZZLE_CATEGORIES = dailyPuzzle.categories || [
		'General',
	];

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

	// --- Handler: randomize button ---
	const handleRandomize = () => {
		setShuffledWords(shuffle(dailyPuzzle.words));
	};

	return (
		<div className='vibegrid-container'>
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

			<div className='vibegrid-grid'>
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
						lockedWords.length === 16
							? `You nailed it! 🔥\nVibeScore: ${getVibeScore()}\nCategories: ${PUZZLE_CATEGORIES.join(
									', '
							  )}`
							: `Vibe check failed.\nVibeScore: ${getVibeScore()}\nCategories: ${PUZZLE_CATEGORIES.join(
									', '
							  )}`
					}
					onRestart={handleRestart}
				/>
			)}
		</div>
	);
}

export default App;
