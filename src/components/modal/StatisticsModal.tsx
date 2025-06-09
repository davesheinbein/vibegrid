import React from 'react';
import { Modal } from '../ui/Modal';

interface StatisticsModalProps {
	open: boolean;
	onClose: () => void;
	user: {
		name: string;
		email: string;
		photoUrl?: string;
	} | null;
	setUser: React.Dispatch<
		React.SetStateAction<{
			name: string;
			email: string;
			photoUrl?: string;
		} | null>
	>;
	dailyCompleted: boolean;
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({
	open,
	onClose,
	user,
	setUser,
	dailyCompleted,
}) => {
	const mockStats = {
		completed: 58,
		winPercentage: 78,
		currentStreak: 0,
		maxStreak: 5,
		perfectPuzzles: 20,
		purpleFirst: 6,
		mistakeDistribution: [20, 11, 3, 11, 13],
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div className='modal-stats-modal'>
				<h2>Statistics</h2>
				{user && (
					<div className='modal-stats-user'>
						{user.photoUrl && (
							<img
								src={user.photoUrl}
								alt={user.name}
								className='modal-stats-user-photo'
							/>
						)}
						<div>{user.name}</div>
						<div>{user.email}</div>
					</div>
				)}
				<div className='modal-stats-body'>
					<div>Completed: {mockStats.completed}</div>
					<div>Win %: {mockStats.winPercentage}</div>
					<div>
						Current Streak: {mockStats.currentStreak}
					</div>
					<div>Max Streak: {mockStats.maxStreak}</div>
					<div>
						Perfect Puzzles: {mockStats.perfectPuzzles}
					</div>
					<div>Purple First: {mockStats.purpleFirst}</div>
					<div>
						Mistake Distribution:{' '}
						{mockStats.mistakeDistribution.join(', ')}
					</div>
				</div>
			</div>
		</Modal>
	);
};

// Modular, props-driven, and ready for extension (e.g., real stats, charts, etc.)
export default StatisticsModal;
