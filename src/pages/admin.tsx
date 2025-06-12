import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import {
	fetchPuzzles,
	deletePuzzle,
} from '../services/puzzlesService';
import { fetchMatches } from '../services/matchesService';
import { fetchGlobalAnalytics } from '../services/analyticsService';
import { fetchHealth } from '../services/healthService';
import {
	fetchAdminUsers,
	banUser as adminBanUser,
	approvePuzzle as adminApprovePuzzle,
	runQADailyScenario,
	runQACustomScenario,
	fetchAdminLogs,
	fetchAdminSockets,
} from '../services/adminService';
import type {
	User,
	Puzzle,
	Match,
	AnalyticsGlobal,
} from '../types/api';
import CustomPuzzleModal from '../components/ui-kit/modals/CustomPuzzleModal';
import Modal from '../components/ui-kit/modals/Modal';

// --- Types for admin data ---

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

const QA_SIM_EVENTS = [
	{
		label: 'Solve Group',
		event: 'qa:solve-group',
		payload: {
			group: ['Apple', 'Banana', 'Pear', 'Cranberry'],
			userId: 'test-user',
			matchId: 'test-match',
		},
	},
	{
		label: 'Bot Emote',
		event: 'qa:bot-emote',
		payload: {
			emote: '😈',
			userId: 'test-user',
			matchId: 'test-match',
		},
	},
	{
		label: 'Show Win Modal',
		event: 'qa:win-modal',
		payload: {
			userId: 'test-user',
			matchId: 'test-match',
		},
	},
	{
		label: 'Show Loss Modal',
		event: 'qa:loss-modal',
		payload: {
			userId: 'test-user',
			matchId: 'test-match',
		},
	},
];

const ADMIN_SECTIONS = [
	'System Overview',
	'Live Matches',
	'Match Playback',
	'Player Analytics',
	'Matchmaking',
	'QA Tools',
	'Communication',
	'Puzzle Quality',
	'Retention',
	'Moderator Tools',
	'Usage Metrics',
	'Event Feed',
];

// Add a simple chart placeholder component
const ChartPlaceholder = ({ title }: { title: string }) => (
	<div
		style={{
			background: '#fff',
			borderRadius: 12,
			boxShadow: '0 2px 8px #e3eaff22',
			padding: 24,
			marginBottom: 32,
			minHeight: 180,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			color: '#64748b',
			fontSize: 18,
			fontWeight: 500,
		}}
	>
		<div style={{ marginBottom: 12 }}>{title}</div>
		<div
			style={{
				width: '100%',
				height: 120,
				background:
					'linear-gradient(90deg,#e0e7ff 0%,#f3f4f6 100%)',
				borderRadius: 8,
				opacity: 0.7,
			}}
		/>
		<div
			style={{
				marginTop: 10,
				fontSize: 14,
				color: '#a1a1aa',
			}}
		>
			(Chart coming soon)
		</div>
	</div>
);

export default function Admin() {
	const [activeTab, setActiveTab] = useState(TOP_NAV[0]);
	const [qaSidebarAction, setQASidebarAction] = useState(
		QA_SIDEBAR[0].action
	);
	const [showAddPuzzleModal, setShowAddPuzzleModal] =
		useState(false);
	const [adminUser, setAdminUser] = useState<any>(null); // Optionally fetch admin user info if needed
	const router = useRouter();
	const [socket, setSocket] = useState<any>(null);
	const [sending, setSending] = useState<string | null>(
		null
	);
	const [section, setSection] = useState(ADMIN_SECTIONS[0]);
	const [showReplay, setShowReplay] = useState(false);
	const [replayData, setReplayData] = useState<any>(null);
	const [simParams, setSimParams] = useState({
		skill: 50,
		region: 'NA',
		queueSize: 8,
	});
	const [simResult, setSimResult] = useState<any>(null);

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
				const analytics: AnalyticsGlobal =
					await fetchGlobalAnalytics();
				setStats((s: any) => ({
					...s,
					totalUsers: analytics.userCount,
					totalPuzzles: analytics.puzzleCount,
					totalMatches: analytics.matchCount,
				}));
				const health = await fetchHealth();
				setStats((s: any) => ({
					...s,
					systemHealth: health.ok ? 'Healthy' : 'Unhealthy',
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
		fetchPuzzles()
			.then(setPuzzles)
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
		await adminApprovePuzzle(id);
		setPuzzles((prev) =>
			prev.map((p) =>
				p.id === id ? { ...p, approved: true } : p
			)
		);
	};
	const handleDeletePuzzle = async (id: string) => {
		await deletePuzzle(id);
		setPuzzles((prev) => prev.filter((p) => p.id !== id));
	};

	// Handle new puzzle creation from modal
	const handleAdminAddPuzzle = (newPuzzle: any) => {
		setPuzzles((prev) => [{ ...newPuzzle }, ...prev]);
		setShowAddPuzzleModal(false);
	};

	// --- Users Data ---
	const [users, setUsers] = useState<User[]>([]);
	const [usersError, setUsersError] = useState<
		string | null
	>(null);
	useEffect(() => {
		if (activeTab !== 'Users') return;
		setUsersError(null);
		fetchAdminUsers()
			.then(setUsers)
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
		await adminBanUser(id);
		setUsers((prev) =>
			prev.map((u) =>
				u.id === id ? { ...u, banned: true } : u
			)
		);
	};

	// --- Live Matches Data ---
	const [matches, setMatches] = useState<Match[]>([]);
	const [matchesError, setMatchesError] = useState<
		string | null
	>(null);
	useEffect(() => {
		if (activeTab !== 'Live Matches') return;
		setMatchesError(null);
		fetchMatches()
			.then(setMatches)
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
		fetchAdminSockets()
			.then(setSockets)
			.catch(() => setSockets([]));
	}, [activeTab]);

	// --- Logs ---
	const [logs, setLogs] = useState<any[]>([]);
	useEffect(() => {
		if (activeTab !== 'Logs') return;
		fetchAdminLogs()
			.then(setLogs)
			.catch(() => setLogs([]));
	}, [activeTab]);

	// --- QA Tools ---
	const handleQASidebarAction = (action: string) => {
		setQASidebarAction(action);
	};
	const handleRunQATool = async () => {
		try {
			switch (qaSidebarAction) {
				case 'daily-default': {
					await runQADailyScenario('default', users[0]?.id);
					alert(
						'Daily Puzzle (Default) scenario triggered.'
					);
					break;
				}
				case 'daily-1group': {
					await runQADailyScenario('1group', users[0]?.id);
					alert(
						'Daily Puzzle (1 Group Solved) scenario triggered.'
					);
					break;
				}
				case 'daily-2group': {
					await runQADailyScenario('2group', users[0]?.id);
					alert(
						'Daily Puzzle (2 Groups Solved) scenario triggered.'
					);
					break;
				}
				case 'daily-3group': {
					await runQADailyScenario('3group', users[0]?.id);
					alert(
						'Daily Puzzle (3 Groups Solved) scenario triggered.'
					);
					break;
				}
				case 'daily-0attempts': {
					await runQADailyScenario(
						'0attempts',
						users[0]?.id
					);
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
						await runQACustomScenario(
							customId,
							users[0]?.id
						);
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
					import(
						'../components/ui-kit/settings/SettingsPanel'
					).then(({ default: SettingsPanel }) => {
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
					});
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

	// --- VS Mode QA Navigation with test data ---
	const handleVSQANav = (
		route: string,
		params: Record<string, string>
	) => {
		const url = new URL(route, window.location.origin);
		Object.entries(params).forEach(([key, value]) =>
			url.searchParams.set(key, value)
		);
		router.push(url.pathname + url.search);
	};

	// --- Match State Simulation (stub with test data) ---
	const handleSimulate = (action: string) => {
		let msg = '';
		switch (action) {
			case 'solve-player':
				msg =
					'Player solved group: ["Apple", "Banana", "Pear", "Cranberry"]';
				break;
			case 'solve-opponent':
				msg =
					'Opponent solved group: ["Plane", "Car", "Bus", "Train"]';
				break;
			case 'bot-emote':
				msg = 'Bot emote: 😈 Taunt';
				break;
			case 'win-modal':
				msg =
					'Endgame modal: Player WIN (score: 4, mistakes: 1)';
				break;
			case 'loss-modal':
				msg =
					'Endgame modal: Player LOSS (score: 2, mistakes: 4)';
				break;
			default:
				msg = 'Unknown simulation.';
		}
		alert(msg);
	};

	// --- Test data for debug panel ---
	const debugData = {
		mode: 'Bot Match — Easy',
		roomCode: 'QA1234',
		playerScore: 3,
		opponentScore: 2,
		mistakes: 1,
		status: 'in progress',
		socket: 'connected',
	};

	useEffect(() => {
		// Only connect once
		if (!socket) {
			const s = io({ path: '/api/socket' });
			setSocket(s);
			return () => s.disconnect();
		}
	}, []);

	// Mock match data for playback
	const mockMatch = {
		id: 'QA-MATCH-1',
		players: ['TestUser', 'TestFriend'],
		events: [
			{ type: 'start', ts: 0 },
			{
				type: 'solve',
				who: 'TestUser',
				group: ['Apple', 'Banana', 'Pear', 'Cranberry'],
				ts: 5,
			},
			{ type: 'mistake', who: 'TestFriend', ts: 12 },
			{
				type: 'emote',
				who: 'TestUser',
				emote: '👏',
				ts: 14,
			},
			{
				type: 'solve',
				who: 'TestFriend',
				group: ['Plane', 'Car', 'Bus', 'Train'],
				ts: 20,
			},
			{
				type: 'chat',
				who: 'TestUser',
				msg: 'Nice!',
				ts: 22,
			},
			{
				type: 'solve',
				who: 'TestUser',
				group: ['Bath', 'Shower', 'Sink', 'Toilet'],
				ts: 30,
			},
			{ type: 'win', who: 'TestUser', ts: 40 },
		],
		duration: 42,
	};
	const [replayStep, setReplayStep] = useState(0);

	return (
		<div
			className='admin-dashboard-container'
			style={{ position: 'relative' }}
		>
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
							style={{
								background: '#2563eb',
								color: '#fff',
								border: 'none',
								borderRadius: 8,
								padding: '10px 22px',
								fontWeight: 700,
								fontSize: 16,
								marginBottom: 18,
								cursor: 'pointer',
								boxShadow: '0 2px 8px 0 #2563eb22',
								transition: 'background 0.18s, color 0.18s',
							}}
						>
							Create Custom Puzzle
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
								onSave={handleAdminAddPuzzle}
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
							<h2 style={{ marginBottom: 12 }}>
								VS Mode QA Navigation
							</h2>
							<p
								style={{
									color: '#64748b',
									marginBottom: 18,
								}}
							>
								Jump into any VS Mode page instantly for QA
								and development.
							</p>
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: 12,
									marginBottom: 32,
								}}
							>
								<button
									style={qaBtnStyle}
									onClick={() =>
										handleVSQANav('/vs/friend/lobby', {
											qa: 'true',
											room: 'QA1234',
										})
									}
								>
									Go to Room Code Lobby
								</button>
								<button
									style={qaBtnStyle}
									onClick={() =>
										handleVSQANav('/vs/friend/match', {
											qa: 'true',
											match: 'QA-MATCH-1',
											player: 'TestUser',
											opponent: 'TestFriend',
										})
									}
								>
									Start Friend Match
								</button>
								<button
									style={qaBtnStyle}
									onClick={() =>
										handleVSQANav('/vs/matchmaking/match', {
											qa: 'true',
											match: 'QA-MATCH-2',
											player: 'TestUser',
											opponent: 'GlobalRival',
										})
									}
								>
									Start Global Match
								</button>
								<button
									style={qaBtnStyle}
									onClick={() =>
										handleVSQANav('/vs/bot/match', {
											qa: 'true',
											difficulty: 'easy',
											match: 'QA-BOT-EASY',
											player: 'TestUser',
											bot: 'Bot-Easy',
										})
									}
								>
									Start Bot Match (Easy)
								</button>
								<button
									style={qaBtnStyle}
									onClick={() =>
										handleVSQANav('/vs/bot/match', {
											qa: 'true',
											difficulty: 'legendary',
											match: 'QA-BOT-LEG',
											player: 'TestUser',
											bot: 'Bot-Legendary',
										})
									}
								>
									Start Bot Match (Legendary)
								</button>
							</div>
							<h2 style={{ marginBottom: 12 }}>
								Quick Match Actions
							</h2>
							<p
								style={{
									color: '#64748b',
									marginBottom: 18,
								}}
							>
								Trigger simulated events within an active VS
								match (QA Mode only).
							</p>
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: 12,
									marginBottom: 32,
								}}
							>
								<button
									style={qaBtnStyle}
									onClick={() =>
										handleSimulate('solve-player')
									}
								>
									Solve Group (Player)
								</button>
								<button
									style={qaBtnStyle}
									onClick={() =>
										handleSimulate('solve-opponent')
									}
								>
									Solve Group (Opponent/Bot)
								</button>
								<button
									style={qaBtnStyle}
									onClick={() =>
										handleSimulate('bot-emote')
									}
								>
									Trigger Bot Emote
								</button>
								<button
									style={qaBtnStyle}
									onClick={() =>
										handleSimulate('win-modal')
									}
								>
									Trigger Win Modal
								</button>
								<button
									style={qaBtnStyle}
									onClick={() =>
										handleSimulate('loss-modal')
									}
								>
									Trigger Loss Modal
								</button>
							</div>
							<h2 style={{ marginBottom: 12 }}>
								Active Session Debug Panel
							</h2>
							<div
								style={{
									background: '#f8fafc',
									borderRadius: 12,
									padding: 18,
									marginBottom: 24,
									boxShadow: '0 1px 4px 0 #e3eaff22',
									fontSize: 15,
								}}
							>
								<div>
									Current mode: <b>{debugData.mode}</b>
								</div>
								<div>
									Room code: <b>{debugData.roomCode}</b>
								</div>
								<div>
									Player score:{' '}
									<b>{debugData.playerScore}</b>
								</div>
								<div>
									Opponent score:{' '}
									<b>{debugData.opponentScore}</b>
								</div>
								<div>
									Mistakes: <b>{debugData.mistakes}</b>
								</div>
								<div>
									Match status: <b>{debugData.status}</b>
								</div>
								<div>
									Socket: <b>{debugData.socket}</b>
								</div>
							</div>
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
							<div style={{ marginTop: 24 }}>
								<h3>Live Event Simulation</h3>
								<p
									style={{
										color: '#64748b',
										marginBottom: 12,
									}}
								>
									Emit socket events to simulate live match
									actions.
								</p>
								<div
									style={{
										display: 'flex',
										gap: 16,
										flexWrap: 'wrap',
										marginBottom: 24,
									}}
								>
									{QA_SIM_EVENTS.map(
										({ label, event, payload }) => (
											<button
												key={event}
												style={{
													borderRadius: 999,
													padding: '10px 24px',
													fontWeight: 600,
													background: '#e0e7ff',
													color: '#2563eb',
													border: 'none',
													boxShadow:
														sending === event
															? '0 0 0 2px #2563eb55'
															: '0 1px 4px #e3eaff33',
													opacity:
														sending === event ? 0.6 : 1,
													cursor:
														sending === event
															? 'not-allowed'
															: 'pointer',
													transition: 'all 0.18s',
												}}
												disabled={
													sending === event || !socket
												}
												onClick={async () => {
													setSending(event);
													try {
														socket.emit(event, payload);
													} finally {
														setTimeout(
															() => setSending(null),
															600
														);
													}
												}}
											>
												{label}
											</button>
										)
									)}
								</div>
							</div>
						</section>
					</div>
				)}
				{section === 'Live Matches' && (
					<div>
						<h2 style={{ fontSize: 24, marginBottom: 18 }}>
							Live & Recent Matches
						</h2>
						<table
							style={{
								width: '100%',
								background: '#fff',
								borderRadius: 12,
								boxShadow: '0 2px 8px #e3eaff22',
								marginBottom: 32,
							}}
						>
							<thead>
								<tr style={{ background: '#f3f4f6' }}>
									<th style={{ padding: 10 }}>Match ID</th>
									<th>Players</th>
									<th>Duration</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td style={{ padding: 10 }}>
										{mockMatch.id}
									</td>
									<td>{mockMatch.players.join(' vs ')}</td>
									<td>{mockMatch.duration}s</td>
									<td>
										<button
											style={{
												background: '#e0e7ff',
												color: '#2563eb',
												border: 'none',
												borderRadius: 8,
												padding: '6px 18px',
												fontWeight: 600,
												cursor: 'pointer',
											}}
											onClick={() => {
												setReplayData(mockMatch);
												setShowReplay(true);
												setReplayStep(0);
											}}
										>
											Replay
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				)}
				{section === 'Player Analytics' && (
					<div>
						<h2 style={{ fontSize: 24, marginBottom: 18 }}>
							Player Analytics & Puzzle Heatmaps
						</h2>
						<ChartPlaceholder title='Time Per Move (seconds)' />
						<ChartPlaceholder title='Error Frequency by Step' />
						<ChartPlaceholder title='Puzzle Heatmap (Mistake Density)' />
						<div
							style={{
								color: '#64748b',
								fontSize: 15,
								marginTop: 18,
							}}
						>
							<b>Tip:</b> Use these analytics to identify
							bottlenecks, difficult puzzles, and player
							hesitation points.
						</div>
					</div>
				)}
				{section === 'Matchmaking' && (
					<div>
						<h2 style={{ fontSize: 24, marginBottom: 18 }}>
							Matchmaking Diagnostics & Simulation
						</h2>
						<div
							style={{
								display: 'flex',
								gap: 32,
								marginBottom: 32,
							}}
						>
							<div style={{ flex: 1 }}>
								<h3 style={{ marginBottom: 10 }}>
									Queue Stats (Mock)
								</h3>
								<div
									style={{
										background: '#fff',
										borderRadius: 12,
										boxShadow: '0 2px 8px #e3eaff22',
										padding: 18,
										marginBottom: 18,
									}}
								>
									<div>
										Current Queue Size: <b>8</b>
									</div>
									<div>
										Avg Wait Time: <b>22s</b>
									</div>
									<div>
										Skill Range: <b>32 - 78</b>
									</div>
									<div>
										Regions: <b>NA (5), EU (2), AS (1)</b>
									</div>
								</div>
							</div>
							<div style={{ flex: 1 }}>
								<h3 style={{ marginBottom: 10 }}>
									Simulate Matchmaking
								</h3>
								<div
									style={{
										background: '#fff',
										borderRadius: 12,
										boxShadow: '0 2px 8px #e3eaff22',
										padding: 18,
									}}
								>
									<div style={{ marginBottom: 10 }}>
										<label>
											Skill Level:{' '}
											<input
												type='range'
												min={0}
												max={100}
												value={simParams.skill}
												onChange={(e) =>
													setSimParams((p) => ({
														...p,
														skill: +e.target.value,
													}))
												}
											/>
										</label>{' '}
										<b>{simParams.skill}</b>
									</div>
									<div style={{ marginBottom: 10 }}>
										<label>
											Region:
											<select
												value={simParams.region}
												onChange={(e) =>
													setSimParams((p) => ({
														...p,
														region: e.target.value,
													}))
												}
											>
												<option value='NA'>NA</option>
												<option value='EU'>EU</option>
												<option value='AS'>AS</option>
											</select>
										</label>
									</div>
									<div style={{ marginBottom: 10 }}>
										<label>
											Queue Size:{' '}
											<input
												type='number'
												min={1}
												max={100}
												value={simParams.queueSize}
												onChange={(e) =>
													setSimParams((p) => ({
														...p,
														queueSize: +e.target.value,
													}))
												}
											/>
										</label>
									</div>
									<button
										style={{
											background: '#2563eb',
											color: '#fff',
											border: 'none',
											borderRadius: 8,
											padding: '8px 22px',
											fontWeight: 700,
											cursor: 'pointer',
											marginTop: 8,
										}}
										onClick={() =>
											setSimResult({
												matched: Math.floor(
													simParams.queueSize / 2
												),
												avgWait: Math.max(
													10,
													40 - simParams.skill / 2
												),
												region: simParams.region,
											})
										}
									>
										Simulate
									</button>
								</div>
							</div>
						</div>
						{simResult && (
							<div
								style={{
									background: '#e0e7ff',
									borderRadius: 12,
									padding: 18,
									color: '#2563eb',
									fontWeight: 600,
									fontSize: 17,
									marginBottom: 18,
								}}
							>
								Simulation: Matched{' '}
								<b>{simResult.matched}</b> pairs in region{' '}
								<b>{simResult.region}</b> (Avg Wait:{' '}
								<b>{simResult.avgWait}s</b>)
							</div>
						)}
						<div
							style={{
								color: '#64748b',
								fontSize: 15,
								marginTop: 18,
							}}
						>
							<b>Tip:</b> Use simulation to validate
							fairness and efficiency under different queue
							conditions.
						</div>
					</div>
				)}
				{section === 'Communication' && (
					<div>
						<h2 style={{ fontSize: 24, marginBottom: 18 }}>
							Communication & Sentiment Monitoring
						</h2>
						<div
							style={{
								background: '#fff',
								borderRadius: 12,
								boxShadow: '0 2px 8px #e3eaff22',
								padding: 24,
								marginBottom: 32,
							}}
						>
							<b>Chat/Emote Sentiment:</b>{' '}
							<span style={{ color: '#2563eb' }}>
								Positive (82%)
							</span>
							,{' '}
							<span style={{ color: '#ef4444' }}>
								Negative (6%)
							</span>
							, Neutral (12%)
							<br />
							<b>Flagged Toxic Messages:</b>{' '}
							<span style={{ color: '#ef4444' }}>3</span>
							<div
								style={{ marginTop: 18, color: '#64748b' }}
							>
								(Sentiment heatmaps and phrase clouds coming
								soon)
							</div>
						</div>
					</div>
				)}
				{section === 'Puzzle Quality' && (
					<div>
						<h2 style={{ fontSize: 24, marginBottom: 18 }}>
							Puzzle Quality Dashboard
						</h2>
						<div
							style={{
								background: '#fff',
								borderRadius: 12,
								boxShadow: '0 2px 8px #e3eaff22',
								padding: 24,
								marginBottom: 32,
							}}
						>
							<b>Flagged Puzzles:</b>{' '}
							<span style={{ color: '#ef4444' }}>2</span>{' '}
							<br />
							<b>Avg Solve Time:</b> 38s <br />
							<b>Fail Rate:</b> 14% <br />
							<b>Direct Edit/Flag tools coming soon.</b>
						</div>
					</div>
				)}
				{section === 'Retention' && (
					<div>
						<h2 style={{ fontSize: 24, marginBottom: 18 }}>
							User Retention & Lifecycle Insights
						</h2>
						<div
							style={{
								background: '#fff',
								borderRadius: 12,
								boxShadow: '0 2px 8px #e3eaff22',
								padding: 24,
								marginBottom: 32,
							}}
						>
							<b>7-day Retention:</b> 41% <br />
							<b>Churn Point:</b> Level 3 <br />
							<b>
								Progression Funnel and cohort analysis
								coming soon.
							</b>
						</div>
					</div>
				)}
				{section === 'Moderator Tools' && (
					<div>
						<h2 style={{ fontSize: 24, marginBottom: 18 }}>
							Live Moderator Tools
						</h2>
						<div
							style={{
								background: '#fff',
								borderRadius: 12,
								boxShadow: '0 2px 8px #e3eaff22',
								padding: 24,
								marginBottom: 32,
							}}
						>
							<b>
								Live Match Observer, Chat Monitor,
								Mute/Kick/Warning controls coming soon.
							</b>
						</div>
					</div>
				)}
				{section === 'Usage Metrics' && (
					<div>
						<h2 style={{ fontSize: 24, marginBottom: 18 }}>
							Cross-Platform Usage Metrics
						</h2>
						<div
							style={{
								background: '#fff',
								borderRadius: 12,
								boxShadow: '0 2px 8px #e3eaff22',
								padding: 24,
								marginBottom: 32,
							}}
						>
							<b>Device Breakdown:</b> Desktop 62%, Mobile
							34%, Tablet 4% <br />
							<b>Top OS:</b> macOS, Windows, iOS <br />
							<b>Game Version:</b> v1.2.3 (latest) <br />
							<b>
								Platform-specific issue tracking coming
								soon.
							</b>
						</div>
					</div>
				)}
				{section === 'Event Feed' && (
					<div>
						<h2 style={{ fontSize: 24, marginBottom: 18 }}>
							Event & Achievement Tracking Feed
						</h2>
						<div
							style={{
								background: '#fff',
								borderRadius: 12,
								boxShadow: '0 2px 8px #e3eaff22',
								padding: 24,
								marginBottom: 32,
							}}
						>
							<b>Recent Milestones:</b>
							<ul style={{ marginTop: 10 }}>
								<li>🏆 User123 unlocked "Puzzle Master"</li>
								<li>🎉 User456 completed 100th match</li>
								<li>⭐ User789 gave 5-star feedback</li>
							</ul>
							<b>
								Live event feed and filters coming soon.
							</b>
						</div>
					</div>
				)}
			</div>
			{/* Match Replay Modal */}
			<Modal
				open={showReplay}
				onClose={() => setShowReplay(false)}
			>
				<h2 style={{ color: '#2563eb', marginBottom: 12 }}>
					Match Replay: {replayData?.id}
				</h2>
				<div style={{ marginBottom: 18 }}>
					<b>Players:</b>{' '}
					{replayData?.players?.join(' vs ')}
				</div>
				<div
					style={{
						background: '#f3f4f6',
						borderRadius: 8,
						padding: 18,
						minHeight: 120,
						marginBottom: 18,
					}}
				>
					{replayData?.events
						?.slice(0, replayStep + 1)
						.map((ev: any, i: number) => (
							<div
								key={i}
								style={{
									marginBottom: 6,
									color:
										ev.type === 'mistake'
											? '#ef4444'
											: ev.type === 'solve'
											? '#2563eb'
											: '#222',
									fontWeight: ev.type === 'win' ? 700 : 500,
								}}
							>
								<span
									style={{
										marginRight: 8,
										fontWeight: 700,
									}}
								>
									[{ev.ts}s]
								</span>
								{ev.type === 'solve' && (
									<span>
										✅ <b>{ev.who}</b> solved group:{' '}
										<span style={{ color: '#2563eb' }}>
											{ev.group.join(', ')}
										</span>
									</span>
								)}
								{ev.type === 'mistake' && (
									<span>
										❌ <b>{ev.who}</b> made a mistake
									</span>
								)}
								{ev.type === 'emote' && (
									<span>
										😃 <b>{ev.who}</b> sent emote:{' '}
										<span style={{ fontSize: 18 }}>
											{ev.emote}
										</span>
									</span>
								)}
								{ev.type === 'chat' && (
									<span>
										💬 <b>{ev.who}</b>:{' '}
										<span style={{ color: '#64748b' }}>
											{ev.msg}
										</span>
									</span>
								)}
								{ev.type === 'win' && (
									<span>
										🏆 <b>{ev.who}</b> won the match!
									</span>
								)}
								{ev.type === 'start' && (
									<span>Match started</span>
								)}
							</div>
						))}
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						marginBottom: 8,
					}}
				>
					<button
						onClick={() =>
							setReplayStep((s) => Math.max(0, s - 1))
						}
						disabled={replayStep === 0}
						style={{
							borderRadius: 8,
							padding: '6px 18px',
							border: 'none',
							background: '#e0e7ff',
							color: '#2563eb',
							fontWeight: 600,
							cursor:
								replayStep === 0
									? 'not-allowed'
									: 'pointer',
						}}
					>
						Prev
					</button>
					<span style={{ fontWeight: 600 }}>
						Step {replayStep + 1} /{' '}
						{replayData?.events?.length || 1}
					</span>
					<button
						onClick={() =>
							setReplayStep((s) =>
								Math.min(
									(replayData?.events?.length || 1) - 1,
									s + 1
								)
							)
						}
						disabled={
							replayStep ===
							(replayData?.events?.length || 1) - 1
						}
						style={{
							borderRadius: 8,
							padding: '6px 18px',
							border: 'none',
							background: '#e0e7ff',
							color: '#2563eb',
							fontWeight: 600,
							cursor:
								replayStep ===
								(replayData?.events?.length || 1) - 1
									? 'not-allowed'
									: 'pointer',
						}}
					>
						Next
					</button>
				</div>
			</Modal>
		</div>
	);
}

// --- QA Button Style ---
const qaBtnStyle = {
	background:
		'linear-gradient(90deg,#38bdf8 0%,#2563eb 100%)',
	color: '#fff',
	border: 'none',
	borderRadius: 999,
	padding: '10px 22px',
	fontWeight: 700,
	fontSize: 16,
	boxShadow: '0 2px 8px 0 #38bdf855',
	cursor: 'pointer',
	transition: 'background 0.18s, color 0.18s',
	outline: 'none',
	marginBottom: 0,
	animation: 'fadeIn 0.22s',
};
