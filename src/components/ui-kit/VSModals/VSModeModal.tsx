// Centralized VSModeModal for UI Kit
import React, { useContext, useState } from 'react';
import { Modal } from '../modals';
import { PrimaryButton, SecondaryButton } from '../buttons';
import { UserSettingsContext } from '../providers';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import useSound from 'use-sound';

interface VSModeModalProps {
	open: boolean;
	onClose: () => void;
	onSelect: (
		mode: 'room' | 'matchmaking' | 'bot',
		botDifficulty?: 'easy' | 'medium' | 'hard' | 'legendary'
	) => void;
	isSearching?: boolean;
}

const botDifficulties = [
	{
		label: 'Easy',
		value: 'easy',
		desc: 'Random guesses, frequent mistakes.',
	},
	{
		label: 'Medium',
		value: 'medium',
		desc: 'Some logic, modest mistakes.',
	},
	{
		label: 'Hard',
		value: 'hard',
		desc: 'Pattern detection, strategic burns.',
	},
	{
		label: 'Legendary',
		value: 'legendary',
		desc: 'Near-perfect logic, fast.',
	},
];

const VSModeModal: React.FC<VSModeModalProps> = ({
	open,
	onClose,
	onSelect,
	isSearching = false,
}) => {
	const { settings } = useContext(UserSettingsContext);
	const [showBot, setShowBot] = useState(false);
	const [playBotSelect] = useSound(
		'/sounds/emote-pop.mp3',
		{ volume: 0.18 }
	);
	const [selectedBot, setSelectedBot] = useState<
		string | null
	>(null);

	return (
		<Modal open={open} onClose={onClose}>
			<div
				style={{
					padding: 28,
					textAlign: 'center',
					minWidth: 300,
					maxWidth: 420,
					background: 'rgba(255,255,255,0.98)',
					borderRadius: 18,
					boxShadow:
						'0 4px 32px 0 #00308733, 0 2px 8px 0 #e3eaff33',
					fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
					color: '#1e293b',
					animation:
						'fadeInUp 0.32s cubic-bezier(0.23, 1.01, 0.32, 1)',
				}}
			>
				<h2
					style={{
						marginBottom: 18,
						fontWeight: 700,
						fontSize: 26,
					}}
				>
					VS Mode
				</h2>
				{isSearching ? (
					<div style={{ margin: '32px 0 18px' }}>
						<div
							style={{
								fontSize: 20,
								fontWeight: 600,
								marginBottom: 10,
							}}
						>
							Global Matchmaking
						</div>
						<div
							style={{
								color: '#64748b',
								fontSize: 16,
								marginBottom: 18,
							}}
						>
							Searching for an opponent...
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								gap: 12,
							}}
						>
							<SecondaryButton
								onClick={onClose}
								style={{ minWidth: 120 }}
							>
								Cancel
							</SecondaryButton>
						</div>
					</div>
				) : !showBot ? (
					<>
						<p
							style={{ marginBottom: 28, color: '#64748b' }}
						>
							Challenge a friend, compete globally, or face
							off against a smart AI bot!
						</p>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 18,
							}}
						>
							<PrimaryButton
								onClick={() => onSelect('room')}
								className='vs-mode-btn vs-mode-room-btn'
								style={{ fontSize: 17, fontWeight: 600 }}
							>
								🔗 Play with a Friend (Room Code)
							</PrimaryButton>
							<PrimaryButton
								onClick={() => onSelect('matchmaking')}
								className='vs-mode-btn vs-mode-matchmaking-btn'
								style={{ fontSize: 17, fontWeight: 600 }}
							>
								🌐 Global Matchmaking
							</PrimaryButton>
							<PrimaryButton
								onClick={() => setShowBot(true)}
								className='vs-mode-btn vs-mode-bot-btn'
								style={{ fontSize: 17, fontWeight: 600 }}
							>
								🤖 Challenge a Bot
							</PrimaryButton>
						</div>
					</>
				) : (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 14,
						}}
					>
						<h3
							style={{
								margin: '10px 0 8px',
								color: '#1e293b',
								fontWeight: 600,
								fontSize: 18,
							}}
						>
							Select Bot Difficulty
						</h3>
						{botDifficulties.map((bot) => {
							// Assign a unique gradient for each difficulty
							let gradient = '';
							switch (bot.value) {
								case 'easy':
									gradient =
										'linear-gradient(90deg, #22d3ee 0%, #34d399 100%)'; // teal-green
									break;
								case 'medium':
									gradient =
										'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)'; // blue-cyan
									break;
								case 'hard':
									gradient =
										'linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)'; // yellow-orange
									break;
								case 'legendary':
									gradient =
										'linear-gradient(90deg, #a78bfa 0%, #f472b6 100%)'; // purple-pink
									break;
								default:
									gradient =
										'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)';
							}
							return (
								<motion.div
									key={bot.value}
									whileHover={{ scale: 1.04 }}
									whileTap={{ scale: 0.97 }}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.22,
										delay: 0.05,
									}}
								>
									<PrimaryButton
										onClick={() => {
											setSelectedBot(bot.value);
											playBotSelect();
											setTimeout(
												() =>
													onSelect('bot', bot.value as any),
												120
											);
										}}
										className={clsx(
											'vs-mode-btn',
											'vs-mode-bot-diff-btn',
											`vs-mode-bot-${bot.value}`,
											{
												selected: selectedBot === bot.value,
											}
										)}
										style={{
											textAlign: 'left',
											justifyContent: 'flex-start',
											fontWeight: 700,
											fontSize: 16,
											padding: '12px 18px',
											background: gradient,
											color: '#fff',
											boxShadow: '0 2px 8px 0 #e3eaff33',
											border:
												selectedBot === bot.value
													? '2px solid #fff'
													: undefined,
										}}
									>
										<span
											style={{
												fontWeight: 700,
												marginRight: 8,
											}}
										>
											{bot.label}
										</span>
										<span
											style={{
												color: '#e0e7ef',
												fontSize: 13,
											}}
										>
											{bot.desc}
										</span>
									</PrimaryButton>
								</motion.div>
							);
						})}
						<SecondaryButton
							onClick={() => setShowBot(false)}
							style={{
								marginTop: 10,
								fontSize: 15,
								fontWeight: 600,
							}}
						>
							← Back
						</SecondaryButton>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default VSModeModal;
