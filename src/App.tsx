import React, { useState, useEffect } from 'react';
import './App.scss';
import DailyPage from './pages/DailyPage';
import StartupPage from './pages/StartupPage';
import CustomPuzzleModal from './components/CustomPuzzleModal';
import BrowseCustomPuzzles from './pages/BrowseCustomPuzzles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faXTwitter,
	faMeta,
	faReddit,
	faLinkedin,
	faTiktok,
	faInstagram,
} from '@fortawesome/free-brands-svg-icons';

function App() {
	const [darkMode, setDarkMode] = useState(true);
	const [user, setUser] = useState<null | {
		name: string;
		email: string;
		photoUrl?: string;
	}>({
		name: 'Jane Doe',
		email: 'jane@example.com',
		photoUrl: '',
	});
	const [mode, setMode] = useState<
		'startup' | 'daily' | 'custom' | 'browse'
	>('startup');
	const [showCustomModal, setShowCustomModal] =
		useState(false);
	const [customPuzzle, setCustomPuzzle] =
		useState<any>(null);
	const [showShareModal, setShowShareModal] =
		useState(false);

	useEffect(() => {
		document.body.classList.toggle('dark-mode', darkMode);
	}, [darkMode]);

	// Navigation handlers
	const handleStartDaily = () => setMode('daily');
	const handleStartCustom = () => setShowCustomModal(true);
	const handleCloseCustomModal = () =>
		setShowCustomModal(false);
	const handlePlayCustom = (puzzle: any) => {
		setCustomPuzzle(puzzle);
		setMode('custom');
		setShowCustomModal(false);
	};
	const handleBackToStartup = () => setMode('startup');
	const handleBrowseCustom = () => setMode('browse');
	const handleShare = () => setShowShareModal(true);

	return (
		<div className={darkMode ? 'dark-mode' : ''}>
			{mode === 'startup' && (
				<StartupPage
					onStartDaily={handleStartDaily}
					onStartCustom={handleStartCustom}
					onBrowseCustom={handleBrowseCustom}
					onShare={handleShare}
				/>
			)}
			{mode === 'daily' && (
				<DailyPage onBack={handleBackToStartup} />
			)}
			{showCustomModal && (
				<CustomPuzzleModal
					open={showCustomModal}
					onClose={handleCloseCustomModal}
					setCustomPuzzle={handlePlayCustom}
					setMode={setMode}
					user={user}
				/>
			)}
			{mode === 'browse' && (
				<BrowseCustomPuzzles
					onBack={handleBackToStartup}
					puzzles={[]}
					setCustomPuzzle={handlePlayCustom}
					setMode={setMode}
					setCustomState={() => {}}
					user={user}
					mode='browse'
				/>
			)}
			{mode === 'custom' && customPuzzle && (
				<div style={{ padding: 32, textAlign: 'center' }}>
					<h2>Custom Puzzle Loaded!</h2>
					<pre
						style={{
							textAlign: 'left',
							margin: '0 auto',
							maxWidth: 500,
						}}
					>
						{JSON.stringify(customPuzzle, null, 2)}
					</pre>
					<button
						className='vibegrid-submit'
						onClick={handleBackToStartup}
						style={{ marginTop: 24 }}
					>
						Back to Home
					</button>
				</div>
			)}
			{showShareModal && (
				<div
					className='share-modal'
					onClick={(e) =>
						e.target === e.currentTarget &&
						setShowShareModal(false)
					}
				>
					<div
						className='share-modal-content'
						style={{ maxWidth: 420 }}
					>
						<h2>Share VibeGrid!</h2>
						<div
							className='share-links-grid'
							style={{
								width: '100%',
								margin: '0 auto',
								maxWidth: 420,
							}}
						>
							{(() => {
								const shareText = encodeURIComponent(
									'Try VibeGrid, the daily word grouping puzzle! https://vibegrid.app'
								);
								const shareTitle = encodeURIComponent(
									"VibeGrid: Can you solve today's grid?"
								);
								const shareUrl = encodeURIComponent(
									'https://vibegrid.app'
								);
								const links = [
									{
										name: 'X',
										url: `https://twitter.com/intent/tweet?text=${shareText}`,
										color: '#222',
										icon: faXTwitter,
									},
									{
										name: 'Meta',
										url: `https://www.meta.com/share?u=${shareUrl}&quote=${shareText}`,
										color: '#1877F3',
										icon: faMeta,
									},
									{
										name: 'Reddit',
										url: `https://www.reddit.com/submit?title=${shareTitle}&text=${shareText}`,
										color: '#FF4500',
										icon: faReddit,
									},
									{
										name: 'LinkedIn',
										url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}&summary=${shareText}`,
										color: '#0077B5',
										icon: faLinkedin,
									},
									{
										name: 'TikTok',
										url: `https://www.tiktok.com/share?url=${shareUrl}&text=${shareText}`,
										color: '#000',
										icon: faTiktok,
									},
									{
										name: 'Instagram',
										url: `https://www.instagram.com/?url=${shareUrl}`,
										color: '#E1306C',
										icon: faInstagram,
									},
								];
								const rows = [];
								for (let i = 0; i < links.length; i += 3) {
									rows.push(
										<div
											className='share-links-row'
											key={i}
											style={{
												display: 'flex',
												gap: 16,
												marginBottom: 12,
												justifyContent: 'center',
											}}
										>
											{links.slice(i, i + 3).map((link) => (
												<a
													href={link.url}
													target='_blank'
													rel='noopener noreferrer'
													className='share-link'
													data-platform={link.name}
													key={link.name}
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: 8,
														fontWeight: 700,
														fontSize: 17,
														padding: '0.7em 1.3em',
														borderRadius: 32,
														background: link.color,
														color: '#fff',
														textDecoration: 'none',
														boxShadow:
															'0 2px 8px 0 rgba(30,41,59,0.10)',
														transition:
															'background 0.18s, transform 0.13s',
														border: 'none',
														outline: 'none',
														cursor: 'pointer',
													}}
													onMouseOver={(e) =>
														(e.currentTarget.style.transform =
															'scale(1.06)')
													}
													onMouseOut={(e) =>
														(e.currentTarget.style.transform =
															'scale(1)')
													}
												>
													<span
														style={{
															fontSize: 22,
															display: 'flex',
															alignItems: 'center',
														}}
													>
														<FontAwesomeIcon
															icon={link.icon}
														/>
													</span>
													<span style={{ fontWeight: 700 }}>
														{link.name}
													</span>
												</a>
											))}
										</div>
									);
								}
								return rows;
							})()}
						</div>
						<button
							className='share-modal-close'
							onClick={() => setShowShareModal(false)}
							style={{ marginTop: 16 }}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
