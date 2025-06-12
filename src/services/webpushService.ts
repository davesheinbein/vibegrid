import axios from 'axios';

export async function subscribeWebPush(
	subscription: any
): Promise<{ success: boolean; message: string }> {
	const res = await axios.post(
		'/api/webpush',
		subscription
	);
	return res.data;
}

export async function unsubscribeWebPush(): Promise<{
	success: boolean;
	message: string;
}> {
	const res = await axios.delete('/api/webpush');
	return res.data;
}
