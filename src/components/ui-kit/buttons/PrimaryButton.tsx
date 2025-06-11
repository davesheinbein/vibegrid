import React from 'react';

interface PrimaryButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
	children,
	...props
}) => (
	<button className='primary-btn' {...props}>
		{children}
	</button>
);

export default PrimaryButton;
