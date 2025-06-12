export const API_ROUTES = {
	AUTH: {
		LOGIN: '/api/auth/login',
		LOGOUT: '/api/auth/logout',
		SESSION: '/api/auth/session',
	},
	ACHIEVEMENTS: '/api/achievements',
	CUSTOMIZATION: '/api/customization',
	USERS: (id: string) => `/api/users/${id}`,
	USER_ACHIEVEMENTS: (id: string) =>
		`/api/users/${id}/achievements`,
	USER_CUSTOMIZATION: (id: string) =>
		`/api/users/${id}/customization`,
	USER_FRIENDS: (id: string) => `/api/users/${id}/friends`,
	USER_MATCHES: (id: string) => `/api/users/${id}/matches`,
	USER_NOTIFICATIONS: (id: string) =>
		`/api/users/${id}/notifications`,
	USER_PROGRESSION: (id: string) =>
		`/api/users/${id}/progression`,
	USER_STATS: (id: string) => `/api/users/${id}/stats`,
	USER_SETTINGS: (id: string) =>
		`/api/users/${id}/settings`,
	LEADERBOARDS: '/api/leaderboards',
	ANALYTICS: '/api/analytics',
	NOTIFICATIONS: '/api/notifications',
	PUZZLES: '/api/puzzles',
	FRIENDS: '/api/friends',
	SYSTEM_STATUS: '/api/system-status',
	BOT_STATS: '/api/botStats',
	WEBPUSH: '/api/webpush',
	UPLOAD: '/api/upload',
	PROGRESSION: '/api/progression',
};
