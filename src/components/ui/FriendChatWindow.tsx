import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
	addMessage,
	clearUnread,
} from '../../store/friendsSlice';

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
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
		});
	}, [chatHistory[chatId]]);

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim()) {
			const msg = {
				id: Math.random().toString(36).slice(2),
				senderId: 'me', // Replace with actual userId if available
				message: message.trim(),
				sentAt: new Date().toISOString(),
				expiresAt: '',
				groupId: isGroup ? chatId : undefined,
				receiverId: isGroup ? undefined : chatId,
			};
			dispatch(addMessage({ chatId, message: msg }));
			setMessage('');
		}
	};

	const messages = chatHistory[chatId] || [];

	return (
		<div className='friend-chat-window floating-chat-dock'>
			<div className='friend-chat-header'>
				{isGroup ? (
					<div className='friend-chat-group-header'>
						<span className='friend-chat-group-name'>
							{group?.name}
						</span>
						<span className='friend-chat-group-members'>
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
					<div className='friend-chat-avatar'>
						{friend?.username}
					</div>
				)}
				<button
					className='friend-chat-close-btn'
					onClick={onClose}
				>
					×
				</button>
			</div>
			<div className='friend-chat-messages'>
				{messages.map((msg: any) => (
					<div
						key={msg.id}
						className={`friend-chat-message${
							msg.senderId === 'me' ? ' self' : ''
						}`}
					>
						<span className='friend-chat-message-sender'>
							{msg.senderId === 'me'
								? 'You'
								: friends.find((f) => f.id === msg.senderId)
										?.username || msg.senderId}
						</span>
						<span className='friend-chat-message-text'>
							{msg.message}
						</span>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<form
				className='friend-chat-input-row'
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
					className='friend-chat-input'
				/>
				<button
					type='submit'
					className='friend-chat-send-btn'
				>
					Send
				</button>
			</form>
		</div>
	);
};

export default FriendChatWindow;
