import React, { useState, useEffect } from 'react';
import { dailyPuzzle } from './data/dailyPuzzle';
import {
	checkGroupValidity,
	partialMatchFeedback,
} from './utils/gameLogic';
import WordButton from './components/WordButton';
import FeedbackBanner from './components/FeedbackBanner';
import EndGameModal from './components/EndGameModal';
import './App.scss';

function App() {
	const [selectedWords, setSelectedWords] = useState<
		string[]
	>([]);
	const [lockedWords, setLockedWords] = useState<string[]>(
		[]
	);
	const [feedback, setFeedback] = useState('');
	const [attemptsLeft, setAttemptsLeft] = useState(4);
	const [gameOver, setGameOver] = useState(false);
	// --- Enhancement: track solved groups for better feedback and UI ---
	const [solvedGroups, setSolvedGroups] = useState<
		string[][]
	>([]);

	// Use useEffect to avoid repeated setTimeout calls on every render
	useEffect(() => {
		if (lockedWords.length === 16 || attemptsLeft === 0) {
			const timer = setTimeout(
				() => setGameOver(true),
				500
			);
			return () => clearTimeout(timer);
		}
	}, [lockedWords.length, attemptsLeft]);

	// --- Enhancement: focus management for accessibility ---
	useEffect(() => {
		if (!gameOver && selectedWords.length > 0) {
			const lastSelected =
				selectedWords[selectedWords.length - 1];
			const el = document.querySelector(
				`[data-word='${lastSelected}']`
			);
			if (el) (el as HTMLElement).focus();
		}
	}, [selectedWords, gameOver]);

	const handleWordClick = (word: string) => {
		if (lockedWords.includes(word) || gameOver) return;
		setSelectedWords((prev) =>
			prev.includes(word)
				? prev.filter((w) => w !== word)
				: [...prev, word]
		);
	};

	const handleSubmit = () => {
		if (gameOver) return;
		if (selectedWords.length !== 4) {
			setFeedback('Select exactly 4 words.');
			return;
		}

		const groupMatch = Object.values(
			dailyPuzzle.groups
		).find((group) =>
			selectedWords.every((word) => group.includes(word))
		);
		if (
			groupMatch &&
			!solvedGroups.some((g) =>
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
					dailyPuzzle.groups
				)
			);
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

	// --- Enhancement: keyboard navigation for accessibility ---
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLDivElement>
	) => {
		if (gameOver) return;
		if (e.key === 'Enter' || e.key === ' ') {
			const word = e.currentTarget.textContent || '';
			if (word) handleWordClick(word);
		}
	};

	return (
		<div className='vibegrid-container'>
			<h1 className='vibegrid-title'>VibeGrid 🎛️</h1>

			{/* Enhancement: Show solved groups visually for clarity */}
			{solvedGroups.length > 0 && (
				<div className='vibegrid-solved-groups'>
					{solvedGroups.map((group, idx) => (
						<div
							className='vibegrid-solved-group'
							key={idx}
						>
							{group.map((word) => (
								<span
									className='vibegrid-solved-word'
									key={word}
								>
									{word}
								</span>
							))}
						</div>
					))}
				</div>
			)}

			<div className='vibegrid-grid'>
				{dailyPuzzle.words.map((word) => (
					<WordButton
						key={word}
						word={word}
						isSelected={selectedWords.includes(word)}
						isLocked={lockedWords.includes(word)}
						onClick={() => handleWordClick(word)}
						onKeyDown={handleKeyDown}
						data-word={word}
					/>
				))}
			</div>

			<button
				className='vibegrid-submit'
				onClick={handleSubmit}
				disabled={attemptsLeft === 0 || gameOver}
			>
				Submit Group
			</button>

			<FeedbackBanner message={feedback} />

			<p className='vibegrid-attempts'>
				Attempts Left: {attemptsLeft}
			</p>

			{gameOver && (
				<EndGameModal
					message={
						lockedWords.length === 16
							? 'You nailed it! 🔥'
							: 'Vibe check failed.'
					}
					onRestart={handleRestart}
				/>
			)}
		</div>
	);
}

export default App;
