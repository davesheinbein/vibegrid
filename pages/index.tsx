import CustomPuzzleModal from '../src/components/CustomPuzzleModal';
import { useRouter } from 'next/router';
import React from 'react';
import {
	getShareUrl,
	copyToClipboard,
} from '../src/utils/helpers';
import { ShareButton } from '../src/components/ui/Buttons';

// Directory for page-level components and layout logic
// Example stub for StartupPage (to be filled in during refactor)

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
		// Smooth fade for theme change
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
						style={{
							width: '100%',
							fontSize: 20,
							padding: '0.8em 0',
							borderRadius: 12,
							background:
								'linear-gradient(90deg,#f472b6 0%,#38bdf8 100%)',
							color: '#fff',
							fontWeight: 700,
							boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
						}}
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
					onClose={() => setShowCustomModal(false)}
					setCustomPuzzle={setCustomPuzzle}
					setMode={() => {}}
					user={null}
					setShowSignInModal={() => {}}
				/>
			)}
			{showShareModal && (
				<div className='share-modal'>
					<div
						className='share-modal-content'
						style={{ position: 'relative' }}
					>
						<button
							onClick={() => setShowShareModal(false)}
							className='dal-close'
							aria-label='Close'
							style={{
								position: 'absolute',
								top: 16,
								right: 16,
							}}
						>
							<svg
								width='18'
								height='18'
								viewBox='0 0 18 18'
								fill='none'
							>
								<line
									x1='4.5'
									y1='4.5'
									x2='13.5'
									y2='13.5'
									stroke='#222'
									strokeWidth='2'
									strokeLinecap='round'
								/>
								<line
									x1='13.5'
									y1='4.5'
									x2='4.5'
									y2='13.5'
									stroke='#222'
									strokeWidth='2'
									strokeLinecap='round'
								/>
							</svg>
						</button>
						<h2>Share your VibeGrid result!</h2>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(3, 1fr)',
								gridTemplateRows: 'repeat(2, auto)',
								gap: 16,
								justifyItems: 'center',
								alignItems: 'center',
								margin: '24px 0',
							}}
						>
							{/* X */}
							<a
								href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
									'Share your VibeGrid result! https://vibegrid.app'
								)}`}
								target='_blank'
								rel='noopener noreferrer'
								title='Share on X'
								style={{
									textDecoration: 'none',
									display: 'flex',
									alignItems: 'center',
									gap: 6,
								}}
							>
								<svg
									width='28'
									height='28'
									viewBox='0 0 32 32'
									fill='none'
								>
									<circle
										cx='16'
										cy='16'
										r='16'
										fill='#222'
									/>
									<g>
										<text
											x='8'
											y='22'
											fontSize='16'
											fill='#fff'
											fontFamily='Arial'
										>
											X
										</text>
									</g>
								</svg>
								<span
									style={{ fontSize: 15, color: '#222' }}
								>
									X
								</span>
							</a>
							{/* Facebook */}
							<a
								href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
									'https://vibegrid.app'
								)}`}
								target='_blank'
								rel='noopener noreferrer'
								title='Share on Facebook'
								style={{
									textDecoration: 'none',
									display: 'flex',
									alignItems: 'center',
									gap: 6,
								}}
							>
								<svg
									width='28'
									height='28'
									viewBox='0 0 32 32'
									fill='none'
								>
									<circle
										cx='16'
										cy='16'
										r='16'
										fill='#1877F3'
									/>
									<path
										d='M21.5 16h-3v8h-3v-8h-2v-3h2v-1.5C15.5 10.57 16.57 9.5 18.5 9.5H21v3h-2c-.28 0-.5.22-.5.5V13h2.5l-.5 3z'
										fill='#fff'
									/>
								</svg>
								<span
									style={{ fontSize: 15, color: '#1877F3' }}
								>
									Facebook
								</span>
							</a>
							{/* Reddit */}
							<a
								href={`https://www.reddit.com/submit?url=${encodeURIComponent(
									'https://vibegrid.app'
								)}&title=${encodeURIComponent(
									'Share your VibeGrid result!'
								)}`}
								target='_blank'
								rel='noopener noreferrer'
								title='Share on Reddit'
								style={{
									textDecoration: 'none',
									display: 'flex',
									alignItems: 'center',
									gap: 6,
								}}
							>
								<svg
									width='28'
									height='28'
									viewBox='0 0 32 32'
									fill='none'
								>
									<circle
										cx='16'
										cy='16'
										r='16'
										fill='#FF4500'
									/>
									<g>
										<circle
											cx='11.5'
											cy='18'
											r='2'
											fill='#fff'
										/>
										<circle
											cx='20.5'
											cy='18'
											r='2'
											fill='#fff'
										/>
										<ellipse
											cx='16'
											cy='21'
											rx='4'
											ry='2'
											fill='#fff'
										/>
										<circle
											cx='16'
											cy='16'
											r='7'
											stroke='#fff'
											strokeWidth='2'
										/>
									</g>
								</svg>
								<span
									style={{ fontSize: 15, color: '#FF4500' }}
								>
									Reddit
								</span>
							</a>
							{/* LinkedIn */}
							<a
								href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
									'https://vibegrid.app'
								)}`}
								target='_blank'
								rel='noopener noreferrer'
								title='Share on LinkedIn'
								style={{
									textDecoration: 'none',
									display: 'flex',
									alignItems: 'center',
									gap: 6,
								}}
							>
								<svg
									width='28'
									height='28'
									viewBox='0 0 32 32'
									fill='none'
								>
									<circle
										cx='16'
										cy='16'
										r='16'
										fill='#0077B5'
									/>
									<g>
										<rect
											x='9'
											y='13'
											width='3'
											height='10'
											fill='#fff'
										/>
										<rect
											x='10.5'
											y='10'
											width='2'
											height='2'
											rx='1'
											fill='#fff'
										/>
										<rect
											x='15'
											y='17'
											width='3'
											height='6'
											fill='#fff'
										/>
										<rect
											x='18'
											y='17'
											width='3'
											height='6'
											fill='#fff'
										/>
										<rect
											x='15'
											y='13'
											width='6'
											height='2'
											fill='#fff'
										/>
									</g>
								</svg>
								<span
									style={{ fontSize: 15, color: '#0077B5' }}
								>
									LinkedIn
								</span>
							</a>
							{/* TikTok */}
							<a
								href={`https://www.tiktok.com/share?url=${encodeURIComponent(
									'https://vibegrid.app'
								)}`}
								target='_blank'
								rel='noopener noreferrer'
								title='Share on TikTok'
								style={{
									textDecoration: 'none',
									display: 'flex',
									alignItems: 'center',
									gap: 6,
								}}
							>
								<svg
									width='28'
									height='28'
									viewBox='0 0 32 32'
									fill='none'
								>
									<circle
										cx='16'
										cy='16'
										r='16'
										fill='#000'
									/>
									<g>
										<path
											d='M21 10.5c.5 1.5 1.5 2.5 3 3v2.5c-1.5 0-3-.5-4-1.5V20c0 2.5-2 4.5-4.5 4.5S11 22.5 11 20s2-4.5 4.5-4.5c.2 0 .5 0 .7.1v2.6c-.2-.1-.5-.1-.7-.1-1.1 0-2 1-2 2s.9 2 2 2 2-1 2-2v-9h2v1.5z'
											fill='#fff'
										/>
									</g>
								</svg>
								<span
									style={{ fontSize: 15, color: '#000' }}
								>
									TikTok
								</span>
							</a>
							{/* Instagram */}
							<a
								href={`https://www.instagram.com/?url=${encodeURIComponent(
									'https://vibegrid.app'
								)}`}
								target='_blank'
								rel='noopener noreferrer'
								title='Share on Instagram'
								style={{
									textDecoration: 'none',
									display: 'flex',
									alignItems: 'center',
									gap: 6,
								}}
							>
								<svg
									width='28'
									height='28'
									viewBox='0 0 32 32'
									fill='none'
								>
									<circle
										cx='16'
										cy='16'
										r='16'
										fill='#E1306C'
									/>
									<g>
										<rect
											x='10'
											y='10'
											width='12'
											height='12'
											rx='4'
											fill='#fff'
										/>
										<circle
											cx='16'
											cy='16'
											r='3'
											fill='#E1306C'
										/>
										<circle
											cx='21'
											cy='11'
											r='1'
											fill='#E1306C'
										/>
									</g>
								</svg>
								<span
									style={{ fontSize: 15, color: '#E1306C' }}
								>
									Instagram
								</span>
							</a>
							<CopyLinkButton />
						</div>
					</div>
				</div>
			)}
		</>
	);
}

// CopyLinkButton component for copying the share link
function CopyLinkButton() {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = () => {
		copyToClipboard(getShareUrl());
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};
	return (
		<div
			style={{
				gridColumn: '1 / span 3',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
			}}
		>
			<button
				onClick={handleCopy}
				style={{
					border: 'none',
					background: 'none',
					cursor: 'pointer',
					padding: 0,
					boxShadow: 'none',
					width: 'auto',
				}}
				title='Copy link'
			>
				<div
					style={{
						fontSize: 15,
						color: '#000',
						display: 'flex',
						alignItems: 'center',
						gap: 6,
					}}
				>
					<svg
						width='28'
						height='28'
						viewBox='0 0 32 32'
						fill='none'
					>
						<circle cx='16' cy='16' r='16' fill='#64748b' />
						<g>
							<rect
								x='10'
								y='14'
								width='8'
								height='8'
								rx='2'
								fill='#fff'
							/>
							<rect
								x='14'
								y='10'
								width='8'
								height='8'
								rx='2'
								fill='none'
								stroke='#fff'
								strokeWidth='2'
							/>
						</g>
					</svg>
					<span style={{ fontSize: 15, color: '#000' }}>
						Copy Url
					</span>
				</div>
				{copied && (
					<span
						style={{
							color: '#16a34a',
							fontSize: 14,
							marginLeft: 4,
						}}
					>
						Link copied!
					</span>
				)}
			</button>
		</div>
	);
}
