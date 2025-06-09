import React, {
	useState,
	useRef,
	useEffect,
	useContext,
} from 'react';
import { Modal } from './Modal';
import {
	UserSettingsContext,
	filterProfanity,
} from './UserSettingsProvider';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addMatchMessage } from '../../store/matchChatSlice';
import {
	scrollToBottom,
	createChatMessage,
	filterProfanityStub,
} from '../../utils/helpers';

const QUICKFIRE_MESSAGES = [
	'You\u2019ll regret that.',
	'GG \ud83d\udd25',
	'Too easy.',
	'Nice try!',
	'\ud83d\udc80',
	'\ud83d\udc51',
	'\ud83d\udca3',
	'\ud83d\ude31',
	'\ud83c\udfaf',
];

interface MatchChatMessage {
	id: string;
	sender: string;
	content: string;
	type: 'text' | 'emoji' | 'quickfire';
	timestamp: number;
}

interface MatchChatWindowProps {
	open: boolean;
	onClose: () => void;
	matchId: string;
	userId: string;
}

const MatchChatWindow: React.FC<MatchChatWindowProps> = (
	props
) => {
	const { open, onClose, matchId, userId } = props;
	const [input, setInput] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { settings } = useContext(UserSettingsContext);
	const dispatch = useDispatch();
	const matchMessages = useSelector(
		(state: RootState) =>
			state.matchChat.messages[matchId] || []
	);

	useEffect(() => {
		scrollToBottom(messagesEndRef);
	}, [matchMessages]);

	const filter = settings?.profanityFilter
		? filterProfanity
		: filterProfanityStub;
	const filteredMessages = settings?.profanityFilter
		? matchMessages.map((msg) => ({
				...msg,
				content: filterProfanity(msg.content),
		  }))
		: matchMessages;

	const handleSend = (
		content: string,
		type: 'text' | 'emoji' | 'quickfire' = 'text'
	) => {
		if (!content.trim()) return;
		const filteredContent = filter(content);
		const msg = createChatMessage({
			senderId: userId,
			content: filteredContent,
			type,
			// Match chat message shape is slightly different, but createChatMessage is extensible
			extra: { timestamp: Date.now(), type },
		});
		dispatch(
			addMatchMessage({
				matchId,
				message: {
					...msg,
					content: filteredContent,
					sender: userId,
					type,
					timestamp: Date.now(),
				},
			})
		);
		setInput('');
	};

	if (!settings?.chatEnabled) return null;

	return (
		<Modal
			open={open}
			onClose={onClose}
			contentClassName='match-chat-modal-content'
		>
			<div className='match-chat-window'>
				<div className='match-chat-messages'>
					{filteredMessages.map((msg) => (
						<div
							key={msg.id}
							className={`match-chat-message match-chat-message--${
								msg.sender === userId ? 'self' : 'other'
							}`}
						>
							<span>{msg.content}</span>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
				<div className='match-chat-quickfire'>
					{QUICKFIRE_MESSAGES.map((qf) => (
						<button
							key={qf}
							onClick={() => handleSend(qf, 'quickfire')}
							className='match-chat-quickfire-btn'
						>
							{qf}
						</button>
					))}
				</div>
				<form
					className='match-chat-input-row'
					onSubmit={(e) => {
						e.preventDefault();
						handleSend(input, 'text');
					}}
				>
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder='Type a message or emoji...'
						className='match-chat-input'
						maxLength={100}
					/>
					<button
						type='submit'
						className='match-chat-send-btn'
					>
						Send
					</button>
				</form>
			</div>
		</Modal>
	);
};

// Architectural note: This component is modular, uses shared helpers, and is ready for extension (e.g., emoji, file sharing, etc.)
export default MatchChatWindow;
