import React from 'react';

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

export default WordButton;
