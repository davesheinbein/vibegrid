import React from 'react';
import { useRouter } from 'next/router';
import { Modal } from './ui/Modal';
import { SubmitButton, ShareButton } from './ui/Buttons';
import {
	getShareUrl,
	copyToClipboard,
} from '../utils/helpers';

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
			<div className='modal-content'>
				<h2>{message}</h2>
				<p
					style={{
						color: '#64748b',
						fontSize: 16,
						margin: '0.5rem 0 1.2rem 0',
						textAlign: 'center',
					}}
				>
					Come back tomorrow for the next daily challenge!
					<br />
					Or{' '}
					<a
						href='#'
						style={{
							color: '#2563eb',
							textDecoration: 'underline',
						}}
						onClick={(e) => {
							e.preventDefault();
							router.push('/browse');
						}}
					>
						{'browse our community made puzzles'}
					</a>
					.
				</p>
				<div
					style={{
						margin: '1.5rem 0 1rem 0',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 12,
					}}
				>
					<div
						style={{
							display: 'flex',
							gap: 12,
							flexWrap: 'wrap',
							justifyContent: 'center',
						}}
					>
						<ShareButton
							onClick={handleCopy}
							label={copied ? 'Copied!' : 'Share VibeGrid'}
						/>
					</div>
				</div>
				<SubmitButton
					onClick={() => router.push('/')}
					style={{ marginTop: 12 }}
				>
					Home
				</SubmitButton>
			</div>
		</Modal>
	);
};

export default EndGameModal;
