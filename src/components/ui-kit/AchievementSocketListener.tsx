import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/notificationsSlice';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';

const AchievementSocketListener: React.FC = () => {
	const dispatch = useDispatch();
	const { data: session } = useSession();

	useEffect(() => {
		if (!session?.user?.id) return;
		const socket = io('/achievements', {
			query: { userId: session.user.id },
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
	}, [session?.user?.id, dispatch]);

	return null;
};

export default AchievementSocketListener;
