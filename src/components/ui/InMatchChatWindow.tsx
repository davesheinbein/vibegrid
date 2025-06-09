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
import {
	scrollToBottom,
	createChatMessage,
	filterProfanityStub,
} from '../../utils/helpers';
import styles from '../../styles/InMatchChatWindow.module.scss';

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
		scrollToBottom(messagesEndRef);
	}, [chatHistory[chatKey]]);

	// TODO: Replace 'me' with actual userId from auth/session
	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim()) {
			const filter = settings?.profanityFilter
				? filterProfanity
				: filterProfanityStub;
			const filteredContent = filter(message.trim());
			const msg = createChatMessage({
				senderId: 'me', // Replace with actual userId
				content: filteredContent,
				extra: {
					receiverId: friendId,
					groupId: undefined,
				},
			});
			dispatch(
				addMessage({ chatId: chatKey, message: msg })
			);
			setMessage('');
		}
	};

	const filteredMessages =
		(settings?.profanityFilter
			? (chatHistory[chatKey] || []).map((msg) => ({
					...msg,
					message: filterProfanity(msg.message),
			  }))
			: chatHistory[chatKey]) || [];

	if (!settings?.chatEnabled) return null;

	return (
		<div className={styles.inMatchChatWindow}>
			<div className={styles.inMatchChatHeader}>
				<span>Match Chat</span>
				<button onClick={onClose}>×</button>
			</div>
			<div className={styles.inMatchChatMessages}>
				{filteredMessages.map((msg: any) => (
					<div
						key={msg.id}
						className={
							styles.chatMessage +
							(msg.system
								? ' ' + styles.chatMessageSystem
								: msg.senderId === friendId
								? ' ' + styles.chatMessageFriend
								: ' ' + styles.chatMessageSelf)
						}
					>
						<span className={styles.chatMessageText}>
							{msg.message}
						</span>
						<span className={styles.chatMessageTime}>
							{new Date(msg.sentAt).toLocaleTimeString()}
						</span>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<form
				className={styles.inMatchChatInputRow}
				onSubmit={handleSend}
			>
				<input
					type='text'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Type a message...'
					className={styles.inMatchChatInput}
				/>
				<button
					type='submit'
					className={styles.inMatchChatSendBtn}
				>
					Send
				</button>
			</form>
			<div className={styles.inMatchChatExpiryNote}>
				Messages expire after match ends.
			</div>
		</div>
	);
};

// Architectural note: This component is modular, uses shared helpers, and is ready for extension (e.g., emoji, file sharing, etc.)
export default InMatchChatWindow;
