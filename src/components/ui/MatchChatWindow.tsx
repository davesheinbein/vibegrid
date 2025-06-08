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

const QUICKFIRE_MESSAGES = [
	'You’ll regret that.',
	'GG 🔥',
	'Too easy.',
	'Nice try!',
	'💀',
	'👑',
	'💣',
	'😱',
	'🎯',
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
	sendMessage: (
		msg: Omit<MatchChatMessage, 'id' | 'timestamp'>
	) => void;
	messages: MatchChatMessage[];
}

const MatchChatWindow: React.FC<MatchChatWindowProps> = (
	props
) => {
	const { settings } = useContext(UserSettingsContext);
	const {
		open,
		onClose,
		matchId,
		userId,
		sendMessage,
		messages,
	} = props;
	const [input, setInput] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [messages]);

	// Filter incoming messages if profanityFilter is enabled
	const filteredMessages = settings.profanityFilter
		? messages.map((msg) => ({
				...msg,
				content: filterProfanity(msg.content),
		  }))
		: messages;

	const handleSend = (
		content: string,
		type: 'text' | 'emoji' | 'quickfire' = 'text'
	) => {
		if (!content.trim()) return;
		// When sending a message, filter if enabled
		const filteredContent = settings.profanityFilter
			? filterProfanity(content)
			: content;
		sendMessage({
			sender: userId,
			content: filteredContent,
			type,
		});
		setInput('');
	};

	// If chat is disabled, render nothing or a message
	if (!settings.chatEnabled) return null;

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

export default MatchChatWindow;
