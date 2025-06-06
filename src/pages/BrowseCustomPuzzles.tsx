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
}

const BrowseCustomPuzzles: React.FC<
	BrowseCustomPuzzlesProps
> = ({
	onBack,
	puzzles,
	setCustomPuzzle,
	setMode,
	setCustomState,
}) => {
	return (
		<div
			className='vibegrid-container'
			style={{ minHeight: '100vh', padding: 24 }}
		>
			<h1 className='vibegrid-title'>
				Browse Custom Puzzles
			</h1>
			<button
				className='vibegrid-submit'
				onClick={onBack}
				style={{ marginBottom: 16 }}
			>
				Back
			</button>
			{puzzles.length === 0 ? (
				<div style={{ marginTop: 32 }}>
					No custom puzzles found. Create one in Custom
					Puzzle Mode!
				</div>
			) : (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 16,
					}}
				>
					{puzzles.map((puzzle) => (
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
								Words: {puzzle.words?.length || 0}
							</div>
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
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default BrowseCustomPuzzles;
