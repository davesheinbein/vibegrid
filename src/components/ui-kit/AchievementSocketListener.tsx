import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/notificationsSlice';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';

const AchievementSocketListener: React.FC = () => {
	const dispatch = useDispatch();
	const { data: session } = useSession();

	useEffect(() => {
		const userIdentifier =
			session?.user?.id || session?.user?.email;
		if (!userIdentifier) return;
		const socket = io('/achievements', {
			query: { userId: userIdentifier },
		});
		socket.on('achievement:unlocked', ({ achievement }) => {
			dispatch(
				addNotification({
					id: `achv-${achievement.id}-${Date.now()}`,
					message: `Achievement unlocked: ${achievement.label}`,
					type: 'achievement',
					createdAt: new Date().toISOString(),
					read: false,
				})
			);
		});
		return () => {
			socket.disconnect();
		};
	}, [session?.user?.id, session?.user?.email, dispatch]);

	return null;
};

export default AchievementSocketListener;
