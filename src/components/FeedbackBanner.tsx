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
			className={`feedback-banner${
				message ? '' : ' feedback-banner--hidden'
			}`}
			aria-live='polite'
		>
			{message}
		</div>
	);
};

export default FeedbackBanner;
