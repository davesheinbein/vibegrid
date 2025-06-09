import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
	addMessage,
	clearUnread,
} from '../../store/friendsSlice';
import {
	scrollToBottom,
	createChatMessage,
	filterProfanityStub,
} from '../../utils/helpers';
import styles from '../../styles/FriendChatWindow.module.scss';

interface FriendChatWindowProps {
	chatId: string; // can be userId (DM) or groupId (group chat)
	onClose: () => void;
}

const FriendChatWindow: React.FC<FriendChatWindowProps> = ({
	chatId,
	onClose,
}) => {
	const dispatch = useDispatch();
	const chatHistory = useSelector(
		(state: RootState) => state.friends.chatHistory
	);
	const friends = useSelector(
		(state: RootState) => state.friends.friends
	);
	const groups = useSelector(
		(state: RootState) => state.friends.groups
	);
	const [message, setMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const group = groups.find((g) => g.id === chatId);
	const isGroup = !!group;
	const friend = !isGroup
		? friends.find((f) => f.id === chatId)
		: undefined;

	useEffect(() => {
		dispatch(clearUnread(chatId));
	}, [chatId, dispatch]);

	useEffect(() => {
		scrollToBottom(messagesEndRef);
	}, [chatHistory[chatId]]);

	// TODO: Replace 'me' with actual userId from auth/session
	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim()) {
			const msg = createChatMessage({
				senderId: 'me', // Replace with actual userId
				content: message.trim(),
				extra: {
					groupId: isGroup ? chatId : undefined,
					receiverId: isGroup ? undefined : chatId,
				},
			});
			dispatch(addMessage({ chatId, message: msg }));
			setMessage('');
		}
	};

	const messages = chatHistory[chatId] || [];

	return (
		<div className={styles.friendChatWindow}>
			<div className={styles.friendChatHeader}>
				{isGroup ? (
					<div>
						<span className={styles.friendChatTitle}>
							{group?.name}
						</span>
						<span>
							{group?.memberIds
								.map(
									(id) =>
										friends.find((f) => f.id === id)
											?.username || id
								)
								.join(', ')}
						</span>
					</div>
				) : (
					<div className={styles.friendChatAvatar}>
						{friend?.username}
					</div>
				)}
				<button
					className={styles.friendChatCloseBtn}
					onClick={onClose}
				>
					×
				</button>
			</div>
			<div className={styles.friendChatMessages}>
				{messages.map((msg: any) => (
					<div
						key={msg.id}
						className={
							styles.friendChatMessage +
							(msg.senderId === 'me'
								? ' ' + styles.friendChatMessageOutbound
								: ' ' + styles.friendChatMessageInbound)
						}
					>
						<span>
							{msg.senderId === 'me'
								? 'You'
								: friends.find((f) => f.id === msg.senderId)
										?.username || msg.senderId}
						</span>
						<span>{msg.message}</span>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<form
				className={styles.friendChatInputRow}
				onSubmit={handleSend}
			>
				<input
					type='text'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder={
						isGroup
							? 'Message group...'
							: `Message ${friend?.username || ''}...`
					}
					className={styles.friendChatInput}
				/>
				<button
					type='submit'
					className={styles.friendChatSendBtn}
				>
					Send
				</button>
			</form>
		</div>
	);
};

// Architectural note: This component is modular, uses shared helpers, and is ready for extension (e.g., emoji, file sharing, etc.)
export default FriendChatWindow;
