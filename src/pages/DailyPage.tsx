// Directory for page-level components and layout logic
// Each file here should represent a top-level route or page (e.g., DailyPage, StartupPage, CustomPage)

// DailyPage component with self-contained daily puzzle logic and UI

import React, { useState, useEffect } from 'react';
import { dailyPuzzle } from '../data/dailyPuzzle';
import { partialMatchFeedback } from '../utils/gameLogic';
import { shuffle } from '../utils/helpers';
import WordButton from '../components/WordButton';
import FeedbackBanner from '../components/FeedbackBanner';
import EndGameModal from '../components/EndGameModal';
import RulesModal from '../components/RulesModal';
import StatisticsModal from '../components/StatisticsModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

const DailyPage: React.FC = () => {
	// --- State declarations ---
	const [selectedWords, setSelectedWords] = useState<
		string[]
	>([]);
	const [lockedWords, setLockedWords] = useState<string[]>(
		[]
	);
	const [feedback, setFeedback] = useState('');
	const [attemptsLeft, setAttemptsLeft] = useState(4);
	const [gameOver, setGameOver] = useState(false);
	const [solvedGroups, setSolvedGroups] = useState<
		string[][]
	>([]);
	const [showRules, setShowRules] = useState(false);
	const [showStats, setShowStats] = useState(false);
	const [shake, setShake] = useState(false);
	const [burnSuspect, setBurnSuspect] = useState<
		string | null
	>(null);
	const [burnedWildcards, setBurnedWildcards] = useState<
		string[]
	>([]);
	const [burnBonus, setBurnBonus] = useState(0);
	const [startTime] = useState(Date.now());
	const [endTime, setEndTime] = useState<number | null>(
		null
	);

	// --- Puzzle setup ---
	const activePuzzle = dailyPuzzle;
	const gridCols = activePuzzle.size?.cols || 4;
	const gridRows =
		activePuzzle.size?.rows ||
		Math.ceil(
			(activePuzzle.words?.length || 16) / gridCols
		);
	const gridWordCount = gridRows * gridCols;
	const groupCount = activePuzzle.groups?.length || 4;
	const groupSize = activePuzzle.groups?.[0]?.length || 4;

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
	const [animatingGroup, setAnimatingGroup] = useState<
		string[] | null
	>(null);
	const [pendingSolvedGroups, setPendingSolvedGroups] =
		useState<string[][]>([]);
	useEffect(() => {
		if (
			solvedGroups.length > 0 &&
			pendingSolvedGroups.length < solvedGroups.length
		) {
			const newGroup =
				solvedGroups[solvedGroups.length - 1];
			setAnimatingGroup(newGroup);
			setTimeout(() => {
				setPendingSolvedGroups((prev) => [
					...prev,
					newGroup,
				]);
				setAnimatingGroup(null);
			}, 700);
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
		const groupMatch = activePuzzle.groups.find(
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
						activePuzzle.groups.map(
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
		setShuffledWords(shuffle(activePuzzle.words));
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
					style={{ display: 'flex', alignItems: 'center' }}
				>
					<button
						className='back-icon-btn'
						// TODO: wire up navigation to StartupPage
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
					style={{ display: 'flex', alignItems: 'center' }}
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
							const groupIdx =
								activePuzzle.groups.findIndex(
									(g: string[]) =>
										g.length === group.length &&
										g.every((w: string) =>
											group.includes(w)
										)
								);
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
			{/* Share, Rules, and Stats modals */}
			<StatisticsModal
				open={showStats}
				onClose={() => setShowStats(false)}
				user={null}
				setUser={() => {}}
				dailyCompleted={true}
			/>
			<RulesModal
				open={showRules}
				onClose={() => setShowRules(false)}
			/>
		</div>
	);
};

export default DailyPage;
