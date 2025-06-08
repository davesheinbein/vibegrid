import React from 'react';
import { SubmitButton } from '../ui/Buttons';
import { Modal } from '../ui/Modal';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
				className='xwd__modal--body modal-stats-body animate-opening stats-modal-signin-body'
				tabIndex={0}
			>
				<article className='xwd__modal--content modal-stats-content stats-modal-signin-content'>
					<div className='stats-modal-lottie-container'>
						<DotLottieReact
							src='https://lottie.host/8594b998-44b5-4401-bf10-cba5b54c9716/KUen1nqUtU.lottie'
							loop
							autoplay
							className='stats-modal-signin-icon'
						/>
					</div>
					<h2 className='stats-modal-signin-title'>
						Sign in to view your stats
					</h2>
					<p className='modal-stats-message stats-modal-signin-message'>
						Sign in to see your statistics and leaderboard
						placement.
					</p>
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
				<h2>Your Grid Royale Stats</h2>
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
								Name
							</th>
							<th className='modal-stats-leaderboard-th'>
								Score
							</th>
						</tr>
					</thead>
					<tbody>
						<tr className='modal-stats-leaderboard-row'>
							<td>1</td>
							<td>Alice</td>
							<td>98</td>
						</tr>
						<tr className='modal-stats-leaderboard-row'>
							<td>2</td>
							<td>Bob</td>
							<td>91</td>
						</tr>
						<tr className='modal-stats-leaderboard-row modal-stats-leaderboard-row--you'>
							<td>3</td>
							<td>{user.name || 'You'}</td>
							<td>82</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
	return (
		<Modal open={open} onClose={onClose}>
			<div className='modal-stats-modal'>{content}</div>
		</Modal>
	);
};

export default StatisticsModal;
