// VibeGrid Backend Entry Point
const express = require('express');
const http = require('http');
const { createSocketServer } = require('./socket');
const next = require('next');
const prisma = require('@prisma/client');
const usersRouter = require('./routes/users');
const friendsRouter = require('./routes/friends');
const chatRouter = require('./routes/chat');
const puzzlesRouter = require('./routes/puzzles');
const matchesRouter = require('./routes/matches');
const achievementsRouter = require('./routes/achievements');
const {
	syncAchievementsToDB,
} = require('./routes/achievements');
const leaderboardsRouter = require('./routes/leaderboards');
const notificationsRouter = require('./routes/notifications');
const adminRouter = require('./routes/admin');
const healthRouter = require('./routes/health');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
	await syncAchievementsToDB(); // Ensure achievements are seeded

	const server = express();
	const httpServer = http.createServer(server);
	createSocketServer(httpServer);

	// Example API route
	server.get('/api/health', (req, res) => {
		res.json({ success: true, data: 'ok' });
	});

	// User API routes
	server.use('/api/users', usersRouter);
	// Friends API routes
	server.use('/api/friends', friendsRouter);
	// Chat API routes
	server.use('/api/chat', chatRouter);
	// Puzzles API routes
	server.use('/api/puzzles', puzzlesRouter);
	// Matches API routes
	server.use('/api/matches', matchesRouter);
	// Achievements API routes
	server.use('/api/achievements', achievementsRouter);
	// Leaderboards API routes
	server.use('/api/leaderboards', leaderboardsRouter);
	// Notifications API routes
	server.use('/api/notifications', notificationsRouter);
	// Admin API routes
	server.use('/api/admin', adminRouter);
	// Health API routes
	server.use('/api/health', healthRouter);

	// Next.js page handling
	server.all('*', (req, res) => handle(req, res));

	const port = process.env.PORT || 3000;
	httpServer.listen(port, () => {
		console.log(`> Ready on http://localhost:${port}`);
	});
});
