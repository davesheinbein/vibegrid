import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

/**
 * GoBackButton - A simple back button for navigation.
 * Props:
 * - onClick: function to call on click
 * - className: additional class names
 * - label: button label (default: 'Back')
 * - style: optional inline styles (should be used only for layout, not color)
 */
const GoBackButton: React.FC<{
	onClick: () => void;
	className?: string;
	label?: string;
	style?: React.CSSProperties;
}> = ({ onClick, className = '', style, label }) => (
	<button
		type='button'
		className={`icon-btn go-back-btn ${className}`.trim()}
		onClick={onClick}
		style={style}
		aria-label={label || 'Back'}
	>
		<FontAwesomeIcon
			icon={faArrowLeft}
			className='go-back-icon'
		/>
		{label && (
			<span className='go-back-label'>{label}</span>
		)}
	</button>
);

export default GoBackButton;
