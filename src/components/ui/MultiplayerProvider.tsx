import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface Notification {
	id: string;
	type: 'message' | 'friend_request' | 'achievement';
	content: string;
	createdAt: string;
	read?: boolean;
}

interface MultiplayerContextType {
	socket: Socket | null;
	roomCode: string | null;
	isHost: boolean;
	isConnected: boolean;
	matchStarted: boolean;
	opponentJoined: boolean;
	notifications: Notification[];
	setRoomCode: (code: string | null) => void;
	createRoom: (roomCode: string) => void;
	joinRoom: (roomCode: string) => void;
	leaveRoom: () => void;
	startMatch: () => void;
	addNotification: (notification: Notification) => void;
	markNotificationRead: (id: string) => void;
	// Add more multiplayer state/actions as needed
}

const MultiplayerContext = createContext<
	MultiplayerContextType | undefined
>(undefined);

export const useMultiplayer = () => {
	const ctx = useContext(MultiplayerContext);
	if (!ctx)
		throw new Error(
			'useMultiplayer must be used within MultiplayerProvider'
		);
	return ctx;
};

export const MultiplayerProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [roomCode, setRoomCode] = useState<string | null>(
		null
	);
	const [isHost, setIsHost] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [matchStarted, setMatchStarted] = useState(false);
	const [opponentJoined, setOpponentJoined] =
		useState(false);
	const [notifications, setNotifications] = useState<
		Notification[]
	>([]);
	const notificationIdRef = useRef(0);

	// --- Notification helpers ---
	const addNotification = (notification: Notification) => {
		setNotifications((prev) => [notification, ...prev]);
		// Push notification (browser)
		if (
			window.Notification &&
			Notification.permission === 'granted'
		) {
			new Notification(notification.content, {
				icon: '/logo.svg',
				badge: '/logo.svg',
				body:
					notification.type === 'achievement'
						? 'Achievement unlocked!'
						: undefined,
			});
		}
	};

	const markNotificationRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) =>
				n.id === id ? { ...n, read: true } : n
			)
		);
	};

	// --- Socket setup ---
	useEffect(() => {
		if (!socket) {
			const s = io();
			setSocket(s);
			setIsConnected(true);
			// Listen for multiplayer events
			s.on('room_joined', () => setOpponentJoined(true));
			s.on('match_started', () => setMatchStarted(true));
			// Listen for notifications
			s.on('new_message', (msg: { content: string }) => {
				addNotification({
					id: `notif-${Date.now()}-${notificationIdRef.current++}`,
					type: 'message',
					content: msg.content,
					createdAt: new Date().toISOString(),
				});
			});
			s.on('friend_request', (data: { from: string }) => {
				addNotification({
					id: `notif-${Date.now()}-${notificationIdRef.current++}`,
					type: 'friend_request',
					content: `Friend request from ${data.from}`,
					createdAt: new Date().toISOString(),
				});
			});
			s.on(
				'achievement',
				(data: { achievement: string }) => {
					addNotification({
						id: `notif-${Date.now()}-${notificationIdRef.current++}`,
						type: 'achievement',
						content: `Achievement unlocked: ${data.achievement}`,
						createdAt: new Date().toISOString(),
					});
				}
			);
			return () => {
				s.disconnect();
			};
		}
	}, [socket]);

	// Request push notification permission on mount
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			'Notification' in window
		) {
			if (Notification.permission === 'default') {
				Notification.requestPermission();
			}
		}
	}, []);

	// --- Multiplayer actions (stubs, expand as needed) ---
	const createRoom = (code: string) => {
		if (socket) {
			socket.emit('create_room', { code });
			setRoomCode(code);
			setIsHost(true);
		}
	};
	const joinRoom = (code: string) => {
		if (socket) {
			socket.emit('join_room', { code });
			setRoomCode(code);
			setIsHost(false);
		}
	};
	const leaveRoom = () => {
		if (socket && roomCode) {
			socket.emit('leave_room', { code: roomCode });
			setRoomCode(null);
			setIsHost(false);
			setOpponentJoined(false);
		}
	};
	const startMatch = () => {
		if (socket && roomCode) {
			socket.emit('start_match', { code: roomCode });
			setMatchStarted(true);
		}
	};

	const value: MultiplayerContextType = {
		socket,
		roomCode,
		isHost,
		isConnected,
		matchStarted,
		opponentJoined,
		notifications,
		setRoomCode,
		createRoom,
		joinRoom,
		leaveRoom,
		startMatch,
		addNotification,
		markNotificationRead,
	};

	return (
		<MultiplayerContext.Provider value={value}>
			{children}
		</MultiplayerContext.Provider>
	);
};

// Add this function to trigger an achievement notification
export function notifyAchievement(
	achievementLabel: string,
	addNotification: (n: Notification) => void
) {
	const notification: Notification = {
		id: `achievement-${Date.now()}`,
		type: 'achievement',
		content: `Achievement unlocked: ${achievementLabel}`,
		createdAt: new Date().toISOString(),
		read: false,
	};
	addNotification(notification);
	// Browser push notification
	if (
		typeof window !== 'undefined' &&
		window.Notification &&
		Notification.permission === 'granted'
	) {
		new Notification(notification.content, {
			icon: '/logo.svg',
			badge: '/logo.svg',
			body: 'You just earned a new achievement!',
		});
	}
}
