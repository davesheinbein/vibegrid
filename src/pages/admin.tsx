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
	{ label: 'Settings', action: 'settings' },
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
		try {
			switch (qaSidebarAction) {
				case 'daily-default': {
					// Simulate starting the daily puzzle (default state)
					await axios.post('/api/admin/qa/daily', {
						scenario: 'default',
						userId: users[0]?.id,
					});
					alert(
						'Daily Puzzle (Default) scenario triggered.'
					);
					break;
				}
				case 'daily-1group': {
					await axios.post('/api/admin/qa/daily', {
						scenario: '1group',
						userId: users[0]?.id,
					});
					alert(
						'Daily Puzzle (1 Group Solved) scenario triggered.'
					);
					break;
				}
				case 'daily-2group': {
					await axios.post('/api/admin/qa/daily', {
						scenario: '2group',
						userId: users[0]?.id,
					});
					alert(
						'Daily Puzzle (2 Groups Solved) scenario triggered.'
					);
					break;
				}
				case 'daily-3group': {
					await axios.post('/api/admin/qa/daily', {
						scenario: '3group',
						userId: users[0]?.id,
					});
					alert(
						'Daily Puzzle (3 Groups Solved) scenario triggered.'
					);
					break;
				}
				case 'daily-0attempts': {
					await axios.post('/api/admin/qa/daily', {
						scenario: '0attempts',
						userId: users[0]?.id,
					});
					alert(
						'Daily Puzzle (0 Attempts) scenario triggered.'
					);
					break;
				}
				case 'custom-id': {
					const customId = prompt(
						'Enter Custom Puzzle ID:'
					);
					if (customId) {
						await axios.post('/api/admin/qa/custom', {
							puzzleId: customId,
							userId: users[0]?.id,
						});
						alert(
							`Custom Puzzle by ID (${customId}) scenario triggered.`
						);
					}
					break;
				}
				case 'settings': {
					// Show settings panel modal
					const panel = document.createElement('div');
					panel.id = 'settings-panel-modal';
					panel.style.position = 'fixed';
					panel.style.top = '0';
					panel.style.left = '0';
					panel.style.width = '100vw';
					panel.style.height = '100vh';
					panel.style.background = 'rgba(0,0,0,0.25)';
					panel.style.zIndex = '9999';
					panel.onclick = () => panel.remove();
					const inner = document.createElement('div');
					inner.style.background = '#fff';
					inner.style.borderRadius = '12px';
					inner.style.maxWidth = '420px';
					inner.style.margin = '60px auto';
					inner.style.padding = '0';
					inner.onclick = (e) => e.stopPropagation();
					panel.appendChild(inner);
					document.body.appendChild(panel);
					import('../components/ui/SettingsPanel').then(
						({ default: SettingsPanel }) => {
							const root = document.createElement('div');
							inner.appendChild(root);
							// @ts-ignore
							import('react-dom/client').then(
								(ReactDOMClient) => {
									const rootInstance =
										ReactDOMClient.createRoot(root);
									rootInstance.render(<SettingsPanel />);
								}
							);
						}
					);
					return;
				}
				default:
					break;
			}
		} catch (err: any) {
			alert(
				'Error running QA scenario: ' +
					(err?.response?.data?.error || err.message)
			);
		}
	};

	return (
		<div className='admin-dashboard-container'>
			<h1 className='admin-header'>
				Grid Royale Admin Dashboard
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
					<div className='admin-qa-section'>
						<aside className='admin-qa-sidebar'>
							<h3>QA Scenarios</h3>
							<ul>
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
										>
											{qa.label}
										</button>
									</li>
								))}
							</ul>
						</aside>
						<section className='admin-qa-main'>
							<h3>
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
									className='qa-run-btn'
									onClick={handleRunQATool}
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
