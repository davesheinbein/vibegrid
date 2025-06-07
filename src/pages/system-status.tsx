import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface StatusCheck {
	name: string;
	status: 'pass' | 'fail' | 'warn' | 'pending';
	message?: string;
	timestamp?: string;
	debug?: any;
}

const checksConfig = [
	{ name: 'Backend Health', key: 'backend' },
	{ name: 'Database Connection', key: 'db' },
	{ name: 'API: /api/puzzles/daily', key: 'api_daily' },
	{ name: 'API: /api/puzzles/custom', key: 'api_custom' },
	{
		name: 'API: /api/matchmaking/join',
		key: 'api_matchmaking',
	},
	{ name: 'API: /api/friends', key: 'api_friends' },
	{ name: 'API: /api/messages', key: 'api_messages' },
	{
		name: 'API: /api/achievements',
		key: 'api_achievements',
	},
	{ name: 'API: /api/leaderboard', key: 'api_leaderboard' },
	{ name: 'Socket: /friends', key: 'socket_friends' },
	{ name: 'Socket: /chat', key: 'socket_chat' },
	{
		name: 'Socket: /matchmaking',
		key: 'socket_matchmaking',
	},
	{ name: 'Socket: /room', key: 'socket_room' },
	{ name: 'Socket: /game', key: 'socket_game' },
	{
		name: 'Socket: /notifications',
		key: 'socket_notifications',
	},
	{ name: 'Achievements Integrity', key: 'achievements' },
	{ name: 'Game Mode: Daily Puzzle', key: 'game_daily' },
	{ name: 'Game Mode: Custom Puzzle', key: 'game_custom' },
	{ name: 'Game Mode: VS Mode', key: 'game_vs' },
	{ name: 'Notification System', key: 'notifications' },
	{ name: 'Security & Auth', key: 'auth' },
];

const badge = (status: string) => {
	if (status === 'pass')
		return <span style={{ color: 'green' }}>✅ Pass</span>;
	if (status === 'fail')
		return <span style={{ color: 'red' }}>❌ Fail</span>;
	if (status === 'warn')
		return (
			<span style={{ color: 'orange' }}>⚠️ Warning</span>
		);
	return <span style={{ color: 'gray' }}>⏳ Pending</span>;
};

const SystemStatus: React.FC = () => {
	const { data: session, status } = useSession();
	const [checks, setChecks] = useState<
		Record<string, StatusCheck>
	>({});
	const [autoRefresh, setAutoRefresh] = useState(false);
	const [refreshInterval, setRefreshInterval] =
		useState(30);
	const [debugKey, setDebugKey] = useState<string | null>(
		null
	);

	// Only allow admin
	if (status === 'loading') return null;
	if (!session || !(session.user as any)?.isAdmin) {
		return (
			<div style={{ padding: 40, color: 'red' }}>
				Access denied. Admins only.
			</div>
		);
	}

	useEffect(() => {
		runAllChecks();
		let interval: any;
		if (autoRefresh) {
			interval = setInterval(
				runAllChecks,
				refreshInterval * 1000
			);
		}
		return () => interval && clearInterval(interval);
	}, [autoRefresh, refreshInterval]);

	async function runAllChecks() {
		const now = new Date().toLocaleTimeString();
		const results: Record<string, StatusCheck> = {};
		// Backend Health
		try {
			const t0 = Date.now();
			const res = await axios.get('/api/health');
			results.backend = {
				name: 'Backend Health',
				status: res.status === 200 ? 'pass' : 'fail',
				message: `Uptime: ${res.data.uptime}s, Env: ${
					res.data.env
				}, Version: ${res.data.version}, Response: ${
					Date.now() - t0
				}ms`,
				timestamp: now,
				debug: res.data,
			};
		} catch (e: any) {
			results.backend = {
				name: 'Backend Health',
				status: 'fail',
				message: e.message,
				timestamp: now,
				debug: e,
			};
		}
		// DB Health
		try {
			const res = await axios.get('/api/health/db');
			results.db = {
				name: 'Database Connection',
				status: res.data.ok ? 'pass' : 'fail',
				message: `Tables: ${res.data.tables.join(
					', '
				)}, Users: ${res.data.userCount}, Puzzles: ${
					res.data.puzzleCount
				}, Matches: ${res.data.matchCount}`,
				timestamp: now,
				debug: res.data,
			};
		} catch (e: any) {
			results.db = {
				name: 'Database Connection',
				status: 'fail',
				message: e.message,
				timestamp: now,
				debug: e,
			};
		}
		// API Endpoints
		const apiEndpoints = [
			{ key: 'api_daily', url: '/api/puzzles/daily' },
			{ key: 'api_custom', url: '/api/puzzles/custom' },
			{
				key: 'api_matchmaking',
				url: '/api/matchmaking/join',
				method: 'post',
			},
			{ key: 'api_friends', url: '/api/friends' },
			{ key: 'api_messages', url: '/api/messages' },
			{ key: 'api_achievements', url: '/api/achievements' },
			{
				key: 'api_leaderboard',
				url: '/api/leaderboard/global',
			},
		];
		for (const ep of apiEndpoints) {
			try {
				const res =
					ep.method === 'post'
						? await axios.post(ep.url, {})
						: await axios.get(ep.url);
				results[ep.key] = {
					name: ep.url,
					status: res.status === 200 ? 'pass' : 'fail',
					message: `Status: ${res.status}, Length: ${
						Array.isArray(res.data) ? res.data.length : '-'
					}`,
					timestamp: now,
					debug: res.data,
				};
			} catch (e: any) {
				results[ep.key] = {
					name: ep.url,
					status: 'fail',
					message: e.message,
					timestamp: now,
					debug: e,
				};
			}
		}
		// TODO: Add socket, achievements, game mode, notification, and auth checks
		setChecks(results);
	}

	return (
		<div
			style={{
				padding: 32,
				maxWidth: 900,
				margin: '0 auto',
			}}
		>
			<h1>VibeGrid System Status</h1>
			<div style={{ marginBottom: 16 }}>
				<label>
					<input
						type='checkbox'
						checked={autoRefresh}
						onChange={(e) =>
							setAutoRefresh(e.target.checked)
						}
					/>
					Auto-refresh
				</label>
				{autoRefresh && (
					<span style={{ marginLeft: 12 }}>
						Every{' '}
						<input
							type='number'
							value={refreshInterval}
							min={5}
							max={300}
							style={{ width: 50 }}
							onChange={(e) =>
								setRefreshInterval(Number(e.target.value))
							}
						/>{' '}
						seconds
					</span>
				)}
				<button
					style={{ marginLeft: 24 }}
					onClick={runAllChecks}
				>
					Manual Refresh
				</button>
			</div>
			<table
				style={{
					width: '100%',
					borderCollapse: 'collapse',
				}}
			>
				<thead>
					<tr>
						<th style={{ textAlign: 'left' }}>Check</th>
						<th>Status</th>
						<th>Message</th>
						<th>Last Checked</th>
						<th>Debug</th>
					</tr>
				</thead>
				<tbody>
					{checksConfig.map((cfg) => (
						<tr
							key={cfg.key}
							style={{ borderBottom: '1px solid #eee' }}
						>
							<td>{cfg.name}</td>
							<td>
								{badge(
									checks[cfg.key]?.status || 'pending'
								)}
							</td>
							<td>{checks[cfg.key]?.message || ''}</td>
							<td>{checks[cfg.key]?.timestamp || ''}</td>
							<td>
								{checks[cfg.key]?.debug && (
									<button
										onClick={() =>
											setDebugKey(
												debugKey === cfg.key
													? null
													: cfg.key
											)
										}
									>
										{debugKey === cfg.key ? 'Hide' : 'Show'}
									</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{debugKey && (
				<pre
					style={{
						marginTop: 24,
						background: '#f8fafc',
						padding: 16,
						borderRadius: 8,
						maxHeight: 400,
						overflow: 'auto',
					}}
				>
					{JSON.stringify(checks[debugKey]?.debug, null, 2)}
				</pre>
			)}
		</div>
	);
};

export default SystemStatus;
