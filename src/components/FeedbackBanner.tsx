import React from 'react';

interface FeedbackBannerProps {
	message: string;
}

const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
	message,
}) => {
	// --- Enhancement: visually hide empty feedback for layout stability ---
	return (
		<div
			className='feedback-banner'
			aria-live='polite'
			style={{ visibility: message ? 'visible' : 'hidden' }}
		>
			{message}
		</div>
	);
};

export default FeedbackBanner;
