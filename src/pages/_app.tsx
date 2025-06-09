import '../styles/index.scss';
import '../styles/App.scss';
import type { AppProps } from 'next/app';
import { FriendsToggleButton } from '../components/ui/Buttons';
import FriendsSidebar from '../components/ui/FriendsSidebar';
import { SessionProvider } from 'next-auth/react';
import { UserSettingsProvider } from '../components/ui/UserSettingsProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';
import React, { useState } from 'react';

export default function App({
	Component,
	pageProps,
}: AppProps) {
	const [isFriendsSidebarOpen, setFriendsSidebarOpen] =
		useState(false);
	return (
		<ReduxProvider store={store}>
			<SessionProvider session={pageProps.session}>
				<UserSettingsProvider>
					<FriendsToggleButton
						onClick={() => setFriendsSidebarOpen(true)}
					/>
					<FriendsSidebar
						isOpen={isFriendsSidebarOpen}
						onClose={() => setFriendsSidebarOpen(false)}
					/>
					<Component {...pageProps} />
				</UserSettingsProvider>
			</SessionProvider>
		</ReduxProvider>
	);
}
