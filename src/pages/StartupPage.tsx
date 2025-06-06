// Directory for page-level components and layout logic
// Example stub for StartupPage (to be filled in during refactor)

import React from 'react';

interface StartupPageProps {
	onStartDaily: () => void;
	onStartCustom: () => void;
	onBrowseCustom: () => void;
	onShare: () => void;
}

const StartupPage: React.FC<StartupPageProps> = ({
	onStartDaily,
	onStartCustom,
	onBrowseCustom,
	onShare,
}) => {
	return (
		<div
			className='startup-page vibegrid-container'
			style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background:
					'linear-gradient(120deg,#f0f9ff 0%,#e0e7ff 100%)',
			}}
		>
			<img
				src='https://i.imgur.com/1jPtNmW.png'
				alt='VibeGrid logo'
				style={{ width: 360 }}
			/>
			<h1
				className='vibegrid-title'
				style={{
					fontSize: 44,
					margin: 0,
					color: '#2563eb',
					letterSpacing: 1,
				}}
			>
				VibeGrid
			</h1>
			<p
				className='vibegrid-subtitle'
				style={{
					color: '#64748b',
					fontSize: 20,
					margin: '10px 0 32px 0',
				}}
			>
				A daily word grouping puzzle. Can you find the vibe?
			</p>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 20,
					alignItems: 'center',
					width: '100%',
					maxWidth: 340,
				}}
			>
				<button
					className='vibegrid-submit'
					onClick={onStartDaily}
					style={{
						width: '100%',
						fontSize: 20,
						padding: '0.8em 0',
						borderRadius: 12,
						background:
							'linear-gradient(90deg,#38bdf8 0%,#fbbf24 100%)',
						color: '#fff',
						fontWeight: 700,
						boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
					}}
				>
					Play Daily Puzzle
				</button>
				<button
					className='vibegrid-submit'
					onClick={onStartCustom}
					style={{
						width: '100%',
						fontSize: 20,
						padding: '0.8em 0',
						borderRadius: 12,
						background:
							'linear-gradient(90deg,#a7f3d0 0%,#38bdf8 100%)',
						color: '#2563eb',
						fontWeight: 700,
						boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
					}}
				>
					Create Custom Puzzle
				</button>
				<button
					className='vibegrid-submit'
					onClick={onBrowseCustom}
					style={{
						width: '100%',
						fontSize: 20,
						padding: '0.8em 0',
						borderRadius: 12,
						background:
							'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
						color: '#fff',
						fontWeight: 700,
						boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
					}}
				>
					Browse Custom Puzzles
				</button>
				<button
					className='vibegrid-submit'
					onClick={onShare}
					style={{
						width: '100%',
						fontSize: 20,
						padding: '0.8em 0',
						borderRadius: 12,
						background:
							'linear-gradient(90deg,#f472b6 0%,#38bdf8 100%)',
						color: '#fff',
						fontWeight: 700,
						boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
					}}
				>
					Share VibeGrid
				</button>
			</div>
			<p
				style={{
					color: '#94a3b8',
					fontSize: 15,
					marginTop: 40,
				}}
			>
				&copy; {new Date().getFullYear()} VibeGrid &mdash;
				Made with{' '}
				<span style={{ color: '#f87171' }}>♥</span>
			</p>
		</div>
	);
};

export default StartupPage;
