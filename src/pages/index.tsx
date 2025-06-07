import CustomPuzzleModal from '../components/modal/CustomPuzzleModal';
import { useRouter } from 'next/router';
import React from 'react';
import {
	getShareUrl,
	copyToClipboard,
	shareLinks,
} from '../utils/helpers';
import { CopyLinkButton } from '../components/ui/Buttons';
import { Modal } from '../components/ui/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faXTwitter,
	faRedditAlien,
	faLinkedinIn,
	faTiktok,
	faInstagram,
	faMeta,
} from '@fortawesome/free-brands-svg-icons';
import StartupPage from '@components/ui/StartupPage';
import FriendsSidebar from '@components/ui/FriendsSidebar';

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
			<FriendsSidebar />
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
					setCustomPuzzle={setCustomPuzzle}
					setMode={() => {}}
					user={null}
					setShowSignInModal={() => {}}
				/>
			)}
			{showShareModal && (
				<Modal
					open={showShareModal}
					onClose={() => setShowShareModal(false)}
				>
					<div className='share-modal-content'>
						<h2>Share your VibeGrid result!</h2>
						<div className='share-links-grid'>
							{(() => {
								const iconMap = {
									X: <FontAwesomeIcon icon={faXTwitter} />,
									Meta: <FontAwesomeIcon icon={faMeta} />,
									Reddit: (
										<FontAwesomeIcon icon={faRedditAlien} />
									),
									LinkedIn: (
										<FontAwesomeIcon icon={faLinkedinIn} />
									),
									TikTok: (
										<FontAwesomeIcon icon={faTiktok} />
									),
									Instagram: (
										<FontAwesomeIcon icon={faInstagram} />
									),
								};
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
													>
														<span className='share-link-icon'>
															{
																iconMap[
																	link.name as keyof typeof iconMap
																]
															}
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
