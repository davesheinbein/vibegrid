import React from 'react';
import { Modal } from '../ui/Modal';

interface RulesModalProps {
	open: boolean;
	onClose: () => void;
	columnCount?: number; // Optional, defaults to 4
	mode?: 'daily' | 'custom' | 'multiplayer'; // Add mode prop
}

const RulesModal: React.FC<RulesModalProps> = ({
	open,
	onClose,
	columnCount = 4,
	mode = 'daily',
}) => {
	let modeTitle = 'How to Play';
	let modeRules: React.ReactNode = null;

	switch (mode) {
		case 'daily':
			modeTitle = 'How to Play: Daily Puzzle';
			modeRules = (
				<ul>
					<li>
						Group {columnCount * 1} words into {columnCount}{' '}
						correct groups.
					</li>
					<li>Each group shares a hidden connection.</li>
					<li>
						Use as few attempts as possible for a higher
						score.
					</li>
					<li>
						Burn words to remove them if you think they
						don't fit.
					</li>
				</ul>
			);
			break;
		case 'custom':
			modeTitle = 'How to Play: Custom Puzzle';
			modeRules = (
				<ul>
					<li>Play or create your own custom puzzles.</li>
					<li>
						Rules are similar to Daily, but with custom
						words and groups.
					</li>
				</ul>
			);
			break;
		case 'multiplayer':
			modeTitle = 'How to Play: Multiplayer';
			modeRules = (
				<ul>
					<li>
						Compete against friends or random players in
						real time.
					</li>
					<li>First to solve all groups wins.</li>
					<li>
						Use chat and taunts to outsmart your opponent.
					</li>
				</ul>
			);
			break;
		default:
			modeRules = (
				<div>See game instructions for details.</div>
			);
	}

	return (
		<Modal open={open} onClose={onClose}>
			<div className='rules-modal-content'>
				<h2>{modeTitle}</h2>
				{modeRules}
			</div>
		</Modal>
	);
};

// Modular, props-driven, and ready for extension (e.g., more modes, visuals, etc.)
export default RulesModal;
