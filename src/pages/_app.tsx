import '../styles/index.scss';
import '../styles/App.scss';
import type { AppProps } from 'next/app';
import { FriendsToggleButton } from '../components/ui-kit/buttons';
import FriendsSidebar from '../components/ui-kit/chats/FriendsSidebar';
import { SessionProvider } from 'next-auth/react';
import { UserSettingsProvider } from '../components/ui-kit';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';
import React, { useState } from 'react';
import { GlobalToast } from '../components/ui-kit/banners';
import AchievementSocketListener from '../components/ui-kit/AchievementSocketListener';
import { SessionDebugger } from '../components/ui-kit/debug';
import { SocketProvider } from '../components/ui-kit/providers/SocketProvider';

export default function App({
	Component,
	pageProps,
}: AppProps) {
	const [isFriendsSidebarOpen, setFriendsSidebarOpen] =
		useState(false);

	return (
		<ReduxProvider store={store}>
			<SessionProvider session={pageProps.session}>
				<SocketProvider>
					<UserSettingsProvider>
						<SessionDebugger />
						<AchievementSocketListener />
						<GlobalToast />
						<FriendsToggleButton
							onClick={() => setFriendsSidebarOpen(true)}
						/>
						<FriendsSidebar
							isOpen={isFriendsSidebarOpen}
							onClose={() => setFriendsSidebarOpen(false)}
						/>
						<Component {...pageProps} />
					</UserSettingsProvider>
				</SocketProvider>
			</SessionProvider>
		</ReduxProvider>
	);
}
