import React, {
	useEffect,
	useRef,
	useState,
	useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
	addMessage,
	clearUnread,
} from '../../store/friendsSlice';
import {
	UserSettingsContext,
	filterProfanity,
} from './UserSettingsProvider';

interface InMatchChatWindowProps {
	matchId: string;
	friendId: string;
	onClose: () => void;
}

const InMatchChatWindow: React.FC<
	InMatchChatWindowProps
> = ({ matchId, friendId, onClose }) => {
	const dispatch = useDispatch();
	const chatHistory = useSelector(
		(state: RootState) => state.friends.chatHistory
	);
	const { settings } = useContext(UserSettingsContext);
	const [message, setMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const chatKey = `${matchId}:${friendId}`;

	useEffect(() => {
		dispatch(clearUnread(chatKey));
	}, [chatKey, dispatch]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
		});
	}, [chatHistory[chatKey]]);

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim()) {
			const filteredContent = settings.profanityFilter
				? filterProfanity(message.trim())
				: message.trim();
			const msg = {
				id: Math.random().toString(36).slice(2),
				senderId: 'me', // Replace with actual userId if available
				message: filteredContent,
				sentAt: new Date().toISOString(),
				expiresAt: '',
				groupId: undefined,
				receiverId: friendId,
				system: false,
			};
			dispatch(
				addMessage({ chatId: chatKey, message: msg })
			);
			setMessage('');
		}
	};

	const filteredMessages = settings.profanityFilter
		? (chatHistory[chatKey] || []).map((msg) => ({
				...msg,
				message: filterProfanity(msg.message),
		  }))
		: chatHistory[chatKey] || [];

	if (!settings.chatEnabled) return null;

	return (
		<div className='inmatch-chat-window'>
			<div className='inmatch-chat-header'>
				<span>Match Chat</span>
				<button onClick={onClose}>×</button>
			</div>
			<div className='inmatch-chat-messages'>
				{filteredMessages.map((msg: any) => (
					<div
						key={msg.id}
						className={`chat-message${
							msg.system
								? ' system'
								: msg.senderId === friendId
								? ' friend'
								: ' self'
						}`}
					>
						<span className='chat-message-text'>
							{msg.message}
						</span>
						<span className='chat-message-time'>
							{new Date(msg.sentAt).toLocaleTimeString()}
						</span>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<form
				className='inmatch-chat-input-row'
				onSubmit={handleSend}
			>
				<input
					type='text'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Type a message...'
					className='inmatch-chat-input'
				/>
				<button
					type='submit'
					className='inmatch-chat-send-btn'
				>
					Send
				</button>
			</form>
			<div className='inmatch-chat-expiry-note'>
				Messages expire after match ends.
			</div>
		</div>
	);
};

export default InMatchChatWindow;
