import React from 'react';

// Uniform GoBackButton
export const GoBackButton: React.FC<{
	onClick: () => void;
	style?: React.CSSProperties;
	className?: string;
	label?: string;
}> = ({
	onClick,
	style,
	className = '',
	label = 'Back',
}) => (
	<button
		className={`back-icon-btn ${className}`.trim()}
		onClick={onClick}
		aria-label={label}
		style={style}
	>
		<span
			style={{
				fontSize: '1.3em',
				lineHeight: 1,
				color: '#fff',
			}}
			aria-hidden='true'
		>
			&#8592;
		</span>
	</button>
);

// Uniform CloseButton
export const CloseButton: React.FC<{
	onClick: () => void;
	style?: React.CSSProperties;
	className?: string;
	label?: string;
}> = ({
	onClick,
	style,
	className = '',
	label = 'Close',
}) => (
	<button
		className={`share-modal-close ${className}`.trim()}
		onClick={onClick}
		aria-label={label}
		style={style}
	>
		{label}
	</button>
);

// Uniform SubmitButton
export const SubmitButton: React.FC<{
	children: React.ReactNode;
	onClick: () => void;
	style?: React.CSSProperties;
	className?: string;
	disabled?: boolean;
}> = ({
	children,
	onClick,
	style,
	className = '',
	disabled,
}) => (
	<button
		className={`vibegrid-submit ${className}`.trim()}
		onClick={onClick}
		style={style}
		disabled={disabled}
	>
		{children}
	</button>
);

// Uniform ShareButton
export const ShareButton: React.FC<{
	onClick: () => void;
	style?: React.CSSProperties;
	className?: string;
	label?: string;
}> = ({
	onClick,
	style,
	className = '',
	label = 'Share VibeGrid',
}) => (
	<button
		className={`share-btn ${className}`.trim()}
		onClick={onClick}
		style={style}
		aria-label={label}
	>
		{label}
	</button>
);

// Uniform DarkModeToggle
export const DarkModeToggle: React.FC<{
	checked: boolean;
	onChange: (checked: boolean) => void;
	style?: React.CSSProperties;
	className?: string;
}> = ({ checked, onChange, style, className = '' }) => (
	<label
		className={`darkmode-toggle ${className}`.trim()}
		style={style}
	>
		<input
			type='checkbox'
			checked={checked}
			onChange={(e) => onChange(e.target.checked)}
			style={{ marginRight: 8 }}
		/>
		<span>Dark Mode</span>
	</label>
);
