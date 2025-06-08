import '../styles/index.scss';
import '../styles/App.scss';
import type { AppProps } from 'next/app';
import { MultiplayerProvider } from '../components/ui/MultiplayerProvider';
import { FriendsProvider } from '../components/ui/FriendsProvider';
import { FriendsToggleButton } from '../components/ui/Buttons';
import FriendsSidebar from '../components/ui/FriendsSidebar';
import { SessionProvider } from 'next-auth/react';
import { NotificationBannerProvider } from '../components/ui/MultiplayerProvider';
import { UserSettingsProvider } from '../components/ui/UserSettingsProvider';

export default function App({
	Component,
	pageProps,
}: AppProps) {
	return (
		<SessionProvider session={pageProps.session}>
			<UserSettingsProvider>
				<NotificationBannerProvider>
					<MultiplayerProvider>
						<FriendsProvider>
							<FriendsToggleButton />
							<FriendsSidebar />
							<Component {...pageProps} />
						</FriendsProvider>
					</MultiplayerProvider>
				</NotificationBannerProvider>
			</UserSettingsProvider>
		</SessionProvider>
	);
}
