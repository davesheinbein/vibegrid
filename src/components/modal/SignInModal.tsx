import React from 'react';
import { Modal } from '../ui/Modal';

interface SignInModalProps {
	open: boolean;
	onClose: () => void;
	onSignIn: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({
	open,
	onClose,
	onSignIn,
}) => (
	<Modal open={open} onClose={onClose}>
		<div
			className='signin-modal-content'
			style={{
				padding: 40,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<h2 style={{ marginBottom: 10, textAlign: 'center' }}>
				Sign in to Track Your Score
			</h2>
			<p
				className='signin-modal-desc'
				style={{ marginBottom: 18, textAlign: 'center' }}
			>
				Sign in with Google to save your stats and see your
				leaderboard placement.
				<br />
				You can continue as a guest, but your stats won't be
				tracked.
			</p>
			<button
				onClick={onSignIn}
				style={{
					display: 'block',
					margin: '0 auto',
					padding: '10px 24px',
					borderRadius: 8,
					background: '#fff',
					color: '#222',
					fontWeight: 600,
					boxShadow: '0 2px 8px #e3eaff33',
					border: '1.5px solid #e0e7ef',
					cursor: 'pointer',
				}}
			>
				Sign in with Google
			</button>
		</div>
	</Modal>
);

export default SignInModal;
