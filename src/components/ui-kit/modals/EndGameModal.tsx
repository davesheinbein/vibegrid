import React from 'react';
import { useRouter } from 'next/router';
import { Modal } from '../modals';
import { CloseButton, CopyLinkButton } from '../buttons';
import CountUp from 'react-countup';
import { format, parseISO } from 'date-fns';
import Graphs from '../graphs/Graphs';
import StatisticsSummary from '../Statistics/StatisticsSummary';

interface EndGameModalProps {
	message: string;
	score: number;
	attemptsLeft: number;
	burnBonus: number;
	win: boolean;
	onShare: () => void;
	finishTime?: string;
}

const EndGameModal: React.FC<EndGameModalProps> = ({
	message,
	score,
	attemptsLeft,
	burnBonus,
	win,
	onShare,
	finishTime,
}) => {
	const router = useRouter();

	// --- Mock user profile stats ---
	const mockStats = {
		total_matches_played: 42,
		vs_bot_matches_played: 18,
		vs_multiplayer_matches_played: 12,
		win_count: 25,
		loss_count: 17,
		perfect_puzzles: 7,
		longest_streak: 5,
		current_streak: 2,
		average_solve_time: 92, // seconds
		mistake_rate: 0.18,
		favorite_category: 'Music',
		last_played_at: '2025-06-10',
		join_date: '2024-12-01',
	};
	// --- Mock per-match session data ---
	const mockMatch = {
		match_id: 'b7e2c1d2-1234-4a5b-8c9d-abcdef123456',
		participants: ['user_1', 'user_2'],
		match_type: 'VS Bot',
		puzzle_id: 'puzzle_123',
		start_time: '2025-06-11T13:00:00Z',
		end_time: '2025-06-11T13:08:32Z',
		winner_id: 'user_1',
		player_stats: [
			{
				user_id: 'user_1',
				solve_time: 92,
				mistakes: 1,
				groups_found: 4,
				streak: 2,
			},
			{
				user_id: 'user_2',
				solve_time: 110,
				mistakes: 3,
				groups_found: 3,
				streak: 1,
			},
		],
		emotes_used: 3,
		taunts_triggered: 1,
		final_score: 100,
		match_result: 'win',
	};
	const mockScoreHistory = [
		{ match: 'M1', score: 80 },
		{ match: 'M2', score: 90 },
		{ match: 'M3', score: 70 },
		{ match: 'M4', score: 100 },
		{ match: 'M5', score: 95 },
		{ match: 'M6', score: 85 },
		{ match: 'M7', score: 88 },
		{ match: 'M8', score: 92 },
		{ match: 'M9', score: 76 },
		{ match: 'M10', score: 99 },
	];

	return (
		<Modal
			open={true}
			onClose={() => router.push('/')}
			contentClassName='endgame-modal'
		>
			<div className='modal-content endgame-modal-content'>
				<CloseButton onClick={() => router.push('/')} />
				<h2>{win ? 'Congratulations!' : 'Game Over'}</h2>
				<p>{message}</p>
				<div className='endgame-modal-score'>
					Score:{' '}
					<b>
						<CountUp end={score} duration={1.2} />
					</b>
				</div>
				<div className='endgame-modal-attempts'>
					Attempts Left:{' '}
					<b>
						<CountUp end={attemptsLeft} duration={0.8} />
					</b>
				</div>
				<div className='endgame-modal-burn-bonus'>
					Burn Bonus:{' '}
					<b>
						<CountUp end={burnBonus} duration={0.8} />
					</b>
				</div>
				{finishTime && (
					<div className='endgame-modal-finish-time'>
						Time: {finishTime}
					</div>
				)}

				{/* --- Statistics Summary --- */}
				<StatisticsSummary stats={mockStats} />

				{/* --- Recent Scores Graph --- */}
				<Graphs
					data={mockScoreHistory}
					shape='horizontalBar'
					dataKey='score'
					labelKey='match'
					title='Recent Scores'
					height={140}
				/>

				{/* --- Per-Match Session Data (Admin Only) --- */}
				{process.env.NEXT_PUBLIC_ADMIN === 'true' && (
					<div
						className='endgame-modal-match-session'
						style={{
							margin: '1.2em 0 0.5em 0',
							padding: '1em',
							background: '#f1f5f9',
							borderRadius: 12,
						}}
					>
						<h3
							style={{
								margin: '0 0 0.7em 0',
								fontSize: '1.08em',
								color: '#0ea5e9',
							}}
						>
							Match Session
						</h3>
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: 18,
							}}
						>
							<div>
								<b>Match ID:</b> {mockMatch.match_id}
							</div>
							<div>
								<b>Type:</b> {mockMatch.match_type}
							</div>
							<div>
								<b>Puzzle ID:</b> {mockMatch.puzzle_id}
							</div>
							<div>
								<b>Start:</b>{' '}
								{format(
									new Date(mockMatch.start_time),
									'p, MMM d'
								)}
							</div>
							<div>
								<b>End:</b>{' '}
								{format(
									new Date(mockMatch.end_time),
									'p, MMM d'
								)}
							</div>
							<div>
								<b>Winner:</b> {mockMatch.winner_id}
							</div>
							<div>
								<b>Final Score:</b>{' '}
								<CountUp
									end={mockMatch.final_score}
									duration={1.2}
								/>
							</div>
							<div>
								<b>Result:</b> {mockMatch.match_result}
							</div>
							<div>
								<b>Emotes Used:</b>{' '}
								<CountUp
									end={mockMatch.emotes_used}
									duration={0.8}
								/>
							</div>
							<div>
								<b>Taunts:</b>{' '}
								<CountUp
									end={mockMatch.taunts_triggered}
									duration={0.8}
								/>
							</div>
						</div>
						<div style={{ marginTop: 10 }}>
							<b>Participants:</b>{' '}
							{mockMatch.participants.join(', ')}
						</div>
						<div style={{ marginTop: 10 }}>
							<b>Player Stats:</b>
							<ul style={{ margin: 0, paddingLeft: 18 }}>
								{mockMatch.player_stats.map((ps) => (
									<li key={ps.user_id}>
										{ps.user_id}: {ps.groups_found} groups,{' '}
										{ps.mistakes} mistakes, {ps.solve_time}
										s, streak {ps.streak}
									</li>
								))}
							</ul>
						</div>
					</div>
				)}

				<div className='endgame-modal-actions'>
					<CopyLinkButton />
				</div>
			</div>
		</Modal>
	);
};

export default EndGameModal;
