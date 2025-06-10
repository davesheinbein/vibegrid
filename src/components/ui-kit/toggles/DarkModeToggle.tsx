// Centralized DarkModeToggle component for UI Kit
import React from 'react';

// A reusable dark mode toggle with effect and nebula/checkbox UI
const DarkModeToggle: React.FC<{
	className?: string;
	style?: React.CSSProperties;
}> = ({ className = '', style }) => {
	const [darkMode, setDarkMode] = React.useState(false);

	React.useEffect(() => {
		document.body.classList.toggle('dark-mode', darkMode);
		document.body.style.transition =
			'background 0.25s ease-in-out, color 0.25s';
	}, [darkMode]);

	return (
		<li
			style={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				margin: '8px 0',
				...style,
			}}
		>
			<label className={`container ${className}`.trim()}>
				<input
					type='checkbox'
					checked={!darkMode}
					onChange={() => setDarkMode((d) => !d)}
					aria-checked={!darkMode}
					aria-label='Toggle dark mode'
				/>
				<div className='checkbox-wrapper'>
					<div className='checkmark'></div>
					<div className='nebula-glow'></div>
					<div className='sparkle-container'></div>
				</div>
			</label>
		</li>
	);
};

export default DarkModeToggle;
