import '../src/index.scss';
import '../src/App.scss';
import type { AppProps } from 'next/app';

export default function App({
	Component,
	pageProps,
}: AppProps) {
	return <Component {...pageProps} />;
}
