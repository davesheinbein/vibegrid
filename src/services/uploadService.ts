import axios from 'axios';

export async function uploadFile(
	file: File
): Promise<{ success: boolean; url: string }> {
	const formData = new FormData();
	formData.append('file', file);
	const res = await axios.post('/api/upload', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	return res.data;
}
