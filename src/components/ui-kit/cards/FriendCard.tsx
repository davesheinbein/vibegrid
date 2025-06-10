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

const FriendCard: React.FC<FriendCardProps> = ({
	friend,
	onChallenge,
	onMessage,
	onRemove,
	unreadCount = 0,
}) => {
	const [hover, setHover] = useState(false);
	const status = getStatus(friend);

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
					className='friend-status-dot'
					style={{
						background: status.color,
						boxShadow: `0 0 0 2px ${status.color}44`,
						transition: 'background 0.18s',
					}}
					aria-label={status.text}
				></span>
				<span className='friend-username'>
					{friend.username}
				</span>
				{unreadCount > 0 && (
					<span className='friend-unread'>
						{unreadCount}
					</span>
				)}
			</div>
			<div
				className='friend-card-status-text'
				style={{
					color: status.color,
					fontSize: 13,
					fontWeight: 500,
					marginLeft: 24,
					marginBottom: 2,
					transition: 'color 0.18s',
				}}
			>
				{status.text}
			</div>
			<div className='friend-card-actions'>
				<button
					className='friend-card-btn challenge-btn'
					onClick={() => onChallenge(friend.id)}
					aria-label='Challenge friend'
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						fontWeight: 700,
						background:
							'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
						color: '#fff',
						borderRadius: 8,
						boxShadow: '0 2px 8px #e3eaff33',
						transition: 'background 0.18s, transform 0.13s',
					}}
				>
					<span
						style={{
							fontSize: 18,
							filter: 'drop-shadow(0 1px 2px #fffbe6)',
						}}
						role='img'
						aria-label='Sword'
					>
						🗡️
					</span>
					<span>Challenge</span>
				</button>
				<button
					className='friend-card-btn'
					onClick={() => onMessage(friend.id)}
					aria-label='Message friend'
				>
					Message
				</button>
				<button
					className='friend-card-btn'
					onClick={() => onRemove(friend.id)}
					aria-label='Remove friend'
				>
					Remove
				</button>
			</div>
		</div>
	);
};

export default FriendCard;
