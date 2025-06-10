import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

/**
 * GoBackButton - A simple back button for navigation.
 * Props:
 * - onClick: function to call on click
 * - className: additional class names
 * - label: button label (default: 'Back')
 * - style: optional inline styles
 */
const GoBackButton: React.FC<{
	onClick: () => void;
	className?: string;
	label?: string;
	style?: React.CSSProperties;
}> = ({ onClick, className = '', style, label }) => (
	<button
		type='button'
		className={`go-back-btn ${className}`.trim()}
		onClick={onClick}
		style={{
			...style,
		}}
		aria-label={label || 'Back'}
	>
		<FontAwesomeIcon
			icon={faArrowLeft}
			style={{
				fontSize: 22,
				color: '#fff',
				filter: 'drop-shadow(0 1px 2px #2563eb33)',
				transition: 'color 0.15s',
				marginRight: label ? 8 : 0,
			}}
		/>
	</button>
);

export default GoBackButton;
