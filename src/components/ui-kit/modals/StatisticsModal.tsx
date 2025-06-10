import React from 'react';
import { Modal } from '../modals';
import { signIn, useSession } from 'next-auth/react';
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
	mode?: 'daily' | 'vs';
}

const STAT_CONFIG = [
	{ label: 'Completed', key: 'completed', suffix: '' },
	{ label: 'Win %', key: 'winPercentage', suffix: '%' },
	{
		label: 'Current Streak',
		key: 'currentStreak',
		suffix: '',
	},
	{ label: 'Max Streak', key: 'maxStreak', suffix: '' },
	{
		label: 'Perfect Puzzles',
		key: 'perfectPuzzles',
		suffix: '',
	},
];

const UserInfo: React.FC<{ user: any }> = ({ user }) => (
	<div className='vibe-stats__user-info'>
		<img
			src={user.photoUrl || '/default-avatar.png'}
			alt={user.name}
			className='vibe-stats__user-avatar'
		/>
		<div className='vibe-stats__user-name'>{user.name}</div>
		<div className='vibe-stats__user-email'>
			{user.email}
		</div>
	</div>
);

const StatRows: React.FC<{ stats: any }> = ({ stats }) => (
	<div className='statistics-stats'>
		{STAT_CONFIG.map(({ label, key, suffix }) => (
			<div key={key} className='statistics-stat-row'>
				<span className='statistics-stat-label'>
					{label}:
				</span>{' '}
				{stats[key]}
				{suffix}
			</div>
		))}
	</div>
);

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

	const renderRules = () => {
		if (mode === 'vs') {
			return (
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
		}
		return null;
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div className='vibe-stats__modal'>
				<CloseButton onClick={onClose} />
				<div className='vibe-stats__header'>Statistics</div>
				{user && user.name ? (
					<>
						<UserInfo user={user} />
						<StatRows stats={mockStats} />
						{renderRules()}
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
							Sign In with Google
						</button>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default StatisticsModal;
