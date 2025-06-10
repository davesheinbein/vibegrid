// Centralized VSRoomModal for UI Kit
import React, { useState } from 'react';
import { Modal } from '../modals';
import { PrimaryButton, SecondaryButton } from '../buttons';

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
	const [roomCode, setRoomCode] = useState('');
	const [error, setError] = useState('');

	const handleJoin = () => {
		if (!roomCode.trim()) {
			setError('Please enter a room code.');
			return;
		}
		setError('');
		onJoinRoom(roomCode.trim());
	};

	const handleCreate = () => {
		const newCode = Math.random()
			.toString(36)
			.substring(2, 8)
			.toUpperCase();
		onCreateRoom(newCode);
		setRoomCode(newCode);
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div
				className='vsroom-modal__content'
				style={{
					maxWidth: 400,
					width: '100%',
					background: 'rgba(255,255,255,0.98)',
					borderRadius: 18,
					boxShadow:
						'0 4px 32px 0 #00308733, 0 2px 8px 0 #e3eaff33',
					padding: '2em 2em 1.5em 2em',
					textAlign: 'center',
					position: 'relative',
				}}
			>
				<button
					className='modal-close-absolute'
					aria-label='Close'
					onClick={onClose}
					style={{
						position: 'absolute',
						top: 16,
						right: 16,
						background: 'none',
						border: 'none',
						fontSize: 22,
						cursor: 'pointer',
					}}
				>
					&times;
				</button>
				<h2
					style={{
						fontWeight: 700,
						fontSize: 26,
						marginBottom: 8,
					}}
				>
					VS Multiplayer Room
				</h2>
				<p
					style={{
						color: '#64748b',
						marginBottom: 18,
					}}
				>
					Join a friend or create a new room to play
					together!
				</p>
				<div style={{ marginBottom: 18 }}>
					<label
						htmlFor='room-code-input'
						style={{
							fontWeight: 500,
							fontSize: 16,
							display: 'block',
							marginBottom: 6,
						}}
					>
						Room Code
					</label>
					<input
						id='room-code-input'
						type='text'
						value={roomCode}
						onChange={(e) =>
							setRoomCode(e.target.value.toUpperCase())
						}
						placeholder='Enter or generate a code'
						style={{
							width: '100%',
							padding: '10px 12px',
							border: '1px solid #e5e7eb',
							borderRadius: 8,
							fontSize: 16,
							marginBottom: 4,
						}}
						disabled={isJoining}
					/>
					{error && (
						<div
							style={{
								color: '#ef4444',
								fontSize: 14,
								marginTop: 2,
							}}
						>
							{error}
						</div>
					)}
				</div>
				<div
					style={{
						display: 'flex',
						gap: 12,
						justifyContent: 'center',
						marginBottom: 10,
					}}
				>
					<PrimaryButton
						onClick={handleJoin}
						disabled={isJoining}
						style={{ minWidth: 110 }}
					>
						{isJoining ? 'Joining...' : 'Join Room'}
					</PrimaryButton>
					<SecondaryButton
						onClick={handleCreate}
						disabled={isJoining}
						style={{ minWidth: 110 }}
					>
						Create Room
					</SecondaryButton>
				</div>
				<div
					style={{
						color: '#64748b',
						fontSize: 13,
						marginTop: 8,
					}}
				>
					Share the code with your friend to play together!
				</div>
			</div>
		</Modal>
	);
};

export default VSRoomModal;
