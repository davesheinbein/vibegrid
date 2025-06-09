import {
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';

export interface MultiplayerState {
	socketConnected: boolean;
	roomId: string | null;
	matchId: string | null;
	players: string[];
	notifications: string[];
	inMatch: boolean;
	matchData: any;
}

const initialState: MultiplayerState = {
	socketConnected: false,
	roomId: null,
	matchId: null,
	players: [],
	notifications: [],
	inMatch: false,
	matchData: null,
};

const multiplayerSlice = createSlice({
	name: 'multiplayer',
	initialState,
	reducers: {
		setSocketConnected(
			state,
			action: PayloadAction<boolean>
		) {
			state.socketConnected = action.payload;
		},
		setRoomId(state, action: PayloadAction<string | null>) {
			state.roomId = action.payload;
		},
		setMatchId(
			state,
			action: PayloadAction<string | null>
		) {
			state.matchId = action.payload;
		},
		setPlayers(state, action: PayloadAction<string[]>) {
			state.players = action.payload;
		},
		setNotifications(
			state,
			action: PayloadAction<string[]>
		) {
			state.notifications = action.payload;
		},
		setInMatch(state, action: PayloadAction<boolean>) {
			state.inMatch = action.payload;
		},
		setMatchData(state, action: PayloadAction<any>) {
			state.matchData = action.payload;
		},
		// ...other reducers as needed
	},
});

export const {
	setSocketConnected,
	setRoomId,
	setMatchId,
	setPlayers,
	setNotifications,
	setInMatch,
	setMatchData,
} = multiplayerSlice.actions;
export default multiplayerSlice.reducer;
