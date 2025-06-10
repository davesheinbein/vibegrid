import React, {
	useEffect,
	useState,
	useCallback,
	useContext,
} from 'react';
import {
	checkGroupValidity,
	partialMatchFeedback,
	groupsArrayToObject,
} from '../../../utils/gameLogic';
import {
	getAllWordsFromGroupsAndWildcards,
	shuffle,
} from '../../../utils/helpers';
import FeedbackBanner from '../banners/FeedbackBanner';
import { Modal } from '../modals';
import InMatchChatWindow from '../chat/InMatchChatWindow';
import MatchChatWindow from '../chat/MatchChatWindow';
import { UserSettingsContext } from '../providers';
import { useSelector, useDispatch } from 'react-redux';
import { addMatchMessage } from '../../../store/matchChatSlice';
import { RootState } from '../../../store';
import VSStatusBar from './VSStatusBar';
import VSGrid from './VSGrid';
import { PrimaryButton, SecondaryButton } from '../buttons';
import VSQuickChatBar from '../chat/VSQuickChatBar';
import { playSound } from '../../../utils/sound';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

// Types for chat messages
interface MatchChatMessage {
	// ...
}

const VSMultiplayerGame: React.FC = (props) => {
	// TODO: Wire up real player/opponent data and game state
	// Example puzzle data for visual layout
	const player = {
		username: 'You',
		groupsSolved: 2,
		mistakes: 1,
		isYou: true,
		avatarUrl: undefined,
	};
	const opponent = {
		username: 'Opponent',
		groupsSolved: 1,
		mistakes: 2,
		avatarUrl: undefined,
	};
	const words = [
		'Jazz',
		'Ironman',
		'Midnight',
		'Apple',
		'Noon',
		'Pear',
		'Blues',
		'Dawn',
		'Galaxy',
		'Spiderman',
		'Rock',
		'Banana',
		'Superman',
		'Dusk',
		'Robot',
		'Orange',
	];
	const selected = ['Jazz', 'Ironman', 'Midnight', 'Apple'];
	const locked = [
		'Jazz',
		'Ironman',
		'Midnight',
		'Apple',
		'Noon',
		'Pear',
		'Blues',
		'Dawn',
	];
	const wildcards: string[] = [];
	const opponentSelected = ['Rock', 'Banana'];
	const solvedBy = {
		player1: ['Jazz', 'Ironman', 'Midnight', 'Apple'],
		player2: ['Noon', 'Pear', 'Blues', 'Dawn'],
	};
	const playerId = 'player1';
	const opponentId = 'player2';
	const gridSize = { rows: 4, cols: 4 };

	// Selection row logic (mirrors Daily Puzzle)
	const groupSize = 4;
	const canSubmit = selected.length === groupSize;
	const handleSelect = (word: string) => {};
	const handleSubmit = () => {};
	const handleCancel = () => {};

	const [sentEmote, setSentEmote] = useState<string | null>(
		null
	);
	const [emoteAnimKey, setEmoteAnimKey] = useState(0);
	const [chatOpen, setChatOpen] = useState(true);
	const [chatMuted, setChatMuted] = useState(false);
	const [chatCollapsed, setChatCollapsed] = useState(false);
	const [socket, setSocket] = useState<any>(null);
	const [qaFeedback, setQaFeedback] = useState<
		string | null
	>(null);
	const [attemptsLeft, setAttemptsLeft] = useState(
		gridSize.cols
	);
	const matchId = 'demo-match'; // TODO: use real matchId from multiplayer state
	const userId = 'player1'; // TODO: use real userId from session

	// Simulate opponent area position (top right above grid)
	const opponentAvatarAreaStyle = {
		position: 'absolute' as const,
		top: 32,
		right: 48,
		zIndex: 30,
		display: 'flex',
		flexDirection: 'column' as const,
		alignItems: 'center' as const,
	};

	const handleEmote = (emote: string) => {
		setSentEmote(emote);
		setEmoteAnimKey((k) => k + 1);
		playSound('emote');
		setTimeout(() => setSentEmote(null), 1200);
	};

	const router =
		typeof window !== 'undefined'
			? require('next/router').useRouter()
			: { query: {} };
	const isQAMode =
		router?.query?.qa === 'true' ||
		(typeof window !== 'undefined' &&
			window.location.search.includes('qa=true'));

	useEffect(() => {
		if (!isQAMode) return;
		// Connect to /game namespace for QA simulation
		const s = io('/game');
		setSocket(s);
		// Join the match/game room for QA events
		s.emit('match:join', {
			matchId: matchId,
			mode: 'multiplayer',
		});
		// Listen for QA simulation events
		s.on('qa:solve-group', (data) => {
			setQaFeedback('QA: Group solved!');
			// TODO: update solved groups state
		});
		s.on('qa:bot-emote', (data) => {
			setSentEmote('😈 QA Bot Emote!');
			setEmoteAnimKey((k) => k + 1);
		});
		s.on('qa:win-modal', () => {
			setQaFeedback('QA: Win modal triggered!');
			// TODO: show win modal
		});
		s.on('qa:loss-modal', () => {
			setQaFeedback('QA: Loss modal triggered!');
			// TODO: show loss modal
		});
		return () => {
			s.disconnect();
		};
	}, [isQAMode, matchId]);

	useEffect(() => {
		setAttemptsLeft(gridSize.cols);
	}, [gridSize.cols]);

	return (
		<div
			className='gridRoyale-container'
			style={{ position: 'relative' }}
		>
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
			{/* Opponent avatar area with floating emote animation */}
			<div style={opponentAvatarAreaStyle}>
				{/* Opponent avatar (placeholder) */}
				<div
					style={{
						width: 54,
						height: 54,
						borderRadius: '50%',
						background:
							'linear-gradient(90deg,#ef4444 0%,#fde68a 100%)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 32,
						fontWeight: 700,
						color: '#fff',
						boxShadow: '0 2px 12px #fde68a55',
						border: '2.5px solid #fff',
					}}
				>
					👤
				</div>
				{/* Floating emote animation above opponent avatar */}
				{sentEmote && (
					<div
						key={emoteAnimKey}
						style={{
							position: 'absolute',
							left: '50%',
							top: -38,
							transform: 'translateX(-50%)',
							pointerEvents: 'none',
							zIndex: 31,
						}}
					>
						<span
							style={{
								display: 'inline-block',
								fontSize: 38,
								animation:
									'floatEmote 1.1s cubic-bezier(.4,2,.6,1), popEmote 0.22s cubic-bezier(.4,2,.6,1)',
								filter: 'drop-shadow(0 2px 12px #fde68a)',
							}}
						>
							{sentEmote}
						</span>
						<style>{`
						@keyframes floatEmote {
							0% { opacity: 0; transform: translateY(0) scale(0.7); }
							10% { opacity: 1; transform: translateY(-10px) scale(1.1); }
							60% { opacity: 1; transform: translateY(-40px) scale(1); }
							100% { opacity: 0; transform: translateY(-80px) scale(0.8); }
						}
						@keyframes popEmote {
							0% { transform: scale(0.7); }
							60% { transform: scale(1.22); }
							100% { transform: scale(1); }
						}
						`}</style>
					</div>
				)}
			</div>
			<VSStatusBar
				player={player}
				opponent={opponent}
				timer='49:01'
				totalGroups={4}
				showMistakes={true}
				showTimer={true}
				onEmoteClick={() => {}}
			/>
			<div className='daily-center-flex-row'>
				<VSGrid
					words={words}
					selected={selected}
					locked={locked}
					wildcards={wildcards}
					onSelect={handleSelect}
					opponentSelected={opponentSelected}
					solvedBy={solvedBy}
					playerId={playerId}
					opponentId={opponentId}
					gridSize={gridSize}
				/>
			</div>
			{/* Selection Row (mirrors Daily Puzzle) */}
			<div className='gridRoyale-controls'>
				<div
					className='gridRoyale-submit-wrapper'
					style={{ justifyContent: 'center' }}
				>
					<PrimaryButton
						className='gridRoyale-submit'
						style={{ margin: '0 auto' }}
						disabled={!canSubmit}
						onClick={handleSubmit}
					>
						Submit
					</PrimaryButton>
					<SecondaryButton
						className='deselect-btn'
						style={{ marginLeft: 12 }}
						onClick={handleCancel}
					>
						Deselect All
					</SecondaryButton>
				</div>
				{/* Attempts bar and feedback banner (optional) */}
				<div className='daily-controls-flex-col'>
					<div
						className='feedback-banner feedback-banner--hidden'
						aria-live='polite'
					></div>
					<div className='gridRoyale-attempts-bar'>
						<span className='gridRoyale-attempt-dot'></span>
						<span className='gridRoyale-attempt-dot'></span>
						<span className='gridRoyale-attempt-dot'></span>
						<span className='gridRoyale-attempt-dot used'></span>
					</div>
					<div className='gridRoyale-attempts'>
						Attempts Left: {attemptsLeft}
					</div>
				</div>
				<PrimaryButton
					className='share-btn'
					style={{ marginTop: 16 }}
				>
					<svg
						aria-hidden='true'
						focusable='false'
						data-prefix='fas'
						data-icon='share-nodes'
						className='svg-inline--fa fa-share-nodes share-icon'
						role='img'
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 448 512'
						style={{
							width: 18,
							height: 18,
							marginRight: 8,
						}}
					>
						<path
							fill='currentColor'
							d='M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z'
						></path>
					</svg>
					Share
				</PrimaryButton>
			</div>
			<VSQuickChatBar onEmote={handleEmote} />
			{/* Chat toggle/collapse button (floating, right) */}
			{!chatOpen && (
				<button
					className='inMatchChatToggleBtn'
					onClick={() => setChatOpen(true)}
					style={{
						position: 'fixed',
						right: 32,
						bottom: 120,
						zIndex: 1200,
						borderRadius: 18,
						background: '#fff',
						boxShadow: '0 2px 8px #e3eaff33',
						padding: '10px 18px',
						fontWeight: 700,
						color: '#2563eb',
						border: '2px solid #e0e7ef',
					}}
				>
					💬 Chat
				</button>
			)}
			{chatOpen && (
				<MatchChatWindow
					open={chatOpen}
					onClose={() => setChatOpen(false)}
					matchId={matchId}
					userId={userId}
				/>
			)}
		</div>
	);
};

export default VSMultiplayerGame;
