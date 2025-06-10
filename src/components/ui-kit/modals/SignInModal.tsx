import React from 'react';
import { Modal } from '../modals';

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
		<div className='signin-modal-content'>
			<h2 className='signin-modal-title'>
				Sign in to Track Your Score
			</h2>
			<button
				onClick={onSignIn}
				className='signin-modal-btn'
			>
				Sign In
			</button>
		</div>
	</Modal>
);

export default SignInModal;
