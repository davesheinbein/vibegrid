import React from 'react';
import {
	getShareUrl,
	copyToClipboard,
} from '../../utils/helpers';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSidebarOpen } from '../../store/friendsSlice';
import { useSession } from 'next-auth/react';

/**
 * GoBackButton - A simple back button for navigation.
 * Props:
 * - onClick: function to call on click
 * - className: additional class names
 * - label: button label (default: 'Back')
 * - style: optional inline styles
 */
export const GoBackButton: React.FC<{
	onClick: () => void;
	className?: string;
	label?: string;
	style?: React.CSSProperties;
}> = ({ onClick, className = '', style }) => (
	<button
		type='button'
		className={`go-back-btn ${className}`.trim()}
		onClick={onClick}
		style={style}
		aria-label='Back'
	>
		<svg
			width='22'
			height='22'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2.2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<polyline points='15 18 9 12 15 6' />
		</svg>
	</button>
);

/**
 * CloseButton - A simple close (X) button for modals, banners, etc.
 * Props:
 * - onClick: function to call on click
 * - className: additional class names
 * - label: button label (default: 'Close')
 * - style: optional inline styles
 */
export const CloseButton: React.FC<{
	onClick: () => void;
	className?: string;
	label?: string;
	style?: React.CSSProperties;
}> = ({
	onClick,
	className = '',
	label = 'Close',
	style,
}) => (
	<button
		type='button'
		className={`close-btn ${className}`.trim()}
		onClick={onClick}
		aria-label={label}
		style={style}
	>
		&#10005;
	</button>
);

/**
 * WordButton - Button for selecting words in the grid. Handles burn, lock, and selection states.
 * Props:
 * - word: the word to display
 * - isSelected: is the word currently selected
 * - isLocked: is the word locked (already solved)
 * - onClick: click handler
 * - onKeyDown: keydown handler (optional)
 * - burnSuspect: highlight as burnable (optional)
 * - isBurned: is the word burned (optional)
 * - ...rest: any other props
 */
interface WordButtonProps {
	word: string;
	isSelected: boolean;
	isLocked: boolean;
	onClick: () => void;
	onKeyDown?: (
		e: React.KeyboardEvent<HTMLButtonElement>
	) => void;
	burnSuspect?: boolean;
	isBurned?: boolean;
	[key: string]: any;
}

export const WordButton: React.FC<WordButtonProps> = ({
	word,
	isSelected,
	isLocked,
	onClick,
	onKeyDown,
	burnSuspect = false,
	isBurned = false,
	...rest
}) => {
	// Compose className based on state
	let className = 'word-btn';
	if (isSelected) className += ' selected';
	if (isLocked) className += ' locked';
	if (burnSuspect) className += ' burn-suspect';
	if (isBurned) className += ' burned';

	return (
		<button
			type='button'
			className={className}
			disabled={isLocked}
			onClick={onClick}
			onKeyDown={onKeyDown}
			{...rest}
		>
			{word}
		</button>
	);
};

/**
 * SubmitButton - A button for submitting forms or actions.
 * Props:
 * - children: button content
 * - onClick: click handler
 * - className: additional class names
 * - disabled: is the button disabled
 * - style: optional inline styles
 */
export const SubmitButton: React.FC<{
	children: React.ReactNode;
	onClick: () => void;
	className?: string;
	disabled?: boolean;
	style?: React.CSSProperties;
}> = ({
	children,
	onClick,
	className = '',
	disabled,
	style,
}) => (
	<button
		onClick={onClick}
		className={`submit-btn ${className}`.trim()}
		disabled={disabled}
		style={style}
	>
		{children}
	</button>
);

/**
 * ShareButton - A button for sharing content via social media or other platforms.
 * Props:
 * - onClick: click handler
 * - className: additional class names
 * - label: button label (default: 'Share')
 */
export const ShareButton: React.FC<{
	onClick: () => void;
	className?: string;
	label?: string;
}> = ({ onClick, className = '', label = 'Share' }) => (
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

/**
 * CopyLinkButton - A button for copying the shareable link to clipboard.
 */
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

/**
 * FriendsToggleButton - A button for toggling the friends sidebar.
 * Props:
 * - onClick: optional click handler
 * - className: additional class names
 * - style: optional inline styles
 */
export const FriendsToggleButton: React.FC<{
	onClick?: () => void;
	className?: string;
	style?: React.CSSProperties;
}> = ({ onClick, className = '', style }) => {
	const { data: session, status } = useSession();
	const isAuthenticated =
		status === 'authenticated' && session?.user;

	return (
		<button
			onClick={onClick}
			className={`friends-toggle-btn ${className}`}
			style={{
				border: 'none',
				background: 'none',
				padding: 0,
				borderRadius: '50%',
				width: 44,
				height: 44,
				boxShadow: '0 2px 8px #e3eaff33',
				cursor: 'pointer',
				...style,
			}}
			aria-label={'Open friends sidebar'}
		>
			{isAuthenticated && session.user?.image ? (
				<img
					src={session.user.image}
					alt={session.user.name || 'Profile'}
					style={{
						width: 36,
						height: 36,
						borderRadius: '50%',
						objectFit: 'cover',
						border: '2px solid #38bdf8',
					}}
				/>
			) : (
				<span
					className='friends-toggle-icon'
					style={{ fontSize: 28, color: '#2563eb' }}
				>
					{/* Default icon, e.g. FontAwesome user-friends or similar */}
					<svg
						width='28'
						height='28'
						viewBox='0 0 24 24'
						fill='none'
						stroke='#2563eb'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<circle cx='9' cy='7' r='4' />
						<path d='M17 11v-1a4 4 0 0 0-4-4' />
						<path d='M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2' />
					</svg>
				</span>
			)}
		</button>
	);
};

// All buttons are modular, props-driven, and ready for extension. Add more as needed.
