import React, { useEffect, useContext } from 'react';
import { UserSettingsContext } from './UserSettingsProvider';

export type NotificationType =
	| 'burn'
	| 'achievement'
	| 'system'
	| 'taunt';

interface NotificationBannerProps {
	type: NotificationType;
	message: string;
	onClose: () => void;
	index: number;
}

const typeColors: Record<NotificationType, string> = {
	burn: '#ff7043', // orange/red
	achievement: '#ffd700', // gold
	system: '#2196f3', // blue
	taunt: '#a259f7', // purple
};

const NotificationBanner: React.FC<
	NotificationBannerProps
> = ({ type, message, onClose, index }) => {
	const { settings } = useContext(UserSettingsContext);
	if (!settings.notificationsEnabled) return null;

	useEffect(() => {
		const timer = setTimeout(onClose, 2500);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className={`notification-banner notification-banner--${type}`}
			style={{
				background: typeColors[type],
				top: `${16 + index * 56}px`,
				animation: 'slideInFade 0.3s',
				zIndex: 9999,
				position: 'fixed',
				left: '50%',
				transform: 'translateX(-50%)',
				minWidth: 320,
				maxWidth: 420,
				color: type === 'achievement' ? '#222' : '#fff',
				borderRadius: 8,
				padding: '12px 24px',
				boxShadow: '0 4px 16px #0002',
				fontWeight: 600,
				fontSize: 18,
				pointerEvents: 'auto',
				cursor: 'pointer',
			}}
			onClick={onClose}
			aria-live='polite'
		>
			{message}
		</div>
	);
};

export default NotificationBanner;
