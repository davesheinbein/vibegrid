import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { addMatchMessage } from '../../../store/matchChatSlice';
import { playSound } from '../../../utils/sound';
import styles from '../../../styles/InMatchChatWindow.module.scss';

const TYPING_INDICATOR_ANIMATION = (
	<span className={styles.inMatchChatTypingIndicator}>
		<span className={styles.dot} />
		<span className={styles.dot} />
		<span className={styles.dot} />
	</span>
);

const MatchChatWindow: React.FC<{
	open: boolean;
	onClose: () => void;
	matchId: string;
	userId: string;
}> = ({ open, onClose, matchId, userId }) => {
	const dispatch = useDispatch();
	const messages = useSelector(
		(state: RootState) =>
			state.matchChat.messages[matchId] || []
	);
	const [message, setMessage] = useState('');
	const [typing, setTyping] = useState(false);
	const [unread, setUnread] = useState(0);
	const endOfMessagesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (open) setUnread(0);
		else if (messages.length > 0) setUnread((u) => u + 1);
	}, [open, messages.length]);

	useEffect(() => {
		if (open && endOfMessagesRef.current) {
			endOfMessagesRef.current.scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [messages, open]);

	useEffect(() => {
		if (
			messages.length &&
			messages[messages.length - 1].sender !== userId
		) {
			playSound('emote'); // Use emote sound for new message cue
		}
	}, [messages, userId]);

	const handleSend = () => {
		if (!message.trim()) return;
		dispatch(
			addMatchMessage({
				matchId,
				message: {
					id: Math.random().toString(36).slice(2),
					sender: userId,
					content: message,
					type: 'text',
					timestamp: Date.now(),
				},
			})
		);
		setMessage('');
		setTyping(false);
	};

	return (
		<div
			className={styles.inMatchChatWindow}
			style={{
				backdropFilter: 'blur(12px) saturate(180%)',
				background: 'rgba(255,255,255,0.98)',
				borderRadius: 18,
				boxShadow:
					'0 8px 32px 0 #00308733, 0 2px 8px 0 #e3eaff33',
				animation: 'fadeIn 0.18s',
			}}
		>
			<div className={styles.inMatchChatHeader}>
				<span>Match Chat</span>
				<button
					className={styles.inMatchChatCloseBtn}
					onClick={onClose}
					aria-label='Close chat'
				>
					✖️
				</button>
			</div>
			<div className={styles.inMatchChatMessages}>
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={
							msg.type === 'system'
								? styles.chatMessageSystem
								: msg.sender === userId
								? styles.chatMessageSelf
								: styles.chatMessageFriend
						}
						style={{ animation: 'chat-bounce-in 0.18s' }}
					>
						<span className={styles.chatMessageText}>
							{msg.content}
						</span>
						<span className={styles.chatMessageTime}>
							{new Date(msg.timestamp).toLocaleTimeString(
								[],
								{
									hour: '2-digit',
									minute: '2-digit',
								}
							)}
						</span>
					</div>
				))}
				{typing && (
					<div
						className={styles.chatMessageFriend}
						style={{ opacity: 0.7 }}
					>
						{TYPING_INDICATOR_ANIMATION}
					</div>
				)}
				<div ref={endOfMessagesRef} />
			</div>
			<div className={styles.inMatchChatInputRow}>
				<input
					className={styles.inMatchChatInput}
					value={message}
					onChange={(e) => {
						setMessage(e.target.value);
						setTyping(!!e.target.value);
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleSend();
					}}
					placeholder='Type a message...'
				/>
				<button
					className={styles.inMatchChatSendBtn}
					onClick={handleSend}
					disabled={!message.trim()}
				>
					Send
				</button>
			</div>
			{unread > 0 && !open && (
				<span className={styles.unreadBadge}>{unread}</span>
			)}
		</div>
	);
};

export default MatchChatWindow;
