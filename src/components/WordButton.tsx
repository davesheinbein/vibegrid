import React from 'react';

interface WordButtonProps {
	word: string;
	isSelected: boolean;
	isLocked: boolean;
	onClick: () => void;
	// --- Enhancement: allow keyboard navigation ---
	onKeyDown?: (
		e: React.KeyboardEvent<HTMLDivElement>
	) => void;
	// --- Enhancement: allow passing data attributes for accessibility ---
	[key: string]: any;
}

// --- Modernized: use semantic class names for easier SCSS targeting ---
const WordButton: React.FC<WordButtonProps> = ({
	word,
	isSelected,
	isLocked,
	onClick,
	onKeyDown,
	...rest
}) => {
	let className = 'word-btn';
	if (isLocked) className += ' locked';
	else if (isSelected) className += ' selected';

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

export default WordButton;
