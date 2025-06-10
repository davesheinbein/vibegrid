import React from 'react';
import { Modal } from '../modals';
import {
	signIn,
	signOut,
	useSession,
} from 'next-auth/react';
import { CloseButton } from '../buttons';

interface StatisticsModalProps {
	open: boolean;
	onClose: () => void;
	user: {
		name: string;
		email: string;
		photoUrl?: string;
	} | null;
	dailyCompleted: boolean;
	mode?: 'daily' | 'vs'; // Add mode prop type
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({
	open,
	onClose,
	user: userProp,
	dailyCompleted,
	mode = 'daily',
}) => {
	const { data: session } = useSession();
	const user =
		userProp ||
		(session?.user
			? {
					name: session.user.name || '',
					email: session.user.email || '',
					photoUrl: session.user.image || undefined,
			  }
			: null);

	const mockStats = {
		completed: 58,
		winPercentage: 78,
		currentStreak: 0,
		maxStreak: 5,
		perfectPuzzles: 20,
		purpleFirst: 6,
		mistakeDistribution: [20, 11, 3, 11, 13],
	};

	// Mode-specific rules
	let rulesContent: React.ReactNode = null;
	if (mode === 'vs') {
		rulesContent = (
			<>
				<h3>VS Mode Rules</h3>
				<ul>
					<li>
						Compete head-to-head against a bot or another
						player.
					</li>
					<li>
						First to solve all groups wins, or whoever
						solves the most with fewest mistakes.
					</li>
					<li>
						Wildcards and mistakes affect your score and
						strategy.
					</li>
				</ul>
			</>
		);
	} else {
		rulesContent = null; // Do not show daily rules
	}

	return (
		<Modal open={open} onClose={onClose}>
			<div
				className='rules-modal-content vibe-stats__modal'
				style={{
					maxWidth: 420,
					width: '100%',
					background: 'rgba(255,255,255,0.96)',
					borderRadius: 18,
					boxShadow:
						'0 4px 32px 0 rgba(0,48,135,0.2), 0 2px 8px 0 rgba(227,234,255,0.2)',
					padding: '2.2em 2.5em 2em 2.5em',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '1.2em',
					color: '#1e293b',
					fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
					position: 'relative',
					textAlign: 'center',
					animation:
						'fadeInUp 0.32s cubic-bezier(0.23, 1.01, 0.32, 1)',
				}}
			>
				<button
					type='button'
					className='close-btn modal-close-absolute'
					aria-label='Close statistics modal'
					style={{
						padding: 20,
						background:
							'linear-gradient(90deg, #eb2525 0%, #f86838 100%)',
						color: '#fff',
						border: 'none',
						borderRadius: '0.7rem',
						fontSize: '1.08rem',
						fontWeight: 600,
						cursor: 'pointer',
						transition: 'background 0.2s',
						boxShadow: '0 2px 8px 0 rgba(16,24,40,0.08)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'absolute',
						top: 16,
						right: 16,
						zIndex: 10,
						lineHeight: 1,
					}}
					onClick={onClose}
				>
					✕
				</button>
				<div className='vibe-stats__header'>Statistics</div>
				{user && user.name ? (
					<>
						<div className='vibe-stats__user-info'>
							<img
								src={user.photoUrl || '/default-avatar.png'}
								alt={user.name}
								style={{
									width: 48,
									height: 48,
									borderRadius: '50%',
									marginBottom: 8,
								}}
							/>
							<div style={{ fontWeight: 600 }}>
								{user.name}
							</div>
							<div
								style={{
									fontSize: 13,
									color: '#888',
								}}
							>
								{user.email}
							</div>
						</div>
						<div className='statistics-stats'>
							<div>Completed: {mockStats.completed}</div>
							<div>Win %: {mockStats.winPercentage}%</div>
							<div>
								Current Streak: {mockStats.currentStreak}
							</div>
							<div>Max Streak: {mockStats.maxStreak}</div>
							<div>
								Perfect Puzzles: {mockStats.perfectPuzzles}
							</div>
						</div>
						{rulesContent}
					</>
				) : (
					<div className='vibe-stats__guest-message vibe-stats__card--muted'>
						<p>
							Sign in to track your progress and unlock
							streaks, win rate, and daily scores.
						</p>
						<button
							className='vibe-stats__signin-btn'
							onClick={() => signIn('google')}
						>
							{/* Optional icon here */}
							Sign In with Google
						</button>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default StatisticsModal;
