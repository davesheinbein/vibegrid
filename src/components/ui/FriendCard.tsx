import React, { useState } from 'react';

interface FriendCardProps {
	friend: {
		id: string;
		username: string;
		online: boolean;
		division?: string;
		tier?: string;
	};
	onChallenge: (id: string) => void;
	onMessage: (id: string) => void;
	onRemove: (id: string) => void;
	unreadCount?: number;
}

const FriendCard: React.FC<FriendCardProps> = ({
	friend,
	onChallenge,
	onMessage,
	onRemove,
	unreadCount = 0,
}) => {
	const [hover, setHover] = useState(false);
	const statusColor = friend.online
		? 'status-green'
		: 'status-grey';

	return (
		<div
			className={`friend-card glassy-friend-card${
				hover ? ' hovered' : ''
			}`}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div className='friend-card-avatar'>
				<span
					className={`avatar-circle ${statusColor} animated-status-ring`}
				/>
				<span
					className={`status-dot ${
						friend.online ? 'online' : 'offline'
					} animated-status-dot`}
				/>
				{unreadCount > 0 && (
					<span className='unread-badge animated-unread-badge'>
						{unreadCount}
					</span>
				)}
			</div>
			<div className='friend-card-info'>
				<span className='friend-card-username'>
					{friend.username}
				</span>
				{friend.division && (
					<span className='friend-card-rank'>
						{friend.division} {friend.tier}
					</span>
				)}
				<div className='friend-card-actions'>
					<button
						className='friend-card-btn'
						onClick={() => onChallenge(friend.id)}
						title='Challenge'
					>
						⚔️
					</button>
					<button
						className='friend-card-btn'
						onClick={() => onMessage(friend.id)}
						title='Message'
					>
						💬
					</button>
					<button
						className='friend-card-btn'
						onClick={() => onRemove(friend.id)}
						title='Remove'
					>
						❌
					</button>
				</div>
			</div>
		</div>
	);
};

// This component is modular, props-driven, and ready for extension (e.g., avatars, badges, etc.)
export default FriendCard;
