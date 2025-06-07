import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SubmitButton } from '../components/ui/Buttons';
import {
	useMultiplayer,
	notifyAchievement,
} from '../components/ui/MultiplayerProvider';

// Example achievements data (replace with real data from backend/user context)
const ACHIEVEMENTS = [
	{
		id: 'first_win',
		label: 'First Win',
		desc: 'Win your first puzzle!',
		icon: '🏆',
	},
	{
		id: 'streak_7',
		label: '7-Day Streak',
		desc: 'Complete a daily puzzle 7 days in a row.',
		icon: '🔥',
	},
	{
		id: 'streak_30',
		label: '30-Day Streak',
		desc: 'Complete a daily puzzle 30 days in a row.',
		icon: '🌟',
	},
	{
		id: 'vs_win',
		label: 'VS Victor',
		desc: 'Win a VS multiplayer match.',
		icon: '⚔️',
	},
	{
		id: 'community_creator',
		label: 'Community Creator',
		desc: 'Publish your first custom puzzle.',
		icon: '🧩',
	},
	{
		id: 'friend_5',
		label: 'Social Butterfly',
		desc: 'Add 5 friends.',
		icon: '👥',
	},
	{
		id: 'all_groups',
		label: 'Grid Master',
		desc: 'Solve all groups in a puzzle without mistakes.',
		icon: '💡',
	},
	// Add more as needed
];

// Dummy user progress (replace with real user data)
const initialUserAchievements: Record<string, boolean> = {
	first_win: true,
	streak_7: false,
	streak_30: false,
	vs_win: true,
	community_creator: false,
	friend_5: true,
	all_groups: false,
};

const AchievementsPage: React.FC = () => {
	const router = useRouter();
	const { addNotification, socket } = useMultiplayer();
	// TODO: Replace with real user achievements from context/provider or backend
	// Example: const userAchievements = useUser()?.achievements || initialUserAchievements;
	const [userAchievements, setUserAchievements] = useState<
		Record<string, boolean>
	>(initialUserAchievements);
	const [justUnlocked, setJustUnlocked] = useState<
		string | null
	>(null);

	// Listen for real-time achievement unlocks
	useEffect(() => {
		if (!socket) return;
		const handler = (data: {
			achievement: { label: string; id: string };
		}) => {
			setUserAchievements((prev) => ({
				...prev,
				[data.achievement.id]: true,
			}));
			setJustUnlocked(data.achievement.label);
			notifyAchievement(
				data.achievement.label,
				addNotification
			);
			setTimeout(() => setJustUnlocked(null), 3200);
		};
		socket.on('achievement:unlocked', handler);
		return () => {
			socket.off('achievement:unlocked', handler);
		};
	}, [socket, addNotification]);

	// Simulate earning an achievement (for demo/testing)
	const handleEarn = (id: string, label: string) => {
		if (!userAchievements[id]) {
			setUserAchievements((prev) => ({
				...prev,
				[id]: true,
			}));
			setJustUnlocked(label);
			notifyAchievement(label, addNotification);
			setTimeout(() => setJustUnlocked(null), 3200);
		}
	};

	return (
		<div
			className='vibegrid-container'
			style={{
				minHeight: '100vh',
				padding: 24,
				maxWidth: 600,
				margin: '0 auto',
			}}
		>
			<h1
				style={{
					fontSize: '2rem',
					fontWeight: 700,
					marginBottom: 18,
					textAlign: 'center',
					color: '#2563eb',
				}}
			>
				Achievements
			</h1>
			<p
				style={{
					textAlign: 'center',
					color: '#64748b',
					marginBottom: 32,
				}}
			>
				Unlock milestones as you play, solve, and connect
				with the VibeGrid community!
			</p>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 18,
				}}
			>
				{ACHIEVEMENTS.map((ach) => (
					<div
						key={ach.id}
						className='achievement-card'
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 18,
							background: userAchievements[ach.id]
								? 'rgba(34,197,94,0.12)'
								: 'rgba(203,213,225,0.18)',
							border: userAchievements[ach.id]
								? '2px solid #22c55e'
								: '2px solid #e5e7eb',
							borderRadius: 14,
							padding: '16px 18px',
							boxShadow: '0 2px 8px 0 #e3eaff33',
							opacity: userAchievements[ach.id] ? 1 : 0.6,
							transition: 'background 0.18s, border 0.18s',
							cursor: userAchievements[ach.id]
								? 'default'
								: 'pointer',
						}}
						onClick={() => handleEarn(ach.id, ach.label)}
						title={
							userAchievements[ach.id]
								? 'Unlocked'
								: 'Click to unlock (demo)'
						}
					>
						<span
							style={{
								fontSize: 32,
								width: 40,
								textAlign: 'center',
							}}
						>
							{ach.icon}
						</span>
						<div style={{ flex: 1 }}>
							<div
								style={{
									fontWeight: 600,
									fontSize: '1.13rem',
									color: userAchievements[ach.id]
										? '#22c55e'
										: '#64748b',
								}}
							>
								{ach.label}
							</div>
							<div
								style={{
									fontSize: '1rem',
									color: '#64748b',
									marginTop: 2,
								}}
							>
								{ach.desc}
							</div>
						</div>
						{userAchievements[ach.id] && (
							<span
								style={{
									color: '#22c55e',
									fontWeight: 700,
									fontSize: 18,
								}}
							>
								✓
							</span>
						)}
					</div>
				))}
			</div>
			<div style={{ marginTop: 36, textAlign: 'center' }}>
				<SubmitButton onClick={() => router.push('/')}>
					Back to Home
				</SubmitButton>
			</div>
			{justUnlocked && (
				<div
					className='notification-toast'
					style={{
						position: 'fixed',
						right: 32,
						bottom: 32,
						zIndex: 9999,
					}}
				>
					<span style={{ fontSize: 22, marginRight: 10 }}>
						🎉
					</span>
					Achievement unlocked: <b>{justUnlocked}</b>
				</div>
			)}
		</div>
	);
};

export default AchievementsPage;
