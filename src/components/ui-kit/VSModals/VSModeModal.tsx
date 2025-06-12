// Centralized VSModeModal for UI Kit
import React, { useContext, useState } from 'react';
import { Modal } from '../modals';
import { PrimaryButton, SecondaryButton } from '../buttons';
import { UserSettingsContext } from '../providers';
import { useSession, signIn } from 'next-auth/react';
import SignInModal from '../modals/SignInModal';

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
	const { data: session } = useSession();
	const { settings } = useContext(UserSettingsContext);
	const [showSignIn, setShowSignIn] = useState(false);
	const [pendingMode, setPendingMode] = useState<
		'room' | 'matchmaking' | null
	>(null);
	const [showBot, setShowBot] = useState(false);

	// Handler for room/matchmaking buttons
	const handleProtectedSelect = (
		mode: 'room' | 'matchmaking'
	) => {
		if (!session) {
			setPendingMode(mode);
			setShowSignIn(true);
			return;
		}
		onSelect(mode);
	};

	// Handler for after sign-in
	const handleSignIn = () => {
		signIn();
		setShowSignIn(false);
		// After sign-in, user will need to re-click the button
		setPendingMode(null);
	};

	return (
		<>
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
						fontFamily:
							'Inter, Segoe UI, Arial, sans-serif',
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
								style={{
									marginBottom: 28,
									color: '#64748b',
								}}
							>
								Challenge a friend, compete globally, or
								face off against a smart AI bot!
							</p>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: 18,
								}}
							>
								<PrimaryButton
									onClick={() =>
										handleProtectedSelect('room')
									}
									className='vs-mode-btn vs-mode-room-btn'
									style={{ fontSize: 17, fontWeight: 600 }}
								>
									🔗 Play with a Friend (Room Code)
								</PrimaryButton>
								<PrimaryButton
									onClick={() =>
										handleProtectedSelect('matchmaking')
									}
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
									<PrimaryButton
										key={bot.value}
										onClick={() =>
											onSelect('bot', bot.value as any)
										}
										className={`vs-mode-btn vs-mode-bot-diff-btn vs-mode-bot-${bot.value}`}
										style={{
											textAlign: 'left',
											justifyContent: 'flex-start',
											fontWeight: 700,
											fontSize: 16,
											padding: '12px 18px',
											background: gradient,
											color: '#fff',
											boxShadow: '0 2px 8px 0 #e3eaff33',
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
			{showSignIn && (
				<SignInModal
					open={showSignIn}
					onClose={() => setShowSignIn(false)}
					onSignIn={handleSignIn}
				/>
			)}
		</>
	);
};

export default VSModeModal;
