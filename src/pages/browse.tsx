import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { CustomPuzzleModal } from '../components/ui-kit/modals';
import { GoBackButton } from '../components/ui-kit/buttons';
import { MatchChatWindow } from '../components/ui-kit/chats';
import { UserSettingsContext } from '../components/ui-kit/providers';
import {
	getShareUrl,
	getShareTitle,
	getShareText,
} from '../utils/helpers';
import { fetchCustomPuzzles } from '../services/customPuzzlesService';
import type { Puzzle } from '../types/api';
import { useSession, signIn } from 'next-auth/react';
import SignInModal from '../components/ui-kit/modals/SignInModal';

export default function Browse() {
	const router = useRouter();
	const { data: session } = useSession();
	const [showSignIn, setShowSignIn] = React.useState(false);
	const [customPuzzle, setCustomPuzzle] =
		React.useState<any>(null);
	const [customState, setCustomState] =
		React.useState<any>(null);
	const [user, setUser] = React.useState<{
		name: string;
		email: string;
		photoUrl?: string;
	} | null>(null);
	const [mode, setMode] = React.useState<
		'browse' | 'custom'
	>('browse');
	const [tab, setTab] = React.useState<
		'community' | 'mine'
	>('community');
	const [loading, setLoading] = React.useState(false);
	const [tabPuzzles, setTabPuzzles] = React.useState<any[]>(
		[]
	);
	const [showChat, setShowChat] = React.useState(false);
	const [chatMessages, setChatMessages] = React.useState<
		any[]
	>([]);
	const { settings } = useContext(UserSettingsContext);

	// Generate a per-match chat room id for custom puzzle play
	const userId = user?.email || 'guest';
	const matchId = customPuzzle
		? `${customPuzzle._id || customPuzzle.id}-${userId}`
		: '';

	// Ephemeral chat logic (stub, can be replaced with socket.io logic)
	const sendMessage = (msg: {
		sender: string;
		content: string;
		type: string;
	}) => {
		const fullMsg = {
			...msg,
			id: Math.random().toString(36).slice(2),
			timestamp: Date.now(),
		};
		setChatMessages((prev) => [...prev, fullMsg]);
	};

	React.useEffect(() => {
		async function fetchPuzzles() {
			setLoading(true);
			try {
				const data = await fetchCustomPuzzles(tab, user);
				setTabPuzzles(data);
			} catch {
				setTabPuzzles([]);
			}
			setLoading(false);
		}
		fetchPuzzles();
	}, [tab, user]);

	const handleSetTab = (newTab: 'community' | 'mine') => {
		if (newTab === 'mine' && !session) {
			setShowSignIn(true);
			return;
		}
		setTab(newTab);
	};
	const handleSetMode = (
		newMode: 'browse' | 'custom' | 'startup' | 'daily'
	) => {
		if (newMode === 'custom' && !session) {
			setShowSignIn(true);
			return;
		}
		if (newMode === 'browse' || newMode === 'custom') {
			setMode(newMode);
		}
	};

	if (mode === 'custom' && customPuzzle) {
		return (
			<>
				{/* Notification Banner (global, already in _app, but can trigger here) */}
				{/* In-match chat window for custom puzzle play */}
				<button
					className='match-chat-toggle-btn'
					onClick={() => setShowChat((v) => !v)}
					style={{
						position: 'absolute',
						top: 16,
						right: 16,
						zIndex: 10,
					}}
				>
					💬 Chat
				</button>
				<MatchChatWindow
					open={showChat}
					onClose={() => setShowChat(false)}
					matchId={matchId}
					userId={userId}
				/>
				<CustomPuzzleModal
					open={true}
					onClose={() => setMode('browse')}
					onSave={(puzzle) => {
						setCustomPuzzle(puzzle);
						setMode('browse');
					}}
					initialData={customPuzzle}
				/>
			</>
		);
	}

	return (
		<>
			{showSignIn && (
				<SignInModal
					open={showSignIn}
					onClose={() => setShowSignIn(false)}
					onSignIn={() => signIn()}
				/>
			)}
			<div
				className='gridRoyale-container'
				style={{
					minHeight: '100vh',
					padding: 24,
					position: 'relative',
				}}
			>
				<div className='browse-puzzles-header'>
					<GoBackButton
						onClick={() => router.push('/')}
						className='back-icon-btn'
					/>
					<div
						className='browse-puzzles-header-title'
						style={{ flex: 1 }}
					>
						<h1 className='gridRoyale-title'>
							Browse Custom Puzzles
						</h1>
						<div className='browse-puzzles-tabs'>
							<button
								onClick={() => setTab('community')}
								className={
									tab === 'community' ? 'active' : ''
								}
							>
								Community Puzzles
							</button>
							<button
								onClick={() => setTab('mine')}
								className={tab === 'mine' ? 'active' : ''}
							>
								My Puzzles
							</button>
						</div>
					</div>
				</div>

				<div className='browse-puzzles-list'>
					{loading ? (
						<div>Loading...</div>
					) : tabPuzzles.length === 0 ? (
						<div style={{ marginTop: 32 }}>
							No custom puzzles found.
						</div>
					) : (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 16,
							}}
						>
							{tabPuzzles.map((puzzle: Puzzle) => (
								<div
									key={puzzle.id}
									className='browse-puzzle-card'
								>
									<div className='browse-puzzle-title'>
										{puzzle.title || 'Untitled Puzzle'}
									</div>
									<div className='browse-puzzle-meta'>
										{/* Optionally show author, date, stats, etc. */}
									</div>
									<div className='browse-puzzle-actions'>
										<button className='browse-play-btn'>
											Play
										</button>
										{/* Add more actions as needed */}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
