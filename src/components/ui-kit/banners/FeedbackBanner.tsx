import React from 'react';

interface FeedbackBannerProps {
	message: string;
}

const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
	message,
}) => {
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
