import React, {
	useState,
	useEffect,
	useContext,
} from 'react';
import { ShareButton } from './Buttons';
import Footer from './Footer';
import VSModeModal from './VSModeModal';
import VSRoomModal from './VSRoomModal';
import VSMultiplayerGame from './VSMultiplayerGame';
import { Modal } from './Modal';
import { UserSettingsContext } from './UserSettingsProvider';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
	setRoomId,
	setMatchId,
	setInMatch,
	setMatchData,
} from '../../store/multiplayerSlice';

interface StartupPageProps {
	onStartDaily: () => void;
	onStartCustom: () => void;
	onBrowseCustom: () => void;
	onShare: () => void;
}

const StartupPage: React.FC<StartupPageProps> = ({
	onStartDaily,
	onStartCustom,
	onBrowseCustom,
	onShare,
}) => {
	const router = useRouter();
	const { settings } = useContext(UserSettingsContext);
	const { data: session } = useSession();
	const dispatch = useDispatch();

	// Redux multiplayer state
	const multiplayer = useSelector(
		(state: RootState) => state.multiplayer
	);
	const matchStarted = multiplayer.inMatch;
	const isHost = multiplayer.matchData?.isHost;
	const opponentJoined =
		multiplayer.matchData?.opponentJoined;
	const socket = multiplayer.matchData?.socket;
	const roomCodeRedux = multiplayer.roomId;

	const [showVSModeModal, setShowVSModeModal] =
		useState(false);
	const [showRoomModal, setShowRoomModal] = useState(false);
	const [pendingRoomCode, setPendingRoomCode] = useState<
		string | null
	>(null);
	const [inVSGame, setInVSGame] = useState(false);
	const [showMatchmaking, setShowMatchmaking] =
		useState(false);
	const [matchmakingError, setMatchmakingError] =
		useState('');
	const [matchmakingTimeout, setMatchmakingTimeout] =
		useState<NodeJS.Timeout | null>(null);
	const [inVSBotGame, setInVSBotGame] = useState(false);
	const [vsBotDifficulty, setVSBotDifficulty] = useState<
		'easy' | 'medium' | 'hard' | 'legendary' | null
	>(null);

	useEffect(() => {
		if (matchStarted) {
			setShowRoomModal(false);
			setShowMatchmaking(false);
			setInVSGame(true);
		}
	}, [matchStarted]);

	// Handle VS Mode selection
	const handleVSModeSelect = (
		mode: 'room' | 'matchmaking' | 'bot',
		botDifficulty?: 'easy' | 'medium' | 'hard' | 'legendary'
	) => {
		setShowVSModeModal(false);
		if (mode === 'room') setShowRoomModal(true);
		else if (mode === 'matchmaking') {
			setShowMatchmaking(true);
			setMatchmakingError('');
			// Join matchmaking queue
			if (socket) socket.emit('joinMatchmaking');
			// Fallback if no match in 15s
			const timeout = setTimeout(() => {
				setMatchmakingError(
					'No opponent found — try again or play locally.'
				);
				if (socket) socket.emit('leaveMatchmaking');
			}, 15000);
			setMatchmakingTimeout(timeout);
			// Listen for match found
			if (socket) {
				socket.once(
					'matchFound',
					(payload: { roomCode: string }) => {
						if (timeout) clearTimeout(timeout);
						setPendingRoomCode(payload.roomCode);
						if (socket)
							socket.emit('joinRoom', payload.roomCode);
						// Optionally update Redux state here
					}
				);
			}
		} else if (mode === 'bot' && botDifficulty) {
			setVSBotDifficulty(botDifficulty);
			setInVSBotGame(true);
		}
	};

	const handleCreateRoom = (roomCode: string) => {
		setPendingRoomCode(roomCode);
		if (socket) socket.emit('createRoom', roomCode);
		// Optionally update Redux state here
	};
	const handleJoinRoom = (roomCode: string) => {
		setPendingRoomCode(roomCode);
		if (socket) socket.emit('joinRoom', roomCode);
		// Optionally update Redux state here
	};

	if (inVSGame) {
		return <VSMultiplayerGame />;
	}

	if (inVSBotGame && vsBotDifficulty) {
		// TODO: Replace with actual VSBotGame component when implemented
		return (
			<div style={{ padding: 32, textAlign: 'center' }}>
				<h2>VS Bot Mode (WIP)</h2>
				<p>
					Difficulty: <b>{vsBotDifficulty}</b>
				</p>
				{/* Integrate NotificationBanner and MatchChatWindow here */}
				<div style={{ margin: '24px 0' }}>
					<button
						className='gridRoyale-submit'
						onClick={() => setInVSBotGame(false)}
					>
						Exit VS Bot Game
					</button>
				</div>
				<div style={{ color: '#64748b', marginTop: 24 }}>
					(Game logic, chat, and notifications coming soon)
				</div>
			</div>
		);
	}

	return (
		<div className='fullscreen-bg'>
			<div
				className='startup-page gridRoyale-container'
				style={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					background:
						'linear-gradient(120deg,#f0f9ff 0%,#e0e7ff 100%)',
				}}
			>
				<img
					src='https://i.imgur.com/1jPtNmW.png'
					alt='Grid Royale logo'
					style={{ width: 360 }}
				/>
				<h1
					className='gridRoyale-title'
					style={{
						fontSize: 44,
						margin: 0,
						color: '#2563eb',
						letterSpacing: 1,
					}}
				>
					Grid Royale
				</h1>
				{session?.user?.name && (
					<div
						style={{
							color: '#64748b',
							fontWeight: 600,
							fontSize: 18,
							marginBottom: 8,
							marginTop: 2,
							textAlign: 'center',
						}}
					>
						Signed in as{' '}
						<span
							style={{ color: '#2563eb', fontWeight: 700 }}
						>
							{session.user.name}
						</span>
					</div>
				)}
				<p
					className='gridRoyale-subtitle'
					style={{
						color: '#64748b',
						fontSize: 20,
						margin: '10px 0 32px 0',
					}}
				>
					A daily word grouping puzzle. Can you find the
					vibe?
				</p>
				<div className='startup-main-menu'>
					<button
						className='gridRoyale-submit startup-btn-daily'
						onClick={onStartDaily}
					>
						Play Daily Puzzle
					</button>
					<button
						className='gridRoyale-submit startup-btn-vs'
						onClick={() => setShowVSModeModal(true)}
					>
						VS Mode
					</button>
					<button
						className='gridRoyale-submit startup-btn-custom'
						onClick={onStartCustom}
					>
						Create Custom Puzzle
					</button>
					<button
						className='gridRoyale-submit startup-btn-browse'
						onClick={onBrowseCustom}
					>
						Browse Custom Puzzles
					</button>
					<button
						onClick={() => router.push('/shop')}
						className='startup-nav-btn startup-btn-shop'
					>
						🛒 Shop
					</button>
					<button
						onClick={() => router.push('/customization')}
						className='startup-nav-btn startup-btn-customization'
					>
						🎨 Customization
					</button>
					<button
						onClick={() => router.push('/achievements')}
						className='startup-nav-btn startup-btn-achievements'
					>
						🏆 Achievements
					</button>
					<ShareButton
						className='gridRoyale-submit startup-share-btn'
						onClick={onShare}
						label='Share'
					/>
				</div>
				<Footer />
			</div>
			{showVSModeModal && (
				<VSModeModal
					open={showVSModeModal}
					onClose={() => setShowVSModeModal(false)}
					onSelect={handleVSModeSelect}
				/>
			)}
			{showRoomModal && (
				<VSRoomModal
					open={showRoomModal}
					onClose={() => setShowRoomModal(false)}
					onCreateRoom={handleCreateRoom}
					onJoinRoom={handleJoinRoom}
					isJoining={
						!isHost && !!pendingRoomCode && !opponentJoined
					}
				/>
			)}
			{/* Matchmaking waiting modal */}
			{showMatchmaking && (
				<Modal
					open={showMatchmaking}
					onClose={() => {
						setShowMatchmaking(false);
						setMatchmakingError('');
						if (matchmakingTimeout)
							clearTimeout(matchmakingTimeout);
						if (socket) socket.emit('leaveMatchmaking');
					}}
				>
					<div
						style={{
							padding: 32,
							textAlign: 'center',
							minWidth: 280,
						}}
					>
						<h2>Global Matchmaking</h2>
						<div
							style={{ margin: '18px 0', color: '#64748b' }}
						>
							{matchmakingError ||
								'Searching for an opponent...'}
						</div>
						{matchmakingError && (
							<button
								className='gridRoyale-submit'
								onClick={() => {
									setShowMatchmaking(false);
									setMatchmakingError('');
								}}
							>
								Try Again
							</button>
						)}
					</div>
				</Modal>
			)}
		</div>
	);
};
export default StartupPage;
