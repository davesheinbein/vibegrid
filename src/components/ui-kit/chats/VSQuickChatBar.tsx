// VSQuickChatBar.tsx
// Quick chat/emotes bar for VS modes (stub)
// TODO: Implement emote/taunt sending and animation
import React, { useState } from 'react';
import { playSound } from '../../../utils/sound';

const QUICK_EMOTES = [
	{ icon: '🔥', label: 'Burn' },
	{ icon: '👏', label: 'Nice' },
	{ icon: '😈', label: 'Taunt' },
	{ icon: '😅', label: 'Oops' },
	{ icon: '💀', label: 'Dead' },
	{ icon: '🏆', label: 'Win' },
];

const VSQuickChatBar: React.FC<{
	onEmote: (emote: string) => void;
}> = ({ onEmote }) => {
	const [pressedIdx, setPressedIdx] = useState<
		number | null
	>(null);

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 32,
				left: '50%',
				transform: 'translateX(-50%)',
				background: 'rgba(30, 41, 59, 0.85)',
				borderRadius: 32,
				padding: '10px 24px',
				display: 'flex',
				gap: 18,
				boxShadow: '0 4px 24px 0 #2222',
				zIndex: 20,
				backdropFilter: 'blur(8px)',
			}}
			role='toolbar'
			aria-label='Quick Emotes'
		>
			{QUICK_EMOTES.map((emote, idx) => (
				<button
					key={emote.icon}
					onClick={() => {
						setPressedIdx(idx);
						onEmote(emote.icon);
						playSound('emote');
						setTimeout(() => setPressedIdx(null), 180);
					}}
					aria-label={emote.label}
					style={{
						background: 'none',
						border: 'none',
						outline: 'none',
						fontSize: 28,
						borderRadius: '50%',
						width: 44,
						height: 44,
						cursor: 'pointer',
						boxShadow:
							pressedIdx === idx
								? '0 0 0 4px #2563eb55, 0 2px 8px #0002'
								: '0 1px 4px #0001',
						transform:
							pressedIdx === idx
								? 'scale(1.18)'
								: 'scale(1)',
						transition: 'all 0.15s cubic-bezier(.4,2,.6,1)',
						filter:
							pressedIdx === idx
								? 'drop-shadow(0 0 8px #fff8)'
								: 'none',
					}}
				>
					<span aria-hidden>{emote.icon}</span>
				</button>
			))}
		</div>
	);
};

export default VSQuickChatBar;
