import React, {
	useEffect,
	useState,
	useCallback,
	useContext,
} from 'react';
import { useMultiplayer } from './MultiplayerProvider';
import {
	checkGroupValidity,
	partialMatchFeedback,
	groupsArrayToObject,
} from '../../utils/gameLogic';
import {
	getAllWordsFromGroupsAndWildcards,
	shuffle,
} from '../../utils/helpers';
import { WordButton } from './Buttons';
import FeedbackBanner from './FeedbackBanner';
import { Modal } from './Modal';
import InMatchChatWindow from './InMatchChatWindow';
import MatchChatWindow from './MatchChatWindow';
import { useNotificationBanner } from './MultiplayerProvider';
import { UserSettingsContext } from './UserSettingsProvider';

// Dummy puzzle for now; replace with actual puzzle from context/server
const demoPuzzle = {
	title: 'VS Puzzle',
	size: { rows: 4, cols: 4 },
	groups: [
		['cat', 'dog', 'lion', 'tiger'],
		['apple', 'orange', 'grape', 'pear'],
		['red', 'blue', 'green', 'yellow'],
		['car', 'bus', 'train', 'plane'],
	],
	wildcards: [],
};

// Types for chat messages
interface MatchChatMessage {
	id: string;
	sender: string;
	content: string;
	type: 'text' | 'emoji' | 'quickfire';
	timestamp: number;
}

// --- Multiplayer Game Logic and UI ---
const VSMultiplayerGame: React.FC = () => {
	const multiplayer = useMultiplayer();
	const { settings } = useContext(UserSettingsContext);
	const { notify } = useNotificationBanner();
	const [selectedWords, setSelectedWords] = useState<
		string[]
	>([]);
	const [lockedWords, setLockedWords] = useState<string[]>(
		[]
	);
	const [solvedGroups, setSolvedGroups] = useState<
		string[][]
	>([]);
	const [attemptsLeft, setAttemptsLeft] = useState(4);
	const [feedback, setFeedback] = useState('');
	const [gameOver, setGameOver] = useState(false);
	const [opponentProgress, setOpponentProgress] = useState({
		solved: 0,
		attempts: 4,
		finished: false,
		time: 0,
	});
	const [showResult, setShowResult] = useState(false);
	const [result, setResult] = useState<
		'win' | 'lose' | 'draw' | null
	>(null);
	const [shuffledWords, setShuffledWords] = useState<
		string[]
	>([]);
	const [startTime] = useState(Date.now());
	const [endTime, setEndTime] = useState<number | null>(
		null
	);
	const [showInMatchChat, setShowInMatchChat] =
		useState(false);
	const [showChat, setShowChat] = useState(false);
	const [chatMessages, setChatMessages] = useState<
		MatchChatMessage[]
	>([]);
	const userId = multiplayer?.userId || '';
	const matchId = multiplayer?.matchId || '';

	// TODO: Replace with puzzle from server/context
	const puzzle = demoPuzzle;

	// In-match chat integration
	const multiplayerOpponentId =
		multiplayer.opponentUserId || '';

	// Shuffle words on mount
	useEffect(() => {
		setShuffledWords(
			shuffle(
				getAllWordsFromGroupsAndWildcards(
					puzzle.groups,
					puzzle.wildcards
				)
			)
		);
	}, [puzzle]);

	// Socket event handlers
	useEffect(() => {
		if (!multiplayer.socket) return;
		const socket = multiplayer.socket;
		// Receive opponent progress
		socket.on(
			'opponentProgress',
			({ solved, attempts, finished, time }) => {
				setOpponentProgress((prev) => ({
					...prev,
					solved,
					attempts,
					finished,
					time,
				}));
			}
		);
		// Receive match end
		socket.on(
			'matchEnded',
			({ winner, time, opponentTime }) => {
				setGameOver(true);
				setShowResult(true);
				setEndTime(Date.now());
				if (winner === socket.id) setResult('win');
				else if (winner === 'draw') setResult('draw');
				else setResult('lose');
			}
		);
		// Opponent disconnect
		socket.on('playerDisconnected', () => {
			setGameOver(true);
			setShowResult(true);
			setResult('win'); // You win by default
			setFeedback('Opponent disconnected. You win!');
		});
		return () => {
			socket.off('opponentProgress');
			socket.off('matchEnded');
			socket.off('playerDisconnected');
		};
	}, [multiplayer.socket]);

	// Send progress to opponent
	useEffect(() => {
		if (!multiplayer.socket) return;
		multiplayer.socket.emit('updateProgress', {
			solved: solvedGroups.length,
			attempts: attemptsLeft,
			finished: gameOver,
			time: endTime ? endTime - startTime : 0,
			roomCode: multiplayer.roomCode,
		});
	}, [
		solvedGroups.length,
		attemptsLeft,
		gameOver,
		endTime,
		startTime,
		multiplayer,
	]);

	// Puzzle group size and count
	const groupSize = puzzle.groups[0]?.length || 4;
	const groupCount = puzzle.groups.length;
	const gridCols = puzzle.size?.cols || 4;

	// Group solve notification
	const handleGroupSolve = useCallback(
		(groupLabel: string) => {
			notify(
				'system',
				`🎉 You solved the '${groupLabel}' group!`
			);
		},
		[notify]
	);

	// Burn notification (example, add where burn logic is handled)
	const handleBurn = useCallback(
		(burnedWord: string, isWildcard: boolean) => {
			if (isWildcard) {
				notify(
					'burn',
					`🔥 Burned wildcard: ${burnedWord} (+Bonus, +1 Attempt)`
				);
			} else {
				notify(
					'burn',
					`💀 Incorrect burn: ${burnedWord} (-1 Attempt)`
				);
			}
		},
		[notify]
	);

	// Milestone notification (e.g. final 2 attempts)
	useEffect(() => {
		if (attemptsLeft === 2 && !gameOver) {
			notify('system', '⚔️ Final 2 attempts remaining!');
		}
	}, [attemptsLeft, gameOver, notify]);

	// Victory/defeat notification
	useEffect(() => {
		if (gameOver) {
			if (result === 'win') {
				notify('achievement', '🏆 You won the match!');
			} else if (result === 'lose') {
				notify('system', '💀 You lost the match.');
			} else if (result === 'draw') {
				notify('system', '🤝 Draw!');
			}
		}
	}, [gameOver, result, notify]);

	// Achievement unlocks (if socket/achievement system is available)
	// multiplayer.socket?.on('achievement:unlocked', (data) => {
	//   notify('achievement', `🏆 Achievement Unlocked: ${data.achievement.label}`);
	// });

	// Handle guess submission
	const handleSubmit = useCallback(() => {
		if (gameOver) return;
		if (selectedWords.length !== groupSize) {
			setFeedback(`Select exactly ${groupSize} words.`);
			return;
		}
		const groupMatch = puzzle.groups.find(
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
			handleGroupSolve(groupMatch[0]); // Notify group solve
			// Check for win
			if (solvedGroups.length + 1 === groupCount) {
				setGameOver(true);
				setEndTime(Date.now());
				setShowResult(true);
				setResult('win');
				multiplayer.socket?.emit('playerWon', {
					roomCode: multiplayer.roomCode,
					time: Date.now() - startTime,
				});
			}
		} else if (groupMatch) {
			setFeedback('This group is already solved.');
			setSelectedWords([]);
		} else {
			setAttemptsLeft((prev) => prev - 1);
			setFeedback(
				partialMatchFeedback(
					selectedWords,
					groupsArrayToObject(puzzle.groups)
				)
			);
			setSelectedWords([]);
			// Lose if out of attempts
			if (attemptsLeft - 1 <= 0) {
				setGameOver(true);
				setEndTime(Date.now());
				setShowResult(true);
				setResult('lose');
				multiplayer.socket?.emit('matchEnded', {
					roomCode: multiplayer.roomCode,
					winner: 'opponent',
					time: Date.now() - startTime,
				});
			}
		}
	}, [
		selectedWords,
		groupSize,
		puzzle.groups,
		solvedGroups,
		groupCount,
		attemptsLeft,
		gameOver,
		multiplayer,
		startTime,
	]);

	// Handle word selection
	const handleWordTap = (word: string) => {
		if (lockedWords.includes(word) || gameOver) return;
		if (selectedWords.includes(word)) {
			setSelectedWords((prev) =>
				prev.filter((w) => w !== word)
			);
		} else if (selectedWords.length < groupSize) {
			setSelectedWords((prev) => [...prev, word]);
		}
	};

	// Grid words
	const solvedWords = solvedGroups.flat();
	const gridWords = shuffledWords.filter(
		(word) => !solvedWords.includes(word)
	);

	// Result modal
	const resultText =
		result === 'win'
			? 'You Win!'
			: result === 'lose'
			? 'You Lose!'
			: 'Draw!';
	const yourTime = endTime
		? ((endTime - startTime) / 1000).toFixed(2)
		: null;
	const oppTime =
		opponentProgress.finished && opponentProgress.time
			? (opponentProgress.time / 1000).toFixed(2)
			: null;

	// Socket event: receive chat message
	useEffect(() => {
		if (!multiplayer?.socket) return;
		const handler = (msg: MatchChatMessage) =>
			setChatMessages((prev) => [...prev, msg]);
		multiplayer.socket.on('match-chat', handler);
		return () => {
			multiplayer.socket?.off('match-chat', handler);
		};
	}, [multiplayer?.socket]);

	const sendMessage = (
		msg: Omit<MatchChatMessage, 'id' | 'timestamp'>
	) => {
		const fullMsg: MatchChatMessage = {
			...msg,
			id: Math.random().toString(36).slice(2),
			timestamp: Date.now(),
		};
		if (multiplayer.socket) {
			multiplayer.socket.emit('match-chat', {
				...fullMsg,
				matchId,
			});
		}
		setChatMessages((prev) => [...prev, fullMsg]);
	};

	return (
		<div
			className='vsmultiplayer-game-container'
			style={{ padding: 32, textAlign: 'center' }}
		>
			<h2>VS Mode: Multiplayer Puzzle</h2>
			<div style={{ margin: '18px 0' }}>
				Room Code: <b>{multiplayer.roomCode}</b>
			</div>
			<div style={{ margin: '18px 0', color: '#2563eb' }}>
				Match started:{' '}
				{multiplayer.matchStarted ? 'Yes' : 'No'}
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: 32,
					margin: '24px 0',
				}}
			>
				<div>
					<h4 style={{ color: '#0ea5e9' }}>
						Your Progress
					</h4>
					<div>
						Solved: {solvedGroups.length} / {groupCount}
					</div>
					<div>Attempts Left: {attemptsLeft}</div>
				</div>
				<div>
					<h4 style={{ color: '#f59e42' }}>Opponent</h4>
					<div>
						Solved: {opponentProgress.solved} / {groupCount}
					</div>
					<div>
						Attempts Left: {opponentProgress.attempts}
					</div>
				</div>
			</div>
			<div
				className='gridRoyale-grid'
				style={{
					gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
					margin: '0 auto',
					maxWidth: 400,
				}}
			>
				{gridWords.map((word: string) => (
					<WordButton
						key={word}
						word={word}
						isSelected={selectedWords.includes(word)}
						isLocked={lockedWords.includes(word)}
						onClick={() => handleWordTap(word)}
					/>
				))}
			</div>
			<div style={{ margin: '18px 0' }}>
				<button
					className='gridRoyale-submit'
					onClick={handleSubmit}
					disabled={
						gameOver || selectedWords.length !== groupSize
					}
				>
					Submit
				</button>
			</div>
			<FeedbackBanner message={feedback} />
			<Modal
				open={showResult}
				onClose={() => setShowResult(false)}
			>
				<div style={{ padding: 24, textAlign: 'center' }}>
					<h2>{resultText}</h2>
					<div style={{ margin: '16px 0' }}>
						You: {solvedGroups.length} solved,{' '}
						{4 - attemptsLeft} wrong guesses
						{yourTime && <div>Time: {yourTime}s</div>}
					</div>
					<div style={{ margin: '16px 0' }}>
						Opponent: {opponentProgress.solved} solved,{' '}
						{4 - opponentProgress.attempts} wrong guesses
						{oppTime && <div>Time: {oppTime}s</div>}
					</div>
					<button
						className='gridRoyale-submit'
						onClick={() => window.location.assign('/')}
					>
						Back to Home
					</button>
				</div>
			</Modal>
			<button
				className='inmatch-chat-toggle-btn'
				onClick={() => setShowInMatchChat((v) => !v)}
			>
				💬 Match Chat
			</button>
			{showInMatchChat && (
				<InMatchChatWindow
					matchId={multiplayer.roomCode || ''}
					friendId={multiplayerOpponentId}
					onClose={() => setShowInMatchChat(false)}
				/>
			)}
			<button
				onClick={() => setShowChat((v) => !v)}
				className='match-chat-toggle-btn'
			>
				Chat
			</button>
			<MatchChatWindow
				open={showChat}
				onClose={() => setShowChat(false)}
				matchId={matchId}
				userId={userId}
				sendMessage={sendMessage}
				messages={chatMessages}
			/>
		</div>
	);
};

export default VSMultiplayerGame;
