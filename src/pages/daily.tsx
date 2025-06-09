import React, {
	useEffect,
	useContext,
	useState,
} from 'react';
import { useRouter } from 'next/router';
import {
	dailyPuzzle,
	shuffle,
	getShareUrl,
	getShareTitle,
	getShareText,
	copyToClipboard,
	getAllWordsFromGroupsAndWildcards,
} from '../utils/helpers';
import {
	checkGroupValidity,
	partialMatchFeedback,
	groupsArrayToObject,
} from '../utils/gameLogic';
import {
	WordButton,
	GoBackButton,
	CopyLinkButton,
} from '../components/ui/Buttons';
import FeedbackBanner from '../components/ui/FeedbackBanner';
import EndGameModal from '../components/modal/EndGameModal';
import RulesModal from '../components/modal/RulesModal';
import StatisticsModal from '../components/modal/StatisticsModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChartBar,
	faInfo,
	faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
	faXTwitter,
	faMeta,
	faReddit,
	faLinkedin,
	faTiktok,
	faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../components/ui/Modal';
import { UserSettingsContext } from '../components/ui/UserSettingsProvider';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
	setSelectedWords,
	setLockedWords,
	setFeedback,
	setAttempts,
	setSolvedGroups,
	setCurrentGroup,
	setIsSolved,
} from '../store/gameSlice';
import {
	addToArray,
	removeFromArray,
	setFeedbackMsg,
	addLockedWords,
	addSolvedGroup,
	addSelectedWord,
	removeSelectedWord,
	clearSelectedWords,
	setAttemptsValue,
} from '../utils/helpers';
import PreGameModal from '../components/modal/PreGameModal';
import {
	getDailyCompletion,
	setDailyCompletion,
	getDailyPuzzleProgress,
	saveDailyPuzzleProgress,
	clearDailyPuzzleProgress,
} from '../utils/dailyCompletion';
import { getShareLinks } from '../utils/shareLinks';

// --- Helper functions for updating arrays in Redux state ---
// (Now imported from src/utils/helpers.ts)

interface DailyPageProps {
	onBack?: () => void;
}

export default function Daily(props: DailyPageProps) {
	const dispatch = useDispatch();
	const selectedWords = useSelector(
		(state: RootState) => state.game.selectedWords
	);
	const lockedWords = useSelector(
		(state: RootState) => state.game.lockedWords
	);
	const feedback = useSelector(
		(state: RootState) => state.game.feedback
	);
	const attemptsLeft = useSelector(
		(state: RootState) => state.game.attempts
	);
	const solvedGroups = useSelector(
		(state: RootState) => state.game.solvedGroups
	);
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
	const [showShare, setShowShare] = useState(false);
	const [user, setUser] = useState<{
		name: string;
		email: string;
		photoUrl?: string;
	} | null>(null);
	const [showGameOverBanner, setShowGameOverBanner] =
		useState(false);
	const [finishTime, setFinishTime] = useState<
		number | null
	>(null);
	const [gameOver, setGameOver] = useState(false);
	const [alreadyCompleted, setAlreadyCompleted] =
		useState<null | ReturnType<typeof getDailyCompletion>>(
			null
		);

	const { settings } = useContext(UserSettingsContext);
	const router = useRouter();

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

	const [shuffledWords, setShuffledWords] = useState<
		string[]
	>([]);

	useEffect(() => {
		setShuffledWords(
			shuffle(
				getAllWordsFromGroupsAndWildcards(
					activePuzzle.groups,
					activePuzzle.wildcards
				)
			)
		);
	}, [activePuzzle]);

	useEffect(() => {
		setShuffledWords(
			shuffle(
				getAllWordsFromGroupsAndWildcards(
					activePuzzle.groups,
					activePuzzle.wildcards
				)
			)
		);
		clearSelectedWords(dispatch);
		addLockedWords(dispatch, [], []); // reset lockedWords to []
		setFeedbackMsg(dispatch, '');
		setAttemptsValue(dispatch, 4);
		addSolvedGroup(dispatch, [], []); // reset solvedGroups to []
		setBurnSuspect(null);
		setBurnedWildcards([]);
		setBurnBonus(0);
		setEndTime(null);
		setPendingSolvedGroups([]); // <-- always reset solved groups for share modal
	}, [activePuzzle]);

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

	const solvedWords = pendingSolvedGroups.flat();
	const animatingWords = animatingGroup || [];
	const gridWords = shuffledWords.filter(
		(word) =>
			!solvedWords.includes(word) &&
			!animatingWords.includes(word)
	);

	const isWildcard = (word: string) =>
		activePuzzle.wildcards?.includes(word);

	const confirmBurn = () => {
		if (!burnSuspect) return;
		if (isWildcard(burnSuspect)) {
			const newBurned = [...burnedWildcards, burnSuspect];
			setBurnedWildcards(newBurned);
			addLockedWords(dispatch, lockedWords, burnSuspect);
			setBurnBonus(
				(prev) => prev + (attemptsLeft >= 2 ? 10 : 5)
			);
			setAttemptsValue(dispatch, attemptsLeft + 1); // Always increment by 1 for each wildcard burn
			setFeedbackMsg(
				dispatch,
				'🔥 Correct burn! Bonus awarded!'
			);
			if (
				activePuzzle.wildcards &&
				activePuzzle.wildcards.length > 0 &&
				activePuzzle.wildcards.every((w: string) =>
					newBurned.includes(w)
				)
			) {
				setFeedbackMsg(
					dispatch,
					'🔥 All wildcards burned! Extra attempt awarded!'
				);
			}
		} else {
			setAttemptsValue(dispatch, attemptsLeft - 1);
			setFeedbackMsg(
				dispatch,
				'❌ That word belongs to a group! Penalty.'
			);
		}
		setBurnSuspect(null);
		clearSelectedWords(dispatch);
	};

	const handleWordTap = (word: string) => {
		if (alreadyCompleted) return; // Prevent interaction if already completed
		if (selectedWords.includes(word)) {
			removeSelectedWord(dispatch, selectedWords, word);
		} else {
			if (selectedWords.length >= groupSize) {
				setFeedbackMsg(
					dispatch,
					`You can only select up to ${groupSize} words.`
				);
				return;
			}
			addSelectedWord(dispatch, selectedWords, word);
		}
	};

	const handleWordRightClick = (
		word: string,
		e: React.MouseEvent
	) => {
		e.preventDefault();
		if (lockedWords.includes(word) || gameOver) return;
		setBurnSuspect((prev) => (prev === word ? null : word));
	};

	const handleSubmit = () => {
		if (alreadyCompleted) return; // Prevent interaction if already completed
		if (gameOver) return;
		if (selectedWords.length !== groupSize) {
			setFeedbackMsg(
				dispatch,
				`Select exactly ${groupSize} words.`
			);
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
			addLockedWords(dispatch, lockedWords, selectedWords);
			addSolvedGroup(dispatch, solvedGroups, groupMatch);
			setFeedbackMsg(dispatch, 'Group locked in!');
			clearSelectedWords(dispatch);
		} else if (groupMatch) {
			setFeedbackMsg(
				dispatch,
				'This group is already solved.'
			);
			clearSelectedWords(dispatch);
		} else {
			setAttemptsValue(dispatch, attemptsLeft - 1);
			setFeedbackMsg(
				dispatch,
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
			clearSelectedWords(dispatch);
		}
	};

	const handleRestart = () => {
		clearSelectedWords(dispatch);
		addLockedWords(dispatch, [], []); // reset lockedWords to []
		setFeedbackMsg(dispatch, '');
		setAttemptsValue(dispatch, 4);
		addSolvedGroup(dispatch, [], []); // reset solvedGroups to []
		setPendingSolvedGroups([]); // <-- always reset solved groups for share modal
	};

	const handleRandomize = () => {
		setShuffledWords(shuffle(activePuzzle.words));
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

	// Helper to check if all groups are solved (excluding wildcards)
	const allGroupsSolved = () => {
		// Only count groups, not wildcards
		const solvedWords = pendingSolvedGroups.flat();
		const groupWords = activePuzzle.groups.flat();
		return groupWords.every((w: string) =>
			solvedWords.includes(w)
		);
	};

	// Calculate final score
	const getFinalScore = () => {
		// 100 base for win, 0 for loss
		const base = allGroupsSolved() ? 100 : 0;
		// Each remaining attempt is worth 10 points (if win)
		const attemptsBonus = allGroupsSolved()
			? attemptsLeft * 10
			: 0;
		// burnBonus is already tracked
		return base + burnBonus + attemptsBonus;
	};

	// Format timer MM:SS
	const formatTimer = (t: number) => {
		const mm = String(Math.floor(t / 60)).padStart(2, '0');
		const ss = String(t % 60).padStart(2, '0');
		return `${mm}:${ss}`;
	};

	const getShareText = () => {
		const solved = pendingSolvedGroups.length; // Use actual solved groups
		const attempts = 4 - attemptsLeft;
		const words = lockedWords.length;
		const total = gridWordCount;
		const score = getFinalScore();
		const url = getShareUrl();
		let timeStr = '';
		if (finishTime !== null) {
			timeStr = ` in ${formatTimer(finishTime)}`;
		}
		return `I scored ${score} in ${solved}/${groupCount} groups solved in ${attempts} attempts${timeStr}! on Grid Royale!\nCan you beat my score? Try the daily puzzle:\n${url}`;
	};
	const getShareUrl = () => 'https://gridRoyale.app';
	const getShareTitle = () =>
		"Grid Royale: Can you solve today's grid?";
	const shareText = `I scored ${getFinalScore()} in ${
		pendingSolvedGroups.length
	}/${groupCount} groups solved in ${attemptsLeft} attempts${
		finishTime ? ` in ${formatTimer(finishTime)}` : ''
	}! on Grid Royale!\nCan you beat my score? Try the daily puzzle:`;
	const shareUrl = getShareUrl();
	const shareTitle = getShareTitle();
	const shareLinks = getShareLinks(
		'result',
		shareText,
		shareUrl,
		shareTitle
	);

	useEffect(() => {
		if (!gameOver) {
			if (allGroupsSolved()) {
				dispatch(setIsSolved(true));
				setShowGameOverBanner(false);
				setEndTime(Date.now());
				setGameOver(true);
			} else if (attemptsLeft === 0) {
				dispatch(setIsSolved(false));
				setShowGameOverBanner(true);
				setEndTime(Date.now());
				setGameOver(true);
			}
		}
	}, [attemptsLeft, pendingSolvedGroups, gameOver]);

	// Pre-game modal and timer state
	const [showPreGameModal, setShowPreGameModal] =
		useState(true);
	const [showCountdown, setShowCountdown] = useState(false);
	const [countdownValue, setCountdownValue] = useState(3);
	const [timerActive, setTimerActive] = useState(false);
	const [timer, setTimer] = useState(0); // seconds
	const [timerInterval, setTimerInterval] =
		useState<NodeJS.Timeout | null>(null);
	const [showGrid, setShowGrid] = useState(false);

	// Start timer when timerActive becomes true
	useEffect(() => {
		if (timerActive) {
			const interval = setInterval(() => {
				setTimer((t) => t + 1);
			}, 1000);
			setTimerInterval(interval);
			return () => clearInterval(interval);
		} else if (timerInterval) {
			clearInterval(timerInterval);
		}
	}, [timerActive]);

	// Clean up timer on unmount
	useEffect(() => {
		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	}, [timerInterval]);

	// Countdown animation logic
	useEffect(() => {
		if (showCountdown) {
			if (countdownValue > 0) {
				const timeout = setTimeout(() => {
					setCountdownValue((v) => v - 1);
				}, 500);
				return () => clearTimeout(timeout);
			} else {
				// Show 'Go!' for 1s, then enable grid and timer
				const timeout = setTimeout(() => {
					setShowCountdown(false);
					setTimerActive(true);
					setShowGrid(true);
				}, 1000);
				return () => clearTimeout(timeout);
			}
		}
	}, [showCountdown, countdownValue]);

	// When the game ends, set finishTime to timer
	useEffect(() => {
		if (gameOver && finishTime === null) {
			setFinishTime(timer);
		}
	}, [gameOver, timer, finishTime]);

	// On mount, check if daily puzzle is already completed for today
	useEffect(() => {
		const completion = getDailyCompletion();
		const today = new Date();
		const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
		let completedToday = false;
		if (
			completion &&
			completion.result &&
			completion.result.finishTime > 0 &&
			completion.result.timestamp
		) {
			const completedDate = new Date(
				completion.result.timestamp
			);
			const completedStr = completedDate
				.toISOString()
				.slice(0, 10);
			completedToday = completedStr === todayStr;
		}
		if (completedToday && completion) {
			setAlreadyCompleted(completion);
			setGameOver(true);
			setFinishTime(completion.result.finishTime);
		} else {
			setAlreadyCompleted(null); // Not completed for today
			setGameOver(false); // Allow play/resume
		}
	}, []);

	// When game is over and not already saved, save completion with timestamp only
	useEffect(() => {
		if (
			gameOver &&
			!alreadyCompleted &&
			finishTime !== null &&
			finishTime > 0 // Only save if the user actually played
		) {
			setDailyCompletion({
				win: allGroupsSolved(),
				score: getFinalScore(),
				attemptsLeft,
				burnBonus,
				finishTime,
				timestamp: Date.now(),
			});
		}
	}, [gameOver, alreadyCompleted, finishTime]);

	const todayStr = new Date().toISOString().slice(0, 10);

	// Restore progress on mount
	useEffect(() => {
		const progress = getDailyPuzzleProgress();
		if (
			progress &&
			progress.puzzleDate === todayStr &&
			!progress.completed
		) {
			setPendingSolvedGroups(progress.matchedGroups || []);
			setAttemptsValue(
				dispatch,
				progress.remainingAttempts ?? 4
			);
			setBurnedWildcards(progress.burnedWords || []);
			setTimer(progress.elapsedTime || 0);
			setBurnBonus(progress.burnBonus || 0);
			// Optionally restore more state (selectedWords, etc)
		} else {
			clearDailyPuzzleProgress();
			// Start fresh for today
		}
	}, []);

	// Persist progress on every move (pendingSolvedGroups, attemptsLeft, burnedWildcards, timer, burnBonus)
	useEffect(() => {
		if (!gameOver && !alreadyCompleted) {
			saveDailyPuzzleProgress({
				puzzleDate: todayStr,
				createdAt: new Date().toISOString(),
				matchedGroups: pendingSolvedGroups,
				remainingAttempts: attemptsLeft,
				burnedWords: burnedWildcards,
				elapsedTime: timer,
				completed: false,
				burnBonus,
			});
		}
	}, [
		pendingSolvedGroups,
		attemptsLeft,
		burnedWildcards,
		timer,
		burnBonus,
		gameOver,
		alreadyCompleted,
	]);

	// Clear progress on completion
	useEffect(() => {
		if (gameOver || alreadyCompleted) {
			clearDailyPuzzleProgress();
		}
	}, [gameOver, alreadyCompleted]);

	return (
		<div className='fullscreen-bg'>
			<div className='gridRoyale-container'>
				{/* Pre-game Modal Overlay */}
				{showPreGameModal && (
					<PreGameModal
						open={showPreGameModal}
						onReady={() => {
							setShowPreGameModal(false);
							setShowCountdown(true);
							setCountdownValue(3);
						}}
						onGoHome={() => router.push('/')}
					/>
				)}
				{/* Countdown Animation */}
				{showCountdown && (
					<div className='pregame-countdown-overlay'>
						<div className='pregame-countdown-text'>
							{countdownValue > 0 ? countdownValue : 'Go!'}
						</div>
					</div>
				)}
				{/* Game Over Banner */}
				{showGameOverBanner && (
					<FeedbackBanner message='Game Over! You are out of attempts.' />
				)}
				<div className='gridRoyale-header-row'>
					<GoBackButton
						onClick={
							props.onBack
								? props.onBack
								: () => window.location.assign('/')
						}
						className='back-icon-btn'
						label='Back'
					/>
					<div className='gridRoyale-header-heading'>
						<h1 className='gridRoyale-title'>
							{activePuzzle.title || 'gridRoyale Daily'}
						</h1>
						<div className='gridRoyale-subtitle'>
							Daily Puzzle
						</div>
						{/* Timer under heading */}
						{timerActive &&
							!showPreGameModal &&
							!showCountdown && (
								<div className='daily-timer'>
									{formatTimer(timer)}
								</div>
							)}
					</div>
					<div
						className='gridRoyale-icons'
						style={{
							display: 'flex',
							gap: 8,
							alignItems: 'center',
							justifyContent: 'flex-end',
							minWidth: 80,
						}}
					>
						<button
							className='rules-btn'
							aria-label='Statistics'
							onClick={() => setShowStats(true)}
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
							<FontAwesomeIcon
								icon={faInfoCircle}
								className='rules-icon'
							/>
						</button>
					</div>
				</div>
				{/* Dimmed grid overlay if pregame modal or countdown is active */}
				{!showPreGameModal && (
					<div
						className={`daily-center-flex-row${
							showCountdown ? ' dimmed-grid' : ''
						}`}
					>
						{!showGrid && (
							<div className='pregame-waiting-message'>
								{showCountdown ? (
									<>
										<div className='pregame-waiting-dot' />
										<div className='pregame-waiting-dot' />
										<div className='pregame-waiting-dot' />
									</>
								) : (
									'Get Ready...'
								)}
							</div>
						)}
						{showGrid && (
							<div
								className='gridRoyale-grid daily-grid'
								data-cols={gridCols}
								data-rows={gridRows}
								style={{
									gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
								}}
							>
								{gridWords.map((word: string) => (
									<WordButton
										key={word}
										word={word}
										isSelected={selectedWords.includes(
											word
										)}
										isLocked={lockedWords.includes(word)}
										isBurned={burnedWildcards.includes(
											word
										)}
										onClick={() =>
											!showCountdown && handleWordTap(word)
										}
										onContextMenu={(e: React.MouseEvent) =>
											!showCountdown &&
											handleWordRightClick(word, e)
										}
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
						)}
					</div>
				)}
				{/* --- Pregame Modal Grid Lockout --- */}
				{(showPreGameModal || !showGrid) && (
					<div className='daily-center-flex-row pregame-grid-lockout'>
						<div
							className='gridRoyale-grid daily-grid pregame-grid-blur'
							data-cols={gridCols}
							data-rows={gridRows}
							style={{
								gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
							}}
						>
							{gridWords.map((_, idx) => (
								<div
									key={idx}
									className='word-btn pregame-grid-cell-lockout'
									style={{
										pointerEvents: 'none',
										userSelect: 'none',
										cursor: 'not-allowed',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 28,
										fontWeight: 700,
										color: '#64748b',
										background: '#f1f5f9',
										border: '1px solid #e5e7eb',
										borderRadius: 8,
										minHeight: 44,
									}}
								>
									<span
										style={{
											fontSize: 32,
											fontWeight: 800,
										}}
									>
										×
									</span>
								</div>
							))}
						</div>
					</div>
				)}
				<div className='gridRoyale-controls'>
					{!burnSuspect && (
						<div
							className='gridRoyale-submit-wrapper'
							style={{ justifyContent: 'center' }}
						>
							<button
								className='gridRoyale-submit'
								onClick={handleSubmit}
								disabled={attemptsLeft === 0 || gameOver}
								style={{ margin: '0 auto' }}
							>
								Submit
							</button>
						</div>
					)}
					{burnSuspect && (
						<div className='burn-status-bar'>
							🔥 Burn active 🔥 <b>{burnSuspect}</b>
							<button
								className='burn-btn'
								onClick={confirmBurn}
							>
								Confirm Burn
							</button>
						</div>
					)}
					<div className='daily-controls-flex-col'>
						<FeedbackBanner message={feedback[0] || ''} />
						<div className='gridRoyale-attempts-bar'>
							{[...Array(attemptsLeft > 4 ? 5 : 4)].map(
								(_, i) => (
									<span
										key={i}
										className={
											'gridRoyale-attempt-dot' +
											(i >= attemptsLeft ? ' used' : '')
										}
									></span>
								)
							)}
						</div>
						<div className='gridRoyale-attempts'>
							Attempts Left: {attemptsLeft}
						</div>
						<div className='gridRoyale-attempts'>
							<button
								className='randomize-btn'
								aria-label='Randomize word order'
								onClick={handleRandomize}
							>
								Mix It Up!
							</button>
							<button
								className='deselect-btn'
								aria-label='Deselect all'
								onClick={() =>
									dispatch(setSelectedWords([]))
								}
							>
								Deselect All
							</button>
						</div>
					</div>
					<button
						className='share-btn'
						onClick={handleShare}
					>
						<FontAwesomeIcon
							icon={faShareAlt}
							className='share-icon'
						/>
						Share
					</button>
				</div>
				{!showPreGameModal &&
					!showCountdown &&
					(alreadyCompleted || gameOver) && (
						<EndGameModal
							message={
								(alreadyCompleted &&
									alreadyCompleted.result.win) ||
								allGroupsSolved()
									? 'You nailed it!'
									: 'Vibe check failed.'
							}
							score={
								alreadyCompleted
									? alreadyCompleted.result.score
									: getFinalScore()
							}
							attemptsLeft={
								alreadyCompleted
									? alreadyCompleted.result.attemptsLeft
									: attemptsLeft
							}
							burnBonus={
								alreadyCompleted
									? alreadyCompleted.result.burnBonus
									: burnBonus
							}
							win={
								alreadyCompleted
									? alreadyCompleted.result.win
									: allGroupsSolved()
							}
							onShare={() => setShowShare(true)}
							finishTime={
								alreadyCompleted
									? typeof alreadyCompleted.result
											.finishTime === 'number'
										? formatTimer(
												alreadyCompleted.result.finishTime
										  )
										: ''
									: finishTime !== null
									? formatTimer(finishTime)
									: ''
							}
						/>
					)}
				<Modal
					open={showShare}
					onClose={() => setShowShare(false)}
				>
					<div
						className='share-modal-content'
						style={{ textAlign: 'center' }}
					>
						<img
							src='https://i.imgur.com/1jPtNmW.png'
							alt='Grid Royale Logo'
							style={{
								width: 180,
								height: 180,
								margin: '10px auto 0',
								borderRadius: 16,
							}}
						/>
						<h2>Share your Grid Royale result!</h2>
						<div
							style={{
								margin: '10px 0 18px',
								fontSize: '1.1em',
							}}
						>
							<div
								style={{
									fontWeight: 600,
									fontSize: '1.2em',
								}}
							>
								I scored <b>{getFinalScore()}</b> on Grid
								Royale!
							</div>
							<div
								style={{
									marginTop: 8,
									color: '#2563eb',
									fontSize: '1em',
								}}
							>
								Finished in:{' '}
								<b>
									{finishTime !== null
										? formatTimer(finishTime)
										: ''}
								</b>
							</div>
							<div
								style={{
									marginTop: 8,
									color: '#2563eb',
									fontSize: '1em',
								}}
							>
								Can you beat my score? Try the daily puzzle:
								<br />
								<a
									href={getShareUrl()}
									target='_blank'
									rel='noopener noreferrer'
									style={{
										color: '#2563eb',
										fontWeight: 600,
										wordBreak: 'break-all',
									}}
								>
									{getShareUrl()}
								</a>
							</div>
						</div>
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
														className={`share-link share-link--${link.name.toLowerCase()}`}
														data-platform={link.name}
														key={link.name}
														style={{ color: link.color }}
													>
														<span className='share-link-icon'>
															<FontAwesomeIcon
																icon={link.icon}
															/>
														</span>
														<span className='share-link-text'>
															{link.name}
														</span>
													</a>
												))}
										</div>
									);
								}
								// Always include CopyLinkButton at the end
								return [
									...rows,
									<CopyLinkButton key='copy-link' />,
								];
							})()}
						</div>
					</div>
				</Modal>
				<StatisticsModal
					open={showStats}
					onClose={() => setShowStats(false)}
					user={user}
					setUser={setUser}
					dailyCompleted={gameOver && allGroupsSolved()}
				/>
				<RulesModal
					open={showRules}
					onClose={() => setShowRules(false)}
				/>
			</div>
		</div>
	);
}
