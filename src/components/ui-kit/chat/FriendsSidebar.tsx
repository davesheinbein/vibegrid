import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
	setFriends,
	setRequests,
	addMessage,
	setUnread,
	clearUnread,
	setGroups,
	sendFriendRequest,
	sendChallenge,
	removeFriend,
} from '../../../store/friendsSlice';
import FriendChatWindow from './FriendChatWindow';
import { useRouter } from 'next/router';
import FriendCard from '../cards/FriendCard';
import {
	useSession,
	signIn,
	signOut,
} from 'next-auth/react';
import SignInModal from '../modals/SignInModal';
import { useCallback } from 'react';
import styles from '../../../styles/FriendsSidebar.module.scss';
import {
	toggleSectionState,
	makeChallengeHandler,
	makeRemoveHandler,
} from '../../../utils/helpers';

interface FriendsSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const FriendsSidebar: React.FC<FriendsSidebarProps> = ({
	isOpen,
	onClose,
}) => {
	const dispatch = useDispatch();
	const friends = useSelector(
		(state: RootState) => state.friends.friends
	);
	const unreadMessages = useSelector(
		(state: RootState) => state.friends.unreadMessages
	);
	const router = useRouter();
	const { data: session, status } = useSession();
	const [showSignIn, setShowSignIn] = React.useState(false);
	const [addUsername, setAddUsername] = React.useState('');
	const [openChatFriendId, setOpenChatFriendId] =
		React.useState<string | null>(null);
	const [expanded, setExpanded] = React.useState({
		online: true,
		offline: true,
		pending: true,
		recent: true,
	});

	const online = friends.filter((f: any) => f.online);
	const offline = friends.filter((f: any) => !f.online);

	const handleChallenge = (id: string) => {
		dispatch(sendChallenge(id));
	};
	const handleRemove = (id: string) => {
		dispatch(removeFriend(id));
	};
	const handleAddFriend = (e: React.FormEvent) => {
		e.preventDefault();
		if (addUsername.trim()) {
			dispatch(sendFriendRequest(addUsername.trim()));
			setAddUsername('');
		}
	};
	const handleToggleSection = (
		key: keyof typeof expanded
	) => {
		setExpanded((prev) => toggleSectionState(prev, key));
	};
	const isAuthenticated =
		status === 'authenticated' && session?.user;
	const handleChallengeRedux = makeChallengeHandler(
		dispatch,
		sendChallenge
	);
	const handleRemoveRedux = makeRemoveHandler(
		dispatch,
		removeFriend
	);

	if (!isOpen) return null;

	return (
		<>
			<div
				className={styles.friendsSidebarOverlay}
				onClick={onClose}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					background: 'transparent',
					zIndex: 10000,
				}}
			/>
			<aside
				className={`${styles.friendsSidebar} glassy-sidebar open`}
				style={{ zIndex: 10001 }}
				onClick={(e) => e.stopPropagation()}
			>
				<button
					className={styles.friendsSidebarCloseBtn}
					onClick={onClose}
					aria-label='Close friends sidebar'
				>
					<span style={{ fontSize: 22, color: '#64748b' }}>
						&#10005;
					</span>
				</button>
				<div className={styles.friendsSidebarContent}>
					{!isAuthenticated ? (
						<>
							<div className={styles.signInTeaser}>
								<h2>Welcome to the Friends Sidebar!</h2>
								<p>
									Connect with friends, chat, and enjoy
									exclusive features.
								</p>
								<button
									className={styles.signInButton}
									onClick={() => setShowSignIn(true)}
								>
									Sign In
								</button>
							</div>
							<SignInModal
								open={showSignIn}
								onClose={() => setShowSignIn(false)}
								onSignIn={() => {
									setShowSignIn(false);
									signIn();
								}}
							/>
							<RotatingMessages />
						</>
					) : (
						<>
							{/* Profile Header */}
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
							<div className={styles.friendsListHeader}>
								<h2>Your Friends</h2>
								<form
									className={styles.addFriendForm}
									onSubmit={handleAddFriend}
								>
									<input
										type='text'
										placeholder='Add a friend by username'
										value={addUsername}
										onChange={(e) =>
											setAddUsername(e.target.value)
										}
										className={styles.addFriendInput}
									/>
									<button
										type='submit'
										className={styles.addFriendButton}
									>
										Add
									</button>
								</form>
							</div>
							{/* Friends List Section */}
							<div
								className='friends-list-section'
								style={{
									flex: 1,
									overflowY: 'auto',
									marginBottom: 16,
								}}
							>
								<div className='friends-list-group'>
									<button
										className={`friends-list-toggle${
											expanded.online ? ' expanded' : ''
										}`}
										onClick={() =>
											handleToggleSection('online')
										}
										style={{
											transition: 'all 0.25s',
											fontWeight: 700,
											color: '#2563eb',
											background: '#f8fafc',
											border: '1.5px solid #2563eb22',
											borderRadius: 12,
											padding: '8px 18px',
											marginBottom: 6,
											fontSize: 16,
											letterSpacing: 0.2,
											boxShadow: expanded.online
												? '0 2px 8px #2563eb11'
												: 'none',
											outline: 'none',
											cursor: 'pointer',
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
										{online.length === 0 ? (
											<div
												style={{
													color: '#64748b',
													fontSize: 15,
													padding: '8px 0 8px 12px',
												}}
											>
												No friends online
											</div>
										) : (
											online.map((friend) => (
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
											))
										)}
									</div>
								</div>
								<div className='friends-list-group'>
									<button
										className={`friends-list-toggle${
											expanded.offline ? ' expanded' : ''
										}`}
										onClick={() =>
											handleToggleSection('offline')
										}
										style={{
											transition: 'all 0.25s',
											fontWeight: 700,
											color: '#64748b',
											background: '#f8fafc',
											border: '1.5px solid #64748b22',
											borderRadius: 12,
											padding: '8px 18px',
											marginBottom: 6,
											fontSize: 16,
											letterSpacing: 0.2,
											boxShadow: expanded.offline
												? '0 2px 8px #64748b11'
												: 'none',
											outline: 'none',
											cursor: 'pointer',
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
										{offline.length === 0 ? (
											<div
												style={{
													color: '#64748b',
													fontSize: 15,
													padding: '8px 0 8px 12px',
												}}
											>
												No friends offline
											</div>
										) : (
											offline.map((friend) => (
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
											))
										)}
									</div>
								</div>
							</div>
							{openChatFriendId && (
								<FriendChatWindow
									chatId={openChatFriendId}
									onClose={() => setOpenChatFriendId(null)}
								/>
							)}
							{/* Divider above achievements button */}
							<div
								style={{
									width: '100%',
									height: 1,
									background: '#e0e7ef',
									margin: '16px 0 8px 0',
								}}
							/>
							{/* Sticky Achievements Button */}
							<div
								style={{
									width: '100%',
									position: 'sticky',
									bottom: 0,
									left: 0,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									padding: '12px 0 8px 0',
									zIndex: 2,
								}}
							>
								<button
									className='friends-achievements-btn'
									style={{
										background: '#2563eb',
										color: '#fbbf24',
										fontWeight: 700,
										fontSize: 16,
										borderRadius: 16,
										padding: '10px 32px',
										boxShadow:
											'0 2px 12px 0 #2563eb22, 0 1.5px 8px 0 #fbbf2422',
										border: 'none',
										cursor: 'pointer',
										width: '90%',
										maxWidth: 320,
										letterSpacing: 0.5,
										transition:
											'background 0.18s, color 0.18s, box-shadow 0.18s',
										outline: 'none',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: 8,
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.background =
											'#1e293b';
										e.currentTarget.style.color = '#ffe066';
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.background =
											'#2563eb';
										e.currentTarget.style.color = '#fbbf24';
									}}
									onClick={() =>
										router.push('/achievements')
									}
								>
									<span
										role='img'
										aria-label='Achievements'
										style={{
											fontSize: 20,
											filter:
												'drop-shadow(0 1px 2px #fffbe6)',
										}}
									>
										🏆
									</span>
									Achievements
								</button>
							</div>
						</>
					)}
				</div>
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
