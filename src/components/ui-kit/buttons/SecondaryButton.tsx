// Centralized SecondaryButton component for UI Kit
import React from 'react';

interface SecondaryButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
	children,
	...props
}) => (
	<button className='secondary-btn' {...props}>
		{children}
	</button>
);

export default SecondaryButton;
