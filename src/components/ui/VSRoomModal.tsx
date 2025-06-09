import React, { useState } from 'react';
import { Modal } from './Modal';
import { SubmitButton } from './Buttons';
import { useMultiplayer } from './MultiplayerProvider';
import { generateRoomCode } from '../../utils/helpers';

interface VSRoomModalProps {
	open: boolean;
	onClose: () => void;
	onCreateRoom: (roomCode: string) => void;
	onJoinRoom: (roomCode: string) => void;
	isJoining?: boolean;
}

const VSRoomModal: React.FC<VSRoomModalProps> = ({
	open,
	onClose,
	onCreateRoom,
	onJoinRoom,
	isJoining = false,
}) => {
	const multiplayer = useMultiplayer();
	const [roomCode, setRoomCode] = useState('');
	const [createdRoom, setCreatedRoom] = useState<
		string | null
	>(null);
	const [error, setError] = useState('');

	// Show the actual room code from multiplayer context if available
	const activeRoomCode =
		multiplayer.roomCode || createdRoom;
	const isHost = multiplayer.isHost;
	const opponentJoined = multiplayer.opponentJoined;
	const matchStarted = multiplayer.matchStarted;

	const handleCreateRoom = () => {
		const code = generateRoomCode();
		setCreatedRoom(code);
		onCreateRoom(code);
	};

	const handleJoinRoom = () => {
		if (!roomCode.match(/^[A-Z0-9]{6}$/i)) {
			setError('Enter a valid 6-character code');
			return;
		}
		setError('');
		onJoinRoom(roomCode.toUpperCase());
	};

	// UI logic for host/joiner
	let content;
	if (!activeRoomCode) {
		// Initial state: choose to create or join a room
		content = (
			<div
				style={{
					padding: 24,
					textAlign: 'center',
					minWidth: 280,
				}}
			>
				<h2 style={{ marginBottom: 20 }}>Room Code</h2>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 18,
					}}
				>
					<SubmitButton
						onClick={handleCreateRoom}
						className='vs-room-btn'
					>
						Create Room
					</SubmitButton>
					<div
						style={{ margin: '12px 0', color: '#64748b' }}
					>
						or join a friend’s room:
					</div>
					<input
						type='text'
						value={roomCode}
						onChange={(e) =>
							setRoomCode(e.target.value.toUpperCase())
						}
						maxLength={6}
						placeholder='Enter code'
						style={{
							textAlign: 'center',
							fontSize: 22,
							letterSpacing: 4,
							padding: 8,
							border: '1px solid #e5e7eb',
							borderRadius: 6,
							marginBottom: 8,
							width: 140,
							marginLeft: 'auto',
							marginRight: 'auto',
						}}
						disabled={isJoining}
					/>
					{error && (
						<div
							style={{ color: '#ef4444', marginBottom: 8 }}
						>
							{error}
						</div>
					)}
					<SubmitButton
						onClick={handleJoinRoom}
						className='vs-room-btn'
						disabled={isJoining}
					>
						Join Room
					</SubmitButton>
				</div>
			</div>
		);
	} else if (isHost) {
		// Host: show room code and waiting for opponent
		content = (
			<div
				style={{
					padding: 24,
					textAlign: 'center',
					minWidth: 280,
				}}
			>
				<h2 style={{ marginBottom: 20 }}>
					Share this Room Code
				</h2>
				<div
					style={{
						fontSize: 32,
						fontWeight: 700,
						letterSpacing: 6,
						margin: '18px 0',
					}}
				>
					{activeRoomCode}
				</div>
				<div style={{ color: '#64748b', marginBottom: 18 }}>
					{opponentJoined
						? 'Opponent joined! Ready to start.'
						: 'Waiting for opponent to join...'}
				</div>
				<SubmitButton
					onClick={multiplayer.startMatch}
					className='vs-room-btn'
					disabled={!opponentJoined || matchStarted}
				>
					Start Match
				</SubmitButton>
			</div>
		);
	} else {
		// Joiner: show joined state and waiting for host to start
		content = (
			<div
				style={{
					padding: 24,
					textAlign: 'center',
					minWidth: 280,
				}}
			>
				<h2 style={{ marginBottom: 20 }}>Joined Room</h2>
				<div
					style={{
						fontSize: 32,
						fontWeight: 700,
						letterSpacing: 6,
						margin: '18px 0',
					}}
				>
					{activeRoomCode}
				</div>
				<div style={{ color: '#64748b', marginBottom: 18 }}>
					{matchStarted
						? 'Match starting...'
						: 'Waiting for host to start the match...'}
				</div>
			</div>
		);
	}

	return (
		<Modal open={open} onClose={onClose}>
			{content}
		</Modal>
	);
};

export default VSRoomModal;
