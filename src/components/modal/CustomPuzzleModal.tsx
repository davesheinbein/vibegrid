import React, { useState } from 'react';
import {
	parseGroupsFromInputs,
	getUniqueWordsFromGroups,
	buildGroupsFromWords,
	capitalizeWords,
	getAllWordsFromGroupsAndWildcards,
} from '../../utils/helpers';
import { WordButton } from '../ui/Buttons';
import { Modal } from '../ui/Modal';

const steps = [
	{
		title: 'Puzzle Title',
		description: 'Give your puzzle a catchy title!',
		field: 'title',
		placeholder: 'e.g. Animal Kingdom',
		validate: ({ puzzleTitle }: any) =>
			puzzleTitle.trim().length > 0,
	},
	{
		title: 'Grid Size',
		description: 'Choose the number of rows and columns.',
		field: 'gridSize',
		placeholder: '',
		validate: ({ numRows, numCols }: any) =>
			numRows > 1 && numCols > 1,
	},
	{
		title: 'Groups of Words',
		description: (numCols: number) =>
			`Define your groups (one group per line, ${numCols} words per group, comma or space separated). The word list will be inferred automatically.`,
		field: 'groupInputs',
		placeholder: (numCols: number) => {
			let ex = [
				'cat',
				'dog',
				'lion',
				'tiger',
				'apple',
				'orange',
				'grape',
				'pear',
			];
			return (
				ex.slice(0, numCols).join(', ') +
				'\n' +
				ex.slice(numCols, 2 * numCols).join(', ')
			);
		},
		validate: ({ groupInputs, numRows, numCols }: any) => {
			const groups = parseGroupsFromInputs(
				groupInputs,
				numCols
			);
			const words = getUniqueWordsFromGroups(groups);
			const groupCount = numRows;
			return (
				groups.length === groupCount &&
				groups.every(
					(g: string[]) => g.length === numCols
				) &&
				words.length === numRows * numCols
			);
		},
	},
	{
		title: 'Wildcards (Optional)',
		description: (numCols: number) =>
			`Wildcards should be ${numCols} words per group, comma or space separated.`,
		field: 'wildcardList',
		placeholder: 'banana, robot, cactus',
		validate: ({
			wildcardList,
			wildcardsToggle,
			numCols,
		}: any) => {
			if (!wildcardsToggle) return true;
			const wildcards = wildcardList
				.split(/[,;\s]+/)
				.map((w: string) => w.trim())
				.filter(Boolean);
			return (
				wildcards.length === numCols &&
				wildcardList.trim().length > 0
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
		() => Array(numRows).fill('')
	);
	const [wildcardList, setWildcardList] = useState('');
	const [category, setCategory] = useState('');
	const [customCategory, setCustomCategory] = useState('');
	const [puzzleTheme, setPuzzleTheme] = useState('');
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

	const groups = parseGroupsFromInputs(
		groupInputs,
		numCols
	);
	const wildcards = wildcardList
		.split(/[\n,]+/)
		.map((w: string) => w.trim())
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (step !== steps.length - 1) return;
		const wildcards = wildcardList
			.split(/[\n,]+/)
			.map((w) => w.trim())
			.filter(Boolean);
		// Compose the category string for storage
		let finalCategory = category;
		if (category === 'Other') {
			finalCategory = customCategory.trim()
				? `Other - ${customCategory.trim()}`
				: 'Other';
		}
		const json = {
			date: new Date().toLocaleDateString('en-GB'),
			title: puzzleTitle,
			size: { rows: numRows, cols: numCols },
			words: allWords,
			groups,
			wildcards,
			category: finalCategory,
			theme: puzzleTheme,
			wildcardsToggle,
			// For preview compatibility
			categoryList: finalCategory,
			puzzleTheme: puzzleTheme.trim(),
		};
		setJsonResult(JSON.stringify(json, null, 2));
		setSaveStatus(null);
		setStep(steps.length);
	};

	function validatePuzzleJson(json: any) {
		if (!json) return false;
		if (!json.title || typeof json.title !== 'string')
			return false;
		if (
			!json.size ||
			typeof json.size.rows !== 'number' ||
			typeof json.size.cols !== 'number'
		)
			return false;
		if (
			!Array.isArray(json.groups) ||
			json.groups.length === 0
		)
			return false;
		if (
			!Array.isArray(json.words) ||
			json.words.length === 0
		)
			return false;
		return true;
	}

	async function savePuzzleToBackend(
		puzzle: any,
		playAfter = false
	) {
		setLoading(true);
		setError(null);
		try {
			const payload = {
				...puzzle,
				creatorId: user?.email || null,
				visibility: 'public',
			};
			const res = await fetch('/api/custom-puzzles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error('Failed to save puzzle');
			const saved = await res.json();
			setSaveStatus('Saved!');
			setShareId(saved._id || saved.id || null);
			if (playAfter) {
				setCustomPuzzle(saved);
				setMode('custom');
				onClose();
			}
		} catch (e: any) {
			setError(e.message || 'Failed to save.');
		} finally {
			setLoading(false);
		}
	}

	const handlePlayNow = async () => {
		if (!jsonResult) return;
		try {
			const puzzle = JSON.parse(jsonResult);
			if (!validatePuzzleJson(puzzle)) {
				setError('Puzzle JSON is invalid.');
				return;
			}
			if (!user) {
				setError('Sign in required to play and save.');
				setShowSignInModal && setShowSignInModal(true);
				return;
			}
			await savePuzzleToBackend(puzzle, true);
		} catch (e: any) {
			setError('Could not start puzzle.');
		}
	};

	const handleSave = async () => {
		if (!jsonResult) return;
		try {
			const puzzle = JSON.parse(jsonResult);
			if (!validatePuzzleJson(puzzle)) {
				setError('Puzzle JSON is invalid.');
				return;
			}
			if (!user) {
				setError('Sign in required to save.');
				setShowSignInModal && setShowSignInModal(true);
				return;
			}
			await savePuzzleToBackend(puzzle, false);
		} catch (e: any) {
			setError('Could not save puzzle.');
		}
	};

	const handleCopyLink = () => {
		if (typeof window !== 'undefined') {
			navigator.clipboard.writeText(window.location.href);
			setCopyStatus('Link copied!');
			setTimeout(() => setCopyStatus(''), 1500);
		}
	};

	const handleGroupChange = (
		idx: number,
		value: string
	) => {
		const allWords = value
			.split(/[,;\-\s\n]+/)
			.map((w) => w.trim())
			.filter(Boolean);

		if (allWords.length > numCols) {
			const newInputs = [...groupInputs];
			let wordIdx = 0;
			for (
				let group = idx;
				group < numRows && wordIdx < allWords.length;
				group++
			) {
				const groupWords = allWords.slice(
					wordIdx,
					wordIdx + numCols
				);
				newInputs[group] = groupWords.join(', ');
				wordIdx += numCols;
			}
			setGroupInputs(newInputs);
		} else {
			const arr = [...groupInputs];
			arr[idx] = value;
			setGroupInputs(arr);
		}
	};

	if (!open) return null;
	return (
		<Modal open={open} onClose={onClose}>
			<div className='custom-puzzle-modal-content'>
				<form
					onSubmit={handleSubmit}
					className='share-modal-form'
				>
					{step === 0 && (
						<div className='step-content fade-in'>
							<h2>{steps[0].title}</h2>
							<p className='share-modal-step-desc'>
								{typeof steps[0].description === 'function'
									? steps[0].description(numCols)
									: steps[0].description}
							</p>
							<input
								type='text'
								value={puzzleTitle}
								onChange={(e) =>
									setPuzzleTitle(
										capitalizeWords(e.target.value)
									)
								}
								placeholder={
									typeof steps[0].placeholder === 'function'
										? steps[0].placeholder(numCols)
										: steps[0].placeholder
								}
								className='share-modal-input'
								autoFocus
							/>
						</div>
					)}
					{step === 1 && (
						<div className='step-content fade-in'>
							<h2>{steps[1].title}</h2>
							<p className='share-modal-step-desc'>
								{typeof steps[1].description === 'function'
									? steps[1].description(numCols)
									: steps[1].description}
							</p>
							<div className='share-modal-row'>
								<label>
									Rows:
									<input
										type='number'
										min={2}
										max={8}
										value={numRows}
										onChange={(e) =>
											setNumRows(Number(e.target.value))
										}
										className='share-modal-input share-modal-input-num'
									/>
								</label>
								<label>
									Columns:
									<input
										type='number'
										min={2}
										max={8}
										value={numCols}
										onChange={(e) =>
											setNumCols(Number(e.target.value))
										}
										className='share-modal-input share-modal-input-num'
									/>
								</label>
							</div>
						</div>
					)}
					{step === 2 && (
						<div className='step-content fade-in'>
							<h2>{steps[2].title}</h2>
							<p className='share-modal-step-desc'>
								{typeof steps[2].description === 'function'
									? steps[2].description(numCols)
									: steps[2].description}
							</p>
							{groupInputs.map((input, idx) => {
								const wordCount = input
									.split(/[,;\s]+/)
									.map((w) => w.trim())
									.filter(Boolean).length;
								return (
									<div
										key={idx}
										style={{ marginBottom: 10 }}
									>
										<label
											style={{
												fontWeight: 500,
												fontSize: 15,
												marginBottom: 2,
												display: 'block',
											}}
										>
											{`Group ${
												idx + 1
											}: ${wordCount} / ${numCols}`}
										</label>
										<input
											type='text'
											value={input}
											onChange={(e) => {
												let val = e.target.value;
												// If the input contains newlines, treat as bulk paste for all group fields
												if (val.includes('\n')) {
													const lines = val
														.split(/\r?\n/)
														.map((l) => l.trim())
														.filter(Boolean);
													const newInputs = [
														...groupInputs,
													];
													for (
														let i = 0;
														i <
														Math.min(
															lines.length,
															groupInputs.length
														);
														i++
													) {
														newInputs[i] = lines[i];
													}
													setGroupInputs(newInputs);
													return;
												}
												let words = val
													.split(/[,;\s]+/)
													.map((w) => w.trim())
													.filter(Boolean);
												if (words.length > numCols) {
													words = words.slice(0, numCols);
													val = words.join(', ');
												}
												const newInputs = [...groupInputs];
												newInputs[idx] = val;
												setGroupInputs(newInputs);
											}}
											placeholder={
												typeof steps[2].placeholder ===
												'function'
													? steps[2].placeholder(numCols)
													: steps[2].placeholder
											}
											className='share-modal-input'
											style={{ marginBottom: 2 }}
										/>
									</div>
								);
							})}
						</div>
					)}
					{step === 3 && (
						<div className='step-content fade-in'>
							<h2>{steps[3].title}</h2>
							<p className='share-modal-step-desc'>
								{typeof steps[3].description === 'function'
									? steps[3].description(numCols)
									: steps[3].description}
							</p>
							<div className='share-modal-wildcard-row'>
								<label className='share-modal-wildcard-label'>
									Enable Wildcards
									<input
										type='checkbox'
										checked={wildcardsToggle}
										onChange={(e) =>
											setWildcardsToggle(e.target.checked)
										}
										className='share-modal-wildcard-checkbox'
									/>
								</label>
							</div>
							{wildcardsToggle && (
								<input
									type='text'
									value={wildcardList}
									onChange={(e) => {
										// Only allow up to numCols words
										let val = e.target.value;
										let words = val
											.split(/[,;\s]+/)
											.map((w) => w.trim())
											.filter(Boolean);
										if (words.length > numCols) {
											words = words.slice(0, numCols);
											val = words.join(', ');
										}
										setWildcardList(val);
									}}
									placeholder={
										typeof steps[3].placeholder ===
										'function'
											? steps[3].placeholder(numCols)
											: steps[3].placeholder
									}
									className='share-modal-input share-modal-wildcard-input'
									maxLength={100}
								/>
							)}
							{wildcardsToggle && (
								<div
									style={{
										fontSize: 13,
										color: '#64748b',
										marginTop: 4,
									}}
								>
									{
										wildcardList
											.split(/[,;\s]+/)
											.filter(Boolean).length
									}{' '}
									/ {numCols} wildcards
								</div>
							)}
						</div>
					)}
					{step === 4 && (
						<div className='step-content fade-in'>
							<h2>{steps[4].title}</h2>
							<p className='share-modal-step-desc'>
								{typeof steps[4].description === 'function'
									? steps[4].description(numCols)
									: steps[4].description}
							</p>
							<label
								htmlFor='category-dropdown'
								style={{
									fontWeight: 500,
									marginBottom: 6,
									display: 'block',
								}}
							>
								Select a category:
							</label>
							<select
								id='category-dropdown'
								className='share-modal-input'
								value={category}
								onChange={(e) => {
									setCategory(e.target.value);
									if (e.target.value !== 'Other')
										setCustomCategory('');
								}}
								style={{ marginBottom: 8 }}
							>
								<option value='' disabled>
									Choose a category
								</option>
								{CATEGORY_OPTIONS.map((opt) => (
									<option key={opt} value={opt}>
										{opt}
									</option>
								))}
							</select>
							{category === 'Other' && (
								<input
									type='text'
									className='share-modal-input'
									placeholder='Enter custom category (optional)'
									value={customCategory}
									onChange={(e) =>
										setCustomCategory(e.target.value)
									}
									style={{ marginTop: 6 }}
								/>
							)}
						</div>
					)}
					{step === 5 && (
						<div className='step-content fade-in'>
							<h2 className='custom-puzzle-theme-title'>
								{steps[5].title}
							</h2>
							<p className='share-modal-step-desc'>
								{typeof steps[5].description === 'function'
									? steps[5].description(numCols)
									: steps[5].description}
							</p>
							<input
								type='text'
								value={puzzleTheme}
								onChange={(e) =>
									setPuzzleTheme(
										capitalizeWords(e.target.value)
									)
								}
								placeholder={
									typeof steps[5].placeholder === 'function'
										? steps[5].placeholder(numCols)
										: steps[5].placeholder
								}
								className='share-modal-input'
							/>
						</div>
					)}
					{step === steps.length &&
						jsonResult &&
						(() => {
							let categoryList = '';
							let puzzleTheme = '';
							try {
								const parsed = JSON.parse(jsonResult);
								categoryList = parsed.categoryList || '';
								puzzleTheme = parsed.puzzleTheme || '';
							} catch {}
							return (
								<div className='share-modal-preview'>
									<h4 className='share-modal-preview-title'>
										Grid Preview
										{categoryList.trim() && (
											<span
												style={{
													display: 'block',
													fontWeight: 500,
													color: '#2563eb',
													fontSize: '1.08rem',
													marginTop: 4,
												}}
											>
												Categories: {categoryList}
											</span>
										)}
										{puzzleTheme.trim() && (
											<span
												style={{
													display: 'block',
													fontWeight: 500,
													color: '#f59e42',
													fontSize: '1.08rem',
													marginTop: 2,
												}}
											>
												Theme: {puzzleTheme}
											</span>
										)}
									</h4>
									<div className='gridRoyale-grid share-modal-preview-grid'>
										{allWords.map(
											(word: string, idx: number) => (
												<WordButton
													key={word + idx}
													word={word}
													isSelected={false}
													isLocked={false}
													onClick={() => {}}
													tabIndex={-1}
													aria-disabled={true}
												/>
											)
										)}
									</div>
									<div className='share-modal-preview-btns'>
										<button
											className='gridRoyale-submit'
											onClick={handleSave}
											type='button'
											disabled={loading}
										>
											{loading ? 'Saving...' : 'Save'}
										</button>
										<button
											className='gridRoyale-submit'
											onClick={handlePlayNow}
											type='button'
											disabled={loading}
										>
											{loading ? 'Loading...' : 'Play Now'}
										</button>
										{shareId && (
											<button
												className='gridRoyale-submit'
												onClick={handleCopyLink}
												type='button'
											>
												Copy Link
											</button>
										)}
									</div>
									{copyStatus && (
										<div className='share-modal-copy-status'>
											{copyStatus}
										</div>
									)}
									{saveStatus && (
										<div
											className={`share-modal-save-status${
												saveStatus === 'Saved!'
													? ' saved'
													: ' error'
											}`}
										>
											{saveStatus}
										</div>
									)}
								</div>
							);
						})()}
					{error && (
						<div className='custom-puzzle-error'>
							{error}
						</div>
					)}
					<div className='share-modal-nav-btns'>
						{/* Back button: show on all steps except the first and preview */}
						{step > 0 && step < steps.length && (
							<button
								type='button'
								className='gridRoyale-submit'
								onClick={handleBack}
							>
								Back
							</button>
						)}
						{/* Next button: show on all steps except the last and preview */}
						{step < steps.length - 1 && (
							<button
								type='button'
								className='gridRoyale-submit'
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
									})
								}
							>
								Next
							</button>
						)}
						{/* Finish button: show on last step before preview */}
						{step === steps.length - 1 && (
							<button
								type='submit'
								className='gridRoyale-submit share-modal-finish-btn'
							>
								Finish & Preview
							</button>
						)}
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default CustomPuzzleModal;
