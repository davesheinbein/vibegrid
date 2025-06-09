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
	const gameOver =
		attemptsLeft === 0 || solvedGroups.length > 0;
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
		dispatch(setSelectedWords([]));
		dispatch(setLockedWords([]));
		dispatch(setFeedback(''));
		dispatch(setAttempts(4));
		dispatch(setSolvedGroups([]));
		setBurnSuspect(null);
		setBurnedWildcards([]);
		setBurnBonus(0);
		setEndTime(null);
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
			dispatch(
				setLockedWords((prev) => [...prev, burnSuspect])
			);
			setBurnBonus(
				(prev) => prev + (attemptsLeft >= 2 ? 10 : 5)
			);
			dispatch(setAttempts((prev) => prev + 1)); // Always increment by 1 for each wildcard burn
			setFeedback('🔥 Correct burn! Bonus awarded!');
			// Optionally: emit chat/taunt here
			// socket.emit('match:chat', { matchId, message: '🔥 Burned a wildcard!', type: 'emoji' });
			if (
				activePuzzle.wildcards &&
				activePuzzle.wildcards.length > 0 &&
				activePuzzle.wildcards.every((w: string) =>
					newBurned.includes(w)
				)
			) {
				setFeedback(
					'🔥 All wildcards burned! Extra attempt awarded!'
				);
			}
		} else {
			dispatch(setAttempts((prev) => prev - 1));
			setFeedback(
				'❌ That word belongs to a group! Penalty.'
			);
		}
		setBurnSuspect(null);
		dispatch(setSelectedWords([]));
	};

	const handleWordTap = (word: string) => {
		if (lockedWords.includes(word) || gameOver) return;
		if (burnSuspect === word) {
			setBurnSuspect(null);
			return;
		}
		if (selectedWords.includes(word)) {
			dispatch(
				setSelectedWords((prev) =>
					prev.filter((w) => w !== word)
				)
			);
			setBurnSuspect(word);
		} else if (burnSuspect) {
			setBurnSuspect(word);
		} else if (selectedWords.length < groupSize) {
			dispatch(setSelectedWords((prev) => [...prev, word]));
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
			dispatch(
				setLockedWords((prev) => [
					...prev,
					...selectedWords,
				])
			);
			dispatch(
				setSolvedGroups((prev) => [...prev, groupMatch])
			);
			setFeedback('Group locked in!');
			dispatch(setSelectedWords([]));
		} else if (groupMatch) {
			setFeedback('This group is already solved.');
			dispatch(setSelectedWords([]));
		} else {
			dispatch(setAttempts((prev) => prev - 1));
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
			dispatch(setSelectedWords([]));
		}
	};

	const handleRestart = () => {
		dispatch(setSelectedWords([]));
		dispatch(setLockedWords([]));
		dispatch(setFeedback(''));
		dispatch(setAttempts(4));
		dispatch(setSolvedGroups([]));
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
		const solved = solvedGroups.length;
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

	useEffect(() => {
		if (!gameOver) {
			if (allGroupsSolved()) {
				dispatch(setIsSolved(true));
				setShowGameOverBanner(false);
				setEndTime(Date.now());
			} else if (attemptsLeft === 0) {
				dispatch(setIsSolved(false));
				setShowGameOverBanner(true);
				setEndTime(Date.now());
			}
		}
	}, [attemptsLeft, pendingSolvedGroups, gameOver]);

	useEffect(() => {
		if (attemptsLeft === 0 && !gameOver) {
			setGameOver(true);
			setShowGameOverBanner(true);
			// Optionally, save stats if user is signed in
			if (user) {
				// saveUserStats(user, ...); // implement as needed
			}
		}
	}, [attemptsLeft, gameOver, user]);

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

	// --- Helper functions for updating arrays in Redux state ---
	function addToArray<T>(arr: T[], items: T | T[]): T[] {
		return Array.isArray(items)
			? [...arr, ...items]
			: [...arr, items];
	}
	function removeFromArray<T>(arr: T[], item: T): T[] {
		return arr.filter((x) => x !== item);
	}

	// Helper: set feedback as array
	function setFeedbackMsg(msg: string) {
		dispatch(setFeedback([msg]));
	}

	// Helper: add to lockedWords
	function addLockedWords(words: string | string[]) {
		dispatch(
			setLockedWords(addToArray(lockedWords, words))
		);
	}

	// Helper: add to solvedGroups
	function addSolvedGroup(group: string[]) {
		dispatch(setSolvedGroups([...solvedGroups, group]));
	}

	// Helper: add to selectedWords
	function addSelectedWord(word: string) {
		dispatch(setSelectedWords([...selectedWords, word]));
	}

	// Helper: remove from selectedWords
	function removeSelectedWord(word: string) {
		dispatch(
			setSelectedWords(removeFromArray(selectedWords, word))
		);
	}

	// Helper: clear selectedWords
	function clearSelectedWords() {
		dispatch(setSelectedWords([]));
	}

	// Helper: set attempts
	function setAttemptsValue(val: number) {
		dispatch(setAttempts(val));
	}

	return (
		<div className='fullscreen-bg'>
			<div className='gridRoyale-container'>
				{/* Pre-game Modal Overlay */}
				{showPreGameModal && (
					<div className='pregame-modal-overlay'>
						<div className='pregame-modal'>
							<h2 className='pregame-modal-title'>
								Ready to Begin?
							</h2>
							<p className='pregame-modal-subtext'>
								Your time will start as soon as you click
								'Ready'. Focus up — this one counts.
							</p>
							<button
								className='pregame-modal-ready-btn pulse'
								onClick={() => {
									setShowPreGameModal(false);
									setShowCountdown(true);
									setCountdownValue(3);
								}}
							>
								Ready
							</button>
							<button
								className='pregame-modal-go-home-btn'
								onClick={() => router.push('/')}
								type='button'
							>
								Go Home
							</button>
						</div>
					</div>
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
				{gameOver && (
					<EndGameModal
						message={
							allGroupsSolved()
								? 'You nailed it!'
								: 'Vibe check failed.'
						}
						onRestart={handleRestart}
						score={getFinalScore()}
						attemptsLeft={attemptsLeft}
						burnBonus={burnBonus}
						win={allGroupsSolved()}
						onShare={() => setShowShare(true)}
						finishTime={
							finishTime !== null
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
												.map((link) => {
													let brandColor = '#64748b';
													switch (link.name) {
														case 'X':
															brandColor = '#222';
															break;
														case 'Meta':
															brandColor = '#1877F3';
															break;
														case 'Reddit':
															brandColor = '#FF4500';
															break;
														case 'LinkedIn':
															brandColor = '#0077B5';
															break;
														case 'TikTok':
															brandColor = '#000';
															break;
														case 'Instagram':
															brandColor = '#E1306C';
															break;
														default:
															break;
													}
													return (
														<a
															href={link.url}
															target='_blank'
															rel='noopener noreferrer'
															className={`share-link share-link--${link.name.toLowerCase()}`}
															data-platform={link.name}
															key={link.name}
															style={{ color: brandColor }}
														>
															<span className='share-link-icon'>
																{link.icon}
															</span>
															<span className='share-link-text'>
																{link.name}
															</span>
														</a>
													);
												})}
										</div>
									);
								}
								return rows;
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
