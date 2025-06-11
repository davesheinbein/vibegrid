import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import Modal from './Modal';
import {
	getShareLinks,
	getPersonalizedShareText,
} from '../../../utils/shareLinks';
import { CloseButton } from '../buttons';

export interface ShareModalContentProps {
	title: string;
	logoUrl?: string; // Optional logo image URL
	children?: React.ReactNode;
	open: boolean;
	onClose: () => void;
	score?: number;
	finishTime?: number | null;
	formatTimer?: (t: number) => string;
	minimal?: boolean; // If true, show only the daily puzzle link
	solved?: number;
	total?: number;
	attempts?: number;
	mode?: string;
}

const ShareModalContent: React.FC<
	ShareModalContentProps
> = ({
	title,
	logoUrl,
	children,
	open,
	onClose,
	score,
	finishTime,
	formatTimer,
	minimal,
	solved,
	total,
	attempts,
	mode,
}) => {
	const shareUrl = 'https://gridRoyale.app';
	const minimalShareText = `Try the daily puzzle: ${shareUrl}`;
	const timeStr =
		finishTime && formatTimer
			? formatTimer(finishTime)
			: '--:--';
	const shareText = minimal
		? minimalShareText
		: getPersonalizedShareText({
				score: score ?? 0,
				solved: solved ?? 0,
				total: total ?? 4,
				attempts: attempts ?? 0,
				time: timeStr,
				mode: mode || 'Daily Puzzle',
				url: shareUrl,
		  });
	const shareLinks = getShareLinks(
		'result',
		shareText,
		shareUrl,
		title
	);

	const renderGameInfo = () => {
		if (minimal) {
			return (
				<div
					style={{
						color: '#2563eb',
						fontWeight: 600,
						fontSize: '1.1em',
						textAlign: 'center',
					}}
				>
					Try the daily puzzle:{' '}
					<a
						href={shareUrl}
						target='_blank'
						rel='noopener noreferrer'
						style={{
							color: '#2563eb',
							fontWeight: 600,
							wordBreak: 'break-all',
						}}
					>
						{shareUrl}
					</a>
				</div>
			);
		}
		if (typeof score === 'number') {
			return (
				<div>
					<div
						style={{ fontWeight: 600, fontSize: '1.2em' }}
					>
						I scored <b>{score}</b> on Grid Royale!
					</div>
					{typeof finishTime === 'number' &&
						formatTimer && (
							<div
								style={{
									marginTop: 8,
									color: '#2563eb',
									fontSize: '1em',
								}}
							>
								Finished in:{' '}
								<b>{formatTimer(finishTime)}</b>
							</div>
						)}
					<div
						style={{
							marginTop: 8,
							color: '#2563eb',
							fontSize: '1em',
						}}
					>
						Can you beat my score?
						<br />
						Try the daily puzzle:
						<br />
						<a
							href={shareUrl}
							target='_blank'
							rel='noopener noreferrer'
							style={{
								color: '#2563eb',
								fontWeight: 600,
								wordBreak: 'break-all',
							}}
						>
							{shareUrl}
						</a>
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div
				className='share-modal-content'
				style={{ textAlign: 'center' }}
			>
				<CloseButton onClick={onClose} />
				{logoUrl && (
					<img
						alt='Grid Royale Logo'
						src={logoUrl}
						style={{
							width: 180,
							height: 180,
							margin: '10px auto 0',
							borderRadius: 16,
						}}
					/>
				)}
				<h2>{title}</h2>
				{/* Render game info and children (e.g., CopyLinkButton) */}
				<div
					style={{
						margin: '10px 0 18px',
						fontSize: '1em',
					}}
				>
					{renderGameInfo()}
				</div>
				<div className='share-links-grid'>
					{(() => {
						const rows = [];
						for (let i = 0; i < shareLinks.length; i += 3) {
							rows.push(
								<div className='share-links-row' key={i}>
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
												style={{ color: link.color }}
											>
												<span className='share-link-icon'>
													<FontAwesomeIcon
														icon={link.icon as IconProp}
													/>
												</span>
												<span className='share-link-text'>
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
				<div>{children}</div>
			</div>
		</Modal>
	);
};

export default ShareModalContent;
