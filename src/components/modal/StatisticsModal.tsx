import React from 'react';
import { Modal } from '../ui/Modal';
import { CloseButton, SubmitButton } from '../ui/Buttons';

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
	if (!open) return null;
	let content;
	if (!user) {
		content = (
			<div
				className='xwd__modal--body modal-stats-body animate-opening'
				tabIndex={0}
			>
				<article className='xwd__modal--content modal-stats-content'>
					<h2 className='modal-system-header modal-stats-title'>
						Statistics
					</h2>
					<div className='Stats-module_regiwall_abstract_stats__BkBe5 dark_regiwall_abstract_stats modal-stats-abstract'></div>
					<div
						className='Stats-module_regiwall_message__pbJmt modal-stats-message'
						data-testid='regiwall_message'
					></div>
				</article>
			</div>
		);
	} else if (!dailyCompleted) {
		content = (
			<div className='modal-stats-incomplete'>
				<h2>Complete the Daily Mission</h2>
				<p className='modal-stats-desc'>
					You must finish today's daily puzzle to view your
					statistics and leaderboard placement.
				</p>
				<SubmitButton
					onClick={onClose}
					className='modal-stats-ok-btn'
				>
					OK
				</SubmitButton>
			</div>
		);
	} else {
		content = (
			<div className='modal-stats-complete'>
				<h2>Your VibeGrid Stats</h2>
				<div className='modal-stats-summary'>
					Games Played: 12
					<br />
					Win Rate: 75%
					<br />
					Avg. Score: 82
					<br />
					Best Streak: 5
				</div>
				<h3 className='modal-stats-leaderboard-title'>
					Leaderboard
				</h3>
				<table className='modal-stats-leaderboard-table'>
					<thead>
						<tr className='modal-stats-leaderboard-header'>
							<th className='modal-stats-leaderboard-th'>
								Rank
							</th>
							<th className='modal-stats-leaderboard-th'>
								User
							</th>
							<th className='modal-stats-leaderboard-th'>
								Score
							</th>
						</tr>
					</thead>
					<tbody>
						<tr className='modal-stats-leaderboard-row modal-stats-leaderboard-row--you'>
							<td>1</td>
							<td>Jane Doe (You)</td>
							<td>82</td>
						</tr>
						<tr className='modal-stats-leaderboard-row'>
							<td>2</td>
							<td>PlayerX</td>
							<td>80</td>
						</tr>
						<tr className='modal-stats-leaderboard-row'>
							<td>3</td>
							<td>PlayerY</td>
							<td>78</td>
						</tr>
					</tbody>
				</table>
				<p className='modal-stats-note'>
					(Leaderboard and stats are simulated. Backend
					integration coming soon.)
				</p>
			</div>
		);
	}
	return (
		<Modal open={open} onClose={onClose}>
			<div className='share-modal-content modal-stats-modal'>
				{content}
			</div>
		</Modal>
	);
};

export default StatisticsModal;
