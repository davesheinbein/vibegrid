// VSBotGame.tsx
import React, {
	useEffect,
	useState,
	useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { WordButton } from './Buttons';
import FeedbackBanner from './FeedbackBanner';
import { Modal } from './Modal';
import MatchChatWindow from './MatchChatWindow';
import { UserSettingsContext } from './UserSettingsProvider';
import {
	getAllWordsFromGroupsAndWildcards,
	shuffle,
} from '../../utils/helpers';
import { runVSBot } from '../../utils/vsBot';
import { themes, vsModeDefaults } from '../ThemeSelector';

interface VSBotGameProps {
	puzzle: any;
	botDifficulty: 'easy' | 'medium' | 'hard' | 'legendary';
	userId: string;
	matchId: string;
	roomCode?: string;
}

const VSBotGame: React.FC<VSBotGameProps> = ({
	puzzle,
	botDifficulty,
	userId,
	matchId,
	roomCode,
}) => {
	const { settings } = useContext(UserSettingsContext);
	const themeName = settings.theme || 'light';
	const theme =
		themes.find((t) => t.name === themeName)?.vsMode ||
		vsModeDefaults;
	const custom = settings.vsModeCustom || {};
	const playerColor = custom.playerColor || theme.player;
	const enemyColor = custom.enemyColor || theme.enemy;
	const playerBg = custom.playerBg || theme.playerBg;
	const enemyBg = custom.enemyBg || theme.enemyBg;
	const boardBg = custom.boardBg || theme.boardBg;
	const fontColor = custom.font || theme.font;
	const borderColor = custom.border || theme.border;

	const dispatch = useDispatch();
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
	const [showResult, setShowResult] = useState(false);
	const [result, setResult] = useState<
		'win' | 'lose' | 'draw' | null
	>(null);
	const [shuffledWords, setShuffledWords] = useState<
		string[]
	>([]);
	const [botSolvedGroups, setBotSolvedGroups] = useState<
		string[][]
	>([]);
	const [botAttemptsLeft, setBotAttemptsLeft] = useState(4);
	const [botTime, setBotTime] = useState<number | null>(
		null
	);
	const [userTime, setUserTime] = useState<number | null>(
		null
	);
	const [startTime] = useState(Date.now());
	const [showChat, setShowChat] = useState(false);

	const groupSize = puzzle.groups[0]?.length || 4;
	const groupCount = puzzle.groups.length;
	const gridCols = puzzle.size?.cols || 4;

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

	// Simulate bot solving after mount
	useEffect(() => {
		const botPromise = runVSBot(puzzle, botDifficulty);
		botPromise.then((result) => {
			setBotSolvedGroups(result.solvedGroups);
			setBotAttemptsLeft(result.attemptsLeft);
			setBotTime(result.timeMs);
		});
	}, [puzzle, botDifficulty]);

	const handleSubmit = () => {
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
			if (solvedGroups.length + 1 === groupCount) {
				setGameOver(true);
				setUserTime(Date.now() - startTime);
				setShowResult(true);
				if (botSolvedGroups.length === groupCount) {
					if (userTime && botTime) {
						if (userTime < botTime) setResult('win');
						else if (userTime > botTime) setResult('lose');
						else setResult('draw');
					} else {
						setResult('draw');
					}
				} else {
					setResult('win');
				}
			}
		} else if (groupMatch) {
			setFeedback('This group is already solved.');
			setSelectedWords([]);
		} else {
			setAttemptsLeft((prev) => prev - 1);
			setFeedback('Incorrect group. Try again!');
			setSelectedWords([]);
			if (attemptsLeft - 1 <= 0) {
				setGameOver(true);
				setUserTime(Date.now() - startTime);
				setShowResult(true);
				setResult('lose');
			}
		}
	};

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

	const solvedWords = solvedGroups.flat();
	const gridWords = shuffledWords.filter(
		(word) => !solvedWords.includes(word)
	);

	const resultText =
		result === 'win'
			? 'You Win!'
			: result === 'lose'
			? 'You Lose!'
			: 'Draw!';
	const yourTime = userTime
		? (userTime / 1000).toFixed(2)
		: null;
	const oppTime = botTime
		? (botTime / 1000).toFixed(2)
		: null;

	return (
		<div
			className='vsbot-game-container'
			style={{ padding: 32, textAlign: 'center' }}
		>
			<h2>
				VS Bot:{' '}
				{botDifficulty.charAt(0).toUpperCase() +
					botDifficulty.slice(1)}
			</h2>
			<div style={{ margin: '18px 0' }}>
				Puzzle: <b>{puzzle.title}</b>
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
					<h4 style={{ color: '#f59e42' }}>Bot</h4>
					<div>
						Solved: {botSolvedGroups.length} / {groupCount}
					</div>
					<div>Attempts Left: {botAttemptsLeft}</div>
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
						Bot: {botSolvedGroups.length} solved,{' '}
						{4 - botAttemptsLeft} wrong guesses
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
			/>
		</div>
	);
};

export default VSBotGame;
