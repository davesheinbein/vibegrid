import React from 'react';
import { Modal } from './Modal';
import { SubmitButton } from './Buttons';

interface VSModeModalProps {
	open: boolean;
	onClose: () => void;
	onSelect: (mode: 'room' | 'matchmaking') => void;
}

const VSModeModal: React.FC<VSModeModalProps> = ({
	open,
	onClose,
	onSelect,
}) => {
	return (
		<Modal open={open} onClose={onClose}>
			<div
				style={{
					padding: 24,
					textAlign: 'center',
					minWidth: 280,
				}}
			>
				<h2 style={{ marginBottom: 20 }}>VS Mode</h2>
				<p style={{ marginBottom: 28, color: '#64748b' }}>
					Challenge a friend or compete globally in
					real-time!
				</p>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 18,
					}}
				>
					<SubmitButton
						onClick={() => onSelect('room')}
						className='vs-mode-btn vs-mode-room-btn'
					>
						🔗 Play with a Friend (Room Code)
					</SubmitButton>
					<SubmitButton
						onClick={() => onSelect('matchmaking')}
						className='vs-mode-btn vs-mode-matchmaking-btn'
					>
						🌐 Global Matchmaking
					</SubmitButton>
				</div>
			</div>
		</Modal>
	);
};

export default VSModeModal;
