import React, {
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useFriends } from './FriendsProvider';
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
	const {
		chatHistory,
		sendFriendMessage,
		loadChatHistory,
		clearUnread,
	} = useFriends();
	const { settings } = useContext(UserSettingsContext);
	const [message, setMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// For in-match chat, you may want to use a separate event/namespace
		loadChatHistory(`${matchId}:${friendId}`);
		clearUnread(`${matchId}:${friendId}`);
	}, [matchId, friendId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
		});
	}, [chatHistory[`${matchId}:${friendId}`]]);

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim()) {
			// When sending a message, filter if enabled
			const filteredContent =
				settings.profanityFilter &&
				filterProfanity(message.trim());
			sendFriendMessage(
				`${matchId}:${friendId}`,
				filteredContent
			);
			setMessage('');
		}
	};

	// Filter incoming messages if profanityFilter is enabled
	const filteredMessages = settings.profanityFilter
		? (chatHistory[`${matchId}:${friendId}`] || []).map(
				(msg) => ({
					...msg,
					message: filterProfanity(msg.message),
				})
		  )
		: chatHistory[`${matchId}:${friendId}`] || [];

	if (!settings.chatEnabled) return null;

	return (
		<div className='inmatch-chat-window'>
			<div className='inmatch-chat-header'>
				<span>Match Chat</span>
				<button onClick={onClose}>×</button>
			</div>
			<div className='inmatch-chat-messages'>
				{filteredMessages.map((msg) => (
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
