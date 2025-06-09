import {
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';

export interface Notification {
	id: string;
	message: string;
	type: 'info' | 'success' | 'error' | 'warning';
	createdAt: string;
	read: boolean;
}

export interface NotificationsState {
	notifications: Notification[];
}

const initialState: NotificationsState = {
	notifications: [],
};

const notificationsSlice = createSlice({
	name: 'notifications',
	initialState,
	reducers: {
		addNotification(
			state,
			action: PayloadAction<Notification>
		) {
			state.notifications.unshift(action.payload);
		},
		markAsRead(state, action: PayloadAction<string>) {
			const n = state.notifications.find(
				(n) => n.id === action.payload
			);
			if (n) n.read = true;
		},
		removeNotification(
			state,
			action: PayloadAction<string>
		) {
			state.notifications = state.notifications.filter(
				(n) => n.id !== action.payload
			);
		},
		clearNotifications(state) {
			state.notifications = [];
		},
	},
});

export const {
	addNotification,
	markAsRead,
	removeNotification,
	clearNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
