import { useRouter } from 'next/router';
import React from 'react';
import {
	getShareUrl,
	copyToClipboard,
} from '../utils/helpers';
import { getShareLinks } from '../utils/shareLinks';
import {
	StartupPage,
	Modal,
	CopyLinkButton,
	CustomPuzzleModal,
} from '../components/ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Home() {
	const router = useRouter();
	const [showCustomModal, setShowCustomModal] =
		React.useState(false);
	const [customPuzzle, setCustomPuzzle] =
		React.useState<any>(null);
	const [showShareModal, setShowShareModal] =
		React.useState(false);

	const shareText = 'Check out my Grid Royale result!';
	const shareUrl = 'https://gridRoyale.app';
	const shareTitle =
		"Grid Royale: Can you solve today's grid?";
	const shareLinks = getShareLinks(
		'url',
		shareText,
		shareUrl,
		shareTitle
	);

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
				<Modal
					open={showShareModal}
					onClose={() => setShowShareModal(false)}
				>
					<div className='share-modal-content'>
						<h2>Share your Grid Royale result!</h2>
						<div className='share-links-grid'>
							{(() => {
								const rows = [];
								for (
									let i = 0;
									i < shareLinks.length;
									i += 3
								) {
									rows.push(
										<div
											className='share-links-row'
											key={i}
										>
											{shareLinks
												.slice(i, i + 3)
												.map((link) => (
													<a
														href={link.url}
														target='_blank'
														rel='noopener noreferrer'
														className={`share-link share-link--${link.name.toLowerCase()}`}
														data-platform={link.name}
														key={link.name}
														style={{ color: link.color }}
													>
														<span className='share-link-icon'>
															<FontAwesomeIcon
																icon={link.icon}
															/>
														</span>
														<span className='share-link-text'>
															{link.name}
														</span>
													</a>
												))}
										</div>
									);
								}
								return [
									...rows,
									<CopyLinkButton key='copy-link' />,
								];
							})()}
						</div>
					</div>
				</Modal>
			)}
		</>
	);
}
