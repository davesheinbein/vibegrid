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
import VSBotGame from './VSBotGame';
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
import styles from '../../styles/StartupPage.module.scss';
import { setMatchmakingTimeout as createMatchmakingTimeout } from '../../utils/helpers';

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
	const [inVSBotGame, setInVSBotGame] = useState(false);
	const [vsBotDifficulty, setVSBotDifficulty] = useState<
		'easy' | 'medium' | 'hard' | 'legendary' | null
	>(null);
	const [matchmakingTimeout, setMatchmakingTimeout] =
		useState<NodeJS.Timeout | null>(null);

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
		// Use a demo puzzle or fetch the appropriate puzzle for VS Bot mode
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
		return (
			<VSBotGame
				puzzle={demoPuzzle}
				botDifficulty={vsBotDifficulty}
				userId={session?.user?.email || 'me'}
				matchId={'vs-bot'}
			/>
		);
	}

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
					<ShareButton
						className='gridRoyale-submit startup-share-btn'
						onClick={onShare}
						label='Share'
					/>
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
