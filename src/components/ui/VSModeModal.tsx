import React, { useContext } from 'react';
import { Modal } from './Modal';
import { SubmitButton } from './Buttons';
import { UserSettingsContext } from './UserSettingsProvider';

interface VSModeModalProps {
	open: boolean;
	onClose: () => void;
	onSelect: (
		mode: 'room' | 'matchmaking' | 'bot',
		botDifficulty?: 'easy' | 'medium' | 'hard' | 'legendary'
	) => void;
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
}) => {
	const { settings } = useContext(UserSettingsContext);
	const [showBot, setShowBot] = React.useState(false);
	return (
		<Modal open={open} onClose={onClose}>
			<div
				style={{
					padding: 24,
					textAlign: 'center',
					minWidth: 280,
				}}
			>
				<h2 style={{ marginBottom: 20 }}>VS Mode</h2>
				<p style={{ marginBottom: 28, color: '#64748b' }}>
					Challenge a friend, compete globally, or face off
					against a smart AI bot!
				</p>
				{!showBot ? (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 18,
						}}
					>
						<SubmitButton
							onClick={() => onSelect('room')}
							className='vs-mode-btn vs-mode-room-btn'
						>
							🔗 Play with a Friend (Room Code)
						</SubmitButton>
						<SubmitButton
							onClick={() => onSelect('matchmaking')}
							className='vs-mode-btn vs-mode-matchmaking-btn'
						>
							🌐 Global Matchmaking
						</SubmitButton>
						<SubmitButton
							onClick={() => setShowBot(true)}
							className='vs-mode-btn vs-mode-bot-btn'
						>
							🤖 Challenge a Bot
						</SubmitButton>
					</div>
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
							}}
						>
							Select Bot Difficulty
						</h3>
					{botDifficulties.map((bot) => (
							<SubmitButton
								key={bot.value}
								onClick={() =>
									onSelect('bot', bot.value as any)
								}
								className={`vs-mode-btn vs-mode-bot-diff-btn vs-mode-bot-${bot.value}`}
								style={{
									textAlign: 'left',
									justifyContent: 'flex-start',
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
									style={{ color: '#64748b', fontSize: 13 }}
								>
									{bot.desc}
								</span>
							</SubmitButton>
						))}
						<button
							onClick={() => setShowBot(false)}
							style={{
								marginTop: 10,
								background: 'none',
								border: 'none',
								color: '#2563eb',
								fontWeight: 600,
								cursor: 'pointer',
								fontSize: 15,
							}}
						>
							← Back
						</button>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default VSModeModal;
