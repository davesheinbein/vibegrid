import React, { useState } from 'react';

interface FriendCardProps {
	friend: {
		id: string;
		username: string;
		online: boolean;
		division?: string;
		tier?: string;
		inMatch?: boolean;
		idle?: boolean;
	};
	onChallenge: (id: string) => void;
	onMessage: (id: string) => void;
	onRemove: (id: string) => void;
	unreadCount?: number;
}

const getStatus = (friend: any) => {
	if (friend.online && friend.inMatch)
		return { text: 'In match', color: '#a259f7' };
	if (friend.online && friend.idle)
		return { text: 'Idle', color: '#fbbf24' };
	if (friend.online)
		return { text: 'Online', color: '#22c55e' };
	return { text: 'Offline', color: '#64748b' };
};

const STATUS_CLASS_MAP: Record<string, string> = {
	'In match': 'status-inmatch',
	'Idle': 'status-idle',
	'Online': 'status-online',
	'Offline': 'status-offline',
};

const FriendCard: React.FC<FriendCardProps> = ({
	friend,
	onChallenge,
	onMessage,
	onRemove,
	unreadCount = 0,
}) => {
	const [hover, setHover] = useState(false);
	const status = getStatus(friend);
	const statusClass =
		STATUS_CLASS_MAP[status.text] || 'status-offline';

	return (
		<div
			className={`friend-card${
				hover ? ' friend-card--hover' : ''
			}`}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div className='friend-card-header'>
				<span
					className={`friend-status-dot ${statusClass}`}
				/>
				<span className='friend-username'>
					{friend.username}
				</span>
				{unreadCount > 0 && (
					<span className='friend-unread'>
						{unreadCount}
					</span>
				)}
			</div>
			<div className='friend-card-status-text'>
				{status.text}
			</div>
			<div className='friend-card-actions'>
				<button
					className='friend-card-btn challenge-btn primary-btn'
					onClick={() => onChallenge(friend.id)}
				>
					Challenge
				</button>
				<button
					className='friend-card-btn secondary-btn'
					onClick={() => onMessage(friend.id)}
				>
					Message
				</button>
				<button
					className='friend-card-btn icon-btn'
					onClick={() => onRemove(friend.id)}
					aria-label='Remove friend'
				>
					&times;
				</button>
			</div>
		</div>
	);
};

export default FriendCard;
