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
	const mockStats = {
		completed: 58,
		winPercentage: 78,
		currentStreak: 0,
		maxStreak: 5,
		perfectPuzzles: 20,
		purpleFirst: 6,
		mistakeDistribution: [20, 11, 3, 11, 13], // 0-4 mistakes
	};
	const histogramMax = Math.max(
		...mockStats.mistakeDistribution
	);

	if (!open) return null;
	let content;
	if (!user) {
		content = (
			<div
				className='xwd__modal--body modal-stats-body animate-opening stats-modal-signin-body'
				tabIndex={0}
				style={{ textAlign: 'center', padding: 32 }}
			>
				<h2 className='modal-system-header'>Statistics</h2>
				<p style={{ color: '#64748b', fontWeight: 500 }}>
					Sign in to see your stats!
				</p>
			</div>
		);
	} else if (!dailyCompleted) {
		content = (
			<div
				className='xwd__modal--body modal-stats-body animate-opening stats-modal-incomplete-body'
				tabIndex={0}
				style={{ textAlign: 'center', padding: 32 }}
			>
				<h2 className='modal-system-header'>Statistics</h2>
				<p style={{ color: '#64748b', fontWeight: 500 }}>
					Complete a daily puzzle to see your stats!
				</p>
			</div>
		);
	} else {
		content = (
			<article className='xwd__modal--content'>
				<div className='Stats-module_stats_container__ZcJgI'>
					<h2
						data-testid='conn-modal__title'
						className='modal-system-header'
					>
						Statistics
					</h2>
					<div className='connections-lifetime-stats Stats-module_stats__Oq7rS'>
						<div
							className='Stat-module_stats__row__xnktL'
							data-testid='stats__row'
						>
							<div
								data-testid='stat-completed'
								id='stat__completed'
								className='Stat-module_stat__xk7C1'
							>
								<div>{mockStats.completed}</div>
								<div className='Stat-module_stat__label__Q5EYk'>
									Completed
								</div>
							</div>
							<div
								data-testid='stat-win_percentage'
								id='stat__win_percentage'
								className='Stat-module_stat__xk7C1'
							>
								<div>{mockStats.winPercentage}</div>
								<div className='Stat-module_stat__label__Q5EYk'>
									Win %
								</div>
							</div>
							<div
								data-testid='stat-current_streak'
								id='stat__current_streak'
								className='Stat-module_stat__xk7C1'
							>
								<div>{mockStats.currentStreak}</div>
								<div className='Stat-module_stat__label__Q5EYk'>
									Current Streak
								</div>
							</div>
							<div
								data-testid='stat-max_streak'
								id='stat__max_streak'
								className='Stat-module_stat__xk7C1'
							>
								<div>{mockStats.maxStreak}</div>
								<div className='Stat-module_stat__label__Q5EYk'>
									Max Streak
								</div>
							</div>
						</div>
						<div
							className='Stat-module_stats__row__xnktL'
							data-testid='stats__row'
						>
							<div
								data-testid='stat-perfect_puzzles'
								id='stat__perfect_puzzles'
								className='Stat-module_stat__xk7C1'
							>
								<div>{mockStats.perfectPuzzles}</div>
								<div className='Stat-module_stat__label__Q5EYk'>
									Perfect Puzzles
								</div>
							</div>
							<div
								data-testid='stat-purple_first_puzzles'
								id='stat__purple_first_puzzles'
								className='Stat-module_stat__xk7C1'
							>
								<div>{mockStats.purpleFirst}</div>
								<div className='Stat-module_stat__label__Q5EYk'>
									Purple First
								</div>
							</div>
						</div>
					</div>
					<div className='Stats-module_mistakes__dA1vb'>
						<h3>MISTAKE DISTRIBUTION</h3>
						<div className='Stats-module_histogram_container__grXlP'>
							{mockStats.mistakeDistribution.map(
								(val, i) => (
									<div
										className='Stats-module_histogram_row__jE8b_'
										data-testid='stats__histogram_row'
										key={i}
									>
										<p>{i}</p>
										<div
											className='Stats-module_histogram_bar___Mxj8'
											data-testid='stats__histogram_bar'
											style={{
												width: `${Math.round(
													(val / histogramMax) * 100
												)}%`,
											}}
										>
											{val}
										</div>
									</div>
								)
							)}
						</div>
					</div>
					<a
						href='https://help.nytimes.com/hc/en-us/articles/28525912587924-Connections'
						className='Stats-module_faq__hcRQo'
						target='_blank'
						rel='noreferrer'
					>
						Having questions about stats? Visit our Help
						Center
						<div className='Stats-module_inline_carrot__icon__G2cbk dark_inline_carrot__icon'></div>
					</a>
				</div>
			</article>
		);
	}
	return (
		<Modal open={open} onClose={onClose}>
			{content}
		</Modal>
	);
};

export default StatisticsModal;
