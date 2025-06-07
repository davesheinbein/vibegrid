import React, { useEffect, useRef, useState } from 'react';
import { useFriends } from './FriendsProvider';

interface FriendChatWindowProps {
	friendId: string;
	onClose: () => void;
}

const FriendChatWindow: React.FC<FriendChatWindowProps> = ({
	friendId,
	onClose,
}) => {
	const {
		chatHistory,
		sendFriendMessage,
		loadChatHistory,
		clearUnread,
		friends,
	} = useFriends();
	const [message, setMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const friend = friends.find((f) => f.id === friendId);

	useEffect(() => {
		loadChatHistory(friendId);
		clearUnread(friendId);
	}, [friendId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
		});
	}, [chatHistory[friendId]]);

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim()) {
			sendFriendMessage(friendId, message);
			setMessage('');
		}
	};

	const messages = chatHistory[friendId] || [];

	return (
		<div className='friend-chat-window floating-chat-dock'>
			<div className='friend-chat-header'>
				<div className='friend-chat-avatar'>
					<span className='avatar-circle'>
						{friend?.username[0]?.toUpperCase() || '?'}
					</span>
					<span
						className={`status-dot ${
							friend?.online ? 'online' : 'offline'
						}`}
					></span>
				</div>
				<div className='friend-chat-title'>
					{friend?.username}
				</div>
				<button
					className='friend-chat-close-btn'
					onClick={onClose}
					title='Close chat'
				>
					✖
				</button>
			</div>
			<div className='friend-chat-messages'>
				{messages.map((msg, i) => (
					<div
						key={msg.id || i}
						className={`friend-chat-message${
							msg.senderId === friendId
								? ' inbound'
								: ' outbound'
						}${msg.system ? ' system' : ''}`}
					>
						<span className='friend-chat-message-text'>
							{msg.message}
						</span>
						{/* TODO: Add emoji reactions, expiry badge, fade-out, etc. */}
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<form
				className='friend-chat-input-row'
				onSubmit={handleSend}
			>
				{/* Emoji picker placeholder */}
				{/* <button type="button" className="friend-chat-emoji-btn">😊</button> */}
				<input
					type='text'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Type a message...'
					className='friend-chat-input'
					autoComplete='off'
				/>
				<button
					type='submit'
					className='friend-chat-send-btn'
					disabled={!message.trim()}
				>
					Send
				</button>
			</form>
			<div className='friend-chat-expiry-note'>
				Messages expire after 24 hours. Expired chats show a
				system message.
			</div>
		</div>
	);
};

export default FriendChatWindow;
