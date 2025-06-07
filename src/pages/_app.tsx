import '../styles/index.scss';
import '../styles/App.scss';
import type { AppProps } from 'next/app';
import { MultiplayerProvider } from '../components/ui/MultiplayerProvider';

export default function App({
	Component,
	pageProps,
}: AppProps) {
	return (
		<MultiplayerProvider>
			<Component {...pageProps} />
		</MultiplayerProvider>
	);
}
