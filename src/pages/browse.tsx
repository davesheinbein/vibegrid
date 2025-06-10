import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { CustomPuzzleModal } from '../components/ui-kit/modals';
import { GoBackButton } from '../components/ui-kit/buttons';
import { MatchChatWindow } from '../components/ui-kit/chat';
import { UserSettingsContext } from '../components/ui-kit/providers';
import {
	getShareUrl,
	getShareTitle,
	getShareText,
} from '../utils/helpers';

export default function Browse() {
	const router = useRouter();
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
				let url = '';
				if (tab === 'mine' && user) {
					url = `/api/custom-puzzles?creatorId=${encodeURIComponent(
						user.email
					)}`;
				} else {
					url = '/api/custom-puzzles/public';
				}
				const res = await fetch(url);
				if (!res.ok)
					throw new Error('Failed to fetch puzzles');
				const data = await res.json();
				setTabPuzzles(data);
			} catch {
				setTabPuzzles([]);
			}
			setLoading(false);
		}
		fetchPuzzles();
	}, [tab, user]);

	const handleSetMode = (
		newMode: 'browse' | 'custom' | 'startup' | 'daily'
	) => {
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
						{tabPuzzles.map((puzzle) => (
							<div
								key={puzzle._id}
								style={{
									border: '1px solid #e5e7eb',
									borderRadius: 8,
									padding: 16,
									background: '#fff',
									color: '#222',
								}}
							>
								<div
									style={{ fontWeight: 600, fontSize: 18 }}
								>
									{puzzle.title || 'Untitled Puzzle'}
								</div>
								<div
									style={{
										fontSize: 14,
										margin: '4px 0 8px 0',
									}}
								>
									{puzzle.theme && (
										<span>Theme: {puzzle.theme} | </span>
									)}
									Words: {puzzle.words?.length || 0} |
									Wildcards:{' '}
									{puzzle.wildcardsToggle ? 'On' : 'Off'}
								</div>
								<div
									style={{
										fontSize: 13,
										color: '#64748b',
										marginBottom: 6,
									}}
								>
									By:{' '}
									{puzzle.creatorName ||
										puzzle.creatorId ||
										'Anonymous'}{' '}
									| {puzzle.date || ''}
								</div>
								<div
									style={{
										display: 'flex',
										gap: 8,
										alignItems: 'center',
									}}
								>
									<button
										className='gridRoyale-submit'
										onClick={() => {
											setCustomPuzzle(puzzle);
											setMode('custom');
											setCustomState(null);
										}}
										style={{ marginRight: 8 }}
									>
										Play
									</button>
									<button
										className='gridRoyale-submit'
										onClick={() => {
											const url =
												router.basePath +
												'/play/custom/' +
												puzzle._id;
											navigator.clipboard.writeText(url);
										}}
										style={{
											background:
												'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
										}}
									>
										Copy Link
									</button>
									<span
										style={{
											marginLeft: 8,
											color: '#0ea5e9',
											fontSize: 18,
										}}
										title='Rating (coming soon)'
									>
										★
									</span>
									<span
										style={{
											marginLeft: 2,
											color: '#64748b',
											fontSize: 16,
										}}
										title='Favorite (coming soon)'
									>
										♡
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
