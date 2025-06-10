// Centralized IconButton component for UI Kit
import React from 'react';

interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon: React.ReactNode;
	label?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
	icon,
	label,
	...props
}) => (
	<button
		className='icon-btn'
		aria-label={label}
		{...props}
	>
		{icon}
	</button>
);

export default IconButton;
