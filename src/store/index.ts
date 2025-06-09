import { configureStore } from '@reduxjs/toolkit';
import customizationReducer from './customizationSlice';
import friendsReducer from './friendsSlice';
import multiplayerReducer from './multiplayerSlice';
import gameReducer from './gameSlice';
import achievementsReducer from './achievementsSlice';
import notificationsReducer from './notificationsSlice';
import browsingReducer from './browsingSlice';
import matchChatReducer from './matchChatSlice';

export const store = configureStore({
	reducer: {
		customization: customizationReducer,
		friends: friendsReducer,
		multiplayer: multiplayerReducer,
		game: gameReducer,
		achievements: achievementsReducer,
		notifications: notificationsReducer,
		browsing: browsingReducer,
		matchChat: matchChatReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
