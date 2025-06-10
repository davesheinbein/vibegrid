import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import Modal from './Modal';
import {
	getShareLinks,
	getPersonalizedShareText,
} from '../../../utils/shareLinks';
import { CloseButton } from '../buttons';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import CountUp from 'react-countup';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import copy from 'copy-to-clipboard';
import { format, formatDistanceToNow } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import useSound from 'use-sound';
import stats from 'stats-lite';
import { useSession } from 'next-auth/react';

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

const MOCK_SCORE_HISTORY = [
	80, 90, 70, 100, 95, 85, 88, 92, 76, 99,
];

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

	// --- Toolkit Integrations ---
	const [copied, setCopied] = React.useState(false);
	const [playCopy] = useSound('/sounds/emote-pop.mp3', {
		volume: 0.18,
	});
	const sessionId = React.useMemo(() => uuidv4(), []);
	const avgScore = stats.mean(MOCK_SCORE_HISTORY);
	const { data: session } = useSession();
	const isAdmin = Boolean((session?.user as any)?.isAdmin);

	const handleCopy = (text: string) => {
		copy(text);
		setCopied(true);
		playCopy();
		setTimeout(() => setCopied(false), 1200);
	};

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
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 40 }}
				transition={{ duration: 0.35 }}
				className={clsx('share-modal-content', { minimal })}
			>
				<CloseButton
					onClick={onClose}
					className='share-modal-close'
				/>
				{logoUrl && (
					<img
						src={logoUrl}
						alt='Logo'
						style={{ width: 48, marginBottom: 12 }}
					/>
				)}
				<h2>{title}</h2>
				{score !== undefined && (
					<div className='stat-row'>
						<span>Score:</span>
						<CountUp
							end={score}
							duration={1.2}
							separator=','
						/>
					</div>
				)}
				{finishTime && (
					<div className='stat-row'>
						<span>Finish Time:</span>
						<span>{format(finishTime, 'HH:mm:ss')}</span>
						<span className='stat-date'>
							(
							{formatDistanceToNow(finishTime, {
								addSuffix: true,
							})}
							)
						</span>
					</div>
				)}
				{/* Only show Session ID for admin users */}
				{isAdmin && (
					<div className='stat-row'>
						<span>Session ID:</span>
						<span
							style={{
								fontFamily: 'monospace',
								fontSize: 13,
							}}
						>
							{sessionId}
						</span>
						<button
							className='copy-btn'
							onClick={() => handleCopy(sessionId)}
							aria-label='Copy session ID'
						>
							Copy
						</button>
						{copied && (
							<motion.span
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className='copy-feedback'
							>
								Copied!
							</motion.span>
						)}
					</div>
				)}
				<div className='stat-row'>
					<span>Average Score:</span>
					<CountUp
						end={avgScore}
						decimals={1}
						duration={1.2}
					/>
				</div>
				<div
					style={{
						width: '100%',
						height: 120,
						margin: '16px 0',
					}}
				>
					<ResponsiveContainer width='100%' height='100%'>
						<BarChart
							data={MOCK_SCORE_HISTORY.map((v, i) => ({
								name: `#${i + 1}`,
								score: v,
							}))}
						>
							<XAxis dataKey='name' fontSize={12} />
							<YAxis fontSize={12} />
							<Tooltip />
							<Bar
								dataKey='score'
								fill='#2563eb'
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
				{/* Share links grid styled for Modal.scss compatibility */}
				<div className='share-links-grid'>
					{[0, 3].map((i) => (
						<div className='share-links-row' key={i}>
							{shareLinks.slice(i, i + 3).map((link) => (
								<a
									href={link.url}
									target='_blank'
									rel='noopener noreferrer'
									className={`share-link share-link--${link.name.toLowerCase()}`}
									data-platform={link.name}
									key={link.name}
								>
									<span
										className={`share-link-icon share-link--${link.name.toLowerCase()}`}
									>
										<FontAwesomeIcon
											icon={link.icon as IconProp}
										/>
									</span>
									<span
										className={`share-link-text share-link--${link.name.toLowerCase()}`}
									>
										{link.name}
									</span>
								</a>
							))}
						</div>
					))}
				</div>
				{children}
			</motion.div>
		</Modal>
	);
};

export default ShareModalContent;
