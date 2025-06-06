import BrowseCustomPuzzles from '../src/legacy/BrowseCustomPuzzles';
import CustomPuzzleModal from '../src/components/CustomPuzzleModal';
import { useRouter } from 'next/router';
import React from 'react';

export default function Browse() {
	const router = useRouter();
	const [puzzles, setPuzzles] = React.useState<any[]>([]);
	const [customPuzzle, setCustomPuzzle] =
		React.useState<any>(null);
	const [customState, setCustomState] =
		React.useState<any>(null);
	const [user, setUser] = React.useState<{
		name: string;
		email: string;
		photoUrl?: string;
	} | null>(null);
	const [mode, setMode] = React.useState<
		'browse' | 'custom'
	>('browse');

	const handleSetMode = (
		newMode: 'browse' | 'custom' | 'startup' | 'daily'
	) => {
		if (newMode === 'browse' || newMode === 'custom') {
			setMode(newMode);
		}
	};

	if (mode === 'custom' && customPuzzle) {
		return (
			<CustomPuzzleModal
				open={true}
				onClose={() => setMode('browse')}
				setCustomPuzzle={setCustomPuzzle}
				setMode={handleSetMode}
				user={user}
				setShowSignInModal={() => {}}
			/>
		);
	}

	return (
		<BrowseCustomPuzzles
			onBack={() => router.push('/')}
			puzzles={puzzles}
			setCustomPuzzle={(puzzle) => {
				setCustomPuzzle(puzzle);
				handleSetMode('custom');
				setCustomState(null);
			}}
			setMode={handleSetMode}
			setCustomState={setCustomState}
			user={user}
			mode={'browse'}
		/>
	);
}
