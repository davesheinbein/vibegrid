import React from 'react';

// Add VS mode color tokens to each theme
export const vsModeDefaults = {
	player: '#2563eb', // blue
	enemy: '#ef4444', // red
	playerBg: '#e0e7ff',
	enemyBg: '#fee2e2',
	boardBg: '#fff',
	font: '#222',
	border: '#e0e7ef',
};

export const themes = [
	{
		name: 'light',
		label: 'Light',
		color: '#f8f5ec', // warm eggshell white
		bg: '#f8f5ec',
		font: '#222',
		swatchType: 'solid',
		vsMode: {
			player: '#2563eb',
			enemy: '#ef4444',
			playerBg: '#e0e7ff',
			enemyBg: '#fee2e2',
			boardBg: '#fff',
			font: '#222',
			border: '#e0e7ef',
		},
	},
	{
		name: 'dark',
		label: 'Dark',
		color: '#181a1b', // almost black, deep gray
		bg: '#23272a',
		font: '#f8f5ec',
		swatchType: 'solid',
		vsMode: {
			player: '#3b82f6',
			enemy: '#ef4444',
			playerBg: '#1e293b',
			enemyBg: '#3b1e1e',
			boardBg: '#23272a',
			font: '#f8f5ec',
			border: '#334155',
		},
	},
	{
		name: 'oceanic',
		label: 'Oceanic',
		color: '#174ea6', // deep blue
		bg: '#0a2540',
		font: '#a7f3f7',
		swatchType: 'solid',
		vsMode: {
			player: '#3b82f6',
			enemy: '#ef4444',
			playerBg: '#1e293b',
			enemyBg: '#3b1e1e',
			boardBg: '#0a2540',
			font: '#a7f3f7',
			border: '#1e40af',
		},
	},
	{
		name: 'sunset',
		label: 'Sunset',
		color: '#ffb347', // fallback for border
		bg: 'linear-gradient(135deg, #ffb347 0%, #ff5e62 100%)', // orange/yellow gradient
		font: '#fff',
		swatchType: 'gradient',
		vsMode: {
			player: '#2563eb',
			enemy: '#ef4444',
			playerBg: '#e0e7ff',
			enemyBg: '#fee2e2',
			boardBg: '#fff',
			font: '#222',
			border: '#e0e7ef',
		},
	},
];

export const ThemeSelector: React.FC<{
	className?: string;
}> = ({ className = '' }) => {
	const [activeTheme, setActiveTheme] =
		React.useState('default');

	React.useEffect(() => {
		document.body.className = '';
		document.body.classList.add(`theme-${activeTheme}`);
		document.body.style.transition =
			'background 0.25s ease-in-out, color 0.25s';
	}, [activeTheme]);

	return (
		<ul
			className={`theme-selector ${className}`}
			style={{
				display: 'flex',
				gap: 18,
				justifyContent: 'center',
				margin: '18px 0',
			}}
		>
			{themes.map(({ name, label, color, bg, font }) => (
				<li
					key={name}
					onClick={() => setActiveTheme(name)}
					style={{
						cursor: 'pointer',
						width: 54,
						height: 54,
						borderRadius: 16,
						background: bg,
						border:
							activeTheme === name
								? `3px solid ${color}`
								: '2px solid #e0e7ef',
						boxShadow:
							activeTheme === name
								? `0 0 16px 2px ${color}66`
								: '0 1px 4px 0 #e3eaff33',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transition:
							'box-shadow 0.22s, border 0.22s, background 0.22s',
						position: 'relative',
					}}
					aria-label={`Select ${label} theme`}
				>
					{/* Preview: grid + font color */}
					<div
						style={{
							width: 32,
							height: 32,
							borderRadius: 8,
							background: color,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow:
								activeTheme === name
									? `0 0 8px 2px ${color}99`
									: 'none',
							transition: 'box-shadow 0.22s',
						}}
					>
						<span
							style={{
								color: font,
								fontWeight: 700,
								fontSize: 13,
								textShadow: '0 1px 4px #fff8',
							}}
						>
							{label[0]}
						</span>
					</div>
					{/* Animated glow */}
					{activeTheme === name && (
						<span
							style={{
								position: 'absolute',
								inset: 0,
								borderRadius: 16,
								boxShadow: `0 0 24px 6px ${color}55`,
								pointerEvents: 'none',
								opacity: 0.7,
								transition: 'opacity 0.22s',
							}}
						/>
					)}
				</li>
			))}
		</ul>
	);
};
