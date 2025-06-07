import React from 'react';
import {
	getShareUrl,
	copyToClipboard,
} from '../../utils/helpers';

export const GoBackButton: React.FC<{
	onClick: () => void;
	className?: string;
	label?: string;
}> = ({ onClick, className = '', label = 'Back' }) => (
	<button
		className={`back-icon-btn ${className}`.trim()}
		onClick={onClick}
		aria-label={label}
	>
		<span className='back-arrow' aria-hidden='true'>
			&#8592;
		</span>
	</button>
);

export const CloseButton: React.FC<{
	onClick: () => void;
	className?: string;
	label?: string;
}> = ({ onClick, className = '', label = 'Close' }) => (
	<button
		onClick={onClick}
		className={`share-modal-close ${className}`.trim()}
		aria-label={label}
	>
		<span className='close-x'>&#215;</span>
	</button>
);

interface WordButtonProps {
	word: string;
	isSelected: boolean;
	isLocked: boolean;
	onClick: () => void;

	onKeyDown?: (
		e: React.KeyboardEvent<HTMLDivElement>
	) => void;

	[key: string]: any;
}

export const WordButton: React.FC<
	WordButtonProps & {
		burnSuspect?: boolean;
	}
> = ({
	word,
	isSelected,
	isLocked,
	onClick,
	onKeyDown,
	burnSuspect,
	...rest
}) => {
	let className = 'word-btn';
	if (isLocked) className += ' locked';
	else if (isSelected) className += ' selected';
	if (burnSuspect) className += ' burn-suspect';

	return (
		<div
			className={className}
			onClick={onClick}
			tabIndex={isLocked ? -1 : 0}
			aria-disabled={isLocked}
			role='button'
			onKeyDown={onKeyDown}
			{...rest}
		>
			{word}
		</div>
	);
};

export const SubmitButton: React.FC<{
	children: React.ReactNode;
	onClick: () => void;
	className?: string;
	disabled?: boolean;
}> = ({ children, onClick, className = '', disabled }) => (
	<button
		className={`vibegrid-submit ${className}`.trim()}
		onClick={onClick}
		disabled={disabled}
	>
		{children}
	</button>
);

export const ShareButton: React.FC<{
	onClick: () => void;
	className?: string;
	label?: string;
}> = ({
	onClick,
	className = '',
	label = 'Share VibeGrid',
}) => (
	<button
		className={`share-btn ${className}`.trim()}
		onClick={onClick}
		aria-label={label}
	>
		{label}
	</button>
);

// A reusable dark mode toggle with effect and nebula/checkbox UI
export const DarkModeToggle: React.FC<{
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

export const CopyLinkButton: React.FC = () => {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = () => {
		copyToClipboard(getShareUrl());
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<a
				href='#'
				onClick={(e) => {
					e.preventDefault();
					handleCopy();
				}}
				className='share-link share-link--copy'
			>
				<span
					className='share-link-icon'
					style={{ color: '#fff' }}
				>
					<svg
						width='22'
						height='22'
						viewBox='0 0 32 32'
						fill='none'
					>
						<circle cx='16' cy='16' r='16' fill='#64748b' />
						<g>
							<rect
								x='10'
								y='14'
								width='8'
								height='8'
								rx='2'
								fill='#fff'
							/>
							<rect
								x='14'
								y='10'
								width='8'
								height='8'
								rx='2'
								fill='none'
								stroke='#fff'
								strokeWidth='2'
							/>
						</g>
					</svg>
				</span>
				<span className='share-link-text'>Copy URL</span>
			</a>
			{copied && (
				<span
					style={{
						color: '#16a34a',
						fontSize: 14,
						marginLeft: 10,
						fontWeight: 700,
					}}
				>
					✓ Copied!
				</span>
			)}
		</div>
	);
};

export const FriendsToggleButton: React.FC<{
	active: boolean;
	onClick: () => void;
}> = ({ active, onClick }) => (
	<button
		onClick={onClick}
		className={`friends-toggle-btn${
			active ? ' active' : ''
		}`}
		aria-label={
			active
				? 'Close friends sidebar'
				: 'Open friends sidebar'
		}
		style={{
			position: 'absolute',
			top: 24,
			right: active ? 320 : 24,
		}}
	>
		<span className='friends-toggle-glow' />
		<span
			className='friends-toggle-icon'
			role='img'
			aria-label='Friends'
		>
			👥
		</span>
	</button>
);
