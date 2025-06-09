import React, { useState } from 'react';
import { Modal } from '../ui/Modal';

interface CustomPuzzleModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (puzzle: any) => void;
	initialData?: any;
}

/**
 * CustomPuzzleModal is a modular, props-driven modal for creating custom puzzles.
 * All UI and logic for custom puzzle creation should be implemented here.
 * This component is future-proofed for extension (e.g., validation, preview, etc).
 */
const CustomPuzzleModal: React.FC<
	CustomPuzzleModalProps
> = ({ open, onClose, onSave, initialData }) => {
	const [puzzleName, setPuzzleName] = useState(
		initialData?.name || ''
	);
	// TODO: Add more fields and validation as needed

	const handleSave = () => {
		if (!puzzleName.trim()) return; // TODO: Add better validation
		onSave({ name: puzzleName });
		onClose();
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div className='custom-puzzle-modal-content'>
				<h2>Create Custom Puzzle</h2>
				<input
					type='text'
					placeholder='Puzzle Name'
					value={puzzleName}
					onChange={(e) => setPuzzleName(e.target.value)}
					style={{ marginBottom: 16, width: '100%' }}
				/>
				<div
					style={{
						display: 'flex',
						gap: 12,
						justifyContent: 'flex-end',
					}}
				>
					<button onClick={onClose}>Cancel</button>
					<button
						onClick={handleSave}
						disabled={!puzzleName.trim()}
					>
						Save
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default CustomPuzzleModal;
