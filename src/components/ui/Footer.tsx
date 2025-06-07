import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faInstagram,
	faTiktok,
	faXTwitter,
	faAmazon,
} from '@fortawesome/free-brands-svg-icons';
import { DarkModeToggle } from './Buttons';

const Footer: React.FC = () => {
	return (
		<div className='footer'>
			<div className='footer-left'>
				<a
					href='https://www.redbubble.com/people/dsdev/shop?artistUserName=dsdev&iaCode=u-prints'
					style={{
						display: 'flex',
						justifyContent: 'center',
						textDecoration: 'none',
					}}
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
					{/* dark/light mode */}
					<DarkModeToggle />
					<li>
						<a
							href='https://instagram.com'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Instagram'
							className='instagram'
						>
							<FontAwesomeIcon
								icon={faInstagram}
								size='lg'
								className='instagram-icon'
							/>
						</a>
					</li>
					<li>
						<a
							href='https://www.tiktok.com/@noblebeasts.art?is_from_webapp=1&sender_device=pc'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='TikTok'
							className='tiktok'
						>
							<FontAwesomeIcon
								icon={faTiktok}
								size='lg'
								className='tiktok-icon'
							/>
						</a>
					</li>
					<li>
						<a
							href='https://x.com/BeastsNoble'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='X'
							className='x'
						>
							<FontAwesomeIcon
								icon={faXTwitter}
								size='lg'
								className='x-icon'
							/>
						</a>
					</li>
					<li>
						<a
							href='https://a.co/d/gdRgyxt'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Amazon'
							className='amazon'
						>
							<FontAwesomeIcon
								icon={faAmazon}
								size='lg'
								className='amazon-icon'
							/>
						</a>
					</li>
				</ul>
				<a
					// href='https://beastworld.vercel.app'
					href='#'
					// target='_blank'
					rel='noopener noreferrer'
					className='ml-auto text-gray-500 hover:underline'
					style={{
						cursor: 'pointer',
						textDecoration: 'none',
					}}
				>
					Beast World
				</a>
			</div>
		</div>
	);
};

export default Footer;
