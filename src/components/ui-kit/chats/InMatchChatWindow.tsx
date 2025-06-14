import React, {
	useEffect,
	useRef,
	useState,
	useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import {
	addMessage,
	clearUnread,
} from '../../../store/friendsSlice';
import { UserSettingsContext } from '../providers';
import { filterProfanityStub as filterProfanity } from '../../../utils/helpers';
import {
	scrollToBottom,
	createChatMessage,
} from '../../../utils/helpers';
import styles from '../../../styles/InMatchChatWindow.module.scss';

interface InMatchChatWindowProps {
	friendId: string;
	onClose: () => void;
}

const InMatchChatWindow: React.FC<
	InMatchChatWindowProps
> = ({ friendId, onClose }) => {
	const dispatch = useDispatch();
	const { settings } = useContext(UserSettingsContext);
	const [message, setMessage] = useState('');
	const endOfMessagesRef = useRef(null);

	const friend = useSelector((state: RootState) =>
		state.friends.friends.find((f) => f.id === friendId)
	);
	const messages = useSelector(
		(state: RootState) =>
			state.friends.chatHistory[friendId] || []
	);

	useEffect(() => {
		if (friendId) {
			dispatch(clearUnread(friendId));
		}
	}, [friendId, dispatch]);

	useEffect(() => {
		scrollToBottom(endOfMessagesRef);
	}, [messages]);

	const handleSend = () => {
		if (message.trim()) {
			const newMessage = createChatMessage({
				senderId: 'me', // TODO: replace with actual userId from session
				content: message.trim(),
				type: 'text',
				extra: { receiverId: friendId },
			});
			dispatch(
				addMessage({
					chatId: friendId,
					message: newMessage,
				})
			);
			setMessage('');
		}
	};

	return (
		<div className={styles.inMatchChatWindow}>
			<div className={styles.inMatchChatHeader}>
				In-Match Chat
				<button onClick={onClose} aria-label='Close chat'>
					×
				</button>
			</div>
			<div className={styles.inMatchChatMessages}>
				{messages.map((msg: any) => (
					<div
						key={msg.id}
						className={
							msg.senderId === 'me'
								? styles.chatMessageSelf
								: styles.chatMessageFriend
						}
					>
						<span className={styles.chatMessageText}>
							{filterProfanity(msg.message)}
						</span>
						<span className={styles.chatMessageTime}>
							{msg.sentAt
								? new Date(msg.sentAt).toLocaleTimeString()
								: ''}
						</span>
					</div>
				))}
				<div ref={endOfMessagesRef} />
			</div>
			<form
				className={styles.inMatchChatInputRow}
				onSubmit={(e) => {
					e.preventDefault();
					handleSend();
				}}
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
		</div>
	);
};

export default InMatchChatWindow;
