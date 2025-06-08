import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomPuzzleModal from '../components/modal/CustomPuzzleModal';

// --- Types for admin data ---
interface User {
	id: string;
	name?: string;
	email?: string;
}
interface Puzzle {
	id: string;
	title?: string;
}
interface Achievement {
	id: string;
	label: string;
	description: string;
}
interface LeaderboardEntry {
	userId: string;
	username: string;
	score: number;
}

const TOP_NAV = [
	'Dashboard',
	'Puzzles',
	'Users',
	'Live Matches',
	'Socket Monitor',
	'Logs',
	'QA Tools',
];

const QA_SIDEBAR = [
	{
		label: 'Test Daily Puzzle (Default)',
		action: 'daily-default',
	},
	{
		label: 'Test Daily Puzzle (1 Group Solved)',
		action: 'daily-1group',
	},
	{
		label: 'Test Daily Puzzle (2 Groups Solved)',
		action: 'daily-2group',
	},
	{
		label: 'Test Daily Puzzle (3 Groups Solved)',
		action: 'daily-3group',
	},
	{
		label: 'Test Daily Puzzle (0 Attempts)',
		action: 'daily-0attempts',
	},
	{
		label: 'Test Custom Puzzle by ID',
		action: 'custom-id',
	},
	{ label: 'VS Test Room (Bot)', action: 'vs-bot' },
	{ label: 'Toggle God Mode', action: 'god-mode' },
	{
		label: 'Simulate Achievement Unlock',
		action: 'achieve-test',
	},
	{ label: 'Simulate Notification', action: 'notif-test' },
];

export default function Admin() {
	const [activeTab, setActiveTab] = useState(TOP_NAV[0]);
	const [qaSidebarAction, setQASidebarAction] = useState(
		QA_SIDEBAR[0].action
	);
	const [showAddPuzzleModal, setShowAddPuzzleModal] =
		useState(false);
	const [adminUser, setAdminUser] = useState<any>(null); // Optionally fetch admin user info if needed

	// --- Dashboard Data ---
	const [stats, setStats] = useState<any>({
		totalUsers: 0,
		totalPuzzles: 0,
		totalMatches: 0,
		todayActive: 0,
		systemHealth: 'Unknown',
		recentActivity: [],
	});
	useEffect(() => {
		async function fetchStats() {
			try {
				const res = await axios.get(
					'/api/analytics/global'
				);
				setStats((s: any) => ({
					...s,
					totalUsers: res.data.userCount,
					totalPuzzles: res.data.puzzleCount,
					totalMatches: res.data.matchCount,
				}));
				const health = await axios.get('/api/health');
				setStats((s: any) => ({
					...s,
					systemHealth: health.data.ok
						? 'Healthy'
						: 'Unhealthy',
				}));
				// Optionally fetch recent activity from logs or events
			} catch (e) {}
		}
		fetchStats();
	}, []);

	// --- Puzzles Data ---
	const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
	const [puzzlesError, setPuzzlesError] = useState<
		string | null
	>(null);
	useEffect(() => {
		if (activeTab !== 'Puzzles') return;
		setPuzzlesError(null);
		axios
			.get('/api/puzzles')
			.then((res) => setPuzzles(res.data))
			.catch((err) => {
				setPuzzlesError(
					err?.response?.status === 404
						? 'Puzzle API endpoint not found (404)'
						: 'Failed to load puzzles.'
				);
				setPuzzles([]);
			});
	}, [activeTab]);
	const handleApprovePuzzle = async (id: string) => {
		await axios.post('/api/admin/approve-puzzle', {
			puzzleId: id,
		});
		setPuzzles((prev) =>
			prev.map((p) =>
				p.id === id ? { ...p, approved: true } : p
			)
		);
	};
	const handleDeletePuzzle = async (id: string) => {
		await axios.delete(`/api/puzzles/${id}`);
		setPuzzles((prev) => prev.filter((p) => p.id !== id));
	};

	// Handle new puzzle creation from modal
	const handleAdminAddPuzzle = (newPuzzle: any) => {
		setPuzzles((prev) => [{ ...newPuzzle }, ...prev]);
		setShowAddPuzzleModal(false);
	};

	// --- Users Data ---
	const [users, setUsers] = useState<any[]>([]);
	const [usersError, setUsersError] = useState<
		string | null
	>(null);
	useEffect(() => {
		if (activeTab !== 'Users') return;
		setUsersError(null);
		axios
			.get('/api/admin/users')
			.then((res) => setUsers(res.data))
			.catch((err) => {
				setUsersError(
					err?.response?.status === 404
						? 'User API endpoint not found (404)'
						: 'Failed to load users.'
				);
				setUsers([]);
			});
	}, [activeTab]);
	const handleBanUser = async (id: string) => {
		await axios.post('/api/admin/ban-user', { userId: id });
		setUsers((prev) =>
			prev.map((u) =>
				u.id === id ? { ...u, banned: true } : u
			)
		);
	};

	// --- Live Matches Data ---
	const [matches, setMatches] = useState<any[]>([]);
	const [matchesError, setMatchesError] = useState<
		string | null
	>(null);
	useEffect(() => {
		if (activeTab !== 'Live Matches') return;
		setMatchesError(null);
		axios
			.get('/api/matches')
			.then((res) => setMatches(res.data))
			.catch((err) => {
				setMatchesError(
					err?.response?.status === 404
						? 'Matches API endpoint not found (404)'
						: 'Failed to load live matches.'
				);
				setMatches([]);
			});
	}, [activeTab]);

	// --- Socket Monitor ---
	const [sockets, setSockets] = useState<any[]>([]);
	useEffect(() => {
		if (activeTab !== 'Socket Monitor') return;
		// TODO: Implement a real endpoint for sockets
		// setSockets(await axios.get('/api/admin/sockets'));
	}, [activeTab]);

	// --- Logs ---
	const [logs, setLogs] = useState<any[]>([]);
	useEffect(() => {
		if (activeTab !== 'Logs') return;
		// TODO: Implement a real endpoint for logs
		// setLogs(await axios.get('/api/admin/logs'));
	}, [activeTab]);

	// --- QA Tools ---
	const handleQASidebarAction = (action: string) => {
		setQASidebarAction(action);
	};
	const handleRunQATool = async () => {
		if (qaSidebarAction === 'achieve-test') {
			// Example: trigger test achievement for a test user
			await axios.post('/api/admin/test-achievement', {
				userId: users[0]?.id,
				achievementId: 'test-achievement-id',
			});
		}
		// Add more QA tool actions as needed
	};

	return (
		<div className='admin-dashboard-container'>
			<style jsx>{`
				.admin-dashboard-container {
					background: linear-gradient(
						120deg,
						#f8fafc 80%,
						#e0e7ff 100%
					);
					min-height: 100vh;
					padding: 0 0 64px 0;
				}
				.admin-header {
					font-size: 2.1rem;
					font-weight: 800;
					color: #1e293b;
					letter-spacing: -0.5px;
					margin: 0 0 18px 0;
					padding: 32px 0 0 0;
					text-align: center;
				}
				.admin-top-nav {
					display: flex;
					gap: 8px;
					background: #f3f4f6;
					border-bottom: 1px solid #e5e7eb;
					padding: 0 0 8px 0;
					margin-bottom: 24px;
					position: sticky;
					top: 0;
					z-index: 10;
					overflow-x: auto;
				}
				.admin-top-nav button {
					background: none;
					border: none;
					padding: 12px 28px 10px 28px;
					font-size: 1.08em;
					font-weight: 500;
					color: #64748b;
					border-radius: 8px 8px 0 0;
					cursor: pointer;
					transition: background 0.15s, color 0.15s;
					outline: none;
					white-space: nowrap;
				}
				.admin-top-nav button.active {
					background: #fff;
					color: #1e293b;
					box-shadow: 0 2px 8px 0 #e3eaff33;
					border-bottom: 2px solid #fbbf24;
					font-weight: 700;
				}
				.admin-main-content {
					max-width: 1200px;
					margin: 0 auto;
					background: #fff;
					border-radius: 16px;
					box-shadow: 0 4px 32px 0 #e3eaff22;
					padding: 32px 36px 40px 36px;
					margin-bottom: 32px;
				}
				.admin-dashboard-stats {
					display: flex;
					gap: 32px;
					margin-bottom: 18px;
					flex-wrap: wrap;
				}
				.admin-dashboard-section h2,
				.admin-puzzles-section h2,
				.admin-users-section h2,
				.admin-matches-section h2,
				.admin-socket-section h2,
				.admin-logs-section h2 {
					margin-bottom: 18px;
					font-size: 1.4em;
					font-weight: 700;
					color: #1e293b;
				}
				.admin-table {
					width: 100%;
					border-collapse: separate;
					border-spacing: 0;
					margin-top: 18px;
					background: #f9fafb;
					border-radius: 10px;
					overflow: hidden;
					box-shadow: 0 2px 8px 0 #e3eaff11;
					font-size: 1em;
				}
				.admin-table th,
				.admin-table td {
					padding: 12px 16px;
					text-align: left;
					border-bottom: 1px solid #e5e7eb;
				}
				.admin-table th {
					background: #f3f4f6;
					font-weight: 600;
					color: #334155;
				}
				.admin-table tr:last-child td {
					border-bottom: none;
				}
				.admin-table button {
					margin-right: 8px;
					background: #fbbf24;
					color: #1e293b;
					border: none;
					border-radius: 6px;
					padding: 6px 14px;
					font-size: 0.98em;
					font-weight: 500;
					cursor: pointer;
					transition: background 0.15s;
				}
				.admin-table button:disabled {
					background: #e5e7eb;
					color: #a1a1aa;
					cursor: not-allowed;
				}
				.admin-table button:hover:not(:disabled) {
					background: #fde68a;
				}
				.admin-qa-section {
					display: flex;
					gap: 32px;
				}
				.admin-qa-sidebar {
					background: #f3f4f6;
					border-radius: 10px;
					padding: 18px 12px 18px 18px;
					box-shadow: 0 2px 8px 0 #e3eaff11;
					min-width: 220px;
				}
				.admin-qa-sidebar ul {
					list-style: none;
					padding: 0;
					margin: 0;
				}
				.admin-qa-sidebar button {
					width: 100%;
					background: none;
					border: none;
					padding: 8px 0;
					text-align: left;
					color: #64748b;
					font-size: 1em;
					border-radius: 6px;
					margin-bottom: 2px;
					transition: background 0.13s, color 0.13s;
				}
				.admin-qa-sidebar button.active,
				.admin-qa-sidebar button:hover {
					background: #fbbf24;
					color: #1e293b;
				}
				.admin-logs-list {
					background: #f3f4f6;
					border-radius: 8px;
					padding: 12px 18px;
					font-size: 0.98em;
					max-height: 300px;
					overflow-y: auto;
				}
				@media (max-width: 900px) {
					.admin-main-content {
						padding: 18px 6vw 24px 6vw;
					}
					.admin-dashboard-stats {
						gap: 16px;
					}
				}
				@media (max-width: 600px) {
					.admin-main-content {
						padding: 8px 2vw 16px 2vw;
					}
					.admin-dashboard-stats {
						flex-direction: column;
						gap: 8px;
					}
					.admin-qa-section {
						flex-direction: column;
						gap: 12px;
					}
					.admin-qa-sidebar {
						min-width: 0;
						padding: 10px 6px 10px 10px;
					}
				}
			`}</style>
			<h1 className='admin-header'>
				VibeGrid Admin Dashboard
			</h1>
			<nav className='admin-top-nav'>
				{TOP_NAV.map((tab) => (
					<button
						key={tab}
						className={activeTab === tab ? 'active' : ''}
						onClick={() => setActiveTab(tab)}
					>
						{tab}
					</button>
				))}
			</nav>
			<div className='admin-main-content'>
				{activeTab === 'Dashboard' && (
					<div className='admin-dashboard-section'>
						<h2>System Overview</h2>
						<div className='admin-dashboard-stats'>
							<div>Total Users: {stats.totalUsers}</div>
							<div>Total Puzzles: {stats.totalPuzzles}</div>
							<div>
								Active Matches: {stats.totalMatches}
							</div>
							<div>Active Today: {stats.todayActive}</div>
							<div>
								System Health:{' '}
								<span
									style={{
										color:
											stats.systemHealth === 'Healthy'
												? 'green'
												: 'red',
									}}
								>
									{stats.systemHealth}
								</span>
							</div>
						</div>
						<h3>Recent Activity</h3>
						<ul>
							{stats.recentActivity?.map(
								(a: any, i: number) => (
									<li key={i}>
										{a.desc}{' '}
										<span
											style={{
												color: '#888',
												fontSize: 12,
											}}
										>
											({a.time})
										</span>
									</li>
								)
							)}
						</ul>
					</div>
				)}
				{activeTab === 'Puzzles' && (
					<div className='admin-puzzles-section'>
						<h2>Puzzle Management</h2>
						<button
							onClick={() => setShowAddPuzzleModal(true)}
						>
							Add New Puzzle
						</button>
						{puzzlesError && (
							<div
								style={{ color: 'red', margin: '12px 0' }}
							>
								{puzzlesError}
							</div>
						)}
						<table className='admin-table'>
							<thead>
								<tr>
									<th>ID</th>
									<th>Title</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{puzzles.map((p) => (
									<tr key={p.id}>
										<td>{p.id}</td>
										<td>{p.title}</td>
										<td>
											<button
												onClick={() =>
													handleApprovePuzzle(p.id)
												}
											>
												Approve
											</button>
											<button>Edit</button>
											<button
												onClick={() =>
													handleDeletePuzzle(p.id)
												}
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{/* Add New Puzzle Modal */}
						{showAddPuzzleModal && (
							<CustomPuzzleModal
								open={showAddPuzzleModal}
								onClose={() => setShowAddPuzzleModal(false)}
								setCustomPuzzle={handleAdminAddPuzzle}
								setMode={() => {}}
								user={adminUser}
							/>
						)}
					</div>
				)}
				{activeTab === 'Users' && (
					<div className='admin-users-section'>
						<h2>User Management</h2>
						{usersError && (
							<div
								style={{ color: 'red', margin: '12px 0' }}
							>
								{usersError}
							</div>
						)}
						<table className='admin-table'>
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Email</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.map((u) => (
									<tr key={u.id}>
										<td>{u.id}</td>
										<td>{u.username || u.name}</td>
										<td>{u.email}</td>
										<td>
											<button>View</button>
											<button>Impersonate</button>
											<button
												onClick={() => handleBanUser(u.id)}
												disabled={u.banned}
											>
												Ban
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{activeTab === 'Live Matches' && (
					<div className='admin-matches-section'>
						<h2>Live Matches</h2>
						{matchesError && (
							<div
								style={{ color: 'red', margin: '12px 0' }}
							>
								{matchesError}
							</div>
						)}
						<table className='admin-table'>
							<thead>
								<tr>
									<th>ID</th>
									<th>Players</th>
									<th>Status</th>
									<th>Started</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{matches.map((m) => (
									<tr key={m.id}>
										<td>{m.id}</td>
										<td>{m.players?.join(', ')}</td>
										<td>{m.state}</td>
										<td>{m.startedAt}</td>
										<td>
											<button>View</button>
											<button>Force End</button>
											<button>Broadcast</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{activeTab === 'Socket Monitor' && (
					<div className='admin-socket-section'>
						<h2>Socket Connections</h2>
						<table className='admin-table'>
							<thead>
								<tr>
									<th>ID</th>
									<th>User</th>
									<th>Room</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{sockets.map((s) => (
									<tr key={s.id}>
										<td>{s.id}</td>
										<td>{s.user}</td>
										<td>{s.room}</td>
										<td>{s.status}</td>
										<td>
											<button>Disconnect</button>
											<button>Send Test Event</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{activeTab === 'Logs' && (
					<div className='admin-logs-section'>
						<h2>System Logs</h2>
						<div
							className='admin-logs-list'
							style={{ maxHeight: 300, overflowY: 'auto' }}
						>
							{logs.map((log, i) => (
								<div
									key={i}
									style={{
										color:
											log.level === 'warn'
												? 'orange'
												: '#333',
									}}
								>
									[{log.time}]{' '}
									<b>{log.level?.toUpperCase()}</b>:{' '}
									{log.msg}
								</div>
							))}
						</div>
					</div>
				)}
				{activeTab === 'QA Tools' && (
					<div
						className='admin-qa-section'
						style={{
							display: 'flex',
							gap: 32,
							alignItems: 'flex-start',
							minHeight: 400,
						}}
					>
						<aside
							className='admin-qa-sidebar'
							style={{
								minWidth: 220,
								background: '#f8fafc',
								border: '1px solid #e5e7eb',
								borderRadius: 12,
								boxShadow: '0 2px 8px 0 #e3eaff22',
								padding: 20,
							}}
						>
							<h3
								style={{
									fontSize: 18,
									fontWeight: 700,
									marginBottom: 16,
									color: '#1e293b',
									letterSpacing: '-0.5px',
								}}
							>
								QA Scenarios
							</h3>
							<ul
								style={{
									listStyle: 'none',
									padding: 0,
									margin: 0,
								}}
							>
								{QA_SIDEBAR.map((qa) => (
									<li
										key={qa.action}
										style={{ marginBottom: 6 }}
									>
										<button
											className={
												qaSidebarAction === qa.action
													? 'active'
													: ''
											}
											onClick={() =>
												handleQASidebarAction(qa.action)
											}
											style={{
												width: '100%',
												background:
													qaSidebarAction === qa.action
														? 'linear-gradient(90deg,#fbbf24 0%,#38bdf8 100%)'
														: 'none',
												color:
													qaSidebarAction === qa.action
														? '#1e293b'
														: '#64748b',
												fontWeight:
													qaSidebarAction === qa.action
														? 700
														: 500,
												border: 'none',
												borderRadius: 6,
												padding: '10px 0',
												fontSize: 15,
												transition:
													'background 0.13s, color 0.13s',
												boxShadow:
													qaSidebarAction === qa.action
														? '0 2px 8px 0 #e3eaff33'
														: 'none',
												cursor: 'pointer',
											}}
										>
											{qa.label}
										</button>
									</li>
								))}
							</ul>
						</aside>
						<section
							className='admin-qa-main'
							style={{
								flex: 1,
								background: '#f9fafb',
								borderRadius: 12,
								boxShadow: '0 2px 8px 0 #e3eaff11',
								padding: 32,
								minHeight: 320,
							}}
						>
							<h3
								style={{
									fontSize: 20,
									fontWeight: 700,
									color: '#1e293b',
									marginBottom: 18,
									letterSpacing: '-0.5px',
								}}
							>
								Selected QA Tool:{' '}
								<span style={{ color: '#2563eb' }}>
									{qaSidebarAction}
								</span>
							</h3>
							<div style={{ marginTop: 16, fontSize: 16 }}>
								<p style={{ marginBottom: 18 }}>
									Run scenario: <b>{qaSidebarAction}</b>
								</p>
								<button
									onClick={handleRunQATool}
									style={{
										background:
											'linear-gradient(90deg,#38bdf8 0%,#fbbf24 100%)',
										color: '#1e293b',
										fontWeight: 700,
										border: 'none',
										borderRadius: 8,
										padding: '10px 32px',
										fontSize: 16,
										boxShadow: '0 2px 8px 0 #e3eaff33',
										cursor: 'pointer',
										transition:
											'background 0.13s, color 0.13s',
									}}
								>
									Run
								</button>
							</div>
						</section>
					</div>
				)}
			</div>
		</div>
	);
}
