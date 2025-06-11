import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faInstagram,
	faTiktok,
	faXTwitter,
	faAmazon,
} from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
	return (
		<div className='footer'>
			<div className='footer-left'>
				<a
					href='https://www.redbubble.com/people/dsdev/shop?artistUserName=dsdev&iaCode=u-prints'
					className='footer-link'
				>
					<span aria-hidden='true'>&copy;</span>
					<span>
						Noble Beast{' '}
						{new Date().toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</span>
				</a>
			</div>
			<div className='footer-right'>
				<ul className='social-icons-footer'>
					<li>
						<a
							href='https://instagram.com'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Instagram'
							className='footer-social-link instagram'
						>
							<FontAwesomeIcon
								icon={faInstagram}
								size='lg'
								className='footer-social-icon instagram-icon'
							/>
						</a>
					</li>
					<li>
						<a
							href='https://www.tiktok.com/@noblebeasts.art?is_from_webapp=1&sender_device=pc'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='TikTok'
							className='footer-social-link tiktok'
						>
							<FontAwesomeIcon
								icon={faTiktok}
								size='lg'
								className='footer-social-icon tiktok-icon'
							/>
						</a>
					</li>
					<li>
						<a
							href='https://x.com/BeastsNoble'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='X'
							className='footer-social-link x'
						>
							<FontAwesomeIcon
								icon={faXTwitter}
								size='lg'
								className='footer-social-icon x-icon'
							/>
						</a>
					</li>
					<li>
						<a
							href='https://a.co/d/gdRgyxt'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Amazon'
							className='footer-social-link amazon'
						>
							<FontAwesomeIcon
								icon={faAmazon}
								size='lg'
								className='footer-social-icon amazon-icon'
							/>
						</a>
					</li>
				</ul>
				<a
					href='https://beastworld.vercel.app'
					target='_blank'
					rel='noopener noreferrer'
					className='footer-link footer-link-beastworld'
				>
					Beast World
				</a>
			</div>
		</div>
	);
};

export default Footer;
