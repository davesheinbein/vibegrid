import prisma from '../server/prismaClient';

// Simple in-memory rate limiter (per process; use Redis for production)
const rateLimitMap = new Map<
	string,
	{ count: number; last: number }
>();
export function rateLimit(
	key: string,
	max: number,
	windowMs: number
): boolean {
	const now = Date.now();
	const entry = rateLimitMap.get(key) || {
		count: 0,
		last: now,
	};
	if (now - entry.last > windowMs) {
		entry.count = 1;
		entry.last = now;
	} else {
		entry.count++;
	}
	rateLimitMap.set(key, entry);
	return entry.count <= max;
}

// Profanity filter stub
export function filterProfanity(message: string): string {
	// TODO: Replace with a real filter or use a library
	return message.replace(/(badword)/gi, '****');
}

// User chat settings stub
export async function isChatDisabled(
	userId: string
): Promise<boolean> {
	// TODO: Check user settings in DB
	return false;
}

// getSessionUser for Socket.IO (expects JWT in handshake auth)
import jwt from 'jsonwebtoken';
export function getSessionUser(
	socket: any
): { id: string } | null {
	try {
		const token =
			socket.handshake.auth?.token ||
			socket.handshake.headers?.authorization?.split(
				' '
			)[1];
		if (!token) return null;
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		);
		return typeof decoded === 'object' &&
			decoded &&
			'id' in decoded
			? { id: (decoded as any).id }
			: null;
	} catch {
		return null;
	}
}
