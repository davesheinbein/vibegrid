import React from 'react';
import { useFriends } from './FriendsProvider';
import { FriendsToggleButton } from './Buttons';
import FriendChatWindow from './FriendChatWindow';
import { useRouter } from 'next/router';
import FriendCard from './FriendCard';

const FriendsSidebar: React.FC = () => {
	const {
		friends,
		requests,
		recentMatches,
		onlineFriends,
		unreadMessages,
		sendFriendRequest,
		acceptFriendRequest,
		declineFriendRequest,
		removeFriend,
		sendChallenge,
		loadChatHistory,
		clearUnread,
	} = useFriends();
	const router = useRouter();
	const [show, setShow] = React.useState(false);
	const [search, setSearch] = React.useState('');
	const [addUsername, setAddUsername] = React.useState('');
	const [openChatFriendId, setOpenChatFriendId] =
		React.useState<string | null>(null);
	const [expanded, setExpanded] = React.useState({
		online: true,
		offline: true,
		pending: true,
		recent: true,
	});

	// Filter friends by online/offline
	const online = friends.filter((f) => f.online);
	const offline = friends.filter((f) => !f.online);

	// Handlers
	const handleAddFriend = (e: React.FormEvent) => {
		e.preventDefault();
		if (addUsername.trim()) {
			sendFriendRequest(addUsername.trim());
			setAddUsername('');
		}
	};

	const toggleSection = (key: keyof typeof expanded) => {
		setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	return (
		<>
			<FriendsToggleButton
				active={show}
				onClick={() => setShow(!show)}
			/>
			{show && (
				<div
					className='friends-sidebar-overlay'
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 199,
						background: 'transparent',
					}}
					onClick={() => setShow(false)}
				/>
			)}
			<aside
				className={`friends-sidebar glassy-sidebar${
					show ? ' open' : ''
				}`}
				style={{
					transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
					boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
					backdropFilter: 'blur(16px) saturate(180%)',
					WebkitBackdropFilter: 'blur(16px) saturate(180%)',
					background: 'rgba(255,255,255,0.18)',
					borderRadius: '1.5rem',
					border: '1px solid rgba(255,255,255,0.24)',
					right: show ? 0 : '-420px',
					opacity: show ? 1 : 0,
					pointerEvents: show ? 'auto' : 'none',
					position: 'fixed',
					top: 0,
					width: 380,
					height: '100vh',
					zIndex: 200,
					display: 'flex',
					flexDirection: 'column',
					padding: '1.5rem 0.5rem 1.5rem 1.5rem',
				}}
			>
				{show && (
					<button
						className='friends-sidebar-close-btn'
						onClick={() => setShow(false)}
						style={{
							position: 'absolute',
							left: '-48px',
							top: 24,
							zIndex: 201,
							width: 36,
							height: 36,
							borderRadius: '50%',
							background: 'rgba(255,255,255,0.7)',
							boxShadow: '0 2px 8px 0 #e3eaff33',
							border: 'none',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						aria-label='Close friends sidebar'
					>
						<span
							style={{ fontSize: 22, color: '#64748b' }}
						>
							&#10005;
						</span>
					</button>
				)}
				{show && (
					<div className='friends-sidebar-content'>
						<div className='friends-sidebar-header'>
							<h2
								className='sidebar-title'
								style={{
									fontFamily: 'Inter, Manrope, sans-serif',
									fontWeight: 700,
									fontSize: 22,
									letterSpacing: 0.2,
								}}
							>
								Friends
							</h2>
							<form
								className='add-friend-form'
								onSubmit={handleAddFriend}
								style={{
									display: 'flex',
									gap: 8,
									marginTop: 12,
								}}
							>
								<input
									type='text'
									value={addUsername}
									onChange={(e) =>
										setAddUsername(e.target.value)
									}
									placeholder='Add friend by username'
									className='add-friend-input pill-bg-glass'
									style={{
										borderRadius: 999,
										padding: '7px 16px',
										border: 'none',
										background: 'rgba(255,255,255,0.22)',
										boxShadow: '0 1px 8px 0 #e3eaff33',
										fontFamily:
											'Inter, Manrope, sans-serif',
									}}
								/>
								<button
									type='submit'
									className='add-friend-btn pill-glow-btn'
								>
									Add
								</button>
							</form>
						</div>
						<div className='friends-list-section'>
							<div className='friends-list-group'>
								<button
									className={`friends-list-toggle${
										expanded.online ? ' expanded' : ''
									}`}
									onClick={() => toggleSection('online')}
									style={{
										transition: 'all 0.25s',
										fontWeight: 600,
									}}
								>
									Online ({online.length})
								</button>
								<div
									className={`friends-list-items${
										expanded.online ? ' expanded' : ''
									}`}
									style={{
										transition: 'all 0.25s ease-out',
										opacity: expanded.online ? 1 : 0,
										transform: expanded.online
											? 'translateY(0)'
											: 'translateY(-12px)',
										maxHeight: expanded.online ? 600 : 0,
										overflow: 'hidden',
									}}
								>
									{online.map((friend) => (
										<FriendCard
											key={friend.id}
											friend={friend}
											onChallenge={sendChallenge}
											onMessage={(id) =>
												setOpenChatFriendId(id)
											}
											onRemove={removeFriend}
											unreadCount={
												unreadMessages[friend.id] || 0
											}
										/>
									))}
								</div>
							</div>
							<div className='friends-list-group'>
								<button
									className={`friends-list-toggle${
										expanded.offline ? ' expanded' : ''
									}`}
									onClick={() => toggleSection('offline')}
									style={{
										transition: 'all 0.25s',
										fontWeight: 600,
									}}
								>
									Offline ({offline.length})
								</button>
								<div
									className={`friends-list-items${
										expanded.offline ? ' expanded' : ''
									}`}
									style={{
										transition: 'all 0.25s ease-out',
										opacity: expanded.offline ? 1 : 0,
										transform: expanded.offline
											? 'translateY(0)'
											: 'translateY(-12px)',
										maxHeight: expanded.offline ? 600 : 0,
										overflow: 'hidden',
									}}
								>
									{offline.map((friend) => (
										<FriendCard
											key={friend.id}
											friend={friend}
											onChallenge={sendChallenge}
											onMessage={(id) =>
												setOpenChatFriendId(id)
											}
											onRemove={removeFriend}
											unreadCount={
												unreadMessages[friend.id] || 0
											}
										/>
									))}
								</div>
							</div>
						</div>
						{openChatFriendId && (
							<FriendChatWindow
								friendId={openChatFriendId}
								onClose={() => setOpenChatFriendId(null)}
							/>
						)}
						{/* Achievements navigation button */}
						<div
							style={{
								marginTop: 'auto',
								paddingTop: 18,
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<button
								className='achievements-nav-btn pill-glow-btn'
								style={{
									borderRadius: 16,
									padding: '10px 28px',
									fontWeight: 600,
									fontSize: 16,
									background: 'rgba(255,255,255,0.22)',
									boxShadow: '0 1px 8px 0 #e3eaff33',
									color: '#334155',
									letterSpacing: 0.2,
									border: 'none',
									cursor: 'pointer',
									transition:
										'background 0.18s, transform 0.13s',
								}}
								onClick={() => {
									setShow(false);
									router.push('/achievements');
								}}
							>
								<span
									role='img'
									aria-label='Achievements'
									style={{ marginRight: 8 }}
								>
									🏆
								</span>
								Achievements
							</button>
						</div>
					</div>
				)}
			</aside>
		</>
	);
};

export default FriendsSidebar;
