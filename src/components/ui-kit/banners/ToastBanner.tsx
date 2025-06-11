// ToastBanner.tsx - Custom toast/notification for VibeGrid UI Kit
import React from 'react';

interface ToastBannerProps {
	message: string;
	icon?: React.ReactNode;
	onClose?: () => void;
	duration?: number; // ms
	type?:
		| 'achievement'
		| 'success'
		| 'error'
		| 'info'
		| 'warning'
		| 'system'
		| 'burn'
		| 'taunt';
	style?: React.CSSProperties;
}

const typeColors: Record<string, string> = {
	achievement: '#fbbf24',
	success: '#22c55e',
	error: '#ef4444',
	info: '#2563eb',
	warning: '#f59e42',
	system: '#2196f3',
	burn: '#ff7043',
	taunt: '#a259f7',
};

export const ToastBanner: React.FC<ToastBannerProps> = ({
	message,
	icon = '🎉',
	onClose,
	duration = 3200,
	type = 'achievement',
	style = {},
}) => {
	React.useEffect(() => {
		if (duration && onClose) {
			const timer = setTimeout(onClose, duration);
			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	return (
		<div
			className={`toast-banner toast-banner--${type}`}
			style={{
				position: 'fixed',
				right: 32,
				bottom: 32,
				zIndex: 9999,
				background: typeColors[type] || '#fff',
				color: '#1e293b',
				borderRadius: 12,
				boxShadow: '0 2px 16px 0 #0002',
				padding: '16px 28px',
				display: 'flex',
				alignItems: 'center',
				fontWeight: 600,
				fontSize: 17,
				gap: 12,
				minWidth: 220,
				...style,
			}}
			role='alert'
		>
			<span style={{ fontSize: 24 }}>{icon}</span>
			<span>{message}</span>
			{onClose && (
				<button
					onClick={onClose}
					style={{
						marginLeft: 18,
						background: 'none',
						border: 'none',
						color: '#1e293b',
						fontSize: 20,
						cursor: 'pointer',
						fontWeight: 700,
					}}
					aria-label='Close notification'
				>
					×
				</button>
			)}
		</div>
	);
};

export default ToastBanner;
