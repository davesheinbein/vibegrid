// Modal for creating and sharing custom puzzles (moved from App.tsx)
import React, { useState, useRef, useEffect } from 'react';

// --- Helper: Parse groups from text ---
function parseGroupsFromText(
	text: string,
	groupSize: number
): string[][] {
	return text
		.split(/\n+/)
		.map((line) =>
			line
				.split(/[,;\-\s]+/)
				.map((w) => w.trim())
				.filter(Boolean)
				.slice(0, groupSize)
		)
		.filter((group) => group.length > 0);
}

// --- Helper: Parse groups from array of group input strings ---
function parseGroupsFromInputs(
	inputs: string[],
	groupSize: number
): string[][] {
	return inputs.map((line) =>
		line
			.split(/[,;\-\s]+/)
			.map((w) => w.trim())
			.filter(Boolean)
			.slice(0, groupSize)
	);
}

// --- Helper: Flatten groups to unique word list ---
function getUniqueWordsFromGroups(
	groups: string[][]
): string[] {
	return Array.from(
		new Set(
			groups
				.flat()
				.map((w) => w.trim())
				.filter(Boolean)
		)
	);
}

// --- Helper: Build groups from word list (for sync) ---
function buildGroupsFromWords(
	words: string[],
	groupSize: number
): string[][] {
	const groups: string[][] = [];
	for (let i = 0; i < words.length; i += groupSize) {
		groups.push(words.slice(i, i + groupSize));
	}
	return groups;
}

// --- Helper: Capitalize first letter of each word ---
function capitalizeWords(str: string): string {
	return str.replace(
		/\b\w+/g,
		(w) =>
			w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
	);
}

// --- Step configuration (streamlined: no separate Words step) ---
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
		title: 'Groups & Words',
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

interface CustomPuzzleModalProps {
	open: boolean;
	onClose: () => void;
	setCustomPuzzle: (puzzle: any) => void;
	setMode: (
		mode: 'startup' | 'daily' | 'custom' | 'browse'
	) => void;
	user?: {
		name: string;
		email: string;
		photoUrl?: string;
	} | null;
	setShowSignInModal?: (open: boolean) => void;
}

// --- Main Component ---
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
	const [categoryList, setCategoryList] = useState('');
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

	// --- Live preview ---
	const groups = parseGroupsFromInputs(
		groupInputs,
		numCols
	);
	const words = getUniqueWordsFromGroups(groups);

	// --- Step navigation ---
	const handleNext = () => {
		setError(null);
		const state = {
			puzzleTitle,
			numRows,
			numCols,
			groupInputs,
			wildcardList,
			categoryList,
			puzzleTheme,
		};
		if (!steps[step].validate(state)) {
			setError('Please complete this step correctly.');
			return;
		}
		// Only advance one step at a time
		setStep((s) => Math.min(s + 1, steps.length - 1));
	};
	const handleBack = () => {
		setError(null);
		setStep((s) => Math.max(s - 1, 0));
	};

	// --- Finalize puzzle ---
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Only allow submit on the last step
		if (step !== steps.length - 1) return;
		const wildcards = wildcardList
			.split(/[\n,]+/)
			.map((w) => w.trim())
			.filter(Boolean);
		const categories = categoryList
			.split(',')
			.map((c) => c.trim())
			.filter(Boolean);
		const json = {
			date: new Date().toLocaleDateString('en-GB'),
			title: puzzleTitle,
			size: { rows: numRows, cols: numCols },
			words,
			groups,
			wildcards,
			categories,
			theme: puzzleTheme,
			wildcardsToggle, // <-- add toggle to output
		};
		setJsonResult(JSON.stringify(json, null, 2));
		setSaveStatus(null);
		setStep(steps.length); // Go to preview step
	};

	// --- Validate puzzle JSON structure ---
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

	// --- Save puzzle to backend ---
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

	// --- Play Now handler ---
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

	// --- Save handler ---
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

	// --- Copy shareable link to clipboard
	const handleCopyLink = () => {
		if (!shareId) return;
		const url = `${window.location.origin}/?puzzle=${shareId}`;
		navigator.clipboard.writeText(url);
		setCopyStatus('Link copied!');
		setTimeout(() => setCopyStatus(null), 2000);
	};

	// --- Handle group change ---
	const handleGroupChange = (
		idx: number,
		value: string
	) => {
		// Split input into words using all allowed separators
		const allWords = value
			.split(/[,;\-\s\n]+/)
			.map((w) => w.trim())
			.filter(Boolean);

		// If the input contains more words than fit in one group, distribute them
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
		<div
			className='share-modal'
			onClick={(e) =>
				e.target === e.currentTarget && onClose()
			}
		>
			<div
				className='share-modal-content'
				style={{ maxWidth: 540, minHeight: 480 }}
			>
				{/* Blue circle stepper for progress */}
				<div style={{ marginBottom: 16 }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
						}}
					>
						{steps.map((_, i) => (
							<div
								key={i}
								style={{
									width: 18,
									height: 18,
									borderRadius: '50%',
									background:
										i === step ? '#38bdf8' : '#e5e7eb',
									border:
										i === step
											? '2px solid #0ea5e9'
											: '1px solid #cbd5e1',
									transition: 'background 0.2s',
								}}
							></div>
						))}
					</div>
				</div>
				<form
					onSubmit={handleSubmit}
					style={{ transition: 'all 0.3s' }}
				>
					{step === 0 && (
						<div className='step-content fade-in'>
							<h2>{steps[0].title}</h2>
							<p>
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
								style={{ width: '100%', marginBottom: 16 }}
								autoFocus
							/>
						</div>
					)}
					{step === 1 && (
						<div className='step-content fade-in'>
							<h2>{steps[1].title}</h2>
							<p>
								{typeof steps[1].description === 'function'
									? steps[1].description(numCols)
									: steps[1].description}
							</p>
							<div style={{ display: 'flex', gap: 16 }}>
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
										style={{ width: 60, marginLeft: 6 }}
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
										style={{ width: 60, marginLeft: 6 }}
									/>
								</label>
							</div>
						</div>
					)}
					{step === 2 && (
						<div className='step-content fade-in'>
							<h2>{steps[2].title}</h2>
							<p>
								{typeof steps[2].description === 'function'
									? steps[2].description(numCols)
									: steps[2].description}
							</p>
							{Array.from({ length: numRows }).map(
								(_, i) => (
									<div key={i} style={{ marginBottom: 10 }}>
										<label
											style={{ fontWeight: 600 }}
										>{`Group ${i + 1}:`}</label>
										<input
											type='text'
											value={groupInputs[i] || ''}
											onChange={(e) =>
												handleGroupChange(
													i,
													capitalizeWords(e.target.value)
												)
											}
											placeholder={`Enter ${numCols} words, comma or space separated`}
											style={{
												width: '100%',
												marginTop: 4,
											}}
										/>
									</div>
								)
							)}
							<div
								style={{
									fontSize: 13,
									color: '#64748b',
									marginTop: 4,
								}}
							>
								Each group must have exactly {numCols} words
								(comma, space, dash, or semicolon
								separated). All words must be unique and
								used exactly once.
							</div>
						</div>
					)}
					{step === 3 && (
						<div className='step-content fade-in'>
							<h2>{steps[3].title}</h2>
							<p>
								{typeof steps[3].description === 'function'
									? steps[3].description(numCols)
									: steps[3].description}
							</p>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									marginBottom: 8,
								}}
							>
								<label
									style={{
										fontWeight: 500,
										marginRight: 10,
									}}
								>
									Enable Wildcards
									<input
										type='checkbox'
										checked={wildcardsToggle}
										onChange={(e) =>
											setWildcardsToggle(e.target.checked)
										}
										style={{ marginLeft: 6 }}
									/>
								</label>
							</div>
							{wildcardsToggle && (
								<input
									type='text'
									value={wildcardList}
									onChange={(e) =>
										setWildcardList(
											capitalizeWords(e.target.value)
										)
									}
									placeholder={
										typeof steps[3].placeholder ===
										'function'
											? steps[3].placeholder(numCols)
											: steps[3].placeholder
									}
									style={{
										width: '100%',
										marginBottom: 12,
									}}
								/>
							)}
						</div>
					)}
					{step === 4 && (
						<div className='step-content fade-in'>
							<h2>{steps[4].title}</h2>
							<p>
								{typeof steps[4].description === 'function'
									? steps[4].description(numCols)
									: steps[4].description}
							</p>
							<input
								type='text'
								value={categoryList}
								onChange={(e) =>
									setCategoryList(
										capitalizeWords(e.target.value)
									)
								}
								placeholder={
									typeof steps[4].placeholder === 'function'
										? steps[4].placeholder(numCols)
										: steps[4].placeholder
								}
								style={{ width: '100%', marginBottom: 12 }}
							/>
						</div>
					)}
					{step === 5 && (
						<div className='step-content fade-in'>
							<h2>{steps[5].title}</h2>
							<p>
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
								style={{ width: '100%', marginBottom: 12 }}
							/>
						</div>
					)}
					{step === steps.length && jsonResult && (
						<div style={{ marginTop: 16 }}>
							<h4>Generated Puzzle JSON</h4>
							<pre
								style={{
									background: '#f1f5f9',
									padding: 12,
									borderRadius: 6,
									fontSize: 13,
								}}
							>
								{jsonResult}
							</pre>
							<div
								style={{
									display: 'flex',
									gap: 8,
									marginTop: 8,
								}}
							>
								<button
									className='vibegrid-submit'
									onClick={handleSave}
									type='button'
									disabled={loading}
								>
									{loading ? 'Saving...' : 'Save'}
								</button>
								<button
									className='vibegrid-submit'
									onClick={handlePlayNow}
									type='button'
									disabled={loading}
								>
									{loading ? 'Loading...' : 'Play Now'}
								</button>
								{shareId && (
									<button
										className='vibegrid-submit'
										onClick={handleCopyLink}
										type='button'
									>
										Copy Link
									</button>
								)}
							</div>
							{copyStatus && (
								<div
									style={{ color: 'green', marginTop: 4 }}
								>
									{copyStatus}
								</div>
							)}
							{saveStatus && (
								<div
									style={{
										color:
											saveStatus === 'Saved!'
												? 'green'
												: 'red',
										marginTop: 4,
									}}
								>
									{saveStatus}
								</div>
							)}
						</div>
					)}
					{error && (
						<div style={{ color: 'red', marginTop: 8 }}>
							{error}
						</div>
					)}
					<div
						style={{
							display: 'flex',
							gap: 8,
							marginTop: 20,
						}}
					>
						{step > 0 && step < steps.length && (
							<button
								type='button'
								className='vibegrid-submit'
								onClick={handleBack}
							>
								Back
							</button>
						)}
						{step < steps.length - 1 && (
							<button
								type='button'
								className='vibegrid-submit'
								onClick={handleNext}
								disabled={
									!steps[step].validate({
										puzzleTitle,
										numRows,
										numCols,
										groupInputs,
										wildcardList,
										wildcardsToggle,
										categoryList,
										puzzleTheme,
									})
								}
							>
								Next
							</button>
						)}
						{step === steps.length - 1 && (
							<button
								type='submit'
								className='vibegrid-submit'
								style={{
									background:
										'linear-gradient(90deg,#22c55e 0%,#38bdf8 100%)',
								}}
							>
								Finish & Preview
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

export default CustomPuzzleModal;
// --- End Custom Puzzle Builder ---
// Streamlined: groups are the source of truth, words are inferred, and the UI is modern and clear.
