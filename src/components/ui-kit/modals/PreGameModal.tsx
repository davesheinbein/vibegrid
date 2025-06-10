import React from 'react';

interface PreGameModalProps {
	open: boolean;
	onReady: () => void;
	onGoHome: () => void;
}

const PreGameModal: React.FC<PreGameModalProps> = ({
	open,
	onReady,
	onGoHome,
}) => {
	if (!open) return null;
	return (
		<div className='pregame-modal-overlay'>
			<div className='pregame-modal'>
				<h2 className='pregame-modal-title'>
					Ready to Begin?
				</h2>
				<p className='pregame-modal-subtext'>
					Your time will start as soon as you click 'Ready'.
					Focus up — this one counts.
				</p>
				<button
					className='pregame-modal-ready-btn pulse'
					onClick={onReady}
				>
					Ready
				</button>
				<button
					className='pregame-modal-go-home-btn'
					onClick={onGoHome}
					type='button'
				>
					Go Home
				</button>
			</div>
		</div>
	);
};

export default PreGameModal;
