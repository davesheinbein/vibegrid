// src/services/adminService.ts
import axios from 'axios';
import type { User, Puzzle } from '../types/api';

// --- Admin API Service ---

export async function fetchAdminUsers(): Promise<User[]> {
	const res = await axios.get('/api/admin/users');
	return res.data;
}

export async function banUser(
	userId: string
): Promise<void> {
	await axios.post('/api/admin/ban-user', { userId });
}

export async function approvePuzzle(
	puzzleId: string
): Promise<void> {
	await axios.post('/api/admin/approve-puzzle', {
		puzzleId,
	});
}

export async function triggerTestAchievement(
	userId: string,
	achievementId: string
): Promise<any> {
	const res = await axios.post(
		'/api/admin/test-achievement',
		{ userId, achievementId }
	);
	return res.data;
}

// QA/Scenario endpoints
export async function runQADailyScenario(
	scenario: string,
	userId: string
): Promise<any> {
	const res = await axios.post('/api/admin/qa/daily', {
		scenario,
		userId,
	});
	return res.data;
}

export async function runQACustomScenario(
	puzzleId: string,
	userId: string
): Promise<any> {
	const res = await axios.post('/api/admin/qa/custom', {
		puzzleId,
		userId,
	});
	return res.data;
}

// Logs and Sockets (stubs, to be implemented on backend)
export async function fetchAdminLogs(): Promise<any[]> {
	const res = await axios.get('/api/admin/logs');
	return res.data;
}

export async function fetchAdminSockets(): Promise<any[]> {
	const res = await axios.get('/api/admin/sockets');
	return res.data;
}
