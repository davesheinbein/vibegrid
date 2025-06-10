import { useRouter } from 'next/router';
import React from 'react';
import {
	StartupPage,
	Modal,
	CopyLinkButton,
	CustomPuzzleModal,
} from '../components/ui-kit';
import ShareModalContent from '../components/ui-kit/modals/ShareModalContent';

export default function Home() {
	const router = useRouter();
	const [showCustomModal, setShowCustomModal] =
		React.useState(false);
	const [customPuzzle, setCustomPuzzle] =
		React.useState<any>(null);
	const [showShareModal, setShowShareModal] =
		React.useState(false);

	return (
		<>
			<StartupPage
				onStartDaily={() => router.push('/daily')}
				onStartCustom={() => setShowCustomModal(true)}
				onBrowseCustom={() => router.push('/browse')}
				onShare={() => setShowShareModal(true)}
			/>
			{showCustomModal && (
				<CustomPuzzleModal
					open={showCustomModal}
					onClose={() => setShowCustomModal(false)}
					onSave={(puzzle) => {
						setCustomPuzzle(puzzle);
						setShowCustomModal(false);
					}}
					initialData={customPuzzle}
				/>
			)}
			{showShareModal && (
				<ShareModalContent
					open={showShareModal}
					onClose={() => setShowShareModal(false)}
					title='Share your Grid Royale result!'
					logoUrl='https://i.imgur.com/1jPtNmW.png'
				>
					<CopyLinkButton key='copy-link' />
				</ShareModalContent>
			)}
		</>
	);
}
