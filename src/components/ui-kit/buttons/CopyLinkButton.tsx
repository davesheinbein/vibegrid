// Centralized CopyLinkButton component for UI Kit
import React from 'react';
import {
	getShareUrl,
	copyToClipboard,
} from '../../../utils/helpers';

const CopyLinkButton: React.FC = () => {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = () => {
		copyToClipboard(getShareUrl());
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<a
				href='#'
				onClick={(e) => {
					e.preventDefault();
					handleCopy();
				}}
				className='share-link share-link--copy'
			>
				<span
					className='share-link-icon'
					style={{ color: '#fff' }}
				>
					<svg
						width='22'
						height='22'
						viewBox='0 0 32 32'
						fill='none'
					>
						<circle cx='16' cy='16' r='16' fill='#64748b' />
						<g>
							<rect
								x='10'
								y='14'
								width='8'
								height='8'
								rx='2'
								fill='#fff'
							/>
							<rect
								x='14'
								y='10'
								width='8'
								height='8'
								rx='2'
								fill='none'
								stroke='#fff'
								strokeWidth='2'
							/>
						</g>
					</svg>
				</span>
				<span className='share-link-text'>Copy URL</span>
			</a>
			{copied && (
				<span
					style={{
						color: '#16a34a',
						fontSize: 14,
						marginLeft: 10,
						fontWeight: 700,
					}}
				>
					✓ Copied!
				</span>
			)}
		</div>
	);
};

export default CopyLinkButton;
