// VSGrid.tsx - DRY: Uses the same layout, tile styling, and animation as Daily Puzzle
// Only VS-specific overlays, indicators, and multiplayer header are added
// TODO: Import shared grid/tile CSS and animation logic from Daily Puzzle
// TODO: Add Framer Motion for selection, solve, and ghosting animations

import React from 'react';
import { WordButton } from '../buttons';

interface VSGridProps {
	words: string[];
	selected: string[];
	locked: string[];
	wildcards?: string[];
	onSelect: (word: string) => void;
	opponentSelected?: string[];
	playerColor?: string;
	opponentColor?: string;
	solvedBy?: Record<string, string[]>; // { playerId: [word, ...] }
	playerId?: string;
	opponentId?: string;
	gridSize?: { rows: number; cols: number };
	preview?: boolean; // NEW: disables all interaction and applies preview styles
}

const VSGrid: React.FC<VSGridProps> = ({
	words,
	selected,
	locked,
	wildcards = [],
	onSelect,
	opponentSelected = [],
	playerColor = '#2563eb',
	opponentColor = '#ef4444',
	solvedBy = {},
	playerId,
	opponentId,
	gridSize = { rows: 4, cols: 4 },
	preview = false,
}) => {
	// Calculate grid style (identical to Daily Puzzle)
	const gridStyle = {
		display: 'grid',
		gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
		gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
		gap: 12,
		width: '100%',
		maxWidth: 480,
		margin: '0 auto',
		minHeight: 320,
		background: '#fff',
		borderRadius: 16,
		boxShadow: '0 2px 16px 0 #e3eaff33',
		padding: 12,
	};

	// TODO: Use shared tile CSS classes from Daily Puzzle
	// TODO: Animate selection, solve, and ghosting with Framer Motion

	return (
		<div
			className='vs-grid gridRoyale-grid daily-grid'
			style={gridStyle}
		>
			{words.map((word, i) => {
				const isSelected = selected.includes(word);
				const isLocked = locked.includes(word);
				const isWildcard = wildcards.includes(word);
				const isOpponent = opponentSelected.includes(word);
				let solvedByPlayer = null;
				for (const pid in solvedBy) {
					if (solvedBy[pid]?.includes(word))
						solvedByPlayer = pid;
				}
				// VS overlays: opponent indicator, solved badge, etc.
				return (
					<div key={word} style={{ position: 'relative' }}>
						<WordButton
							word={word}
							isSelected={isSelected}
							isLocked={isLocked}
							onClick={
								preview ? () => {} : () => onSelect(word)
							}
							className={
								(isWildcard ? 'wildcard ' : '') +
								(isOpponent ? 'opponent ' : '') +
								(solvedByPlayer === playerId
									? 'solved-by-player '
									: solvedByPlayer === opponentId
									? 'solved-by-opponent '
									: '')
							}
							style={
								preview
									? {
											background:
												'rgb(253.8571428571, 240.7142857143, 188.1428571429)',
											color: '#1e293b',
											borderColor: '#fde047',
											boxShadow:
												'0 0 0 3px rgba(253, 224, 71, 0.3333333333), 0 4px 16px 0 rgba(56, 189, 248, 0.3333333333)',
											transform:
												'translateY(-2px) scale(1.03)',
											zIndex: 2,
									  }
									: undefined
							}
							// disables tab focus in preview
							tabIndex={preview ? -1 : 0}
						/>
						{/* VS overlays */}
						{isOpponent && !preview && (
							<span
								className='vs-ghost-overlay'
								style={{
									position: 'absolute',
									top: 4,
									right: 4,
									background: opponentColor,
									color: '#fff',
									borderRadius: 8,
									fontSize: 12,
									padding: '2px 6px',
									zIndex: 2,
									pointerEvents: 'none',
								}}
							>
								Opponent
							</span>
						)}
						{solvedByPlayer && !preview && (
							<span
								className={`vs-solved-badge ${
									solvedByPlayer === playerId
										? 'player'
										: 'opponent'
								}`}
								style={{
									position: 'absolute',
									bottom: 4,
									right: 4,
									background:
										solvedByPlayer === playerId
											? playerColor
											: opponentColor,
									color: '#fff',
									borderRadius: 8,
									fontSize: 12,
									padding: '2px 6px',
									zIndex: 2,
									pointerEvents: 'none',
								}}
							>
								{solvedByPlayer === playerId
									? 'You'
									: 'Them'}
							</span>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default VSGrid;
