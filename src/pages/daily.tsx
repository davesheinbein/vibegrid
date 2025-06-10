import React, {
	useEffect,
	useContext,
	useState,
} from 'react';
import { useRouter } from 'next/router';
import {
	dailyPuzzle,
	shuffle,
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
} from '../components/ui-kit/buttons';
import {
	FeedbackBanner,
	EndGameModal,
	RulesModal,
	StatisticsModal,
	PreGameModal,
	Modal,
} from '../components/ui-kit';
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
import { UserSettingsContext } from '../components/ui-kit/providers';
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
import {
	getDailyCompletion,
	setDailyCompletion,
	getDailyPuzzleProgress,
	saveDailyPuzzleProgress,
	clearDailyPuzzleProgress,
} from '../utils/dailyCompletion';
import { useSession } from 'next-auth/react';
import ShareModalContent from '../components/ui-kit/modals/ShareModalContent';

// --- Helper functions for updating arrays in Redux state ---
// (Now imported from src/utils/helpers.ts)

interface DailyPageProps {
	onBack?: () => void;
}

export default function Daily(props: DailyPageProps) {
	const { data: session } = useSession();
	const user = session?.user
		? {
				name: session.user.name || '',
				email: session.user.email || '',
				photoUrl: session.user.image || undefined,
		  }
		: null;

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
		setAttemptsValue(dispatch, 4); // Always 4 attempts
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
		setShuffledWords(
			shuffle(
				getAllWordsFromGroupsAndWildcards(
					activePuzzle.groups || [],
					activePuzzle.wildcards || []
				)
			)
		);
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
		const score = getFinalScore();
		const url = getShareUrl();
		let timeStr = '';
		if (finishTime !== null) {
			timeStr = ` in ${formatTimer(finishTime)}`;
		}
		return `I scored ${score} from ${solved}/${groupCount} groups solved in ${attempts} attempts on Grid Royale!\n\nCan you beat my score?\nTry the daily puzzle: ${url}`;
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
				<div className='gridRoyale-header-row'>
					<GoBackButton
						onClick={
							props.onBack
								? props.onBack
								: () => window.location.assign('/')
						}
						className='back-icon-btn'
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
						onClick={() => setShowShare(true)}
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
				{showShare && (
					<ShareModalContent
						open={showShare}
						onClose={() => setShowShare(false)}
						title='Share your Grid Royale result!'
						logoUrl='https://i.imgur.com/1jPtNmW.png'
						score={getFinalScore()}
						finishTime={finishTime}
						formatTimer={formatTimer}
					>
						<CopyLinkButton key='copy-link' />
					</ShareModalContent>
				)}
				<StatisticsModal
					open={showStats}
					onClose={() => setShowStats(false)}
					user={user}
					dailyCompleted={gameOver && allGroupsSolved()}
				/>
				<RulesModal
					open={showRules}
					onClose={() => setShowRules(false)}
					mode='daily'
				/>
			</div>
		</div>
	);
}
