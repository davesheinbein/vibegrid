import React from 'react';

interface FriendsSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const FriendsSidebar: React.FC<FriendsSidebarProps> = ({
	isOpen,
	onClose,
}) => {
	if (!isOpen) return null;
	return (
		<aside className='friends-sidebar'>
			<button
				className='friends-sidebar-close-btn'
				onClick={onClose}
				aria-label='Close friends sidebar'
				style={{ position: 'absolute', top: 12, right: 12 }}
			>
				×
			</button>
			<div style={{ padding: 24 }}>
				<h2 style={{ marginBottom: 16 }}>Friends</h2>
				<p style={{ color: '#64748b' }}>
					This is a placeholder for the Friends Sidebar. Add
					your friends, chat, and see who's online!
				</p>
			</div>
		</aside>
	);
};

export default FriendsSidebar;
