import React from 'react';
import { Modal } from '../ui/Modal';
import { SubmitButton } from '../ui/Buttons';

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
			<h2>Sign in to Track Your Score</h2>
			<p className='signin-modal-desc'>
				Sign in with Google to save your stats and see your
				leaderboard placement.
				<br />
				You can continue as a guest, but your stats won't be
				tracked.
			</p>
			<SubmitButton
				onClick={onSignIn}
				className='signin-modal-btn'
			>
				<svg
					className='signin-modal-google-icon'
					width='22'
					height='22'
					viewBox='0 0 48 48'
				>
					<g>
						<circle fill='#fff' cx='24' cy='24' r='24' />
						<path
							fill='#4285F4'
							d='M34.6 24.2c0-.7-.1-1.4-.2-2H24v4.1h6c-.3 1.5-1.3 2.7-2.7 3.5v2.9h4.4c2.6-2.4 4.1-5.9 4.1-10.5z'
						/>
						<path
							fill='#34A853'
							d='M24 36c3.6 0 6.6-1.2 8.8-3.2l-4.4-2.9c-1.2.8-2.7 1.3-4.4 1.3-3.4 0-6.2-2.3-7.2-5.3h-4.5v3.1C15.2 33.8 19.3 36 24 36z'
						/>
						<path
							fill='#FBBC05'
							d='M16.8 25.9c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1v-3.1h-4.5C11.5 21.2 13.8 24 16.8 25.9z'
						/>
						<path
							fill='#EA4335'
							d='M24 18.4c1.9 0 3.6.6 4.9 1.7l3.7-3.7C30.6 14.2 27.6 13 24 13c-4.7 0-8.8 2.2-11.2 5.8l4.5 3.1c1-3 3.8-5.3 7.2-5.3z'
						/>
					</g>
				</svg>
				Sign in with Google
			</SubmitButton>
		</div>
	</Modal>
);

export default SignInModal;
