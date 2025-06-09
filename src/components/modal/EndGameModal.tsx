import React from 'react';
import { useRouter } from 'next/router';
import { Modal } from '../ui/Modal';
import { ShareButton } from '../ui/Buttons';

interface EndGameModalProps {
	message: string;
	// onRestart: () => void;
	score: number;
	attemptsLeft: number;
	burnBonus: number;
	win: boolean;
	onShare: () => void;
	finishTime?: string;
}

const EndGameModal: React.FC<EndGameModalProps> = ({
	message,
	// onRestart,
	score,
	attemptsLeft,
	burnBonus,
	win,
	onShare,
	finishTime,
}) => {
	const router = useRouter();

	return (
		<Modal
			open={true}
			onClose={() => router.push('/')}
			contentClassName='endgame-modal-content-hide-close'
		>
			<div className='modal-content endgame-modal-content'>
				<h2>{win ? 'Congratulations!' : 'Game Over'}</h2>
				<p>{message}</p>
				<div className='endgame-modal-score'>
					Score: <b>{score}</b>
				</div>
				<div className='endgame-modal-attempts'>
					Attempts Left: <b>{attemptsLeft}</b>
				</div>
				<div className='endgame-modal-burn-bonus'>
					Burn Bonus: <b>{burnBonus}</b>
				</div>
				{finishTime && (
					<div className='endgame-modal-finish-time'>
						Time: {finishTime}
					</div>
				)}
				<div className='endgame-modal-actions'>
					{/* Disabled */}
					{/* <button
						onClick={onRestart}
						className='endgame-modal-home-btn'
					>
						Restart
					</button> */}
					<ShareButton
						onClick={onShare}
						className='endgame-modal-share-btn'
						label='Share'
					/>
				</div>
			</div>
		</Modal>
	);
};

// Modular, props-driven, and ready for extension (e.g., stats, animations, etc.)
export default EndGameModal;
