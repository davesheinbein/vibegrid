import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
	addMessage,
	clearUnread,
	setUnread,
} from '../../../store/friendsSlice';
import styles from '../../../styles/FriendChatWindow.module.scss';

const TYPING_INDICATOR = (
	<span className={styles.friendChatTypingIndicator}>
		<span className={styles.dot} />
		<span className={styles.dot} />
		<span className={styles.dot} />
	</span>
);

const formatDate = (dateStr: string) => {
	const d = new Date(dateStr);
	return d.toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
};

const FriendChatWindow: React.FC<{
	friendId: string;
	onClose: () => void;
}> = ({ friendId, onClose }) => {
	const dispatch = useDispatch();
	const [message, setMessage] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const [unread, setUnreadState] = useState(0);
	const endOfMessagesRef = useRef<HTMLDivElement>(null);
	const chatMessages = useSelector(
		(state: RootState) =>
			state.friends.chatHistory[friendId] || []
	);
	const friend = useSelector((state: RootState) =>
		state.friends.friends.find((f) => f.id === friendId)
	);
	const unreadCount = useSelector(
		(state: RootState) =>
			state.friends.unreadMessages[friendId] || 0
	);

	// Scroll to bottom on new message
	useEffect(() => {
		if (endOfMessagesRef.current) {
			endOfMessagesRef.current.scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [chatMessages]);

	// Unread badge logic
	useEffect(() => {
		if (document.hasFocus()) {
			dispatch(clearUnread(friendId));
			setUnreadState(0);
		} else {
			setUnreadState(unreadCount);
		}
	}, [chatMessages, unreadCount, friendId, dispatch]);

	// Simulate typing indicator (replace with socket event in real app)
	useEffect(() => {
		let timeout: NodeJS.Timeout;
		if (Math.random() < 0.1) {
			setIsTyping(true);
			timeout = setTimeout(() => setIsTyping(false), 1800);
		}
		return () => clearTimeout(timeout);
	}, [chatMessages]);

	// Group messages by date
	const grouped = chatMessages.reduce(
		(acc: Record<string, any[]>, msg) => {
			const date = formatDate(
				msg.sentAt || new Date().toISOString()
			);
			if (!acc[date]) acc[date] = [];
			acc[date].push(msg);
			return acc;
		},
		{}
	);
	const dates = Object.keys(grouped);

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;
		dispatch(
			addMessage({
				chatId: friendId,
				message: {
					id: Math.random().toString(36).slice(2),
					senderId: 'me', // TODO: use real userId
					receiverId: friendId,
					message,
					sentAt: new Date().toISOString(),
					expiresAt: '',
				},
			})
		);
		setMessage('');
	};

	return (
		<div className={styles.friendChatWindow}>
			<div className={styles.friendChatHeader}>
				<div className={styles.friendChatAvatar}>
					{/* Avatar or initials */}
					{friend?.username?.[0] || '?'}
					<span
						className={
							friend?.online
								? styles.onlineDot
								: styles.offlineDot
						}
					/>
				</div>
				<div className={styles.friendChatTitle}>
					{friend?.username || 'Friend'}
				</div>
				<button
					className={styles.friendChatCloseBtn}
					onClick={onClose}
					aria-label='Close chat'
				>
					×
				</button>
			</div>
			<div className={styles.friendChatMessages}>
				{dates.map((date) => (
					<React.Fragment key={date}>
						<div className={styles.friendChatDateDivider}>
							{date}
						</div>
						{grouped[date].map((msg, i) => (
							<div
								key={msg.id || i}
								className={
									msg.senderId === 'me'
										? styles.friendChatMessageOutbound
										: styles.friendChatMessageInbound
								}
							>
								<span
									className={styles.friendChatMessageText}
								>
									{msg.message}
								</span>
								<span
									className={styles.friendChatMessageTime}
								>
									{new Date(msg.sentAt).toLocaleTimeString(
										[],
										{
											hour: '2-digit',
											minute: '2-digit',
										}
									)}
								</span>
							</div>
						))}
					</React.Fragment>
				))}
				{isTyping && (
					<div
						className={styles.friendChatMessageInbound}
						style={{ minHeight: 28, opacity: 0.7 }}
					>
						{TYPING_INDICATOR}
					</div>
				)}
				<div ref={endOfMessagesRef} />
			</div>
			<form
				className={styles.friendChatInputRow}
				onSubmit={handleSend}
			>
				<input
					className={styles.friendChatInput}
					type='text'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Type a message...'
				/>
				<button
					className={styles.friendChatSendBtn}
					type='submit'
				>
					Send
				</button>
			</form>
			{unread > 0 && (
				<span className={styles.unreadBadge}>{unread}</span>
			)}
		</div>
	);
};

export default FriendChatWindow;
