import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {
	PrimaryButton,
	GoBackButton,
} from '../components/ui-kit/buttons';
import { addNotification } from '../store/notificationsSlice';
import { ACHIEVEMENTS } from '../data/achievementsConfig';

const AchievementsPage: React.FC = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const [unlocked, setUnlocked] = useState<Set<string>>(
		new Set()
	);
	const [unlockDates, setUnlockDates] = useState<
		Record<string, string>
	>({});
	const [loading, setLoading] = useState(true);
	const [category, setCategory] = useState<string>('All');
	const [resetting, setResetting] = useState(false);

	// Only fetch user's unlocked achievements
	useEffect(() => {
		async function fetchUnlocked() {
			try {
				const mine = await fetch(
					'/api/users/me/achievements'
				).then((r) => r.json());
				setUnlocked(new Set(mine.map((a: any) => a.label)));
				const dates: Record<string, string> = {};
				mine.forEach((a: any) => {
					if (a.label && a.unlockedAt)
						dates[a.label] = a.unlockedAt;
				});
				setUnlockDates(dates);
			} catch (e) {
				setUnlocked(new Set());
				setUnlockDates({});
			}
			setLoading(false);
		}
		fetchUnlocked();
	}, []);

	const categories = React.useMemo(() => {
		const cats = new Set<string>();
		ACHIEVEMENTS.forEach(
			(a) => a.category && cats.add(a.category)
		);
		return ['All', ...Array.from(cats)];
	}, []);

	const filteredAchievements =
		category === 'All'
			? ACHIEVEMENTS
			: ACHIEVEMENTS.filter((a) => a.category === category);

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
		// Re-fetch unlocked achievements after reset
		try {
			const mine = await fetch(
				'/api/users/me/achievements'
			).then((r) => r.json());
			setUnlocked(new Set(mine.map((a: any) => a.label)));
			const dates: Record<string, string> = {};
			mine.forEach((a: any) => {
				if (a.label && a.unlockedAt)
					dates[a.label] = a.unlockedAt;
			});
			setUnlockDates(dates);
		} catch (e) {
			setUnlocked(new Set());
			setUnlockDates({});
		}
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
				position: 'relative',
			}}
		>
			<GoBackButton
				onClick={() => router.push('/')}
				style={{
					position: 'absolute',
					top: 16,
					left: 16,
					right: 'auto',
					zIndex: 20,
				}}
			/>
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
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginBottom: 24,
				}}
			>
				<label
					style={{
						fontWeight: 600,
						marginRight: 8,
					}}
				>
					Category:
				</label>
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					style={{
						padding: '6px 12px',
						borderRadius: 6,
						border: '1px solid #e0e7ef',
						fontWeight: 500,
					}}
				>
					{categories.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
			</div>
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
					{filteredAchievements.map((ach) => {
						const isUnlocked = unlocked.has(ach.label);
						const isSecret = ach.secret && !isUnlocked;
						return (
							<div
								key={ach.label}
								style={{
									background: isUnlocked
										? '#fbbf24'
										: '#f1f5f9',
									color: isUnlocked ? '#1e293b' : '#64748b',
									borderRadius: 10,
									padding: 18,
									boxShadow: isUnlocked
										? '0 2px 12px 0 #fbbf2440'
										: '0 1px 4px 0 #e0e7ef',
									opacity: isUnlocked ? 1 : 0.7,
									border: isUnlocked
										? '2px solid #fde047'
										: '1.5px solid #e0e7ef',
									display: 'flex',
									alignItems: 'center',
									gap: 18,
									filter: isUnlocked
										? undefined
										: 'blur(0.5px) grayscale(0.7)',
								}}
							>
								<span
									style={{ fontSize: 28, minWidth: 36 }}
								>
									{isSecret ? (
										'❓'
									) : ach.icon ? (
										<img
											src={ach.icon}
											alt=''
											style={{ width: 32, height: 32 }}
										/>
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
										{isSecret ? '???' : ach.label}
									</div>
									<div style={{ fontSize: 14 }}>
										{isSecret
											? 'Unlock to reveal this secret achievement.'
											: ach.description}
									</div>
									{isUnlocked && (
										<div
											style={{
												fontSize: 12,
												color: '#16a34a',
												marginTop: 2,
											}}
										>
											Unlocked
											{unlockDates[ach.label]
												? ` on ${new Date(
														unlockDates[ach.label]
												  ).toLocaleDateString()}`
												: ''}
											!
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default AchievementsPage;
