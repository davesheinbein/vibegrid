import React from 'react';

/**
 * CloseButton - A simple close (X) button for modals, banners, etc.
 * Props:
 * - onClick: function to call on click
 * - className: additional class names
 * - label: button label (default: 'Close')
 * - style: optional inline styles
 */
const CloseButton: React.FC<{
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
		className={`close-btn modal-close-absolute ${className}`.trim()}
		onClick={onClick}
		aria-label={label}
		style={{
			padding: 20,
			background:
				'linear-gradient(90deg, #eb2525 0%, #f86838 100%)',
			color: '#fff',
			border: 'none',
			borderRadius: '0.7rem',
			fontSize: '1.08rem',
			fontWeight: 600,
			cursor: 'pointer',
			transition: 'background 0.2s',
			boxShadow: '0 2px 8px 0 rgba(16, 24, 40, 0.08)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			top: 16,
			right: 16,
			zIndex: 10,
			lineHeight: 1,
			...style,
		}}
	>
		&#10005;
	</button>
);

export default CloseButton;
