import React from 'react';
import { Modal } from './ui/Modal';
import { CloseButton } from './ui/Buttons';

interface RulesModalProps {
	open: boolean;
	onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({
	open,
	onClose,
}) => (
	<Modal open={open} onClose={onClose}>
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
			<CloseButton
				onClick={onClose}
				className='rules-modal-close'
			/>
		</div>
	</Modal>
);

export default RulesModal;
