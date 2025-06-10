import React from 'react';
import { useSession } from 'next-auth/react';

/**
 * FriendsToggleButton - A button for toggling the friends sidebar.
 * Props:
 * - onClick: optional click handler
 * - className: additional class names
 * - style: optional inline styles
 */
export const FriendsToggleButton: React.FC<{
	onClick?: () => void;
	className?: string;
	style?: React.CSSProperties;
}> = ({ onClick, className = '', style }) => {
	const { data: session, status } = useSession();
	const isAuthenticated =
		status === 'authenticated' && session?.user;

	return (
		<button
			onClick={onClick}
			className={`friends-toggle-btn ${className}`}
			style={{
				border: 'none',
				background: 'none',
				padding: 0,
				borderRadius: '50%',
				width: 44,
				height: 44,
				boxShadow: '0 2px 8px #e3eaff33',
				cursor: 'pointer',
				...style,
			}}
			aria-label={'Open friends sidebar'}
		>
			{isAuthenticated && session.user?.image ? (
				<img
					src={session.user.image}
					alt={session.user.name || 'Profile'}
					style={{
						width: 36,
						height: 36,
						borderRadius: '50%',
						objectFit: 'cover',
						border: '2px solid #38bdf8',
					}}
				/>
			) : (
				<span
					className='friends-toggle-icon'
					style={{ fontSize: 28, color: '#2563eb' }}
				>
					{/* Default icon, e.g. FontAwesome user-friends or similar */}
					<svg
						width='28'
						height='28'
						viewBox='0 0 24 24'
						fill='none'
						stroke='#2563eb'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<circle cx='9' cy='7' r='4' />
						<path d='M17 11v-1a4 4 0 0 0-4-4' />
						<path d='M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2' />
					</svg>
				</span>
			)}
		</button>
	);
};

export default FriendsToggleButton;
