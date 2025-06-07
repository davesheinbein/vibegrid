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
	receiverId: string;
	message: string;
	sentAt: string;
	expiresAt: string;
	system?: boolean;
}

interface FriendsContextType {
	friends: Friend[];
	requests: FriendRequest[];
	recentMatches: Friend[];
	onlineFriends: string[];
	unreadMessages: Record<string, number>;
	chatHistory: Record<string, FriendMessage[]>;
	sendFriendRequest: (username: string) => void;
	acceptFriendRequest: (requestId: string) => void;
	declineFriendRequest: (requestId: string) => void;
	removeFriend: (friendId: string) => void;
	sendChallenge: (friendId: string) => void;
	acceptChallenge: (challengeId: string) => void;
	sendFriendMessage: (
		friendId: string,
		message: string
	) => void;
	loadChatHistory: (friendId: string) => void;
	clearUnread: (friendId: string) => void;
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
	const sendFriendMessage = (
		friendId: string,
		message: string
	) => {
		socketRef.current?.emit('friendMessage', {
			friendId,
			message,
		});
	};
	const loadChatHistory = (friendId: string) => {
		socketRef.current?.emit('loadChatHistory', {
			friendId,
		});
	};
	const clearUnread = (friendId: string) => {
		setUnreadMessages((u) => ({ ...u, [friendId]: 0 }));
	};

	return (
		<FriendsContext.Provider
			value={{
				friends,
				requests,
				recentMatches,
				onlineFriends,
				unreadMessages,
				chatHistory,
				sendFriendRequest,
				acceptFriendRequest,
				declineFriendRequest,
				removeFriend,
				sendChallenge,
				acceptChallenge,
				sendFriendMessage,
				loadChatHistory,
				clearUnread,
			}}
		>
			{children}
		</FriendsContext.Provider>
	);
};
