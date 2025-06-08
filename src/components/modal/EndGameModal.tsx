import React from 'react';
import { useRouter } from 'next/router';
import { Modal } from '../ui/Modal';
import { SubmitButton, ShareButton } from '../ui/Buttons';

interface EndGameModalProps {
	message: string;
	onRestart: () => void;
	score: number;
	attemptsLeft: number;
	burnBonus: number;
	win: boolean;
	onShare: () => void;
}

const EndGameModal: React.FC<EndGameModalProps> = ({
	message,
	onRestart,
	score,
	attemptsLeft,
	burnBonus,
	win,
	onShare,
}) => {
	const router = useRouter();

	return (
		<Modal
			open={true}
			onClose={() => router.push('/')}
			contentClassName='endgame-modal-content-hide-close'
		>
			<div className='modal-content endgame-modal-content'>
				<h2>{message}</h2>
				<div
					style={{
						margin: '18px 0 10px',
						fontWeight: 600,
						fontSize: '1.2em',
					}}
				>
					{win ? '🎉 You Win!' : '😢 Game Over'}
				</div>
				<div
					style={{
						margin: '10px 0 18px',
						fontSize: '1.1em',
					}}
				>
					<div>
						Final Score: <b>{score}</b>
					</div>
					<div
						style={{
							fontSize: '0.98em',
							color: '#64748b',
							marginTop: 6,
						}}
					>
						{win && (
							<>
								<div>Base Win: 100</div>
								<div>Burn Bonus: {burnBonus}</div>
								<div>
									Attempts Left Bonus: {attemptsLeft} × 10 ={' '}
									{attemptsLeft * 10}
								</div>
							</>
						)}
						{!win && <div>Burn Bonus: {burnBonus}</div>}
					</div>
				</div>
				<p className='endgame-modal-desc'>
					Come back tomorrow for the next daily challenge!
					<br />
					Or{' '}
					<a
						href='#'
						className='endgame-modal-link'
						onClick={(e) => {
							e.preventDefault();
							router.push('/browse');
						}}
					>
						{'browse our community made puzzles'}
					</a>
					.
				</p>
				<div className='endgame-modal-share'>
					<div className='endgame-modal-share-btns'>
						<ShareButton
							onClick={onShare}
							label={'Share'}
						/>
					</div>
				</div>
				<SubmitButton
					onClick={() => router.push('/')}
					className='endgame-modal-home-btn'
				>
					Home
				</SubmitButton>
			</div>
		</Modal>
	);
};

export default EndGameModal;
