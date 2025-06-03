import React from 'react';

interface EndGameModalProps {
	message: string;
	onRestart: () => void;
}

const EndGameModal: React.FC<EndGameModalProps> = ({
	message,
	onRestart,
}) => {
	// --- Enhancement: allow modal to close on backdrop click for better UX ---
	const handleBackdropClick = (
		e: React.MouseEvent<HTMLDivElement>
	) => {
		if (e.target === e.currentTarget) {
			onRestart();
		}
	};

	return (
		<div
			className='endgame-modal'
			onClick={handleBackdropClick}
		>
			<div className='modal-content'>
				<h2>{message}</h2>
				<button onClick={onRestart} autoFocus>
					Play Again
				</button>
			</div>
		</div>
	);
};

export default EndGameModal;
