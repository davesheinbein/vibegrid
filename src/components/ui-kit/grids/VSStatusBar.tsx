// VSStatusBar.tsx - DRY: Header layout matches Daily Puzzle, with VS additions
// TODO: Use shared header CSS/typography from Daily Puzzle
// TODO: Add Framer Motion for progress and timer animations

import React from 'react';

interface VSStatusBarProps {
	player: {
		username: string;
		avatarUrl?: string;
		groupsSolved: number;
		mistakes: number;
		isYou?: boolean;
	};
	opponent?: {
		username: string;
		avatarUrl?: string;
		groupsSolved: number;
		mistakes: number;
	};
	timer?: string;
	totalGroups: number;
	showMistakes?: boolean;
	showTimer?: boolean;
	onEmoteClick?: () => void;
}

const VSStatusBar: React.FC<VSStatusBarProps> = ({
	player,
	opponent,
	timer,
	totalGroups,
	showMistakes = true,
	showTimer = true,
	onEmoteClick,
}) => (
	<div
		className='vs-status-bar gridRoyale-header-row'
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 16,
			marginBottom: 16,
		}}
	>
		{/* Left: Player info */}
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 8,
			}}
		>
			{player.avatarUrl && (
				<img
					src={player.avatarUrl}
					alt={player.username}
					className='vs-status-avatar'
					style={{
						width: 32,
						height: 32,
						borderRadius: '50%',
					}}
				/>
			)}
			<span
				className='vs-status-username'
				style={{ fontWeight: 700 }}
			>
				{player.username}
				{player.isYou ? ' (You)' : ''}
			</span>
			<span
				className='vs-status-groups'
				style={{ marginLeft: 8 }}
			>
				Groups: {player.groupsSolved}/{totalGroups}
			</span>
			{showMistakes && (
				<span
					className='vs-status-mistakes'
					style={{ marginLeft: 8 }}
				>
					Mistakes: {player.mistakes}
				</span>
			)}
		</div>
		{/* Center: Timer */}
		{showTimer && timer && (
			<div
				className='vs-status-timer'
				style={{ fontWeight: 700, fontSize: 18 }}
			>
				⏱ {timer}
			</div>
		)}
		{/* Right: Opponent info */}
		{opponent && (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 8,
				}}
			>
				{opponent.avatarUrl && (
					<img
						src={opponent.avatarUrl}
						alt={opponent.username}
						className='vs-status-avatar'
						style={{
							width: 32,
							height: 32,
							borderRadius: '50%',
						}}
					/>
				)}
				<span
					className='vs-status-username'
					style={{ fontWeight: 700 }}
				>
					{opponent.username}
				</span>
				<span
					className='vs-status-groups'
					style={{ marginLeft: 8 }}
				>
					Groups: {opponent.groupsSolved}/{totalGroups}
				</span>
				{showMistakes && (
					<span
						className='vs-status-mistakes'
						style={{ marginLeft: 8 }}
					>
						Mistakes: {opponent.mistakes}
					</span>
				)}
				{onEmoteClick && (
					<button
						className='vs-status-emote-btn'
						onClick={onEmoteClick}
						aria-label='Send Emote'
						style={{ marginLeft: 8, fontSize: 20 }}
					>
						😊
					</button>
				)}
			</div>
		)}
	</div>
);

export default VSStatusBar;
