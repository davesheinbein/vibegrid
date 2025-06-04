import React from 'react';

interface RulesModalProps {
	open: boolean;
	onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({
	open,
	onClose,
}) => {
	if (!open) return null;
	return (
		<div
			className='rules-modal'
			onClick={(e) =>
				e.target === e.currentTarget && onClose()
			}
		>
			<div
				className='rules-modal-content'
				style={{ color: '#334155' }}
			>
				<h2>How to Play</h2>
				<ul>
					<li>
						Select 4 words that you think belong together.
					</li>
					<li>Each group of 4 shares a common theme.</li>
					<li>You have 4 attempts to find all groups.</li>
					<li>Locked words can't be selected again.</li>
					<li>
						Try to solve all groups before you run out of
						attempts!
					</li>
				</ul>
				<button
					onClick={onClose}
					className='rules-modal-close'
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default RulesModal;
