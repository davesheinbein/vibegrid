import React from 'react';

// EndGameModal: Modal shown at the end of a game session.
// Single responsibility: display end-of-game message and restart action.
// Future-proof: easy to extend for additional actions (e.g., share, view stats) if needed.

interface EndGameModalProps {
	message: string;
	onRestart: () => void;
}

const EndGameModal: React.FC<EndGameModalProps> = ({
	message,
	onRestart,
}) => {
	// Enhancement: allow modal to close on backdrop click for better UX
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
				{/*
					Future: Add more actions here (e.g., share, view stats)
				*/}
			</div>
		</div>
	);
};

export default EndGameModal;
