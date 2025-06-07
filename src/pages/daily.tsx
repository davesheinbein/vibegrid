import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
	dailyPuzzle,
	shuffle,
	getShareUrl,
	getShareTitle,
	getShareText,
	copyToClipboard,
	getAllWordsFromGroupsAndWildcards,
} from '../utils/helpers';
import {
	checkGroupValidity,
	partialMatchFeedback,
	groupsArrayToObject,
} from '../utils/gameLogic';
import {
	WordButton,
	GoBackButton,
} from '../components/ui/Buttons';
import FeedbackBanner from '../components/ui/FeedbackBanner';
import EndGameModal from '../components/modal/EndGameModal';
import RulesModal from '../components/modal/RulesModal';
import StatisticsModal from '../components/modal/StatisticsModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import {
	faXTwitter,
	faMeta,
	faReddit,
	faLinkedin,
	faTiktok,
	faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../components/ui/Modal';

interface DailyPageProps {
	onBack?: () => void;
}

export default function Daily(props: DailyPageProps) {
	const [selectedWords, setSelectedWords] = useState<
		string[]
	>([]);
	const [lockedWords, setLockedWords] = useState<string[]>(
		[]
	);
	const [feedback, setFeedback] = useState('');
	const [attemptsLeft, setAttemptsLeft] = useState(4);
	const [gameOver, setGameOver] = useState(false);
	const [solvedGroups, setSolvedGroups] = useState<
		string[][]
	>([]);
	const [showRules, setShowRules] = useState(false);
	const [showStats, setShowStats] = useState(false);
	const [shake, setShake] = useState(false);
	const [burnSuspect, setBurnSuspect] = useState<
		string | null
	>(null);
	const [burnedWildcards, setBurnedWildcards] = useState<
		string[]
	>([]);
	const [burnBonus, setBurnBonus] = useState(0);
	const [startTime] = useState(Date.now());
	const [endTime, setEndTime] = useState<number | null>(
		null
	);
	const [showShare, setShowShare] = useState(false);

	const activePuzzle = dailyPuzzle;
	const gridCols = activePuzzle.size?.cols || 4;
	const gridRows =
		activePuzzle.size?.rows ||
		Math.ceil(
			(activePuzzle.words?.length || 16) / gridCols
		);
	const gridWordCount = gridRows * gridCols;
	const groupCount = activePuzzle.groups?.length || 4;
	const groupSize = activePuzzle.groups?.[0]?.length || 4;

	const [shuffledWords, setShuffledWords] = useState<
		string[]
	>([]);

	useEffect(() => {
		setShuffledWords(
			shuffle(
				getAllWordsFromGroupsAndWildcards(
					activePuzzle.groups,
					activePuzzle.wildcards
				)
			)
		);
	}, [activePuzzle]);

	useEffect(() => {
		setShuffledWords(
			shuffle(
				getAllWordsFromGroupsAndWildcards(
					activePuzzle.groups,
					activePuzzle.wildcards
				)
			)
		);
		setSelectedWords([]);
		setLockedWords([]);
		setFeedback('');
		setAttemptsLeft(4);
		setGameOver(false);
		setSolvedGroups([]);
		setBurnSuspect(null);
		setBurnedWildcards([]);
		setBurnBonus(0);
		setEndTime(null);
	}, [activePuzzle]);

	const [animatingGroup, setAnimatingGroup] = useState<
		string[] | null
	>(null);
	const [pendingSolvedGroups, setPendingSolvedGroups] =
		useState<string[][]>([]);
	useEffect(() => {
		if (
			solvedGroups.length > 0 &&
			pendingSolvedGroups.length < solvedGroups.length
		) {
			const newGroup =
				solvedGroups[solvedGroups.length - 1];
			setAnimatingGroup(newGroup);
			setTimeout(() => {
				setPendingSolvedGroups((prev) => [
					...prev,
					newGroup,
				]);
				setAnimatingGroup(null);
			}, 700);
		}
	}, [solvedGroups]);

	const solvedWords = pendingSolvedGroups.flat();
	const animatingWords = animatingGroup || [];
	const gridWords = shuffledWords.filter(
		(word) =>
			!solvedWords.includes(word) &&
			!animatingWords.includes(word)
	);

	const isWildcard = (word: string) =>
		activePuzzle.wildcards?.includes(word);

	const confirmBurn = () => {
		if (!burnSuspect) return;
		if (isWildcard(burnSuspect)) {
			const newBurned = [...burnedWildcards, burnSuspect];
			setBurnedWildcards(newBurned);
			setLockedWords((prev) => [...prev, burnSuspect]);
			setBurnBonus(
				(prev) => prev + (attemptsLeft >= 2 ? 10 : 5)
			);
			setFeedback('🔥 Correct burn! Bonus awarded!');
			if (
				activePuzzle.wildcards &&
				activePuzzle.wildcards.length > 0 &&
				activePuzzle.wildcards.every((w: string) =>
					newBurned.includes(w)
				)
			) {
				setAttemptsLeft((prev) => prev + 1);
				setFeedback(
					'🔥 All wildcards burned! Extra attempt awarded!'
				);
			}
		} else {
			setAttemptsLeft((prev) => prev - 1);
			setFeedback(
				'❌ That word belongs to a group! Penalty.'
			);
		}
		setBurnSuspect(null);
		setSelectedWords([]);
	};

	const handleWordTap = (word: string) => {
		if (lockedWords.includes(word) || gameOver) return;
		if (burnSuspect === word) {
			setBurnSuspect(null);
			return;
		}
		if (selectedWords.includes(word)) {
			setSelectedWords((prev) =>
				prev.filter((w) => w !== word)
			);
			setBurnSuspect(word);
		} else if (burnSuspect) {
			setBurnSuspect(word);
		} else if (selectedWords.length < groupSize) {
			setSelectedWords((prev) => [...prev, word]);
		}
	};

	const handleWordRightClick = (word: string, e: React.MouseEvent) => {
		e.preventDefault();
		if (lockedWords.includes(word) || gameOver) return;
		setBurnSuspect((prev) => (prev === word ? null : word));
	};

	const handleSubmit = () => {
		if (gameOver) return;
		if (selectedWords.length !== groupSize) {
			setFeedback(`Select exactly ${groupSize} words.`);
			return;
		}
		const groupMatch = activePuzzle.groups.find(
			(group: string[]) =>
				selectedWords.every((word) => group.includes(word))
		);
		if (
			groupMatch &&
			!solvedGroups.some((g: string[]) =>
				g.every((word) => groupMatch.includes(word))
			)
		) {
			setLockedWords((prev) => [...prev, ...selectedWords]);
			setSolvedGroups((prev) => [...prev, groupMatch]);
			setFeedback('Group locked in!');
			setSelectedWords([]);
		} else if (groupMatch) {
			setFeedback('This group is already solved.');
			setSelectedWords([]);
		} else {
			setAttemptsLeft((prev) => prev - 1);
			setFeedback(
				partialMatchFeedback(
					selectedWords,
					Object.fromEntries(
						activePuzzle.groups.map(
							(g: string[], i: number) => [i, g]
						)
					)
				)
			);
			setShake(true);
			setTimeout(() => setShake(false), 500);
			setSelectedWords([]);
		}
	};

	const handleRestart = () => {
		setSelectedWords([]);
		setLockedWords([]);
		setFeedback('');
		setAttemptsLeft(4);
		setGameOver(false);
		setSolvedGroups([]);
	};

	const handleRandomize = () => {
		setShuffledWords(shuffle(activePuzzle.words));
	};

	const handleShare = async () => {
		const text = getShareText();
		const url = getShareUrl();
		const title = getShareTitle();
		if (navigator.share) {
			try {
				await navigator.share({ title, text, url });
				return;
			} catch {}
		}
		setShowShare(true);
	};
	const getShareText = () => {
		const solved = solvedGroups.length;
		const attempts = 4 - attemptsLeft;
		const words = lockedWords.length;
		const total = gridWordCount;
		const emoji = words === total ? '🔥' : '✨';
		return `VibeGrid: ${solved}/${groupCount} groups solved in ${attempts} attempts! ${emoji} Play: https://vibegrid.app`;
	};
	const getShareUrl = () => 'https://vibegrid.app';
	const getShareTitle = () =>
		"VibeGrid: Can you solve today's grid?";
	const shareLinks = [
		{
			name: 'X',
			url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				getShareText()
			)}`,
			icon: <FontAwesomeIcon icon={faXTwitter} />,
		},
		{
			name: 'Meta',
			url: `https://www.meta.com/share?u=${encodeURIComponent(
				getShareUrl()
			)}&quote=${encodeURIComponent(getShareText())}`,
			icon: <FontAwesomeIcon icon={faMeta} />,
		},
		{
			name: 'Reddit',
			url: `https://www.reddit.com/submit?title=${encodeURIComponent(
				getShareTitle()
			)}&text=${encodeURIComponent(getShareText())}`,
			icon: <FontAwesomeIcon icon={faReddit} />,
		},
		{
			name: 'LinkedIn',
			url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
				getShareUrl()
			)}&title=${encodeURIComponent(
				getShareTitle()
			)}&summary=${encodeURIComponent(getShareText())}`,
			icon: <FontAwesomeIcon icon={faLinkedin} />,
		},
		{
			name: 'TikTok',
			url: `https://www.tiktok.com/share?url=${encodeURIComponent(
				getShareUrl()
			)}&text=${encodeURIComponent(getShareText())}`,
			icon: <FontAwesomeIcon icon={faTiktok} />,
		},
		{
			name: 'Instagram',
			url: `https://www.instagram.com/?url=${encodeURIComponent(
				getShareUrl()
			)}`,
			icon: <FontAwesomeIcon icon={faInstagram} />,
		},
	];

	return (
		<div className='fullscreen-bg'>
			<div className='vibegrid-container'>
				<div className='vibegrid-header-row'>
					<GoBackButton
						onClick={
							props.onBack
								? props.onBack
								: () => window.location.assign('/')
						}
						className='back-icon-btn'
						label='Back'
					/>
					<div className='vibegrid-header-heading'>
						<h1 className='vibegrid-title'>
							{activePuzzle.title || 'VibeGrid Daily'}
						</h1>
						<div className='vibegrid-subtitle'>
							Daily Puzzle
						</div>
					</div>
					<div
						className='vibegrid-icons'
						style={{
							display: 'flex',
							gap: 8,
							alignItems: 'center',
							justifyContent: 'flex-end',
							minWidth: 80,
						}}
					>
						<button
							className='rules-btn'
							aria-label='Statistics'
							onClick={() => setShowStats(true)}
						>
							<FontAwesomeIcon
								icon={faChartBar}
								className='rules-icon'
							/>
						</button>
						<button
							className='rules-btn'
							onClick={() => setShowRules(true)}
							aria-label='How to Play'
						>
							<svg
								className='rules-icon'
								viewBox='0 0 24 24'
								width='28'
								height='28'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<circle cx='12' cy='12' r='10' />
								<line x1='12' y1='16' x2='12' y2='12' />
								<line x1='12' y1='8' x2='12' y2='8' />
							</svg>
						</button>
					</div>
				</div>

				{/* Solved groups, grid, controls, etc. remain unchanged */}
				{solvedGroups.length > 0 && (
					<div className='vibegrid-solved-groups'>
						{pendingSolvedGroups.map(
							(group: string[], idx: number) => {
								const groupIdx =
									activePuzzle.groups.findIndex(
										(g: string[]) =>
											g.length === group.length &&
											g.every((w: string) =>
												group.includes(w)
											)
									);
								let groupLabel = `Group ${groupIdx + 1}`;
								if (
									activePuzzle.groupLabels &&
									Array.isArray(activePuzzle.groupLabels) &&
									activePuzzle.groupLabels[groupIdx]
								) {
									groupLabel =
										activePuzzle.groupLabels[groupIdx];
								}
								return (
									<section
										className={`vibegrid-solved-group vibegrid-solved-group-${
											['easy', 'medium', 'hard', 'expert'][
												idx
											]
										}`}
										key={idx}
										role='img'
										aria-label={`Correct group ${groupLabel}. ${group.join(
											','
										)}`}
									>
										<h3 className='vibegrid-solved-category'>
											{groupLabel}
										</h3>
										<ol className='vibegrid-solved-word-list'>
											{group.map((word: string) => (
												<li
													className='vibegrid-solved-word'
													key={word}
												>
													{word}
												</li>
											))}
										</ol>
									</section>
								);
							}
						)}
					</div>
				)}
				<div className='daily-center-flex-row'>
					<div
						className='vibegrid-grid daily-grid'
						data-cols={gridCols}
						data-rows={gridRows}
						style={{
							gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
						}}
					>
						{gridWords.map((word: string) => (
							<WordButton
								key={word}
								word={word}
								isSelected={selectedWords.includes(word)}
								isLocked={lockedWords.includes(word)}
								onClick={() => handleWordTap(word)}
								onContextMenu={(e: React.MouseEvent) => handleWordRightClick(word, e)}
								burnSuspect={burnSuspect === word}
							/>
						))}
						{animatingGroup &&
							animatingGroup.map((word: string) => (
								<WordButton
									key={word + '-animating'}
									word={word}
									isSelected={false}
									isLocked={true}
									onClick={() => {}}
									className='word-btn animating-to-solved'
								/>
							))}
					</div>
				</div>
				<div className='vibegrid-controls'>
					<div
						className='vibegrid-submit-wrapper'
						style={{ justifyContent: 'center' }}
					>
						<button
							className='vibegrid-submit'
							onClick={handleSubmit}
							disabled={attemptsLeft === 0 || gameOver}
							style={{ margin: '0 auto' }}
						>
							Submit
						</button>
					</div>
					{burnSuspect && (
						<div className='burn-status-bar'>
							🔥 Burn active 🔥 <b>{burnSuspect}</b>
							<button
								className='burn-btn'
								onClick={confirmBurn}
							>
								Confirm Burn
							</button>
						</div>
					)}
					<div className='daily-controls-flex-col'>
						<FeedbackBanner message={feedback} />
						<div className='vibegrid-attempts-bar'>
							{[...Array(attemptsLeft > 4 ? 5 : 4)].map(
								(_, i) => (
									<span
										key={i}
										className={
											'vibegrid-attempt-dot' +
											(i >= attemptsLeft ? ' used' : '')
										}
									></span>
								)
							)}
						</div>
						<div className='vibegrid-attempts'>
							Attempts Left: {attemptsLeft}
						</div>
						<div className='vibegrid-attempts'>
							<button
								className='randomize-btn'
								aria-label='Randomize word order'
								onClick={handleRandomize}
							>
								Mix It Up!
							</button>
							<button
								className='deselect-btn'
								aria-label='Deselect all'
								onClick={() => setSelectedWords([])}
							>
								Deselect All
							</button>
						</div>
					</div>
					<button
						className='share-btn'
						onClick={handleShare}
					>
						<FontAwesomeIcon
							icon={faShareAlt}
							className='share-icon'
						/>
						Share
					</button>
					{showShare && (
						<Modal
							open={showShare}
							onClose={() => setShowShare(false)}
						>
							<div className='share-modal-content'>
								<h2>Share your VibeGrid result!</h2>
								<div className='share-links-grid'>
									{(() => {
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
														.map((link) => {
															let brandColor = '#64748b';
															switch (link.name) {
																case 'X':
																	brandColor = '#222';
																	break;
																case 'Meta':
																	brandColor = '#1877F3';
																	break;
																case 'Reddit':
																	brandColor = '#FF4500';
																	break;
																case 'LinkedIn':
																	brandColor = '#0077B5';
																	break;
																case 'TikTok':
																	brandColor = '#000';
																	break;
																case 'Instagram':
																	brandColor = '#E1306C';
																	break;
																default:
																	break;
															}
															return (
																<a
																	href={link.url}
																	target='_blank'
																	rel='noopener noreferrer'
																	className={`share-link share-link--${link.name.toLowerCase()}`}
																	data-platform={link.name}
																	key={link.name}
																>
																	<span className='share-link-icon'>
																		{link.icon}
																	</span>
																	<span className='share-link-text'>
																		{link.name}
																	</span>
																</a>
															);
														})}
												</div>
											);
										}
										return rows;
									})()}
								</div>
							</div>
						</Modal>
					)}
				</div>
				{gameOver && (
					<EndGameModal
						message={
							lockedWords.length === gridWordCount
								? 'You nailed it!'
								: 'Vibe check failed.'
						}
						onRestart={handleRestart}
					/>
				)}
				<StatisticsModal
					open={showStats}
					onClose={() => setShowStats(false)}
					user={null}
					setUser={() => {}}
					dailyCompleted={true}
				/>
				<RulesModal
					open={showRules}
					onClose={() => setShowRules(false)}
				/>
			</div>
		</div>
	);
}
