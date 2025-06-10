import React, {
	useState,
	useEffect,
	useContext,
} from 'react';
import { PrimaryButton, SecondaryButton } from '../buttons';
import { UserSettingsContext } from '../providers';
import Footer from '../Footer';
import { VSModeModal, VSRoomModal } from '../VSModals';
import VSMultiplayerGame from '../grids/VSMultiplayerGame';
import { Modal } from '../modals';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import {
	setRoomId,
	setMatchId,
	setInMatch,
	setMatchData,
} from '../../../store/multiplayerSlice';
import styles from '../../../styles/StartupPage.module.scss';
import { setMatchmakingTimeout as createMatchmakingTimeout } from '../../../utils/helpers';

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
	const userSettings = useContext(UserSettingsContext) as {
		settings: any;
	};
	const settings = userSettings?.settings;
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
	const [showMatchmaking, setShowMatchmaking] =
		useState(false);
	const [matchmakingError, setMatchmakingError] =
		useState('');
	const [matchmakingTimeout, setMatchmakingTimeout] =
		useState<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (matchStarted) {
			setShowRoomModal(false);
			setShowMatchmaking(false);
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
			const timeoutId = createMatchmakingTimeout(() => {
				setMatchmakingError(
					'No opponent found — try again or play locally.'
				);
				if (socket) socket.emit('leaveMatchmaking');
			}, 15000);
			setMatchmakingTimeout(timeoutId);
			// Listen for match found
			if (socket) {
				socket.once(
					'matchFound',
					(payload: { roomCode: string }) => {
						if (matchmakingTimeout)
							clearTimeout(matchmakingTimeout);
						setPendingRoomCode(payload.roomCode);
						if (socket)
							socket.emit('joinRoom', payload.roomCode);
					}
				);
			}
		} else if (mode === 'bot' && botDifficulty) {
			// Route to /vs/bot?difficulty=... (optionally add userId/matchId)
			const userId = session?.user?.email || 'me';
			const matchId = 'vs-bot';
			router.push({
				pathname: '/vs/bot',
				query: {
					difficulty: botDifficulty,
					userId,
					matchId,
				},
			});
		}
	};

	const handleCreateRoom = (roomCode: string) => {
		setPendingRoomCode(roomCode);
		if (socket) socket.emit('createRoom', roomCode);
	};
	const handleJoinRoom = (roomCode: string) => {
		setPendingRoomCode(roomCode);
		if (socket) socket.emit('joinRoom', roomCode);
	};

	return (
		<div className='fullscreen-bg'>
			<div
				className={`${styles.startupPageContainer} startup-page gridRoyale-container`}
			>
				<img
					src='https://i.imgur.com/1jPtNmW.png'
					alt='Grid Royale logo'
					className={styles.logoImage}
				/>
				<h1 className={styles.title}>Grid Royale</h1>
				<p className={styles.subtitle}>
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
					{/* TODO: Replace with ShareButton from UI kit if available */}
					<button
						className='gridRoyale-submit startup-share-btn'
						onClick={onShare}
					>
						Share
					</button>
					{session?.user?.name && (
						<div className={styles.signedInAs}>
							Signed in as
							<br />
							<span className={styles.userName}>
								{session.user.name}
							</span>
						</div>
					)}
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
						setShowVSModeModal(true); // Show VSModeModal again
						if (socket) socket.emit('leaveMatchmaking');
					}}
				>
					<div className={styles.matchmakingModalContent}>
						<h2>Global Matchmaking</h2>
						<div className={styles.matchmakingMessage}>
							{matchmakingError ||
								'Searching for an opponent...'}
						</div>
						{matchmakingError && (
							<button
								className='gridRoyale-submit'
								onClick={() => {
									setShowMatchmaking(false);
									setMatchmakingError('');
									setShowVSModeModal(true); // Show VSModeModal again
								}}
							>
								Try Again
							</button>
						)}
					</div>
				</Modal>
			)}
			{showMatchmaking && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 1000,
						background: 'rgba(30,41,59,0.32)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						animation:
							'fadeInUp 0.32s cubic-bezier(0.23, 1.01, 0.32, 1)',
					}}
				>
					<div
						style={{
							minWidth: 320,
							maxWidth: 420,
							background: 'rgba(255,255,255,0.98)',
							borderRadius: 18,
							boxShadow:
								'0 4px 32px 0 #00308733, 0 2px 8px 0 #e3eaff33',
							padding: '2.2em 2.5em 2em 2.5em',
							textAlign: 'center',
							color: '#1e293b',
							fontFamily:
								'Inter, Segoe UI, Arial, sans-serif',
						}}
					>
						<div
							style={{
								fontSize: 22,
								fontWeight: 700,
								marginBottom: 10,
							}}
						>
							Global Matchmaking
						</div>
						<div
							style={{
								color: '#64748b',
								fontSize: 16,
								marginBottom: 18,
							}}
						>
							Searching for an opponent...
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								gap: 12,
							}}
						>
							<SecondaryButton
								onClick={() => {
									setShowMatchmaking(false);
									setMatchmakingError('');
									setShowVSModeModal(true); // Show VSModeModal again
									if (socket)
										socket.emit('leaveMatchmaking');
								}}
								style={{ minWidth: 100 }}
							>
								Cancel
							</SecondaryButton>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default StartupPage;
