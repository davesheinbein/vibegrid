import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
	setSidebarOpen,
	setFriends,
	setRequests,
	addMessage,
	setUnread,
	clearUnread,
	setGroups,
	sendFriendRequest,
	sendChallenge,
	removeFriend,
} from '../../store/friendsSlice';
import FriendChatWindow from './FriendChatWindow';
import { useRouter } from 'next/router';
import FriendCard from './FriendCard';
import {
	useSession,
	signIn,
	signOut,
} from 'next-auth/react';
import SignInModal from '../modal/SignInModal';
import { useCallback } from 'react';

const FriendsSidebar: React.FC = () => {
	const dispatch = useDispatch();
	const friends = useSelector(
		(state: RootState) => state.friends.friends
	);
	const unreadMessages = useSelector(
		(state: RootState) => state.friends.unreadMessages
	);
	const isSidebarOpen = useSelector(
		(state: RootState) => state.friends.isSidebarOpen
	);
	const router = useRouter();
	const { data: session, status } = useSession();
	const [showSignIn, setShowSignIn] = React.useState(false);
	console.log('🚀 ~ session:', session);
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
	const online = friends.filter((f: any) => f.online);
	const offline = friends.filter((f: any) => !f.online);

	// Handlers
	const handleChallenge = (id: string) => {
		(dispatch as any)(sendChallenge(id));
	};
	const handleRemove = (id: string) => {
		(dispatch as any)(removeFriend(id));
	};
	const handleAddFriend = (e: React.FormEvent) => {
		e.preventDefault();
		if (addUsername.trim()) {
			(dispatch as any)(
				sendFriendRequest(addUsername.trim())
			);
			setAddUsername('');
		}
	};

	const toggleSection = (key: keyof typeof expanded) => {
		setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const isAuthenticated =
		status === 'authenticated' && session?.user;

	const toggleSidebar = () =>
		dispatch(setSidebarOpen(!isSidebarOpen));
	const handleChallengeRedux = useCallback(
		(id: string) => {
			(dispatch as any)(sendChallenge(id));
		},
		[dispatch]
	);
	const handleRemoveRedux = useCallback(
		(id: string) => {
			(dispatch as any)(removeFriend(id));
		},
		[dispatch]
	);

	return (
		<>
			{isSidebarOpen && (
				<div
					className='friends-sidebar-overlay'
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 9998,
						background: 'transparent',
					}}
					onClick={toggleSidebar}
				/>
			)}
			<aside
				className={`friends-sidebar glassy-sidebar${
					isSidebarOpen ? ' open' : ''
				}`}
				style={{
					transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
					boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
					backdropFilter: 'blur(16px) saturate(180%)',
					WebkitBackdropFilter: 'blur(16px) saturate(180%)',
					background: 'rgba(255,255,255,0.18)',
					borderRadius: '1.5rem',
					border: '1px solid rgba(255,255,255,0.24)',
					right: isSidebarOpen ? 0 : '-420px',
					opacity: isSidebarOpen ? 1 : 0,
					pointerEvents: isSidebarOpen ? 'auto' : 'none',
					position: 'fixed',
					top: 0,
					width: 380,
					height: '100vh',
					zIndex: 9999,
					display: 'flex',
					flexDirection: 'column',
					padding: '1.5rem 0.5rem 1.5rem 1.5rem',
				}}
			>
				{isSidebarOpen && (
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
				{isSidebarOpen && (
					<div className='friends-sidebar-content'>
						{!isAuthenticated ? (
							<div className='friends-signin-teaser'>
								<div
									style={{
										textAlign: 'center',
										marginBottom: 24,
									}}
								>
									<h2
										style={{
											fontWeight: 800,
											fontSize: 22,
											color: '#2563eb',
											marginBottom: 8,
										}}
									>
										Sign in to unlock Friends & Leaderboards
									</h2>
									<p
										style={{
											color: '#64748b',
											fontSize: 16,
											marginBottom: 18,
										}}
									>
										Connect with friends, track your stats,
										and see how you rank!
									</p>
									<button
										className='friends-signin-btn pulse'
										onClick={() => setShowSignIn(true)}
										style={{
											background:
												'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
											color: '#1e293b',
											fontWeight: 700,
											fontSize: 18,
											borderRadius: 16,
											padding: '12px 32px',
											boxShadow: '0 2px 8px 0 #e3eaff33',
											marginBottom: 18,
											animation:
												'pulseBtn 1.2s infinite cubic-bezier(0.4,0.2,0.2,1)',
										}}
									>
										Sign in with Google
									</button>
								</div>
								{/* Blurred/dimmed friends list preview */}
								<div
									className='friends-list-preview'
									style={{
										filter: 'blur(3px) grayscale(0.5)',
										opacity: 0.7,
										pointerEvents: 'none',
										marginBottom: 18,
									}}
								>
									<div
										style={{
											fontWeight: 600,
											color: '#2563eb',
											marginBottom: 6,
										}}
									>
										Online (2)
									</div>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 8,
										}}
									>
										<div
											className='friend-card'
											style={{
												background: '#f0f9ff',
												borderRadius: 12,
												padding: 10,
												display: 'flex',
												alignItems: 'center',
												gap: 10,
											}}
										>
											<div
												className='avatar-circle'
												style={{
													background:
														'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
													width: 34,
													height: 34,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: '#fff',
													fontWeight: 700,
												}}
											>
												A
											</div>
											<span
												style={{
													fontWeight: 600,
													color: '#2563eb',
												}}
											>
												Alice
											</span>
										</div>
										<div
											className='friend-card'
											style={{
												background: '#f0f9ff',
												borderRadius: 12,
												padding: 10,
												display: 'flex',
												alignItems: 'center',
												gap: 10,
											}}
										>
											<div
												className='avatar-circle'
												style={{
													background:
														'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
													width: 34,
													height: 34,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: '#fff',
													fontWeight: 700,
												}}
											>
												B
											</div>
											<span
												style={{
													fontWeight: 600,
													color: '#2563eb',
												}}
											>
												Bob
											</span>
										</div>
									</div>
								</div>
								{/* Dynamic call-to-action banner */}
								<div
									className='friends-cta-banner'
									style={{
										background:
											'linear-gradient(90deg,#38bdf8 0%,#fbbf24 100%)',
										color: '#fff',
										borderRadius: 12,
										padding: '10px 18px',
										fontWeight: 700,
										fontSize: 16,
										marginBottom: 16,
										textAlign: 'center',
										animation: 'fadeIn 0.7s',
									}}
								>
									Unlock multiplayer, chat, and more!
								</div>
								{/* Leaderboard tease */}
								<div
									className='friends-leaderboard-tease'
									style={{
										background: '#fffbe6',
										borderRadius: 12,
										padding: '10px 18px',
										color: '#b45309',
										fontWeight: 600,
										fontSize: 15,
										marginBottom: 14,
										textAlign: 'center',
										boxShadow: '0 1px 4px 0 #fbbf2433',
									}}
								>
									See how you rank on the global
									leaderboard!
								</div>
								{/* Rotating engagement messages */}
								<RotatingMessages />
								{/* Sign-in modal */}
								<SignInModal
									open={showSignIn}
									onClose={() => setShowSignIn(false)}
									onSignIn={() => {
										setShowSignIn(false);
										signIn('google');
									}}
								/>
							</div>
						) : (
							<>
								<div
									className='friends-sidebar-header-row'
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										padding: '16px 16px 0 16px',
									}}
								>
									<div
										className='friends-sidebar-profile'
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 10,
										}}
									>
										{session.user?.image ? (
											<img
												src={session.user.image}
												alt={session.user.name || 'Profile'}
												style={{
													width: 36,
													height: 36,
													borderRadius: '50%',
													objectFit: 'cover',
													marginRight: 8,
												}}
											/>
										) : (
											// fallback avatar
											<div
												style={{
													width: 36,
													height: 36,
													borderRadius: '50%',
													background: '#e0e7ef',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													marginRight: 8,
													fontWeight: 700,
													color: '#888',
												}}
											>
												{session.user?.name
													? session.user.name[0].toUpperCase()
													: '?'}
											</div>
										)}
										<span
											className='friends-sidebar-profile-name'
											style={{
												fontWeight: 600,
												fontSize: '1.1em',
											}}
										>
											{session.user?.name}
										</span>
									</div>
									<button
										className='friends-sidebar-signout-btn'
										onClick={() => signOut()}
										style={{
											background: 'none',
											border: 'none',
											color: '#888',
											fontWeight: 500,
											fontSize: 14,
											cursor: 'pointer',
											marginLeft: 8,
										}}
										title='Sign out'
									>
										Sign Out
									</button>
								</div>
								<div style={{ padding: '0 16px 8px 16px' }}>
									<h3
										style={{
											margin: '18px 0 8px 0',
											fontWeight: 700,
											fontSize: '1.2em',
										}}
									>
										Friends
									</h3>
								</div>
								<div className='friends-sidebar-header'>
									<h2
										className='sidebar-title'
										style={{
											fontFamily:
												'Inter, Manrope, sans-serif',
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
												background:
													'rgba(255,255,255,0.22)',
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
											onClick={() =>
												toggleSection('online')
											}
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
												maxHeight: expanded.online
													? 600
													: 0,
												overflow: 'hidden',
											}}
										>
											{online.map((friend) => (
												<FriendCard
													key={friend.id}
													friend={friend}
													onChallenge={handleChallenge}
													onMessage={(id) =>
														setOpenChatFriendId(id)
													}
													onRemove={handleRemoveRedux}
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
											onClick={() =>
												toggleSection('offline')
											}
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
												maxHeight: expanded.offline
													? 600
													: 0,
												overflow: 'hidden',
											}}
										>
											{offline.map((friend) => (
												<FriendCard
													key={friend.id}
													friend={friend}
													onChallenge={handleChallenge}
													onMessage={(id) =>
														setOpenChatFriendId(id)
													}
													onRemove={handleRemoveRedux}
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
										chatId={openChatFriendId}
										onClose={() =>
											setOpenChatFriendId(null)
										}
									/>
								)}
							</>
						)}
					</div>
				)}
			</aside>
		</>
	);
};

// RotatingMessages component for engagement
const rotatingMessages = [
	'🎉 New: Earn achievements with friends!',
	'🏆 Compete for the top spot on the leaderboard!',
	'💬 Chat and challenge your friends in real time!',
	'🔒 Sign in to save your progress and stats!',
	'✨ Customize your profile and avatar!',
];
const RotatingMessages: React.FC = () => {
	const [index, setIndex] = React.useState(0);
	React.useEffect(() => {
		const interval = setInterval(() => {
			setIndex((i) => (i + 1) % rotatingMessages.length);
		}, 3500);
		return () => clearInterval(interval);
	}, []);
	return (
		<div
			className='friends-rotating-msg'
			style={{
				color: '#2563eb',
				fontWeight: 600,
				fontSize: 15,
				minHeight: 24,
				textAlign: 'center',
				marginBottom: 10,
				transition: 'opacity 0.3s',
			}}
		>
			{rotatingMessages[index]}
		</div>
	);
};

export default FriendsSidebar;
