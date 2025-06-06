import React from 'react';
import { useRouter } from 'next/router';
import CustomPuzzleModal from '../src/components/CustomPuzzleModal';

export default function Browse() {
	const router = useRouter();
	const [customPuzzle, setCustomPuzzle] = React.useState<any>(null);
	const [customState, setCustomState] = React.useState<any>(null);
	const [user, setUser] = React.useState<{
		name: string;
		email: string;
		photoUrl?: string;
	} | null>(null);
	const [mode, setMode] = React.useState<'browse' | 'custom'>('browse');
	const [tab, setTab] = React.useState<'community' | 'mine'>('community');
	const [loading, setLoading] = React.useState(false);
	const [tabPuzzles, setTabPuzzles] = React.useState<any[]>([]);

	React.useEffect(() => {
		async function fetchPuzzles() {
			setLoading(true);
			try {
				let url = '';
				if (tab === 'mine' && user) {
					url = `/api/custom-puzzles?creatorId=${encodeURIComponent(user.email)}`;
				} else {
					url = '/api/custom-puzzles/public';
				}
				const res = await fetch(url);
				if (!res.ok) throw new Error('Failed to fetch puzzles');
				const data = await res.json();
				setTabPuzzles(data);
			} catch {
				setTabPuzzles([]);
			}
			setLoading(false);
		}
		fetchPuzzles();
	}, [tab, user]);

	const handleSetMode = (newMode: 'browse' | 'custom' | 'startup' | 'daily') => {
		if (newMode === 'browse' || newMode === 'custom') {
			setMode(newMode);
		}
	};

	if (mode === 'custom' && customPuzzle) {
		return (
			<CustomPuzzleModal
				open={true}
				onClose={() => setMode('browse')}
				setCustomPuzzle={setCustomPuzzle}
				setMode={handleSetMode}
				user={user}
				setShowSignInModal={() => {}}
			/>
		);
	}

	return (
		<div
			className='vibegrid-container'
			style={{ minHeight: '100vh', padding: 24, position: 'relative' }}
		>
			<button
				className='back-icon-btn'
				onClick={() => router.push('/')}
				aria-label='Back'
				style={{ marginRight: 16 }}
			>
				<span style={{ fontSize: '1.3em', lineHeight: 1, color: '#fff' }} aria-hidden='true'>
					&#8592;
				</span>
			</button>

			<div className='browse-puzzles-header'>
				<h1 className='vibegrid-title'>Browse Custom Puzzles</h1>
				<div className='browse-puzzles-tabs'>
					<button
						onClick={() => setTab('community')}
						className={tab === 'community' ? 'active' : ''}
					>
						Community Puzzles
					</button>
					<button
						onClick={() => setTab('mine')}
						className={tab === 'mine' ? 'active' : ''}
					>
						My Puzzles
					</button>
				</div>
			</div>

			<div className='browse-puzzles-list'>
				{loading ? (
					<div>Loading...</div>
				) : tabPuzzles.length === 0 ? (
					<div style={{ marginTop: 32 }}>
						No custom puzzles found.
					</div>
				) : (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 16,
						}}
					>
						{tabPuzzles.map((puzzle) => (
							<div
								key={puzzle._id}
								style={{
									border: '1px solid #e5e7eb',
									borderRadius: 8,
									padding: 16,
									background: '#fff',
									color: '#222',
								}}
							>
								<div style={{ fontWeight: 600, fontSize: 18 }}>
									{puzzle.title || 'Untitled Puzzle'}
								</div>
								<div style={{ fontSize: 14, margin: '4px 0 8px 0' }}>
									{puzzle.theme && (
										<span>Theme: {puzzle.theme} | </span>
									)}
									Words: {puzzle.words?.length || 0} |
									Wildcards: {puzzle.wildcardsToggle ? 'On' : 'Off'}
								</div>
								<div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>
									By: {puzzle.creatorName || puzzle.creatorId || 'Anonymous'} | {puzzle.date || ''}
								</div>
								<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
									<button
										className='vibegrid-submit'
										onClick={() => {
											setCustomPuzzle(puzzle);
											setMode('custom');
											setCustomState(null);
										}}
										style={{ marginRight: 8 }}
									>
										Play
									</button>
									<button
										className='vibegrid-submit'
										onClick={() => {
											const url = router.basePath + '/play/custom/' + puzzle._id;
											navigator.clipboard.writeText(url);
										}}
										style={{ background: 'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)' }}
									>
										Copy Link
									</button>
									<span style={{ marginLeft: 8, color: '#fbbf24', fontSize: 18 }} title='Rating (coming soon)'>★</span>
									<span style={{ marginLeft: 2, color: '#64748b', fontSize: 16 }} title='Favorite (coming soon)'>♡</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<style>{`
				.back-icon-btn {
					position: absolute;
					top: 24px;
					left: 24px;
					padding: 0;
					background: linear-gradient(90deg,#2563eb 0%,#38bdf8 100%);
					border: none;
					border-radius: 8px;
					width: 40px;
					height: 40px;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;
					z-index: 10;
				}
				.back-icon-btn:hover {
					background: linear-gradient(90deg,#38bdf8 0%,#2563eb 100%);
				}
				.browse-puzzles-header {
					position: absolute;
					top: 20px;
					left: 0;
					right: 0;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					z-index: 2;
				}
				.browse-puzzles-tabs {
					display: flex;
					gap: 12px;
					margin-top: 10px;
				}
				.browse-puzzles-tabs button {
					font-weight: 400;
					background: none;
					border: none;
					border-bottom: 2px solid transparent;
					color: #64748b;
					font-size: 18px;
					cursor: pointer;
					padding: 6px 18px;
					border-radius: 0;
					transition: color 0.2s, border-bottom 0.2s;
				}
				.browse-puzzles-tabs button.active {
					font-weight: 700;
					border-bottom: 2px solid #38bdf8;
					color: #2563eb;
				}
				.browse-puzzles-list {
					margin-top: 120px;
				}
			`}</style>
		</div>
	);
}
