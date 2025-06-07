import CustomPuzzleModal from '../components/modal/CustomPuzzleModal';
import { useRouter } from 'next/router';
import React from 'react';
import {
	getShareUrl,
	copyToClipboard,
	shareLinks,
} from '../utils/helpers';
import {
	ShareButton,
	CopyLinkButton,
} from '../components/ui/Buttons';
import { Modal } from '../components/ui/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faXTwitter,
	faRedditAlien,
	faLinkedinIn,
	faTiktok,
	faInstagram,
	faMeta,
} from '@fortawesome/free-brands-svg-icons';

interface StartupPageProps {
	onStartDaily: () => void;
	onStartCustom: () => void;
	onBrowseCustom: () => void;
	onShare: () => void;
}

const StartupPage: React.FC<StartupPageProps> = ({
	onStartDaily,
	onStartCustom,
	onBrowseCustom,
	onShare,
}) => {
	const [darkMode, setDarkMode] = React.useState(false);
	React.useEffect(() => {
		document.body.classList.toggle('dark-mode', darkMode);

		document.body.style.transition =
			'background 0.25s ease-in-out, color 0.25s';
	}, [darkMode]);

	return (
		<div className='fullscreen-bg'>
			<div
				className='startup-page vibegrid-container'
				style={{
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					background:
						'linear-gradient(120deg,#f0f9ff 0%,#e0e7ff 100%)',
				}}
			>
				<img
					src='https://i.imgur.com/1jPtNmW.png'
					alt='VibeGrid logo'
					style={{ width: 360 }}
				/>
				<h1
					className='vibegrid-title'
					style={{
						fontSize: 44,
						margin: 0,
						color: '#2563eb',
						letterSpacing: 1,
					}}
				>
					VibeGrid
				</h1>
				<p
					className='vibegrid-subtitle'
					style={{
						color: '#64748b',
						fontSize: 20,
						margin: '10px 0 32px 0',
					}}
				>
					A daily word grouping puzzle. Can you find the
					vibe?
				</p>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 20,
						alignItems: 'center',
						width: '100%',
						maxWidth: 340,
					}}
				>
					<button
						className='vibegrid-submit'
						onClick={onStartDaily}
						style={{
							width: '100%',
							fontSize: 20,
							padding: '0.8em 0',
							borderRadius: 12,
							background:
								'linear-gradient(90deg,#38bdf8 0%,#fbbf24 100%)',
							color: '#fff',
							fontWeight: 700,
							boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
						}}
					>
						Play Daily Puzzle
					</button>
					<button
						className='vibegrid-submit'
						onClick={onStartCustom}
						style={{
							width: '100%',
							fontSize: 20,
							padding: '0.8em 0',
							borderRadius: 12,
							background:
								'linear-gradient(90deg,#a7f3d0 0%,#38bdf8 100%)',
							color: '#2563eb',
							fontWeight: 700,
							boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
						}}
					>
						Create Custom Puzzle
					</button>
					<button
						className='vibegrid-submit'
						onClick={onBrowseCustom}
						style={{
							width: '100%',
							fontSize: 20,
							padding: '0.8em 0',
							borderRadius: 12,
							background:
								'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)',
							color: '#fff',
							fontWeight: 700,
							boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
						}}
					>
						Browse Custom Puzzles
					</button>
					<ShareButton
						className='vibegrid-submit'
						onClick={onShare}
						label='Share VibeGrid'
					/>
					<div
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							margin: '8px 0',
						}}
					>
						<label className='container'>
							<input
								type='checkbox'
								checked={!darkMode}
								onChange={() => setDarkMode((d) => !d)}
								aria-checked={!darkMode}
								aria-label='Toggle dark mode'
							/>
							<div className='checkbox-wrapper'>
								<div className='checkmark'></div>
								<div className='nebula-glow'></div>
								<div className='sparkle-container'></div>
							</div>
						</label>
					</div>
				</div>
				<p
					style={{
						color: '#94a3b8',
						fontSize: 15,
						marginTop: 40,
					}}
				>
					&copy; {new Date().getFullYear()} VibeGrid &mdash;
					Made with{' '}
					<span style={{ color: '#f87171' }}>♥</span>
				</p>
			</div>
		</div>
	);
};

export default function Home() {
	const router = useRouter();
	const [showCustomModal, setShowCustomModal] =
		React.useState(false);
	const [customPuzzle, setCustomPuzzle] =
		React.useState<any>(null);
	const [showShareModal, setShowShareModal] =
		React.useState(false);

	return (
		<>
			<StartupPage
				onStartDaily={() => router.push('/daily')}
				onStartCustom={() => setShowCustomModal(true)}
				onBrowseCustom={() => router.push('/browse')}
				onShare={() => setShowShareModal(true)}
			/>
			{showCustomModal && (
				<CustomPuzzleModal
					open={showCustomModal}
					onClose={() => setShowCustomPuzzle(false)}
					setCustomPuzzle={setCustomPuzzle}
					setMode={() => {}}
					user={null}
					setShowSignInModal={() => {}}
				/>
			)}
			{showShareModal && (
				<Modal
					open={showShareModal}
					onClose={() => setShowShareModal(false)}
				>
					<div className='share-modal-content'>
						<h2>Share your VibeGrid result!</h2>
						<div className='share-links-grid'>
							{(() => {
								const iconMap = {
									X: <FontAwesomeIcon icon={faXTwitter} />,
									Meta: <FontAwesomeIcon icon={faMeta} />,
									Reddit: (
										<FontAwesomeIcon icon={faRedditAlien} />
									),
									LinkedIn: (
										<FontAwesomeIcon icon={faLinkedinIn} />
									),
									TikTok: (
										<FontAwesomeIcon icon={faTiktok} />
									),
									Instagram: (
										<FontAwesomeIcon icon={faInstagram} />
									),
								};
								const rows = [];
								for (
									let i = 0;
									i < shareLinks.length;
									i += 3
								) {
									rows.push(
										<div
											className='share-links-row'
											key={i}
										>
											{shareLinks
												.slice(i, i + 3)
												.map((link) => (
													<a
														href={link.url}
														target='_blank'
														rel='noopener noreferrer'
														className={`share-link share-link--${link.name.toLowerCase()}`}
														data-platform={link.name}
														key={link.name}
													>
														<span className='share-link-icon'>
															{
																iconMap[
																	link.name as keyof typeof iconMap
																]
															}
														</span>
														<span className='share-link-text'>
															{link.name}
														</span>
													</a>
												))}
										</div>
									);
								}
								return [
									...rows,
									<CopyLinkButton key='copy-link' />,
								];
							})()}
						</div>
					</div>
				</Modal>
			)}
		</>
	);
}
