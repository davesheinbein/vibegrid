import axios from 'axios';
import { User } from '../types/api';

export const fetchUsers = async (): Promise<User[]> => {
	const res = await axios.get('/api/admin/users');
	return res.data;
};

export const banUser = async (
	userId: string
): Promise<void> => {
	await axios.post('/api/admin/ban-user', { userId });
};
