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
						Select {columnCount} words that you think belong
						together.
					</li>
					<li>
						Each group of {columnCount} shares a common
						theme.
					</li>
					<li>
						You have {columnCount} attempts to find all
						groups.
					</li>
					<li>Locked words can't be selected again.</li>
					<li>
						Try to solve all groups before you run out of
						attempts!
					</li>
					<li>
						One new puzzle every day. Track your streaks and
						stats!
					</li>
				</ul>
			);
			break;
		case 'custom':
			modeTitle = 'How to Play: Custom Puzzle';
			modeRules = (
				<ul>
					<li>
						Select {columnCount} words that you think belong
						together.
					</li>
					<li>
						Each group of {columnCount} shares a common
						theme.
					</li>
					<li>
						You have {columnCount} attempts to find all
						groups.
					</li>
					<li>Locked words can't be selected again.</li>
					<li>
						Try to solve all groups before you run out of
						attempts!
					</li>
					<li>
						Play, create, and share puzzles with the
						community. No streaks, but your stats and
						favorites are saved.
					</li>
				</ul>
			);
			break;
		case 'multiplayer':
			modeTitle = 'How to Play: VS Multiplayer';
			modeRules = (
				<ul>
					<li>
						Compete in real-time to solve all groups first!
					</li>
					<li>
						Select {columnCount} words that you think belong
						together.
					</li>
					<li>
						Each group of {columnCount} shares a common
						theme.
					</li>
					<li>
						You have {columnCount} attempts to find all
						groups.
					</li>
					<li>Locked words can't be selected again.</li>
					<li>
						First to solve all groups, or the most groups
						when attempts run out, wins.
					</li>
					<li>
						Track your multiplayer stats and challenge
						friends!
					</li>
				</ul>
			);
			break;
		default:
			modeRules = (
				<ul>
					<li>
						Select {columnCount} words that you think belong
						together.
					</li>
					<li>
						Each group of {columnCount} shares a common
						theme.
					</li>
					<li>
						You have {columnCount} attempts to find all
						groups.
					</li>
					<li>Locked words can't be selected again.</li>
					<li>
						Try to solve all groups before you run out of
						attempts!
					</li>
				</ul>
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

export default RulesModal;
