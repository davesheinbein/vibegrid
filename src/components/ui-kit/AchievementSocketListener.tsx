import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/notificationsSlice';
import { useSocket } from './providers/SocketProvider';

const AchievementSocketListener: React.FC = () => {
	const dispatch = useDispatch();
	const { socket, isConnected } = useSocket();

	useEffect(() => {
		if (!socket || !isConnected) return;

		console.log('🏆 Setting up achievement listeners...');

		// Listen for achievement unlocks
		const handleAchievementUnlocked = ({
			achievement,
		}: {
			achievement: any;
		}) => {
			console.log('🎉 Achievement unlocked:', achievement);

			dispatch(
				addNotification({
					id: `achv-${achievement.id}-${Date.now()}`,
					message: `Achievement unlocked: ${achievement.label}`,
					type: 'achievement',
					createdAt: new Date().toISOString(),
					read: false,
				})
			);
		};

		// Listen for friend-related notifications
		const handleFriendRequestReceived = ({
			from,
			timestamp,
		}: any) => {
			console.log('👥 Friend request received from:', from);

			dispatch(
				addNotification({
					message: `Friend request from ${
						from?.email || from?.id
					}`,
					type: 'info',
					data: { from },
				})
			);
		};

		const handleFriendRequestAccepted = ({
			by,
			timestamp,
		}: any) => {
			console.log('✅ Friend request accepted by:', by);

			dispatch(
				addNotification({
					message: `Friend request accepted by ${
						by?.email || by?.id
					}`,
					type: 'info',
					data: { by },
				})
			);
		};

		// Listen for game invites
		const handleGameInvite = ({ from, gameType }: any) => {
			console.log('🎮 Game invite received:', {
				from,
				gameType,
			});

			dispatch(
				addNotification({
					message: `Game invite from ${
						from?.email || from?.id
					}${gameType ? ' (' + gameType + ')' : ''}`,
					type: 'info',
					data: { from, gameType },
				})
			);
		};

		// Register event listeners
		socket.on(
			'achievement:unlocked',
			handleAchievementUnlocked
		);
		socket.on(
			'friend:request:received',
			handleFriendRequestReceived
		);
		socket.on(
			'friend:request:accepted',
			handleFriendRequestAccepted
		);
		socket.on('game:invite:received', handleGameInvite);

		// Cleanup listeners
		return () => {
			console.log(
				'🏆 Cleaning up achievement listeners...'
			);
			socket.off(
				'achievement:unlocked',
				handleAchievementUnlocked
			);
			socket.off(
				'friend:request:received',
				handleFriendRequestReceived
			);
			socket.off(
				'friend:request:accepted',
				handleFriendRequestAccepted
			);
			socket.off('game:invite:received', handleGameInvite);
		};
	}, [socket, isConnected, dispatch]);

	return null;
};

export default AchievementSocketListener;
