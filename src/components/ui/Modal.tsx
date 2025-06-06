import React from 'react';
import { CloseButton } from './Buttons';

// Uniform Modal wrapper for all modals
export const Modal: React.FC<{
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
	contentStyle?: React.CSSProperties;
	contentClassName?: string;
}> = ({
	open,
	onClose,
	children,
	className = '',
	contentStyle,
	contentClassName = '',
}) => {
	if (!open) return null;
	return (
		<div
			className={`share-modal ${className}`.trim()}
			onClick={(e) =>
				e.target === e.currentTarget && onClose()
			}
		>
			<div
				className={`share-modal-content ${contentClassName}`.trim()}
				style={contentStyle}
			>
				{children}
			</div>
		</div>
	);
};
