import React, { useState } from 'react';
import {
	parseGroupsFromInputs,
	parseGroupsFromText,
	getUniqueWordsFromGroups,
	capitalizeWords,
	getAllWordsFromGroupsAndWildcards,
} from '../../../utils/helpers';
import { WordButton, CloseButton } from '../buttons';
import { Modal } from './Modal';
import { VSGrid } from '../grids';
import { createPuzzle } from '../../../services/puzzlesService';

interface CustomPuzzleModalProps {
	open: boolean;
	onClose: () => void;
	setCustomPuzzle: (puzzle: any) => void;
	setMode: (mode: 'startup' | 'daily' | 'custom') => void;
	user?: {
		name: string;
		email: string;
		photoUrl?: string;
	} | null;
	setShowSignInModal?: (open: boolean) => void;
}

// Helper button for DRY uniform modal actions
const ModalButton: React.FC<
	React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className = '', ...props }) => (
	<button
		className={`custom-puzzle-btn ${className}`.trim()}
		{...props}
	/>
);

const steps = [
	{
		title: 'Puzzle Title',
		description: 'Give your puzzle a catchy title!',
		field: 'title',
		placeholder: 'e.g. Animal Kingdom',
		validate: (state: any) =>
			state.puzzleTitle.trim().length > 0,
	},
	{
		title: 'Grid Size',
		description: 'Choose the number of rows and columns.',
		field: 'gridSize',
		placeholder: '',
		validate: (state: any) =>
			state.numRows > 1 && state.numCols > 1,
	},
	{
		title: 'Groups of Words',
		description: (numCols: number) =>
			`Define your groups (one group per line, ${numCols} words per group, comma or space separated). The word list will be inferred automatically.`,
		field: 'groupInputs',
		placeholder: (numCols: number) =>
			`e.g. apple, banana, pear, orange`,
		validate: (state: any) => {
			const groups = parseGroupsFromInputs(
				state.groupInputs,
				state.numCols
			);
			if (groups.length !== state.numRows) return false;
			for (const group of groups) {
				if (group.length !== state.numCols) return false;
			}
			const allWords = groups.flat();
			const uniqueWords = new Set(
				allWords.map((w) => w.trim().toLowerCase())
			);
			if (allWords.length !== uniqueWords.size)
				return false;
			return true;
		},
		enforceGroupWordLimit: true,
	},
	{
		title: 'Wildcards (Optional)',
		description: (numCols: number) =>
			`Wildcards should be ${numCols} words per group, comma or space separated.`,
		field: 'wildcardList',
		placeholder: 'banana, robot, cactus',
		validate: (state: any) => {
			if (!state.wildcardsToggle) return true;
			const wildcards = state.wildcardList
				.split(/[,;\s]+/)
				.map((w: string) => w.trim())
				.filter(Boolean);
			return (
				wildcards.length === state.numCols &&
				state.wildcardList.trim().length > 0
			);
		},
	},
	{
		title: 'Categories (Optional)',
		description:
			'Comma separated categories for your puzzle.',
		field: 'categoryList',
		placeholder: 'Animals, Fruits',
		validate: (_: any) => true,
	},
	{
		title: 'Theme (Optional)',
		description:
			'Give your puzzle a theme (e.g. party, moody, nostalgia).',
		field: 'puzzleTheme',
		placeholder: 'party',
		validate: (_: any) => true,
	},
	{
		title: 'Difficulty',
		description: 'Select the difficulty for your puzzle.',
		field: 'difficulty',
		validate: (state: any) => !!state.difficulty,
	},
	{
		title: 'Preview',
		description:
			'Preview your puzzle and save, play, or share!',
		field: 'preview',
		validate: (_: any) => true,
	},
];

const CATEGORY_OPTIONS = [
	'Animals',
	'Movies',
	'Food',
	'Nature',
	'Travel',
	'Music',
	'History',
	'Pop Culture',
	'Science',
	'Phrases',
	'Other',
];

const CustomPuzzleModal: React.FC<
	CustomPuzzleModalProps
> = ({
	open,
	onClose,
	setCustomPuzzle,
	setMode,
	user,
	setShowSignInModal,
}) => {
	const [step, setStep] = useState(0);
	const [puzzleTitle, setPuzzleTitle] = useState('');
	const [numRows, setNumRows] = useState(4);
	const [numCols, setNumCols] = useState(4);
	const [groupInputs, setGroupInputs] = useState<string[]>(
		() => Array(4).fill('')
	);
	const [wildcardList, setWildcardList] = useState('');
	const [category, setCategory] = useState('');
	const [customCategory, setCustomCategory] = useState('');
	const [puzzleTheme, setPuzzleTheme] = useState('');
	const [difficulty, setDifficulty] = useState('Medium');
	const [jsonResult, setJsonResult] = useState('');
	const [saveStatus, setSaveStatus] = useState<
		string | null
	>(null);
	const [shareId, setShareId] = useState<string | null>(
		null
	);
	const [copyStatus, setCopyStatus] = useState<
		string | null
	>(null);
	const [error, setError] = useState<string | null>(null);
	const [wildcardsToggle, setWildcardsToggle] =
		useState(true);
	const [loading, setLoading] = useState(false);
	const [
		groupWordCountWarnings,
		setGroupWordCountWarnings,
	] = useState<boolean[]>(() => Array(numRows).fill(false));

	const groups = parseGroupsFromInputs(
		groupInputs,
		numCols
	);
	const wildcards = wildcardList
		.split(/[\n,]+/)
		.map((w) => w.trim())
		.filter(Boolean);
	const allWords: string[] =
		getAllWordsFromGroupsAndWildcards(groups, wildcards);

	const handleNext = () => {
		setError(null);
		const state = {
			puzzleTitle,
			numRows,
			numCols,
			groupInputs,
			wildcardList,
			category,
			customCategory,
			puzzleTheme,
			wildcardsToggle,
			difficulty, // <-- FIX: include difficulty in validation state
		};
		if (!steps[step].validate(state)) {
			setError('Please complete this step correctly.');
			return;
		}
		setStep((s) => Math.min(s + 1, steps.length - 1));
	};
	const handleBack = () => {
		setError(null);
		setStep((s) => Math.max(s - 1, 0));
	};
	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		setError(null);
		const state = {
			puzzleTitle,
			numRows,
			numCols,
			groupInputs,
			wildcardList,
			category,
			customCategory,
			puzzleTheme,
			wildcardsToggle,
			difficulty, // <-- FIX: include difficulty in validation state
		};
		for (let i = 0; i < steps.length; i++) {
			if (!steps[i].validate(state)) {
				setError(
					`Please complete step ${i + 1} correctly.`
				);
				setStep(i);
				return;
			}
		}
		savePuzzleToBackend(state);
	};
	const savePuzzleToBackend = async (state: any) => {
		setLoading(true);
		setError(null);
		try {
			const data = await createPuzzle(state);
			setJsonResult(data.puzzleJson);
			setShareId(data.shareId);
			setSaveStatus(
				'Puzzle saved! You can now play or share it.'
			);
		} catch (err: any) {
			setError(err.message || 'Failed to save puzzle');
		} finally {
			setLoading(false);
		}
	};
	const handlePlayNow = () => {
		setMode('custom'); // Use 'custom' mode for playing custom puzzles
		setCustomPuzzle({
			title: puzzleTitle,
			json: jsonResult,
		});
		onClose();
	};
	const handleSave = () => {
		const element = document.createElement('a');
		const file = new Blob([jsonResult], {
			type: 'application/json',
		});
		element.href = URL.createObjectURL(file);
		element.download = `${puzzleTitle.replace(
			/\s+/g,
			'_'
		)}_puzzle.json`;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};
	const handleCopyLink = () => {
		navigator.clipboard.writeText(
			`${window.location.origin}/play/${shareId}`
		);
		setCopyStatus(
			'Link copied! Share it with your friends.'
		);
	};
	// In the groupInputs step, prevent users from entering more words than columns per group
	const handleGroupChange = (
		value: string,
		rowIndex: number
	) => {
		const words = value
			.split(/[,;\s]+/)
			.map((w) => w.trim())
			.filter(Boolean);
		const tooMany = words.length > numCols;
		setGroupWordCountWarnings((prev) => {
			const arr = [...prev];
			arr[rowIndex] = tooMany;
			return arr;
		});
		// Allow temporary overflow for feedback, but trim on blur
		setGroupInputs((prev) => {
			const newGroups = [...prev];
			newGroups[rowIndex] = value;
			return newGroups;
		});
	};

	const handleGroupBlur = (
		value: string,
		rowIndex: number
	) => {
		const words = value
			.split(/[,;\s]+/)
			.map((w) => w.trim())
			.filter(Boolean);
		const limited = words.slice(0, numCols).join(', ');
		setGroupInputs((prev) => {
			const newGroups = [...prev];
			newGroups[rowIndex] = limited;
			return newGroups;
		});
		setGroupWordCountWarnings((prev) => {
			const arr = [...prev];
			arr[rowIndex] = false;
			return arr;
		});
	};

	const handleGroupPaste = (
		e: React.ClipboardEvent<HTMLInputElement>,
		rowIndex: number
	) => {
		if (rowIndex !== 0) return; // Only trigger for Group 1
		const paste = e.clipboardData.getData('text');
		// Only trigger if comma-separated or multi-word paste
		if (!paste.includes(',')) return;
		e.preventDefault();
		// Use helper to parse into group chunks
		const parsedGroups = parseGroupsFromInputs(
			parseGroupsFromText(paste, numCols).map((g) =>
				g.join(', ')
			),
			numCols
		);
		// Fill groupInputs with parsed chunks, pad with empty if needed
		setGroupInputs((prev) => {
			const newInputs = Array(numRows)
				.fill('')
				.map((_, i) => parsedGroups[i]?.join(', ') || '');
			return newInputs;
		});
	};

	// When saving or previewing, merge customCategory into the categories as 'Other - {customCategory}' if present
	const getFinalCategories = () => {
		if (category === 'Other' && customCategory) {
			return ['Other - ' + customCategory];
		}
		return category ? [category] : [];
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div
				className='custom-puzzle-modal-content'
				style={{
					background: '#fff',
					borderRadius: 18,
					boxShadow:
						'0 4px 32px 0 rgba(0, 48, 135, 0.2), 0 2px 8px 0 rgba(227, 234, 255, 0.2)',
					padding: '2.2em 2.5em 2em 2.5em',
					minWidth: '320px',
					width: '90vw',
					maxWidth: '600px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center',
					position: 'relative',
					animation:
						'fadeInUp 0.32s cubic-bezier(0.23, 1.01, 0.32, 1)',
				}}
			>
				<CloseButton
					onClick={onClose}
					style={{
						position: 'absolute',
						top: 16,
						right: 16,
						zIndex: 2,
					}}
				/>
				<h2>Create Custom Puzzle</h2>
				<div style={{ marginBottom: 16 }}>
					<div style={{ fontWeight: 500, marginBottom: 8 }}>
						Step {step + 1} of {steps.length}:{' '}
						{steps[step].title}
					</div>
					<div style={{ fontSize: 14, color: '#666' }}>
						{typeof steps[step].description === 'function'
							? steps[step].description(numCols)
							: steps[step].description}
					</div>
				</div>
				{step === 0 && (
					<input
						type='text'
						placeholder='Puzzle Title'
						value={puzzleTitle}
						onChange={(e) => setPuzzleTitle(e.target.value)}
						style={{ marginBottom: 16, width: '100%' }}
						autoFocus
					/>
				)}
				{step === 1 && (
					<div
						style={{
							display: 'flex',
							gap: 12,
							marginBottom: 16,
						}}
					>
						<input
							type='number'
							min={2}
							max={8}
							value={numRows}
							onChange={(e) =>
								setNumRows(Number(e.target.value))
							}
							style={{ width: 80 }}
							placeholder='Rows'
						/>
						<span>x</span>
						<input
							type='number'
							min={2}
							max={8}
							value={numCols}
							onChange={(e) =>
								setNumCols(Number(e.target.value))
							}
							style={{ width: 80 }}
							placeholder='Columns'
						/>
					</div>
				)}
				{step === 2 && (
					<>
						<div
							style={{ width: '100%', marginBottom: 12 }}
						>
							{groupInputs.map((group, i) => (
								<div key={i} style={{ marginBottom: 8 }}>
									<input
										type='text'
										placeholder={`Group ${
											i + 1
										} (${numCols} words)`}
										value={group}
										onChange={(e) =>
											handleGroupChange(e.target.value, i)
										}
										onBlur={(e) =>
											handleGroupBlur(e.target.value, i)
										}
										{...(i === 0
											? {
													onPaste: (e) =>
														handleGroupPaste(e, i),
											  }
											: {})}
										style={{
											width: '100%',
											borderColor: groupWordCountWarnings[i]
												? '#e74c3c'
												: undefined,
											fontFamily: 'inherit',
											fontSize: 15,
											padding: '7px 10px',
											borderRadius: 6,
											borderWidth: 1,
											borderStyle: 'solid',
											boxSizing: 'border-box',
										}}
										autoFocus={i === 0}
									/>
									{groupWordCountWarnings[i] && (
										<div
											style={{
												color: '#e74c3c',
												fontSize: 13,
												marginTop: 2,
											}}
										>
											Too many words! Only {numCols} allowed
											per group.
										</div>
									)}
								</div>
							))}
						</div>
						<div style={{ color: 'red', marginBottom: 8 }}>
							{error && error.includes('step 3') && error}
						</div>
					</>
				)}
				{step === 3 && (
					<>
						<label
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: 16,
							}}
						>
							<input
								type='checkbox'
								checked={wildcardsToggle}
								onChange={(e) =>
									setWildcardsToggle(e.target.checked)
								}
								style={{ marginRight: 8 }}
							/>
							Enable wildcards
						</label>
						{wildcardsToggle && (
							<>
								<input
									type='text'
									placeholder='Wildcards (optional)'
									value={wildcardList}
									onChange={(e) => {
										const value = e.target.value;
										const words = value
											.split(/[,;\s]+/)
											.map((w) => w.trim())
											.filter(Boolean);
										if (words.length <= numCols) {
											setWildcardList(value);
										}
									}}
									style={{
										marginBottom: 16,
										width: '100%',
									}}
								/>
								{wildcardList
									.split(/[,;\s]+/)
									.filter(Boolean).length > numCols && (
									<div
										style={{
											color: '#e74c3c',
											fontSize: 13,
											marginTop: 2,
										}}
									>
										Too many words! Only {numCols} allowed
										for wildcards.
									</div>
								)}
							</>
						)}
					</>
				)}
				{step === 4 && (
					<>
						<div
							style={{ marginBottom: 16, width: '100%' }}
						>
							<select
								value={category}
								onChange={(e) => {
									if (e.target.value === 'Other') {
										setCategory('Other');
									} else {
										setCategory(e.target.value);
										setCustomCategory('');
									}
								}}
								style={{ width: '100%', marginBottom: 8 }}
							>
								<option value=''>
									Select a category...
								</option>
								{CATEGORY_OPTIONS.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
							</select>
							{category === 'Other' && (
								<input
									type='text'
									placeholder='Other (type your own)'
									value={customCategory}
									onChange={(e) =>
										setCustomCategory(e.target.value)
									}
									style={{ width: '100%', marginBottom: 8 }}
								/>
							)}
						</div>
					</>
				)}
				{step === 5 && (
					<>
						<select
							value={puzzleTheme}
							onChange={(e) =>
								setPuzzleTheme(e.target.value)
							}
							style={{ marginBottom: 16, width: '100%' }}
						>
							<option value=''>
								Select a theme (optional)
							</option>
							<option value='party'>Party</option>
							<option value='moody'>Moody</option>
							<option value='nostalgia'>Nostalgia</option>
							<option value='nature'>Nature</option>
							<option value='sports'>Sports</option>
							<option value='fantasy'>Fantasy</option>
							<option value='holiday'>Holiday</option>
							<option value='retro'>Retro</option>
							<option value='space'>Space</option>
							<option value='other'>Other</option>
						</select>
						{puzzleTheme === 'other' && (
							<input
								type='text'
								placeholder='Enter custom theme'
								value={customCategory}
								onChange={(e) =>
									setCustomCategory(e.target.value)
								}
								style={{ marginBottom: 16, width: '100%' }}
							/>
						)}
						<div style={{ color: 'red', marginBottom: 8 }}>
							{error && error.includes('step 6') && error}
						</div>
					</>
				)}
				{step ===
					steps.findIndex(
						(s) => s.field === 'difficulty'
					) && (
					<div style={{ width: '100%', marginBottom: 16 }}>
						<select
							value={difficulty}
							onChange={(e) =>
								setDifficulty(e.target.value)
							}
							style={{
								width: '100%',
								fontSize: 16,
								padding: '8px 10px',
								borderRadius: 6,
							}}
						>
							<option value='Easy'>Easy</option>
							<option value='Medium'>Medium</option>
							<option value='Hard'>Hard</option>
							<option value='Legendary'>Legendary</option>
						</select>
					</div>
				)}
				{step === steps.length - 1 && (
					<div style={{ marginBottom: 16, width: '100%' }}>
						<h3>Preview</h3>
						<div
							style={{
								fontWeight: 600,
								fontSize: 18,
								marginBottom: 8,
							}}
						>
							<b>Title:</b>
							{puzzleTitle || 'Untitled Puzzle'}
						</div>
						<div style={{ marginBottom: 8 }}>
							<b>Grid:</b> {numRows} x {numCols}
						</div>
						{getFinalCategories().length > 0 && (
							<div style={{ marginBottom: 8 }}>
								<b>Categories:</b>{' '}
								{getFinalCategories().join(', ')}
							</div>
						)}
						{puzzleTheme && (
							<div style={{ marginBottom: 8 }}>
								<b>Theme:</b> {puzzleTheme}
							</div>
						)}
						<div
							style={{
								margin: '0 auto 18px auto',
								maxWidth: 480,
								pointerEvents: 'none',
								userSelect: 'none',
							}}
						>
							<VSGrid
								words={getAllWordsFromGroupsAndWildcards(
									groups,
									wildcards
								)}
								selected={[]}
								locked={[]}
								wildcards={wildcards}
								onSelect={() => {}}
								gridSize={{ rows: numRows, cols: numCols }}
							/>
						</div>
						<div
							style={{
								border: '1px solid #e0e7ef',
								borderRadius: 12,
								padding: 16,
								background: '#fafdff',
								marginBottom: 8,
								textAlign: 'left',
								fontSize: 15,
								overflowX: 'auto',
							}}
						>
							<div
								style={{
									marginTop: 12,
									color: '#888',
									fontSize: 13,
								}}
							>
								<b>All Words:</b> {allWords.join(', ')}
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								gap: 12,
								justifyContent: 'flex-end',
								marginTop: 16,
							}}
						>
							<ModalButton onClick={handleBack}>
								Back
							</ModalButton>
							<ModalButton
								type='button'
								onClick={handleSave}
								disabled={loading}
							>
								Save
							</ModalButton>
							<ModalButton
								type='button'
								onClick={handlePlayNow}
								disabled={loading}
							>
								Play Now
							</ModalButton>
						</div>
						{saveStatus && (
							<div
								style={{ marginTop: 16, color: 'green' }}
							>
								{saveStatus}
							</div>
						)}
						{copyStatus && (
							<div
								style={{ marginTop: 16, color: 'green' }}
							>
								{copyStatus}
							</div>
						)}
						{error && (
							<div style={{ marginTop: 16, color: 'red' }}>
								{error}
							</div>
						)}
					</div>
				)}
				{step < steps.length - 1 && (
					<div
						style={{
							display: 'flex',
							gap: 12,
							justifyContent: 'flex-end',
							marginTop: 16,
						}}
					>
						{step > 0 && (
							<ModalButton onClick={handleBack}>
								Back
							</ModalButton>
						)}
						<ModalButton
							type='button'
							onClick={handleNext}
							disabled={
								!steps[step].validate({
									puzzleTitle,
									numRows,
									numCols,
									groupInputs,
									wildcardList,
									category,
									customCategory,
									puzzleTheme,
									wildcardsToggle,
									difficulty, // <-- FIX: pass difficulty to validator
								}) ||
								(step === 2 &&
									groupInputs.some(
										(g) =>
											g.split(/[,;\s]+/).filter(Boolean)
												.length > numCols
									))
							}
						>
							Next
						</ModalButton>
					</div>
				)}
				{saveStatus && (
					<div style={{ marginTop: 16, color: 'green' }}>
						{saveStatus}
					</div>
				)}
				{copyStatus && (
					<div style={{ marginTop: 16, color: 'green' }}>
						{copyStatus}
					</div>
				)}
				{error && (
					<div style={{ marginTop: 16, color: 'red' }}>
						{error}
					</div>
				)}
			</div>
		</Modal>
	);
};

export default CustomPuzzleModal;
