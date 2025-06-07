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
		: 'status-grey'; // Add yellow/red as needed
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
				>
					{/* Avatar image here */}
				</span>
				<span
					className={`status-dot ${
						friend.online ? 'online' : 'offline'
					} animated-status-dot`}
				></span>
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
				{friend.division && friend.tier && (
					<span className='friend-card-rank'>
						{friend.division} {friend.tier}
					</span>
				)}
			</div>
			<div className='friend-card-actions'>
				<button
					className='friend-card-btn challenge-btn glassy-action-btn'
					title='Challenge'
					onClick={() => onChallenge(friend.id)}
				>
					⚔
				</button>
				<button
					className='friend-card-btn message-btn glassy-action-btn'
					title='Message'
					onClick={() => onMessage(friend.id)}
				>
					💬
				</button>
				<button
					className='friend-card-btn remove-btn glassy-action-btn'
					title='Remove'
					onClick={() => onRemove(friend.id)}
				>
					✖
				</button>
			</div>
			{hover && (
				<div className='friend-hover-card glassy-hover-card'>
					<div className='hover-avatar animated-border'>
						<span
							className={`avatar-circle ${statusColor} animated-status-ring`}
						></span>
					</div>
					<div className='hover-info'>
						<span className='hover-username'>
							{friend.username}
						</span>
						{friend.division && friend.tier && (
							<span className='hover-rank'>
								{friend.division} {friend.tier}
							</span>
						)}
						<span
							className={`hover-status-dot ${
								friend.online ? 'online' : 'offline'
							} animated-status-dot`}
						></span>
					</div>
					<div className='hover-actions'>
						<button
							className='hover-action-btn glassy-action-btn'
							onClick={() => onChallenge(friend.id)}
						>
							Challenge
						</button>
						<button
							className='hover-action-btn glassy-action-btn'
							onClick={() => onMessage(friend.id)}
						>
							Message
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default FriendCard;
