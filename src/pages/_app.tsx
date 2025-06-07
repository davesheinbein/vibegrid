import '../styles/index.scss';
import '../styles/App.scss';
import type { AppProps } from 'next/app';
import { MultiplayerProvider } from '../components/ui/MultiplayerProvider';
import { FriendsProvider } from '../components/ui/FriendsProvider';

export default function App({
	Component,
	pageProps,
}: AppProps) {
	return (
		<MultiplayerProvider>
			<FriendsProvider>
				<Component {...pageProps} />
			</FriendsProvider>
		</MultiplayerProvider>
	);
}
