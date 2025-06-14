import {
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';
import { AppDispatch } from './index';
// import { io, Socket } from 'socket.io-client'; // Disabled until Socket.IO server is set up

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
	receiverId?: string;
	groupId?: string;
	message: string;
	sentAt: string;
	expiresAt: string;
	system?: boolean;
}
export interface Group {
	id: string;
	name: string;
	memberIds: string[];
}
export interface FriendsState {
	friends: Friend[];
	requests: FriendRequest[];
	chatHistory: Record<string, FriendMessage[]>;
	unreadMessages: Record<string, number>;
	groups: Group[];
	isSidebarOpen: boolean;
}

const initialState: FriendsState = {
	friends: [],
	requests: [],
	chatHistory: {},
	unreadMessages: {},
	groups: [],
	isSidebarOpen: false,
};

const friendsSlice = createSlice({
	name: 'friends',
	initialState,
	reducers: {
		setFriends(state, action: PayloadAction<Friend[]>) {
			state.friends = action.payload;
		},
		setRequests(
			state,
			action: PayloadAction<FriendRequest[]>
		) {
			state.requests = action.payload;
		},
		setGroups(state, action: PayloadAction<Group[]>) {
			state.groups = action.payload;
		},
		setSidebarOpen(state, action: PayloadAction<boolean>) {
			state.isSidebarOpen = action.payload;
		},
		addMessage(
			state,
			action: PayloadAction<{
				chatId: string;
				message: FriendMessage;
			}>
		) {
			const { chatId, message } = action.payload;
			if (!state.chatHistory[chatId])
				state.chatHistory[chatId] = [];
			state.chatHistory[chatId].push(message);
		},
		setUnread(
			state,
			action: PayloadAction<{
				chatId: string;
				count: number;
			}>
		) {
			state.unreadMessages[action.payload.chatId] =
				action.payload.count;
		},
		clearUnread(state, action: PayloadAction<string>) {
			state.unreadMessages[action.payload] = 0;
		},
		// ...other reducers as needed
	},
});

// Thunks for async/socket actions
export const sendFriendRequest =
	(username: string) => (dispatch: AppDispatch) => {
		// Socket.IO disabled until server is implemented
		console.log('sendFriendRequest called for:', username);
		// TODO: Implement REST API call or Socket.IO when server is ready
		/* 
		const socket: Socket = io(
			process.env.NEXT_PUBLIC_SOCKET_URL ||
				'http://localhost:4000'
		);
		socket.emit('sendFriendRequest', { username });
		socket.disconnect();
		*/
	};

export const sendChallenge =
	(friendId: string) => (dispatch: AppDispatch) => {
		// Socket.IO disabled until server is implemented
		console.log('sendChallenge called for:', friendId);
		/* 
		const socket: Socket = io(
			process.env.NEXT_PUBLIC_SOCKET_URL ||
				'http://localhost:4000'
		);
		socket.emit('sendChallenge', { friendId });
		socket.disconnect();
		*/
	};

export const removeFriend =
	(friendId: string) => (dispatch: AppDispatch) => {
		// Socket.IO disabled until server is implemented
		console.log('removeFriend called for:', friendId);
		/* 
		const socket: Socket = io(
			process.env.NEXT_PUBLIC_SOCKET_URL ||
				'http://localhost:4000'
		);
		socket.emit('removeFriend', { friendId });
		socket.disconnect();
		*/
	};

export const {
	setFriends,
	setRequests,
	setGroups,
	setSidebarOpen,
	addMessage,
	setUnread,
	clearUnread,
} = friendsSlice.actions;
export default friendsSlice.reducer;
