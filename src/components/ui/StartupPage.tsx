import React, { useState, useEffect } from 'react';
import { ShareButton } from './Buttons';
import Footer from './Footer';
import VSModeModal from './VSModeModal';
import VSRoomModal from './VSRoomModal';
import VSMultiplayerGame from './VSMultiplayerGame';
import { useMultiplayer } from './MultiplayerProvider';
import { Modal } from './Modal';

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
	const multiplayer = useMultiplayer();
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

	useEffect(() => {
		if (multiplayer.matchStarted) {
			setShowRoomModal(false);
			setShowMatchmaking(false);
			setInVSGame(true);
		}
	}, [multiplayer.matchStarted]);

	// Handle VS Mode selection
	const handleVSModeSelect = (
		mode: 'room' | 'matchmaking'
	) => {
		setShowVSModeModal(false);
		if (mode === 'room') setShowRoomModal(true);
		else if (mode === 'matchmaking') {
			setShowMatchmaking(true);
			setMatchmakingError('');
			// Join matchmaking queue
			multiplayer.socket?.emit('joinMatchmaking');
			// Fallback if no match in 15s
			const timeout = setTimeout(() => {
				setMatchmakingError(
					'No opponent found — try again or play locally.'
				);
				multiplayer.socket?.emit('leaveMatchmaking');
			}, 15000);
			setMatchmakingTimeout(timeout);
			// Listen for match found
			multiplayer.socket?.once(
				'matchFound',
				({ roomCode }) => {
					if (timeout) clearTimeout(timeout);
					setPendingRoomCode(roomCode);
					multiplayer.joinRoom(roomCode);
				}
			);
		}
	};

	const handleCreateRoom = (roomCode: string) => {
		setPendingRoomCode(roomCode);
		multiplayer.createRoom(roomCode);
	};
	const handleJoinRoom = (roomCode: string) => {
		setPendingRoomCode(roomCode);
		multiplayer.joinRoom(roomCode);
	};

	if (inVSGame) {
		return <VSMultiplayerGame />;
	}

	return (
		<div className='fullscreen-bg'>
			<div
				className='startup-page vibegrid-container'
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
					alt='VibeGrid logo'
					style={{ width: 360 }}
				/>
				<h1
					className='vibegrid-title'
					style={{
						fontSize: 44,
						margin: 0,
						color: '#2563eb',
						letterSpacing: 1,
					}}
				>
					VibeGrid
				</h1>
				<p
					className='vibegrid-subtitle'
					style={{
						color: '#64748b',
						fontSize: 20,
						margin: '10px 0 32px 0',
					}}
				>
					A daily word grouping puzzle. Can you find the
					vibe?
				</p>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 20,
						alignItems: 'center',
						width: '100%',
						maxWidth: 340,
					}}
				>
					<button
						className='vibegrid-submit'
						onClick={onStartDaily}
						style={{
							width: '100%',
							fontSize: 20,
							padding: '0.8em 0',
							borderRadius: 12,
							background:
								'linear-gradient(90deg,#38bdf8 0%,#fbbf24 100%)',
							color: '#fff',
							fontWeight: 700,
							boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
						}}
					>
						Play Daily Puzzle
					</button>
					<button
						className='vibegrid-submit'
						onClick={() => setShowVSModeModal(true)}
						style={{
							width: '100%',
							fontSize: 20,
							padding: '0.8em 0',
							borderRadius: 12,
							background:
								'linear-gradient(90deg,#fbbf24 0%,#a7f3d0 100%)',
							color: '#2563eb',
							fontWeight: 700,
							boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
						}}
					>
						VS Mode
					</button>
					<button
						className='vibegrid-submit'
						onClick={onStartCustom}
						style={{
							width: '100%',
							fontSize: 20,
							padding: '0.8em 0',
							borderRadius: 12,
							background:
								'linear-gradient(90deg,#a7f3d0 0%,#38bdf8 100%)',
							color: '#2563eb',
							fontWeight: 700,
							boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
						}}
					>
						Create Custom Puzzle
					</button>
					<button
						className='vibegrid-submit'
						onClick={onBrowseCustom}
						style={{
							width: '100%',
							fontSize: 20,
							padding: '0.8em 0',
							borderRadius: 12,
							background:
								'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
							color: '#fff',
							fontWeight: 700,
							boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
						}}
					>
						Browse Custom Puzzles
					</button>
					<ShareButton
						className='vibegrid-submit'
						onClick={onShare}
						label='Share VibeGrid'
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
						multiplayer &&
						!multiplayer.isHost &&
						!!pendingRoomCode &&
						!multiplayer.opponentJoined
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
						multiplayer.socket?.emit('leaveMatchmaking');
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
								className='vibegrid-submit'
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
