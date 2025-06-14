import React from 'react';

export const Modal: React.FC<{
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
}> = ({
	open,
	onClose,
	children,
	className = '',
	contentClassName = '',
}) => {
	if (!open) return null;
	return (
		<div
			className={`share-modal ${className}`.trim()}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className={contentClassName}>{children}</div>
		</div>
	);
};

export default Modal;
