// Page for browsing custom puzzles (moved from App.tsx)
import React from 'react';

interface BrowseCustomPuzzlesProps {
	onBack: () => void;
	puzzles: any[];
	setCustomPuzzle: (puzzle: any) => void;
	setMode: (
		mode: 'startup' | 'daily' | 'custom' | 'browse'
	) => void;
	setCustomState: (state: any) => void;
	user?: {
		name: string;
		email: string;
		photoUrl?: string;
	} | null;
	mode?: 'browse';
}

const BrowseCustomPuzzles: React.FC<
	BrowseCustomPuzzlesProps
> = ({
	onBack,
	puzzles,
	setCustomPuzzle,
	setMode,
	setCustomState,
	user,
	mode = 'browse',
}) => {
	const [tab, setTab] = React.useState<
		'community' | 'mine'
	>('community');
	const [loading, setLoading] = React.useState(false);
	const [tabPuzzles, setTabPuzzles] = React.useState<any[]>(
		[]
	);

	React.useEffect(() => {
		async function fetchPuzzles() {
			setLoading(true);
			try {
				let url = '';
				if (tab === 'mine' && user) {
					url = `/api/custom-puzzles?creatorId=${encodeURIComponent(
						user.email
					)}`;
				} else {
					url = '/api/custom-puzzles/public';
				}
				const res = await fetch(url);
				if (!res.ok)
					throw new Error('Failed to fetch puzzles');
				const data = await res.json();
				setTabPuzzles(data);
			} catch {
				setTabPuzzles([]);
			}
			setLoading(false);
		}
		fetchPuzzles();
	}, [tab, user]);

	return (
		<div
			className='vibegrid-container'
			style={{
				minHeight: '100vh',
				padding: 24,
				position: 'relative',
			}}
		>
			<button
				className='vibegrid-back-arrow'
				onClick={onBack}
				style={{
					position: 'absolute',
					top: 24,
					left: 24,
					padding: 0,
					background: 'none',
					border: 'none',
					boxShadow: 'none',
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					zIndex: 10,
				}}
				aria-label='Back'
			>
				<svg
					width='38'
					height='38'
					viewBox='0 0 38 38'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M26 33L13 19L26 5'
						stroke='#2563eb'
						strokeWidth='4.5'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</button>
			<h1
				className='vibegrid-title'
				style={{
					textAlign: 'center',
					marginLeft: 0,
					marginRight: 0,
					paddingLeft: 32,
					paddingRight: 32,
				}}
			>
				Browse Custom Puzzles
			</h1>
			<div
				style={{
					display: 'flex',
					gap: 16,
					marginBottom: 16,
					justifyContent: 'center',
					marginTop: 24,
				}}
			>
				<button
					className={`vibegrid-submit${
						tab === 'community' ? ' active' : ''
					}`}
					onClick={() => setTab('community')}
				>
					Community Puzzles
				</button>
				<button
					className={`vibegrid-submit${
						tab === 'mine' ? ' active' : ''
					}`}
					onClick={() => setTab('mine')}
					disabled={!user}
				>
					My Puzzles
				</button>
			</div>
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
							<div
								style={{ fontWeight: 600, fontSize: 18 }}
							>
								{puzzle.title || 'Untitled Puzzle'}
							</div>
							<div
								style={{
									fontSize: 14,
									margin: '4px 0 8px 0',
								}}
							>
								{puzzle.theme && (
									<span>Theme: {puzzle.theme} | </span>
								)}
								Words: {puzzle.words?.length || 0} |
								Wildcards:{' '}
								{puzzle.wildcardsToggle ? 'On' : 'Off'}
							</div>
							<div
								style={{
									fontSize: 13,
									color: '#64748b',
									marginBottom: 6,
								}}
							>
								By:{' '}
								{puzzle.creatorName ||
									puzzle.creatorId ||
									'Anonymous'}{' '}
								| {puzzle.date || ''}
							</div>
							<div
								style={{
									display: 'flex',
									gap: 8,
									alignItems: 'center',
								}}
							>
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
										const url =
											window.location.origin +
											'/#/play/custom/' +
											puzzle._id;
										navigator.clipboard.writeText(url);
									}}
									style={{
										background:
											'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
									}}
								>
									Copy Link
								</button>
								<span
									style={{
										marginLeft: 8,
										color: '#fbbf24',
										fontSize: 18,
									}}
									title='Rating (coming soon)'
								>
									★
								</span>
								<span
									style={{
										marginLeft: 2,
										color: '#64748b',
										fontSize: 16,
									}}
									title='Favorite (coming soon)'
								>
									♡
								</span>
							</div>
						</div>
					))}
				</div>
			)}
			<style>{`
				.vibegrid-back-arrow:hover svg path {
					stroke: #1e40af;
				}
			`}</style>
		</div>
	);
};

export default BrowseCustomPuzzles;
