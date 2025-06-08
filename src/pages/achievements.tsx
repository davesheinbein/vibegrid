import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SubmitButton } from '../components/ui/Buttons';
import {
	useMultiplayer,
	notifyAchievement,
} from '../components/ui/MultiplayerProvider';

interface Achievement {
	id: string;
	label: string;
	description: string;
	icon?: string;
	unlockedAt?: string;
}

const AchievementsPage: React.FC = () => {
	const router = useRouter();
	const { addNotification, socket } = useMultiplayer();
	const [userAchievements, setUserAchievements] = useState<
		Record<string, boolean>
	>({});
	const [justUnlocked, setJustUnlocked] = useState<
		string | null
	>(null);
	const [achievements, setAchievements] = useState<
		Achievement[]
	>([]);
	const [unlocked, setUnlocked] = useState<Set<string>>(
		new Set()
	);
	const [loading, setLoading] = useState(true);
	const [resetting, setResetting] = useState(false);

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

	useEffect(() => {
		async function fetchAchievements() {
			setLoading(true);
			const all = await fetch('/api/achievements').then(
				(r) => r.json()
			);
			const mine = await fetch(
				'/api/users/me/achievements'
			).then((r) => r.json());
			setAchievements(all);
			setUnlocked(new Set(mine.map((a: any) => a.label)));
			setLoading(false);
		}
		fetchAchievements();
	}, [resetting]);

	const handleReset = async () => {
		if (
			!window.confirm(
				'Are you sure you want to reset all your achievements? This cannot be undone.'
			)
		)
			return;
		setResetting(true);
		await fetch('/api/users/me/achievements', {
			method: 'DELETE',
		});
		setResetting(false);
	};

	return (
		<div
			className='gridRoyale-container'
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
				with the Grid Royale community!
			</p>
			<button
				onClick={handleReset}
				disabled={resetting}
				style={{
					display: 'block',
					margin: '0 auto 24px',
					background: '#fbbf24',
					color: '#1e293b',
					border: 'none',
					borderRadius: 6,
					padding: '8px 18px',
					fontWeight: 600,
					cursor: 'pointer',
				}}
			>
				{resetting
					? 'Resetting...'
					: 'Reset My Achievements'}
			</button>
			{loading ? (
				<div
					style={{ textAlign: 'center', color: '#64748b' }}
				>
					Loading achievements...
				</div>
			) : (
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr',
						gap: 18,
					}}
				>
					{achievements.map((ach) => (
						<div
							key={ach.label}
							style={{
								background: unlocked.has(ach.label)
									? '#fbbf24'
									: '#f1f5f9',
								color: unlocked.has(ach.label)
									? '#1e293b'
									: '#64748b',
								borderRadius: 10,
								padding: 18,
								boxShadow: unlocked.has(ach.label)
									? '0 2px 12px 0 #fbbf2440'
									: '0 1px 4px 0 #e0e7ef',
								opacity: unlocked.has(ach.label) ? 1 : 0.7,
								border: unlocked.has(ach.label)
									? '2px solid #fde047'
									: '1.5px solid #e0e7ef',
								display: 'flex',
								alignItems: 'center',
								gap: 18,
							}}
						>
							<span style={{ fontSize: 28, minWidth: 36 }}>
								{ach.icon ? (
									<i className={`fa fa-${ach.icon}`}></i>
								) : (
									'🏆'
								)}
							</span>
							<div>
								<div
									style={{
										fontWeight: 700,
										fontSize: 18,
									}}
								>
									{ach.label}
								</div>
								<div style={{ fontSize: 14 }}>
									{ach.description}
								</div>
								{unlocked.has(ach.label) && (
									<div
										style={{
											fontSize: 12,
											color: '#16a34a',
											marginTop: 2,
										}}
									>
										Unlocked!
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
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
