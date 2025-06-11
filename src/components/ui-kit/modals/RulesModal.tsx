import React from 'react';
import { Modal } from '../modals';
import { CloseButton } from '../buttons';

interface RulesModalProps {
	open: boolean;
	onClose: () => void;
	columnCount?: number;
	mode?: 'daily' | 'custom' | 'multiplayer';
	wildcardsActive?: boolean;
}

const RulesModal: React.FC<RulesModalProps> = ({
	open,
	onClose,
	columnCount = 4,
	mode = 'daily',
	wildcardsActive,
}) => {
	let modeTitle = 'How to Play';
	let modeRules: React.ReactNode = null;
	switch (mode) {
		case 'daily':
			modeTitle = 'How to Play: Daily Puzzle';
			modeRules = (
				<>
					<ul>
						<li>
							Group {columnCount * 1} words into{' '}
							{columnCount} correct groups.
						</li>
						<li>Each group shares a hidden connection.</li>
						<li>
							Use as few attempts as possible for a higher
							score. The game ends when you run out of
							attempts.
						</li>
						{typeof wildcardsActive !== 'undefined' &&
							wildcardsActive && (
								<li>
									Burn words to remove them if you think
									they don't fit.
									<span>
										{' '}
										If wildcards are active, burning a
										wildcard word may restore an attempt
										(life).
									</span>
								</li>
							)}
					</ul>
					<div
						className='rules-modal-scoring-info'
						style={{
							margin: '1.2em 0 0.5em 0',
							padding: '1em',
							background: '#f3f6fa',
							borderRadius: 12,
							textAlign: 'left',
						}}
					>
						<h4
							style={{
								margin: '0 0 0.5em 0',
								fontSize: '1em',
								color: '#2563eb',
							}}
						>
							How Scoring Works
						</h4>
						<ul
							style={{
								margin: 0,
								paddingLeft: 18,
								fontSize: '0.98em',
								color: '#334155',
							}}
						>
							<li>
								<b>Daily Puzzle:</b> Score = groups found –
								mistakes + bonus for no wildcards/hints.
								Time may be a tiebreaker.
							</li>
							<li
								style={{
									color: '#64748b',
									marginTop: 6,
								}}
							>
								All modes: Score is based on accuracy,
								speed, and sometimes style (emotes/taunts).
								All stats are saved for analytics and
								leaderboards.
							</li>
						</ul>
					</div>
				</>
			);
			break;
		case 'custom':
			modeTitle = 'How to Play: Custom Puzzle';
			modeRules = (
				<>
					<ul>
						<li>Play or create your own custom puzzles.</li>
						<li>
							Rules are similar to Daily, but with custom
							words and groups.
						</li>
						<li>
							Attempts may be limited or unlimited depending
							on puzzle settings.
						</li>
						{typeof wildcardsActive !== 'undefined' &&
							wildcardsActive && (
								<li>
									Burning a wildcard word will restore an
									attempt (life).
								</li>
							)}
					</ul>
					<div
						className='rules-modal-scoring-info'
						style={{
							margin: '1.2em 0 0.5em 0',
							padding: '1em',
							background: '#f3f6fa',
							borderRadius: 12,
							textAlign: 'left',
						}}
					>
						<h4
							style={{
								margin: '0 0 0.5em 0',
								fontSize: '1em',
								color: '#2563eb',
							}}
						>
							How Scoring Works
						</h4>
						<ul
							style={{
								margin: 0,
								paddingLeft: 18,
								fontSize: '0.98em',
								color: '#334155',
							}}
						>
							<li>
								<b>Custom Puzzle:</b> Scoring is similar to
								Daily, but may vary depending on puzzle
								creator's settings.
							</li>
							<li
								style={{
									color: '#64748b',
									marginTop: 6,
								}}
							>
								All modes: Score is based on accuracy,
								speed, and sometimes style (emotes/taunts).
								All stats are saved for analytics and
								leaderboards.
							</li>
						</ul>
					</div>
				</>
			);
			break;
		case 'multiplayer':
			modeTitle = 'How to Play: Multiplayer';
			modeRules = (
				<>
					<ul>
						<li>
							Compete against friends or random players.
						</li>
						<li>First to solve all groups wins.</li>
						<li>
							Incorrect attempts may reduce your score or
							end your run.
						</li>
						{typeof wildcardsActive !== 'undefined' &&
							wildcardsActive && (
								<li>
									Burning a wildcard word will restore an
									attempt (life).
								</li>
							)}
					</ul>
					<div
						className='rules-modal-scoring-info'
						style={{
							margin: '1.2em 0 0.5em 0',
							padding: '1em',
							background: '#f3f6fa',
							borderRadius: 12,
							textAlign: 'left',
						}}
					>
						<h4
							style={{
								margin: '0 0 0.5em 0',
								fontSize: '1em',
								color: '#2563eb',
							}}
						>
							How Scoring Works
						</h4>
						<ul
							style={{
								margin: 0,
								paddingLeft: 18,
								fontSize: '0.98em',
								color: '#334155',
							}}
						>
							<li>
								<b>VS Multiplayer:</b> Score = groups found
								(+speed bonus) – mistakes + streak/bonus.
								Highest score wins.
							</li>
							<li
								style={{
									color: '#64748b',
									marginTop: 6,
								}}
							>
								All modes: Score is based on accuracy,
								speed, and sometimes style (emotes/taunts).
								All stats are saved for analytics and
								leaderboards.
							</li>
						</ul>
					</div>
				</>
			);
			break;
		default:
			modeRules = null;
	}
	return (
		<Modal open={open} onClose={onClose}>
			<div className='rules-modal-content'>
				<CloseButton
					onClick={onClose}
					className='modal-close-absolute'
				/>
				<h2>{modeTitle}</h2>
				{modeRules}
			</div>
		</Modal>
	);
};

export default RulesModal;
