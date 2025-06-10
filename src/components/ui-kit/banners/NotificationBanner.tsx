import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { removeNotification } from '../../../store/notificationsSlice';
import { UserSettingsContext } from '../providers/UserSettingsProvider';
import classNames from 'classnames';

const typeColors: Record<NotificationType, string> = {
	burn: '#ff7043',
	achievement: '#ffd700',
	system: '#2196f3',
	taunt: '#a259f7',
};

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

const NotificationBanner: React.FC<
	NotificationBannerProps
> = ({ type, message, onClose, index }) => {
	const { settings } = useContext(UserSettingsContext);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (settings && settings.notificationsEnabled === false)
			return;
		const timer = setTimeout(() => {
			dispatch(removeNotification(message));
			onClose();
		}, 2500);
		return () => clearTimeout(timer);
	}, [onClose, settings, dispatch, message]);

	if (settings && settings.notificationsEnabled === false)
		return null;

	return (
		<div
			className={classNames(
				'notification-banner',
				`notification-banner--${type}`
			)}
			style={{ backgroundColor: typeColors[type] }}
		>
			{message}
		</div>
	);
};

export default NotificationBanner;
