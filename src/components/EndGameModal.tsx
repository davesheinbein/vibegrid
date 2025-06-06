import React from 'react';

// EndGameModal: Modal shown at the end of a game session.
// Single responsibility: display end-of-game message and restart action.
// Future-proof: easy to extend for additional actions (e.g., share, view stats) if needed.

interface EndGameModalProps {
	message: string;
	onRestart: () => void;
}

const EndGameModal: React.FC<EndGameModalProps> = ({
	message,
	onRestart,
}) => {
	// Enhancement: allow modal to close on backdrop click for better UX
	const handleBackdropClick = (
		e: React.MouseEvent<HTMLDivElement>
	) => {
		if (e.target === e.currentTarget) {
			onRestart();
		}
	};

	const [copied, setCopied] = React.useState(false);
	const shareUrl = window.location.href;
	const shareText = encodeURIComponent(
		'Check out my VibeGrid result!'
	);

	const handleCopy = () => {
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div
			className='endgame-modal'
			onClick={handleBackdropClick}
		>
			<div className='modal-content'>
				<h2>{message}</h2>
				<p
					style={{
						color: '#64748b',
						fontSize: 16,
						margin: '0.5rem 0 1.2rem 0',
						textAlign: 'center',
					}}
				>
					Come back tomorrow for the next daily challenge!
					<br />
					Or{' '}
					<a
						href='#'
						style={{
							color: '#2563eb',
							textDecoration: 'underline',
						}}
						onClick={(e) => {
							e.preventDefault();
							if (window.location.pathname !== '/browse')
								window.location.assign('/browse');
						}}
					>
						{'browse our community made puzzles'}
					</a>
					.
				</p>
				<div
					style={{
						margin: '1.5rem 0 1rem 0',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 12,
					}}
				>
					<div
						style={{
							display: 'flex',
							gap: 12,
							flexWrap: 'wrap',
							justifyContent: 'center',
						}}
					>
						<a
							href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
								shareUrl
							)}`}
							target='_blank'
							rel='noopener noreferrer'
							title='Share on Facebook'
							style={{ textDecoration: 'none' }}
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
						</a>
						<a
							href={`https://www.reddit.com/submit?url=${encodeURIComponent(
								shareUrl
							)}&title=${shareText}`}
							target='_blank'
							rel='noopener noreferrer'
							title='Share on Reddit'
							style={{ textDecoration: 'none' }}
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
						</a>
						<a
							href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
								shareUrl
							)}`}
							target='_blank'
							rel='noopener noreferrer'
							title='Share on LinkedIn'
							style={{ textDecoration: 'none' }}
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
						</a>
						<a
							href={`https://www.tiktok.com/share?url=${encodeURIComponent(
								shareUrl
							)}`}
							target='_blank'
							rel='noopener noreferrer'
							title='Share on TikTok'
							style={{ textDecoration: 'none' }}
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
						</a>
						<a
							href={`https://www.instagram.com/?url=${encodeURIComponent(
								shareUrl
							)}`}
							target='_blank'
							rel='noopener noreferrer'
							title='Share on Instagram'
							style={{ textDecoration: 'none' }}
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
						</a>
						<button
							onClick={handleCopy}
							style={{
								border: 'none',
								background: 'none',
								cursor: 'pointer',
								padding: 0,
							}}
							title='Copy link'
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
									fill='#64748b'
								/>
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
						</button>
					</div>
					{copied && (
						<div
							style={{
								color: '#16a34a',
								fontSize: 14,
								marginTop: 4,
							}}
						>
							Link copied!
						</div>
					)}
				</div>
				<button
					onClick={() => {
						window.location.assign('/');
					}}
					autoFocus
				>
					Home
				</button>
				{/*
					Future: Add more actions here (e.g., share, view stats)
				*/}
			</div>
		</div>
	);
};

export default EndGameModal;
