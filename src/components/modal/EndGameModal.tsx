import React from 'react';
import { useRouter } from 'next/router';
import { Modal } from '../ui/Modal';
import { SubmitButton, ShareButton } from '../ui/Buttons';
import {
	getShareUrl,
	copyToClipboard,
} from '../../utils/helpers';

interface EndGameModalProps {
	message: string;
	onRestart: () => void;
}

const EndGameModal: React.FC<EndGameModalProps> = ({
	message,
	onRestart,
}) => {
	const router = useRouter();
	const [copied, setCopied] = React.useState(false);
	const handleCopy = () => {
		copyToClipboard(getShareUrl(), setCopied);
	};

	return (
		<Modal open={true} onClose={onRestart}>
			<div className='modal-content endgame-modal-content'>
				<h2>{message}</h2>
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
							onClick={handleCopy}
							label={copied ? 'Copied!' : 'Share VibeGrid'}
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
