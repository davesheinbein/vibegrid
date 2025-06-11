import React from 'react';

interface SolvedGroupsDisplayProps {
	pendingSolvedGroups: {
		groupIdx: number;
		words: string[];
	}[];
	activePuzzle: any;
}

const SolvedGroupsDisplay: React.FC<
	SolvedGroupsDisplayProps
> = ({ pendingSolvedGroups, activePuzzle }) => {
	if (!pendingSolvedGroups.length) return null;
	return (
		<div
			className='gridRoyale-solved-groups'
			aria-label='Solved Groups'
			style={{
				margin: '0 auto 18px auto',
				maxWidth: 600,
				display: 'flex',
				flexWrap: 'wrap',
				gap: 18,
				justifyContent: 'center',
				alignItems: 'flex-start',
				minHeight: 48,
			}}
		>
			{pendingSolvedGroups
				// Only show unique groupIdx
				.filter(
					(g, i, arr) =>
						arr.findIndex(
							(x) => x.groupIdx === g.groupIdx
						) === i
				)
				.sort((a, b) => a.groupIdx - b.groupIdx)
				.map(({ groupIdx, words }) => (
					<section
						className='gridRoyale-solved-group'
						key={groupIdx}
						role='img'
						aria-label={`Solved group: ${
							activePuzzle?.groupLabels?.[groupIdx] ||
							`Group ${groupIdx + 1}`
						}`}
						style={{
							background: '#f1f5f9',
							border: '2px solid #e0e7ef',
							borderRadius: 14,
							minWidth: 120,
							minHeight: 44,
							margin: 0,
							padding: '10px 18px 8px 18px',
							boxShadow: '0 2px 12px #e0e7ff33',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							animation:
								'fadeInUp 0.6s cubic-bezier(.4,2,.6,1)',
						}}
					>
						<div
							className='gridRoyale-solved-label'
							style={{
								fontWeight: 700,
								color: '#2563eb',
								fontSize: 16,
								marginBottom: 6,
								textAlign: 'center',
							}}
						>
							{activePuzzle?.groupLabels?.[groupIdx] ||
								`Group ${groupIdx + 1}`}
						</div>
						<ul
							style={{
								listStyle: 'none',
								padding: 0,
								margin: 0,
								display: 'flex',
								gap: 8,
								flexWrap: 'wrap',
								justifyContent: 'center',
							}}
						>
							{(Array.isArray(words) ? words : []).map(
								(word) => (
									<li
										className='gridRoyale-solved-word'
										key={word}
										style={{
											background: '#fff',
											border: '1.5px solid #e0e7ef',
											borderRadius: 8,
											padding: '4px 12px',
											fontWeight: 600,
											fontSize: 15,
											color: '#222',
											margin: 0,
											boxShadow: '0 1px 4px #e0e7ff22',
											animation:
												'fadeInUp 0.7s cubic-bezier(.4,2,.6,1)',
										}}
									>
										{word}
									</li>
								)
							)}
						</ul>
					</section>
				))}
		</div>
	);
};

export default SolvedGroupsDisplay;
