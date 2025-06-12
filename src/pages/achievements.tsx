import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PrimaryButton } from '../components/ui-kit/buttons';
import {
	fetchAchievements,
	resetAchievements,
} from '../services/achievementsService';
import GoBackButton from '../components/ui-kit/buttons/GoBackButton';
import { useSession, signIn } from 'next-auth/react';
import SignInModal from '../components/ui-kit/modals/SignInModal';

interface Achievement {
	id: string;
	label: string;
	description: string;
	icon?: string;
	unlockedAt?: string;
	unlocked?: boolean;
}

const AchievementsPage: React.FC = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const [achievements, setAchievements] = useState<
		Achievement[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [resetting, setResetting] = useState(false);
	const [justUnlocked, setJustUnlocked] = useState<
		string | null
	>(null);

	useEffect(() => {
		async function loadAchievements() {
			setLoading(true);
			const mine = await fetchAchievements();
			setAchievements(mine);
			setLoading(false);
		}
		loadAchievements();
	}, [resetting]);

	const handleReset = async () => {
		if (
			!window.confirm(
				'Are you sure you want to reset all your achievements? This cannot be undone.'
			)
		)
			return;
		setResetting(true);
		await resetAchievements();
		setJustUnlocked(null);
		setResetting(false);
	};

	if (!session) {
		return (
			<SignInModal
				open={true}
				onClose={() => {}}
				onSignIn={() => signIn()}
			/>
		);
	}

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
			<GoBackButton
				className='back-icon-btn'
				onClick={() => router.push('/')}
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
						overflowY: 'scroll',
					}}
				>
					{achievements.map((ach) => (
						<div
							key={ach.id}
							style={{
								background: ach.unlocked
									? '#fbbf24'
									: '#f1f5f9',
								color: ach.unlocked ? '#1e293b' : '#64748b',
								borderRadius: 10,
								padding: 18,
								boxShadow: ach.unlocked
									? '0 2px 12px 0 #fbbf2440'
									: '0 1px 4px 0 #e0e7ef',
								opacity: ach.unlocked ? 1 : 0.7,
								border: ach.unlocked
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
									style={{ fontWeight: 700, fontSize: 18 }}
								>
									{ach.label}
								</div>
								<div style={{ fontSize: 14 }}>
									{ach.description}
								</div>
								{ach.unlocked && (
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
