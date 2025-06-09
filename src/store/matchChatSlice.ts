import {
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';

export interface MatchChatMessage {
	id: string;
	sender: string;
	content: string;
	type: 'text' | 'emoji' | 'quickfire';
	timestamp: number;
}

export interface MatchChatState {
	messages: Record<string, MatchChatMessage[]>; // matchId -> messages
}

const initialState: MatchChatState = {
	messages: {},
};

const matchChatSlice = createSlice({
	name: 'matchChat',
	initialState,
	reducers: {
		addMatchMessage(
			state,
			action: PayloadAction<{
				matchId: string;
				message: MatchChatMessage;
			}>
		) {
			const { matchId, message } = action.payload;
			if (!state.messages[matchId])
				state.messages[matchId] = [];
			state.messages[matchId].push(message);
		},
		setMatchMessages(
			state,
			action: PayloadAction<{
				matchId: string;
				messages: MatchChatMessage[];
			}>
		) {
			const { matchId, messages } = action.payload;
			state.messages[matchId] = messages;
		},
		clearMatchMessages(
			state,
			action: PayloadAction<string>
		) {
			delete state.messages[action.payload];
		},
	},
});

export const {
	addMatchMessage,
	setMatchMessages,
	clearMatchMessages,
} = matchChatSlice.actions;
export default matchChatSlice.reducer;
