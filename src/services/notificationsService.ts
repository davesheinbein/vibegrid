import axios from 'axios';
import { API_ROUTES } from '../constants/apiRoutes';
import { Notification } from '../types/api';

export const fetchNotifications = async (
	userId: string
): Promise<Notification[]> => {
	const res = await axios.get(
		API_ROUTES.USER_NOTIFICATIONS(userId)
	);
	return res.data;
};

export const fetchGlobalNotifications = async (): Promise<
	Notification[]
> => {
	const res = await axios.get(API_ROUTES.NOTIFICATIONS);
	return res.data;
};
