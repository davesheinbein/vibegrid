// Modal for statistics and leaderboard (moved from App.tsx)
import React from 'react';

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
				<div
					role='button'
					aria-label='close'
					className='xwd__modal--close'
					tabIndex={0}
					onClick={onClose}
					data-testid='modal-close'
					style={{
						position: 'absolute',
						top: 12,
						right: 12,
						cursor: 'pointer',
					}}
				>
					<i
						className='pz-icon pz-icon-close'
						style={{ fontSize: 22 }}
					>
						&times;
					</i>
				</div>
				<article
					className='xwd__modal--content'
					style={{
						textAlign: 'center',
						padding: '1.5rem 0.5rem',
					}}
				>
					<h2
						className='modal-system-header'
						style={{ fontSize: '1.5rem', marginBottom: 16 }}
					>
						Statistics
					</h2>
					<div
						className='Stats-module_regiwall_abstract_stats__BkBe5 dark_regiwall_abstract_stats'
						style={{ minHeight: 40 }}
					></div>
					<div
						className='Stats-module_regiwall_message__pbJmt'
						data-testid='regiwall_message'
						style={{ margin: '1.2rem 0' }}
					>
						<h3
							style={{
								fontSize: '1.15rem',
								marginBottom: 8,
							}}
						>
							Track your Connections stats.
						</h3>
						<p
							style={{
								color: '#64748b',
								fontSize: 15,
								marginBottom: 18,
							}}
						>
							Register to follow your streaks, total
							completed puzzles, win rate and more.
						</p>
						<button
							type='button'
							className='button-primary conn-anon-login button-dark-mode-support vibegrid-submit'
							style={{
								fontSize: 17,
								padding: '0.7em 2.2em',
								fontWeight: 600,
							}}
							onClick={() =>
								setUser({
									name: 'Jane Doe',
									email: 'jane@example.com',
								})
							}
						>
							Create a free account
						</button>
					</div>
				</article>
			</div>
		);
	} else if (!dailyCompleted) {
		content = (
			<div style={{ textAlign: 'center' }}>
				<h2>Complete the Daily Mission</h2>
				<p style={{ color: '#64748b', fontSize: 16 }}>
					You must finish today's daily puzzle to view your
					statistics and leaderboard placement.
				</p>
				<button
					className='vibegrid-submit'
					onClick={onClose}
					style={{ marginTop: 16 }}
				>
					OK
				</button>
			</div>
		);
	} else {
		content = (
			<div style={{ textAlign: 'center', minWidth: 280 }}>
				<h2>Your VibeGrid Stats</h2>
				<div
					style={{
						margin: '1.2rem 0',
						fontSize: 17,
						color: '#2563eb',
						fontWeight: 600,
					}}
				>
					Games Played: 12
					<br />
					Win Rate: 75%
					<br />
					Avg. Score: 82
					<br />
					Best Streak: 5
				</div>
				<h3
					style={{
						color: '#0ea5e9',
						margin: '1.2rem 0 0.5rem 0',
					}}
				>
					Leaderboard
				</h3>
				<table
					style={{
						margin: '0 auto 1.2rem auto',
						fontSize: 15,
						borderCollapse: 'collapse',
					}}
				>
					<thead>
						<tr style={{ color: '#64748b' }}>
							<th style={{ padding: 4 }}>Rank</th>
							<th style={{ padding: 4 }}>User</th>
							<th style={{ padding: 4 }}>Score</th>
						</tr>
					</thead>
					<tbody>
						<tr
							style={{
								fontWeight: 700,
								background: '#e0f2fe',
							}}
						>
							<td>1</td>
							<td>Jane Doe (You)</td>
							<td>82</td>
						</tr>
						<tr>
							<td>2</td>
							<td>PlayerX</td>
							<td>80</td>
						</tr>
						<tr>
							<td>3</td>
							<td>PlayerY</td>
							<td>78</td>
						</tr>
					</tbody>
				</table>
				<p style={{ color: '#64748b', fontSize: 14 }}>
					(Leaderboard and stats are simulated. Backend
					integration coming soon.)
				</p>
			</div>
		);
	}
	return (
		<div
			className='share-modal'
			onClick={(e) =>
				e.target === e.currentTarget && onClose()
			}
		>
			<div
				className='share-modal-content'
				style={{ maxWidth: 420, position: 'relative' }}
			>
				{content}
				<button
					className='share-modal-close'
					onClick={onClose}
					style={{ marginTop: 16 }}
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default StatisticsModal;
