import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useRef,
} from 'react';
import { io, Socket } from 'socket.io-client';

// Types
export interface Friend {
	id: string;
	username: string;
	online: boolean;
	division?: string;
	tier?: string;
}
export interface FriendRequest {
	id: string;
	from: Friend;
	to: Friend;
	status: 'pending' | 'accepted' | 'declined' | 'blocked';
	createdAt: string;
}
export interface FriendMessage {
	id: string;
	senderId: string;
	receiverId?: string; // For DMs
	groupId?: string; // For group messages
	message: string;
	sentAt: string;
	expiresAt: string;
	system?: boolean;
}
export interface Group {
	id: string;
	name: string;
	memberIds: string[];
	createdAt: string;
}
export interface Notification {
	id: string;
	type: 'message' | 'friend_request' | 'achievement';
	content: string;
	createdAt: string;
	read?: boolean;
}

interface FriendsContextType {
	friends: Friend[];
	requests: FriendRequest[];
	recentMatches: Friend[];
	onlineFriends: string[];
	unreadMessages: Record<string, number>; // chatId: count
	chatHistory: Record<string, FriendMessage[]>; // chatId: messages
	groups: Group[];
	notifications: Notification[];
	sendFriendRequest: (username: string) => void;
	acceptFriendRequest: (requestId: string) => void;
	declineFriendRequest: (requestId: string) => void;
	removeFriend: (friendId: string) => void;
	sendChallenge: (friendId: string) => void;
	acceptChallenge: (challengeId: string) => void;
	sendMessage: (chatId: string, message: string) => void;
	loadChatHistory: (chatId: string) => void;
	clearUnread: (chatId: string) => void;
	createGroup: (
		name: string,
		memberIds: string[]
	) => string;
	addNotification: (notification: Notification) => void;
	markNotificationRead: (id: string) => void;
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
}

const FriendsContext = createContext<
	FriendsContextType | undefined
>(undefined);

export const useFriends = () => {
	const ctx = useContext(FriendsContext);
	if (!ctx)
		throw new Error(
			'useFriends must be used within FriendsProvider'
		);
	return ctx;
};

export const FriendsProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [friends, setFriends] = useState<Friend[]>([]);
	const [requests, setRequests] = useState<FriendRequest[]>(
		[]
	);
	const [recentMatches, setRecentMatches] = useState<
		Friend[]
	>([]);
	const [onlineFriends, setOnlineFriends] = useState<
		string[]
	>([]);
	const [unreadMessages, setUnreadMessages] = useState<
		Record<string, number>
	>({});
	const [chatHistory, setChatHistory] = useState<
		Record<string, FriendMessage[]>
	>({});
	const [groups, setGroups] = useState<Group[]>([]);
	const [notifications, setNotifications] = useState<
		Notification[]
	>([]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		const s = io(
			process.env.NEXT_PUBLIC_SOCKET_URL ||
				'http://localhost:4000'
		);
		socketRef.current = s;
		// Listen for friend events
		s.on('friendList', setFriends);
		s.on('friendRequests', setRequests);
		s.on('recentMatches', setRecentMatches);
		s.on('friendOnline', (id: string) =>
			setOnlineFriends((f) => [...f, id])
		);
		s.on('friendOffline', (id: string) =>
			setOnlineFriends((f) => f.filter((fid) => fid !== id))
		);
		s.on('friendMessage', (msg: FriendMessage) => {
			setChatHistory((h) => ({
				...h,
				[msg.senderId]: [...(h[msg.senderId] || []), msg],
			}));
			setUnreadMessages((u) => ({
				...u,
				[msg.senderId]: (u[msg.senderId] || 0) + 1,
			}));
		});
		s.on(
			'chatHistory',
			({
				friendId,
				messages,
			}: {
				friendId: string;
				messages: FriendMessage[];
			}) => {
				setChatHistory((h) => ({
					...h,
					[friendId]: messages,
				}));
			}
		);
		// Cleanup
		return () => {
			s.disconnect();
		};
	}, []);

	// Actions
	const sendFriendRequest = (username: string) => {
		socketRef.current?.emit('sendFriendRequest', {
			username,
		});
	};
	const acceptFriendRequest = (requestId: string) => {
		socketRef.current?.emit('acceptFriendRequest', {
			requestId,
		});
	};
	const declineFriendRequest = (requestId: string) => {
		socketRef.current?.emit('declineFriendRequest', {
			requestId,
		});
	};
	const removeFriend = (friendId: string) => {
		socketRef.current?.emit('removeFriend', { friendId });
	};
	const sendChallenge = (friendId: string) => {
		socketRef.current?.emit('sendChallenge', { friendId });
	};
	const acceptChallenge = (challengeId: string) => {
		socketRef.current?.emit('acceptChallenge', {
			challengeId,
		});
	};
	const sendMessage = (chatId: string, message: string) => {
		// If chatId is a groupId, send to group; if userId, send DM
		// Implementation depends on backend/socket
		// Placeholder: just add to chatHistory
		const isGroup = groups.some((g) => g.id === chatId);
		const msg: FriendMessage = {
			id: Math.random().toString(36).slice(2),
			senderId: 'me', // Replace with actual userId
			groupId: isGroup ? chatId : undefined,
			receiverId: isGroup ? undefined : chatId,
			message,
			sentAt: new Date().toISOString(),
			expiresAt: '',
		};
		setChatHistory((prev) => ({
			...prev,
			[chatId]: [...(prev[chatId] || []), msg],
		}));
	};
	const loadChatHistory = (chatId: string) => {
		socketRef.current?.emit('loadChatHistory', {
			chatId,
		});
	};
	const clearUnread = (chatId: string) => {
		setUnreadMessages((u) => ({ ...u, [chatId]: 0 }));
	};
	const createGroup = (
		name: string,
		memberIds: string[]
	) => {
		const groupId = Math.random().toString(36).slice(2);
		const group: Group = {
			id: groupId,
			name,
			memberIds,
			createdAt: new Date().toISOString(),
		};
		setGroups((prev) => [...prev, group]);
		return groupId;
	};

	const addNotification = (notification: Notification) => {
		setNotifications((prev) => [notification, ...prev]);
	};

	const markNotificationRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) =>
				n.id === id ? { ...n, read: true } : n
			)
		);
	};

	// --- Notification wrappers ---
	// Wrap sendFriendRequest to add notification
	const originalSendFriendRequest = sendFriendRequest;
	const sendFriendRequestWithNotif = (username: string) => {
		originalSendFriendRequest(username);
		addNotification({
			id: Math.random().toString(36).slice(2),
			type: 'friend_request',
			content: `Friend request sent to ${username}`,
			createdAt: new Date().toISOString(),
		});
	};

	// Wrap sendMessage to add notification
	const originalSendMessage = sendMessage;
	const sendMessageWithNotif = (
		chatId: string,
		message: string
	) => {
		originalSendMessage(chatId, message);
		const isGroup = groups.some((g) => g.id === chatId);
		addNotification({
			id: Math.random().toString(36).slice(2),
			type: 'message',
			content: `New message sent${
				isGroup ? ' to group' : ''
			}`,
			createdAt: new Date().toISOString(),
		});
	};

	// Example: trigger notification on achievement (stub)
	const unlockAchievement = (title: string) => {
		addNotification({
			id: Math.random().toString(36).slice(2),
			type: 'achievement',
			content: `Achievement unlocked: ${title}`,
			createdAt: new Date().toISOString(),
		});
	};

	const toggleSidebar = () => setIsSidebarOpen((v) => !v);

	return (
		<FriendsContext.Provider
			value={{
				friends,
				requests,
				recentMatches,
				onlineFriends,
				unreadMessages,
				chatHistory,
				groups,
				notifications,
				addNotification,
				markNotificationRead,
				sendFriendRequest: sendFriendRequestWithNotif,
				acceptFriendRequest,
				declineFriendRequest,
				removeFriend,
				sendChallenge,
				acceptChallenge,
				sendMessage: sendMessageWithNotif,
				loadChatHistory,
				clearUnread,
				createGroup,
				isSidebarOpen,
				toggleSidebar,
			}}
		>
			{children}
		</FriendsContext.Provider>
	);
};
