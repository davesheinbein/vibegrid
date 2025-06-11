import React from 'react';
import CountUp from 'react-countup';
import { format, parseISO } from 'date-fns';

export type StatisticsSummaryMode =
	| 'daily'
	| 'vs'
	| 'history';

export interface PlayerStats {
	total_matches_played: number;
	vs_bot_matches_played: number;
	vs_multiplayer_matches_played: number;
	win_count: number;
	loss_count: number;
	perfect_puzzles: number;
	longest_streak: number;
	current_streak: number;
	average_solve_time: number;
	mistake_rate: number;
	favorite_category: string;
	last_played_at: string;
	join_date: string;
}

interface StatisticsSummaryProps {
	stats: PlayerStats;
	mode: StatisticsSummaryMode;
	className?: string;
	style?: React.CSSProperties;
	// For VS mode
	opponentStats?: PlayerStats;
	// For daily mode
	globalStats?: {
		percentileRank?: number;
		leaderboardPosition?: number;
	};
}

const StatisticsSummary: React.FC<
	StatisticsSummaryProps
> = ({
	stats,
	mode,
	className = '',
	style,
	opponentStats,
	globalStats,
}) => {
	if (mode === 'daily') {
		return (
			<div
				className={`endgame-modal-stats-summary ${className}`.trim()}
				style={{ ...style }}
			>
				<h3
					style={{
						color: '#2563eb',
						margin: '0 0 0.7em 0',
					}}
				>
					Daily Puzzle Stats
				</h3>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 18,
					}}
				>
					<div>
						<b>Your Time:</b> {stats.average_solve_time}s
					</div>
					<div>
						<b>Mistakes:</b> {stats.mistake_rate * 100}%
					</div>
					<div>
						<b>Streak:</b> {stats.current_streak}
					</div>
					{globalStats?.percentileRank !== undefined && (
						<div>
							<b>Global Percentile:</b> Top{' '}
							{globalStats.percentileRank}%
						</div>
					)}
					{globalStats?.leaderboardPosition !==
						undefined && (
						<div>
							<b>Leaderboard:</b> #
							{globalStats.leaderboardPosition}
						</div>
					)}
				</div>
			</div>
		);
	}

	if (mode === 'vs') {
		return (
			<div
				className={`endgame-modal-stats-summary ${className}`.trim()}
				style={{ ...style }}
			>
				<h3
					style={{
						color: '#2563eb',
						margin: '0 0 0.7em 0',
					}}
				>
					VS Match Summary
				</h3>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 32,
					}}
				>
					<div>
						<h4 style={{ color: '#0ea5e9' }}>You</h4>
						<div>
							<b>Score:</b> {stats.win_count}
						</div>
						<div>
							<b>Groups Found:</b> {stats.perfect_puzzles}
						</div>
						<div>
							<b>Mistakes:</b> {stats.mistake_rate * 100}%
						</div>
						<div>
							<b>Solve Time:</b> {stats.average_solve_time}s
						</div>
						<div>
							<b>Streak:</b> {stats.current_streak}
						</div>
						{/* Add taunts/emotes if available */}
					</div>
					{opponentStats && (
						<div>
							<h4 style={{ color: '#ef4444' }}>Opponent</h4>
							<div>
								<b>Score:</b> {opponentStats.win_count}
							</div>
							<div>
								<b>Groups Found:</b>{' '}
								{opponentStats.perfect_puzzles}
							</div>
							<div>
								<b>Mistakes:</b>{' '}
								{opponentStats.mistake_rate * 100}%
							</div>
							<div>
								<b>Solve Time:</b>{' '}
								{opponentStats.average_solve_time}s
							</div>
							<div>
								<b>Streak:</b>{' '}
								{opponentStats.current_streak}
							</div>
							{/* Add taunts/emotes if available */}
						</div>
					)}
				</div>
			</div>
		);
	}

	// Full history mode
	return (
		<div
			className={`endgame-modal-stats-summary ${className}`.trim()}
			style={{ ...style }}
		>
			<h3
				style={{ color: '#2563eb', margin: '0 0 0.7em 0' }}
			>
				Lifetime Stats
			</h3>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: 18,
				}}
			>
				<div>
					<b>Matches Played:</b>{' '}
					{stats.total_matches_played}
				</div>
				<div>
					<b>VS Bot:</b> {stats.vs_bot_matches_played}
				</div>
				<div>
					<b>VS Multiplayer:</b>{' '}
					{stats.vs_multiplayer_matches_played}
				</div>
				<div>
					<b>Wins:</b> {stats.win_count}
				</div>
				<div>
					<b>Losses:</b> {stats.loss_count}
				</div>
				<div>
					<b>Perfect Puzzles:</b> {stats.perfect_puzzles}
				</div>
				<div>
					<b>Longest Streak:</b> {stats.longest_streak}
				</div>
				<div>
					<b>Current Streak:</b> {stats.current_streak}
				</div>
				<div>
					<b>Avg. Solve Time:</b> {stats.average_solve_time}
					s
				</div>
				<div>
					<b>Mistake Rate:</b> {stats.mistake_rate * 100}%
				</div>
				<div>
					<b>Favorite Category:</b>{' '}
					{stats.favorite_category}
				</div>
				<div>
					<b>Last Played:</b>{' '}
					{format(
						parseISO(stats.last_played_at),
						'MMM d, yyyy'
					)}
				</div>
				<div>
					<b>Joined:</b>{' '}
					{format(parseISO(stats.join_date), 'MMM d, yyyy')}
				</div>
				{/* Placeholders for additional stats */}
				<div>
					<b>Achievements Unlocked:</b> {/* TODO */}
				</div>
				<div>
					<b>Games by Mode:</b> {/* TODO */}
				</div>
				<div>
					<b>Time-of-Day Activity:</b> {/* TODO */}
				</div>
				<div>
					<b>Streaks Broken:</b> {/* TODO */}
				</div>
			</div>
		</div>
	);
};

export default StatisticsSummary;
