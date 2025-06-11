// VSBotGame.tsx
import React, {
	useContext,
	useEffect,
	useState,
} from 'react';
import { UserSettingsContext } from '../providers';
import VSStatusBar from './VSStatusBar';
import VSQuickChatBar from '../chat/VSQuickChatBar';
import {
	PrimaryButton,
	SecondaryButton,
	GoBackButton,
	WordButton,
	CopyLinkButton,
} from '../buttons';
import FeedbackBanner from '../banners/FeedbackBanner';
import EndGameModal from '../modals/EndGameModal';
import RulesModal from '../modals/RulesModal';
import StatisticsModal from '../modals/StatisticsModal';
import PreGameModal from '../modals/PreGameModal';
import { Modal } from '../modals/Modal';
import dailyPuzzles from '../../../data/dailyPuzzles.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChartBar,
	faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
	shuffle,
	getAllWordsFromGroupsAndWildcards,
} from '../../../utils/helpers';
import { playSound } from '../../../utils/sound';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import { NotificationBanner } from '../banners';
import ShareModalContent from '../modals/ShareModalContent';
import axios from 'axios';

// VSBotGame: VS Mode board vs Bot, visually identical to Daily Puzzle with VS overlays
const VSBotGame: React.FC<any> = ({
	botDifficulty,
	userId,
	matchId,
	roomCode,
}) => {
	const userSettings = useContext(UserSettingsContext) as {
		settings: any;
	};
	const settings = userSettings?.settings;
	const [selected, setSelected] = useState<string[]>([]);
	const [locked, setLocked] = useState<string[]>([]);
	const [feedback, setFeedback] = useState('');
	const [notification, setNotification] = useState<
		string | null
	>(null);
	const [notificationType, setNotificationType] = useState<
		'positive' | 'negative' | 'neutral'
	>('neutral');
	const [shakeSelected, setShakeSelected] = useState(false);
	const [correctPulse, setCorrectPulse] = useState(false);
	const [pointsAnim, setPointsAnim] = useState<{
		value: number;
		key: number;
	} | null>(null);
	const [streak, setStreak] = useState(0);
	const [soundEnabled, setSoundEnabled] = useState(true); // TODO: get from user settings

	const [opponentSelected, setOpponentSelected] = useState<
		string[]
	>([]); // Bot's current selection
	const [solvedGroups, setSolvedGroups] = useState<
		string[][]
	>([]);
	const [animatingGroup, setAnimatingGroup] = useState<
		string[] | null
	>(null);
	const [pendingSolvedGroups, setPendingSolvedGroups] =
		useState<string[][]>([]);
	const [burnSuspect, setBurnSuspect] = useState<
		string | null
	>(null);
	const [burnedWildcards, setBurnedWildcards] = useState<
		string[]
	>([]);
	const [burnBonus, setBurnBonus] = useState(0);
	const [showRules, setShowRules] = useState(false);
	const [showStats, setShowStats] = useState(false);
	const [showShare, setShowShare] = useState(false);
	const [showPreGameModal, setShowPreGameModal] =
		useState(true);
	const [showCountdown, setShowCountdown] = useState(false);
	const [countdownValue, setCountdownValue] = useState(3);
	const [timerActive, setTimerActive] = useState(false);
	const [timer, setTimer] = useState(0); // seconds
	const [timerInterval, setTimerInterval] =
		useState<NodeJS.Timeout | null>(null);
	const [showGrid, setShowGrid] = useState(false);
	const [finishTime, setFinishTime] = useState<
		number | null
	>(null);
	const [gameOver, setGameOver] = useState(false);

	const [activePuzzle, setActivePuzzle] =
		useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [shuffledWords, setShuffledWords] = useState<
		string[]
	>([]);
	const [floatingEmote, setFloatingEmote] = useState<
		string | null
	>(null);
	const [emoteAnimKey, setEmoteAnimKey] =
		useState<number>(0);

	const BOT_TAUNTS = [
		'Is that your best move? 😏',
		"You'll have to try harder!",
		'Calculating... or are you? 🤖',
		'Nice try!',
		'Hmm... interesting choice.',
		"You can't beat the matrix!",
		'Feeling the pressure?',
		'I saw that coming!',
		'Try again, human!',
		'My circuits are tingling!',
	];
	const BOT_EMOTES = ['😈', '🤖', '😂', '😅', '🔥', '👏'];

	const [botThinking, setBotThinking] = useState(false);
	const [botTaunt, setBotTaunt] = useState<string | null>(
		null
	);
	const [botTauntAnimKey, setBotTauntAnimKey] = useState(0);

	const router =
		typeof window !== 'undefined'
			? require('next/router').useRouter()
			: { query: {} };
	const isQAMode =
		router?.query?.qa === 'true' ||
		(typeof window !== 'undefined' &&
			window.location.search.includes('qa=true'));

	// Select a random puzzle by difficulty
	useEffect(() => {
		setLoading(true);
		const pool = dailyPuzzles.filter(
			(p) =>
				p.difficulty &&
				p.difficulty.toLowerCase() ===
					botDifficulty?.toLowerCase() &&
				p.groups &&
				p.groups.length > 0
		);
		const puzzle =
			pool.length > 0
				? pool[Math.floor(Math.random() * pool.length)]
				: null;
		setActivePuzzle(puzzle);
		setLoading(false);
	}, [botDifficulty]);

	// Shuffle words when puzzle loads
	useEffect(() => {
		if (!activePuzzle) return;
		setShuffledWords(
			shuffle(
				getAllWordsFromGroupsAndWildcards(
					activePuzzle.groups || [],
					activePuzzle.wildcards || []
				)
			)
		);
	}, [activePuzzle]);

	// Show grid after countdown
	useEffect(() => {
		if (!showCountdown) return;
		if (countdownValue > 0) {
			const timeout = setTimeout(
				() => setCountdownValue((v) => v - 1),
				700
			);
			return () => clearTimeout(timeout);
		} else {
			const timeout = setTimeout(() => {
				setShowCountdown(false);
				setShowGrid(true);
			}, 1000);
			return () => clearTimeout(timeout);
		}
	}, [showCountdown, countdownValue]);

	const words = activePuzzle?.words || [];
	const wildcards = activePuzzle?.wildcards || [];
	const groupSize = activePuzzle?.groups?.[0]?.length || 4;
	const totalGroups = activePuzzle?.groups?.length || 4;
	const gridRows = activePuzzle?.size?.rows || 4;
	const gridCols = activePuzzle?.size?.cols || 4;
	const groupCount = totalGroups;
	const gridWordCount = gridRows * gridCols;

	// Calculate initial attempts based on columns and wildcards
	const [attemptsLeft, setAttemptsLeft] =
		useState(gridCols);

	// Animate solved group
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
		wildcards.includes(word);

	const confirmBurn = () => {
		if (!burnSuspect) return;
		if (isWildcard(burnSuspect)) {
			const newBurned = [...burnedWildcards, burnSuspect];
			setBurnedWildcards(newBurned);
			setLocked((prev) => [...prev, burnSuspect]);
			setBurnBonus(
				(prev) => prev + (attemptsLeft >= 2 ? 10 : 5)
			);
			setAttemptsLeft((prev) => prev + 1);
			setFeedback('🔥 Correct burn! Bonus awarded!');
		} else {
			setAttemptsLeft((prev) => prev - 1);
			setFeedback(
				'❌ That word belongs to a group! Penalty.'
			);
		}
		setBurnSuspect(null);
		setSelected([]);
	};

	const handleWordTap = (word: string) => {
		if (gameOver) return;
		if (burnSuspect) {
			setBurnSuspect(null);
			setSelected([word]);
			return;
		}
		if (selected.includes(word)) {
			setSelected((prev) => prev.filter((w) => w !== word));
		} else {
			if (selected.length >= groupSize) {
				setFeedback(
					`You can only select up to ${groupSize} words.`
				);
				return;
			}
			setSelected((prev) => [...prev, word]);
		}
	};

	const handleWordRightClick = (
		word: string,
		e: React.MouseEvent
	) => {
		e.preventDefault();
		if (locked.includes(word) || gameOver) return;
		setBurnSuspect((prev) => {
			// Always clear selection and burn suspect when toggling
			setSelected([]);
			return prev === word ? null : word;
		});
	};

	// Submission handler
	const handleSubmit = () => {
		// Use the total number of words in the puzzle
		const totalWords =
			(activePuzzle?.groups?.flat().length || 0) +
			(activePuzzle?.wildcards?.length || 0);
		if (locked.length === totalWords) return;
		if (selected.length !== groupSize) {
			setFeedback(`Select exactly ${groupSize} words.`);
			return;
		}
		const groupMatch = activePuzzle.groups.find(
			(group: string[]) =>
				selected.every((word) => group.includes(word))
		);
		if (
			groupMatch &&
			!locked.some((w) => groupMatch.includes(w))
		) {
			// Correct group
			setLocked((prev) => [...prev, ...groupMatch]);
			setNotification('✅ Nice! You earned 10 points.');
			setNotificationType('positive');
			setPointsAnim({ value: 10, key: Date.now() });
			setCorrectPulse(true);
			setStreak((s) => s + 1);
			if (soundEnabled) playSound('success');
			setTimeout(() => setCorrectPulse(false), 700);
			setTimeout(() => setNotification(null), 2000);
			// Do NOT clear selected; user must deselect manually
		} else if (groupMatch) {
			setFeedback('This group is already solved.');
			setNotification('This group is already solved.');
			setNotificationType('neutral');
			setTimeout(() => setNotification(null), 2000);
		} else {
			// Incorrect
			setAttemptsLeft((prev) => prev - 1);
			setFeedback('Not a valid group.');
			setNotification(
				'❌ Missed it! Try again — you lost 3 points.'
			);
			setNotificationType('negative');
			setPointsAnim({ value: -3, key: Date.now() });
			setShakeSelected(true);
			if (soundEnabled) playSound('fail');
			setStreak(0);
			setTimeout(() => setShakeSelected(false), 500);
			setTimeout(() => setNotification(null), 2000);
			// Do NOT clear selected; user must deselect manually
		}
	};

	const handleRandomize = () => {
		setShuffledWords((prev) =>
			prev.slice().sort(() => Math.random() - 0.5)
		);
	};

	const handleDeselect = () => setSelected([]);

	const handleShare = () => setShowShare(true);

	const handleEmote = (emote: string) => {
		setFloatingEmote(emote);
		setEmoteAnimKey((k) => k + 1);
		playSound('emote');
		setTimeout(() => setFloatingEmote(null), 1200);
	};

	const canSubmit =
		selected.length === groupSize &&
		!gameOver &&
		!burnSuspect;

	const allGroupsSolved = () => {
		if (!activePuzzle || !activePuzzle.groups) return false;
		const solved = pendingSolvedGroups.flat();
		const groupWords = activePuzzle.groups.flat();
		return groupWords.every((w: string) =>
			solved.includes(w)
		);
	};

	const getFinalScore = () => {
		const base = allGroupsSolved() ? 100 : 0;
		const attemptsBonus = allGroupsSolved()
			? attemptsLeft * 10
			: 0;
		return base + burnBonus + attemptsBonus;
	};

	const formatTimer = (t: number) => {
		const mm = String(Math.floor(t / 60)).padStart(2, '0');
		const ss = String(t % 60).padStart(2, '0');
		return `${mm}:${ss}`;
	};

	// Timer logic
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

	useEffect(() => {
		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	}, [timerInterval]);

	// Countdown logic
	useEffect(() => {
		if (showCountdown) {
			if (countdownValue > 0) {
				const timeout = setTimeout(() => {
					setCountdownValue((v) => v - 1);
				}, 500);
				return () => clearTimeout(timeout);
			} else {
				const timeout = setTimeout(() => {
					setShowCountdown(false);
					setTimerActive(true);
					setShowGrid(true);
				}, 1000);
				return () => clearTimeout(timeout);
			}
		}
	}, [showCountdown, countdownValue]);

	// Endgame logic
	useEffect(() => {
		if (!gameOver) {
			if (allGroupsSolved()) {
				setFinishTime(timer);
				setGameOver(true);
			} else if (attemptsLeft === 0) {
				setFinishTime(timer);
				setGameOver(true);
			}
		}
	}, [attemptsLeft, pendingSolvedGroups, gameOver]);

	// When the game ends, set finishTime to timer
	useEffect(() => {
		if (gameOver && finishTime === null) {
			setFinishTime(timer);
		}
	}, [gameOver, timer, finishTime]);

	// Example: Trigger bot thinking and taunt after user submits or at random intervals
	useEffect(() => {
		if (!showGrid || gameOver) return;
		if (pendingSolvedGroups.length > 0) {
			// Simulate bot thinking after user solves a group
			setBotThinking(true);
			playSound('botThinking');
			const thinkTime = 1200 + Math.random() * 1200;
			const tauntTime =
				thinkTime + 400 + Math.random() * 600;
			const taunt =
				Math.random() < 0.5
					? BOT_TAUNTS[
							Math.floor(Math.random() * BOT_TAUNTS.length)
					  ]
					: BOT_EMOTES[
							Math.floor(Math.random() * BOT_EMOTES.length)
					  ];
			const thinkTimeout = setTimeout(() => {
				setBotThinking(false);
				setBotTaunt(taunt);
				setBotTauntAnimKey((k) => k + 1);
				playSound('botTaunt');
				setTimeout(() => setBotTaunt(null), 1800);
			}, tauntTime);
			return () => clearTimeout(thinkTimeout);
		}
	}, [pendingSolvedGroups.length, showGrid, gameOver]);

	// Socket.io client for QA simulation
	const [socket, setSocket] = useState<any>(null);

	useEffect(() => {
		if (!isQAMode) return;
		// Connect to /game namespace for QA simulation
		const s = io('/game');
		setSocket(s);
		// Join the match/game room for QA events
		if (roomCode)
			s.emit('match:join', {
				matchId: roomCode,
				mode: 'bot',
			});
		// Listen for QA simulation events
		s.on('qa:solve-group', (data) => {
			// Simulate solving a group (test data)
			setSolvedGroups((prev) => [
				...prev,
				['Apple', 'Banana', 'Pear', 'Cranberry'],
			]);
			setFeedback('QA: Group solved!');
		});
		s.on('qa:bot-emote', (data) => {
			setBotTaunt('😈 QA Bot Emote!');
			setBotTauntAnimKey((k) => k + 1);
		});
		s.on('qa:win-modal', () => {
			setGameOver(true);
			setFeedback('QA: Win modal triggered!');
		});
		s.on('qa:loss-modal', () => {
			setGameOver(true);
			setFeedback('QA: Loss modal triggered!');
		});
		return () => {
			s.disconnect();
		};
	}, [isQAMode, roomCode]);

	const [botStats, setBotStats] = useState<any>(null);
	const [botStatsLoading, setBotStatsLoading] =
		useState(true);
	const [botStatsError, setBotStatsError] = useState<
		string | null
	>(null);

	// Fetch bot stats on mount or when botDifficulty changes
	useEffect(() => {
		if (!botDifficulty) return;
		setBotStatsLoading(true);
		axios
			.get(`/api/bot-stats/${botDifficulty}`)
			.then((res) => {
				setBotStats(res.data);
				setBotStatsLoading(false);
			})
			.catch((err) => {
				setBotStatsError('Could not load stats');
				setBotStatsLoading(false);
			});
	}, [botDifficulty]);

	// --- Animate and update stats after match ---
	const [showStatsBanner, setShowStatsBanner] =
		useState(false);
	const [postMatchStats, setPostMatchStats] =
		useState<any>(null);

	// Helper: Calculate stats delta for animation
	const getStatsDelta = (oldStats: any, newStats: any) => {
		if (!oldStats || !newStats) return {};
		const delta: Record<string, number> = {};
		for (const key in newStats) {
			if (
				typeof newStats[key] === 'number' &&
				typeof oldStats[key] === 'number'
			) {
				delta[key] = newStats[key] - oldStats[key];
			}
		}
		return delta;
	};

	// Call this when match ends
	const handleMatchEnd = async (result: {
		win: boolean;
		perfect: boolean;
		points: number;
		finishTime: number;
		groupsSolvedFirst: number;
		botOutsolvedFirst: number;
		threeMistakeFail: boolean;
		totalWordsGuessed: number;
		totalMistakes: number;
		accuracy: number;
		mostGuessedWord: string;
		mostCommonTheme: string;
		dramaticComeback: boolean;
		clutchWin: boolean;
		cleanSweep: boolean;
		multiPerfect: boolean;
	}) => {
		if (!botDifficulty) return;
		// Prepare update object (merge with previous stats)
		const prev = botStats || {};
		const update = {
			completed: (prev.completed || 0) + 1,
			winCount: (prev.winCount || 0) + (result.win ? 1 : 0),
			lossCount:
				(prev.lossCount || 0) + (!result.win ? 1 : 0),
			winPercentage:
				(((prev.winCount || 0) + (result.win ? 1 : 0)) /
					((prev.completed || 0) + 1)) *
				100,
			currentStreak: result.win
				? (prev.currentStreak || 0) + 1
				: 0,
			maxStreak: result.win
				? Math.max(
						(prev.currentStreak || 0) + 1,
						prev.maxStreak || 0
				  )
				: prev.maxStreak || 0,
			perfectPuzzles:
				(prev.perfectPuzzles || 0) +
				(result.perfect ? 1 : 0),
			totalPoints:
				(prev.totalPoints || 0) + (result.points || 0),
			fastestWinTime:
				result.win &&
				(prev.fastestWinTime == null ||
					result.finishTime < prev.fastestWinTime)
					? result.finishTime
					: prev.fastestWinTime,
			averageMatchTime:
				((prev.averageMatchTime || 0) *
					(prev.completed || 0) +
					(result.finishTime || 0)) /
				((prev.completed || 0) + 1),
			groupsSolvedFirst:
				(prev.groupsSolvedFirst || 0) +
				(result.groupsSolvedFirst || 0),
			botOutsolvedFirst:
				(prev.botOutsolvedFirst || 0) +
				(result.botOutsolvedFirst || 0),
			threeMistakeFails:
				(prev.threeMistakeFails || 0) +
				(result.threeMistakeFail ? 1 : 0),
			totalWordsGuessed:
				(prev.totalWordsGuessed || 0) +
				(result.totalWordsGuessed || 0),
			totalMistakes:
				(prev.totalMistakes || 0) +
				(result.totalMistakes || 0),
			accuracyPercentage:
				((prev.accuracyPercentage || 0) *
					(prev.completed || 0) +
					(result.accuracy || 0)) /
				((prev.completed || 0) + 1),
			mostGuessedWord:
				result.mostGuessedWord || prev.mostGuessedWord,
			mostCommonTheme:
				result.mostCommonTheme || prev.mostCommonTheme,
			dramaticComebacks:
				(prev.dramaticComebacks || 0) +
				(result.dramaticComeback ? 1 : 0),
			clutchWins:
				(prev.clutchWins || 0) + (result.clutchWin ? 1 : 0),
			cleanSweeps:
				(prev.cleanSweeps || 0) +
				(result.cleanSweep ? 1 : 0),
			multiPerfects:
				(prev.multiPerfects || 0) +
				(result.multiPerfect ? 1 : 0),
			averageMistakesPerMatch:
				((prev.averageMistakesPerMatch || 0) *
					(prev.completed || 0) +
					(result.totalMistakes || 0)) /
				((prev.completed || 0) + 1),
		};
		// Post to backend
		const res = await axios.post(
			`/api/bot-stats/${botDifficulty}`,
			update
		);
		setPostMatchStats(res.data);
		setShowStatsBanner(true);
		setTimeout(() => setShowStatsBanner(false), 6000);
		// Refresh stats for next match
		setBotStats(res.data);
	};

	// Example: Call handleMatchEnd when game ends
	useEffect(() => {
		if (gameOver && finishTime !== null) {
			// TODO: Gather all result data from game state
			handleMatchEnd({
				win: allGroupsSolved(),
				perfect: /* logic for perfect puzzle */ false,
				points: getFinalScore(),
				finishTime,
				groupsSolvedFirst: 0, // TODO
				botOutsolvedFirst: 0, // TODO
				threeMistakeFail: false, // TODO
				totalWordsGuessed: 0, // TODO
				totalMistakes: 0, // TODO
				accuracy: 0, // TODO
				mostGuessedWord: '', // TODO
				mostCommonTheme: '', // TODO
				dramaticComeback: false, // TODO
				clutchWin: false, // TODO
				cleanSweep: false, // TODO
				multiPerfect: false, // TODO
			});
		}
		// eslint-disable-next-line
	}, [gameOver, finishTime]);

	// --- Collapsible in-game stats banner ---
	const [statsCollapsed, setStatsCollapsed] =
		useState(true);
	const renderInGameStatsBanner = () => {
		const stats = postMatchStats || botStats;
		if (!stats) return null;
		return (
			<div
				style={{
					position: 'fixed',
					top: 12,
					left: '50%',
					transform: 'translateX(-50%)',
					zIndex: 50,
					background: '#e0e7ff',
					borderRadius: 16,
					boxShadow: '0 2px 12px #2563eb22',
					padding: statsCollapsed
						? '6px 18px'
						: '18px 32px',
					minWidth: 180,
					maxWidth: 420,
					transition: 'all 0.4s cubic-bezier(.4,2,.6,1)',
					cursor: 'pointer',
					fontSize: 15,
					color: '#222',
					userSelect: 'none',
				}}
				onClick={() => setStatsCollapsed((v) => !v)}
			>
				<div
					style={{
						fontWeight: 700,
						fontSize: 17,
						marginBottom: statsCollapsed ? 0 : 8,
					}}
				>
					VS Bot Stats {statsCollapsed ? '▼' : '▲'}
				</div>
				{!statsCollapsed && (
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: 12,
						}}
					>
						<div>
							Completed: <b>{stats.completed}</b>
						</div>
						<div>
							Win %:{' '}
							<b>{stats.winPercentage?.toFixed(1) ?? 0}%</b>
						</div>
						<div>
							Current Streak: <b>{stats.currentStreak}</b>
						</div>
						<div>
							Max Streak: <b>{stats.maxStreak}</b>
						</div>
						<div>
							Perfects: <b>{stats.perfectPuzzles}</b>
						</div>
						<div>
							Total Points: <b>{stats.totalPoints}</b>
						</div>
						<div>
							Fastest:{' '}
							<b>
								{stats.fastestWinTime
									? `${Math.floor(
											stats.fastestWinTime / 60
									  )}:${(stats.fastestWinTime % 60)
											.toString()
											.padStart(2, '0')}`
									: '--:--'}
							</b>
						</div>
						<div>
							Avg. Time:{' '}
							<b>
								{stats.averageMatchTime
									? `${Math.floor(
											stats.averageMatchTime / 60
									  )}:${(
											Math.round(stats.averageMatchTime) %
											60
									  )
											.toString()
											.padStart(2, '0')}`
									: '--:--'}
							</b>
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className='fullscreen-bg'>
			{isQAMode && (
				<div
					style={{
						position: 'fixed',
						top: 12,
						left: 12,
						zIndex: 9999,
						background: 'rgba(37,99,235,0.12)',
						color: '#2563eb',
						fontWeight: 700,
						borderRadius: 8,
						padding: '6px 16px',
						boxShadow: '0 2px 8px 0 #2563eb22',
						letterSpacing: 1,
						fontSize: 15,
						animation: 'fadeIn 0.4s',
					}}
				>
					DEV QA MODE
				</div>
			)}
			<div className='gridRoyale-container'>
				{/* Pregame Modal Overlay */}
				{showPreGameModal && (
					<PreGameModal
						open={showPreGameModal}
						onReady={() => {
							setShowPreGameModal(false);
							setShowCountdown(true);
							setCountdownValue(3);
						}}
						onGoHome={() => window.location.assign('/')}
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
						onClick={() => window.location.assign('/')}
						className='back-icon-btn'
					/>
					<div className='gridRoyale-header-heading'>
						<h1 className='gridRoyale-title'>
							{(activePuzzle && activePuzzle.title) ||
								'Grid Royale VS Bot'}
						</h1>
						<div className='gridRoyale-subtitle'>
							VS Bot
						</div>
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
				{/* Notification Banner */}
				<div className='notification'>
					{notification && (
						<NotificationBanner
							type={
								notificationType === 'positive'
									? 'achievement'
									: notificationType === 'negative'
									? 'burn'
									: 'system'
							}
							message={notification}
							onClose={() => setNotification(null)}
							index={0}
						/>
					)}
				</div>
				{/* Main grid and overlays */}
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
										isSelected={selected.includes(word)}
										isLocked={locked.includes(word)}
										isBurned={burnedWildcards.includes(
											word
										)}
										onClick={() => handleWordTap(word)}
										onContextMenu={(e: React.MouseEvent) =>
											handleWordRightClick(word, e)
										}
										onDoubleClick={(e: React.MouseEvent) =>
											handleWordRightClick(word, e)
										}
										burnSuspect={burnSuspect === word}
										shake={
											selected.includes(word) &&
											shakeSelected
										}
										correctPulse={
											selected.includes(word) &&
											correctPulse
										}
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
											onContextMenu={() => {}}
											className='word-btn animating-to-solved'
										/>
									))}
							</div>
						)}
					</div>
				)}
				{/* Pregame Modal Grid Lockout (blurred grid) */}
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
							<PrimaryButton
								className='gridRoyale-submit'
								style={{ margin: '0 auto' }}
								disabled={attemptsLeft === 0 || gameOver}
								onClick={handleSubmit}
							>
								Submit
							</PrimaryButton>
						</div>
					)}
					{burnSuspect && (
						<div className='burn-status-bar'>
							🔥 Burn active 🔥 <b>{burnSuspect}</b>
							<PrimaryButton
								className='burn-btn'
								onClick={confirmBurn}
							>
								Confirm Burn
							</PrimaryButton>
						</div>
					)}
					<div className='daily-controls-flex-col'>
						<FeedbackBanner message={feedback} />
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
							<SecondaryButton
								className='randomize-btn'
								aria-label='Randomize word order'
								onClick={handleRandomize}
							>
								Mix It Up!
							</SecondaryButton>
							<SecondaryButton
								className='deselect-btn'
								style={{ marginLeft: 12 }}
								onClick={handleDeselect}
							>
								Deselect All
							</SecondaryButton>
						</div>
					</div>
					<PrimaryButton
						className='share-btn'
						style={{
							margin: '16px auto 0 auto',
							display: 'flex',
							alignItems: 'center',
							gap: 8,
						}}
						onClick={() => setShowShare(true)}
					>
						<span className='share-icon'>🔗</span>Share
					</PrimaryButton>
				</div>
				{/* Bot avatar, taunt, and thinking indicator */}
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						margin: '0 0 18px 0',
						position: 'relative',
						zIndex: 12,
					}}
				>
					<div
						style={{
							position: 'relative',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						{/* Bot avatar */}
						<div
							style={{
								margin: 20,
								width: 64,
								height: 64,
								borderRadius: '50%',
								backgroundColor: '#38bdf8',
								background:
									'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 38,
								fontWeight: 700,
								color: '#fff',
								boxShadow: '0 2px 12px #bae6fd55',
							}}
						>
							<img
								src='https://i.imgur.com/aSdxSOF.png'
								alt='Bot Avatar'
								style={{
									width: 44,
									height: 44,
									borderRadius: '50%',
								}}
							/>
						</div>
						{/* Bot thinking indicator */}
						{botThinking && (
							<div
								style={{
									marginTop: 8,
									padding: '6px 18px',
									borderRadius: 18,
									background: 'rgba(37,99,235,0.13)',
									color: '#2563eb',
									fontWeight: 600,
									fontSize: 17,
									boxShadow: '0 2px 8px #bae6fd33',
									animation:
										'botPulse 1.1s infinite cubic-bezier(.4,2,.6,1)',
								}}
							>
								<span style={{ marginRight: 8 }}>🧠</span>
								Calculating the matrix…
								<style>{`
								@keyframes botPulse {
									0% { opacity: 0.7; transform: scale(1); }
									50% { opacity: 1; transform: scale(1.08); }
									100% { opacity: 0.7; transform: scale(1); }
								}
								`}</style>
							</div>
						)}
						{/* Bot taunt/auto-emote speech bubble */}
						{botTaunt && (
							<div
								key={botTauntAnimKey}
								style={{
									marginTop: 10,
									background: '#fff',
									color: '#1e293b',
									borderRadius: 18,
									padding: '10px 22px',
									fontSize: 18,
									fontWeight: 600,
									boxShadow: '0 4px 24px 0 #bae6fd33',
									border: '1.5px solid #bae6fd',
									animation:
										'botTauntBounce 1.1s cubic-bezier(.4,2,.6,1)',
									position: 'absolute',
									top: 60,
									left: '50%',
									transform: 'translateX(-50%)',
									zIndex: 20,
								}}
							>
								{botTaunt}
								<style>{`
								@keyframes botTauntBounce {
									0% { opacity: 0; transform: translateY(20px) scale(0.7); }
									10% { opacity: 1; transform: translateY(-4px) scale(1.08); }
									60% { opacity: 1; transform: translateY(-10px) scale(1); }
									100% { opacity: 0; transform: translateY(-30px) scale(0.8); }
								}
								`}</style>
							</div>
						)}
					</div>
				</div>
				{/* Endgame Modal */}
				{!showPreGameModal &&
					!showCountdown &&
					gameOver && (
						<EndGameModal
							message={
								allGroupsSolved()
									? 'You nailed it!'
									: 'Vibe check failed.'
							}
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
				<ShareModalContent
					open={showShare}
					onClose={() => setShowShare(false)}
					title='Share your Grid Royale result!'
					logoUrl='https://i.imgur.com/1jPtNmW.png'
					score={getFinalScore()}
					finishTime={finishTime}
					formatTimer={formatTimer}
					minimal={!gameOver}
				>
					<CopyLinkButton key='copy-link' />
				</ShareModalContent>
				<StatisticsModal
					open={showStats}
					onClose={() => setShowStats(false)}
					user={null}
					dailyCompleted={gameOver && allGroupsSolved()}
				/>
				<RulesModal
					open={showRules}
					onClose={() => setShowRules(false)}
					mode='multiplayer'
				/>
				{/* Floating Emote Animation */}
				{floatingEmote && (
					<div
						key={emoteAnimKey}
						style={{
							position: 'absolute',
							left: '50%',
							bottom: 120,
							transform: 'translateX(-50%)',
							pointerEvents: 'none',
							zIndex: 30,
						}}
					>
						<span
							style={{
								display: 'inline-block',
								fontSize: 48,
								animation:
									'floatEmote 1.1s cubic-bezier(.4,2,.6,1), popEmote 0.22s cubic-bezier(.4,2,.6,1)',
								filter: 'drop-shadow(0 2px 12px #0006)',
							}}
						>
							{floatingEmote}
						</span>
					</div>
				)}
				{/* Points animation (floating number) */}
				{showStatsBanner && postMatchStats && (
					<div
						style={{
							position: 'fixed',
							top: 80,
							left: '50%',
							transform: 'translateX(-50%)',
							zIndex: 60,
							background: '#fff',
							border: '2px solid #2563eb',
							borderRadius: 18,
							boxShadow: '0 4px 24px #2563eb22',
							padding: 24,
							minWidth: 220,
							maxWidth: 420,
							fontSize: 17,
							color: '#222',
							fontWeight: 600,
							animation:
								'fadeInScale 0.7s cubic-bezier(.4,2,.6,1)',
						}}
					>
						<div style={{ marginBottom: 8 }}>
							Stats Updated!
						</div>
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: 12,
							}}
						>
							{Object.entries(
								getStatsDelta(botStats, postMatchStats)
							).map(
								([k, v]) =>
									v !== 0 && (
										<div key={k}>
											{k}:{' '}
											<b
												style={{
													color:
														v > 0 ? '#2563eb' : '#ef4444',
												}}
											>
												{v > 0 ? '+' : ''}
												{v}
											</b>
										</div>
									)
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default VSBotGame;
