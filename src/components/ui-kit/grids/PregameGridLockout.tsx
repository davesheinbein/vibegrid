import React from 'react';

interface PregameGridLockoutProps {
	gridWords: string[];
	gridCols: number;
	gridRows: number;
}

const PregameGridLockout: React.FC<
	PregameGridLockoutProps
> = ({ gridWords, gridCols, gridRows }) => (
	<div className='daily-center-flex-row pregame-grid-lockout'>
		<div
			className='gridRoyale-grid daily-grid pregame-grid-blur'
			data-cols={gridCols}
			data-rows={gridRows}
			style={{
				gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
			}}
		>
			{gridWords.map((_, idx) => (
				<div
					key={idx}
					className='word-btn pregame-grid-cell-lockout'
					style={{
						pointerEvents: 'none',
						userSelect: 'none',
						cursor: 'not-allowed',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 28,
						fontWeight: 700,
						color: '#64748b',
						background: '#f1f5f9',
						border: '1px solid #e5e7eb',
						borderRadius: 8,
						minHeight: 44,
					}}
				>
					<span
						style={{
							fontSize: 32,
							fontWeight: 800,
						}}
					>
						×
					</span>
				</div>
			))}
		</div>
	</div>
);

export default PregameGridLockout;
