// VibeGrid Socket.io Server (core structure)
const { Server } = require('socket.io');
const { getSessionUser } = require('./utils/auth');
const prisma = require('./prismaClient');
const { rateLimit } = require('./rateLimit');

function createSocketServer(httpServer) {
	const io = new Server(httpServer, {
		cors: { origin: '*' },
	});

	// Make io available to Express routes for emitting events
	const express = require('express');
	const app = httpServer.listeners('request')[0];
	if (app && app instanceof express) {
		app.set('io', io);
	}

	// --- Friends Namespace ---
	io.of('/friends').on('connection', (socket) => {
		const user = getSessionUser(socket);
		if (!user) return socket.disconnect();
		socket.join(user.id);

		// Friend request
		socket.on(
			'friend:request',
			async ({ toUserId }, cb) => {
				if (
					!rateLimit(user.id + ':friend:request', 5, 60000)
				)
					return cb?.({ error: 'Rate limit' });
				try {
					const existing =
						await prisma.friendRequest.findFirst({
							where: {
								fromUserId: user.id,
								toUserId,
								status: 'pending',
							},
						});
					if (existing)
						return cb?.({ error: 'Already sent' });
					const request = await prisma.friendRequest.create(
						{
							data: {
								fromUserId: user.id,
								toUserId,
								status: 'pending',
							},
						}
					);
					io.of('/friends')
						.to(toUserId)
						.emit('friend:request:received', {
							from: user.id,
						});
					cb?.({ success: true, request });
				} catch (e) {
					cb?.({ error: 'Failed to send request' });
				}
			}
		);

		// Accept friend request
		socket.on(
			'friend:accept',
			async ({ requestId }, cb) => {
				try {
					const req = await prisma.friendRequest.update({
						where: { id: requestId },
						data: { status: 'accepted' },
					});
					await prisma.friend.createMany({
						data: [
							{
								userId: req.fromUserId,
								friendId: req.toUserId,
								status: 'accepted',
							},
							{
								userId: req.toUserId,
								friendId: req.fromUserId,
								status: 'accepted',
							},
						],
						skipDuplicates: true,
					});
					io.of('/friends')
						.to(req.fromUserId)
						.emit('friend:accepted', {
							userId: req.toUserId,
						});
					io.of('/friends')
						.to(req.toUserId)
						.emit('friend:accepted', {
							userId: req.fromUserId,
						});
					cb?.({ success: true });
				} catch (e) {
					cb?.({ error: 'Failed to accept' });
				}
			}
		);

		// Remove friend
		socket.on('friend:remove', async ({ friendId }, cb) => {
			try {
				await prisma.friend.deleteMany({
					where: {
						OR: [
							{ userId: user.id, friendId },
							{ userId: friendId, friendId: user.id },
						],
					},
				});
				io.of('/friends')
					.to(friendId)
					.emit('friend:removed', { userId: user.id });
				cb?.({ success: true });
			} catch (e) {
				cb?.({ error: 'Failed to remove' });
			}
		});

		// Online status
		prisma.user.update({
			where: { id: user.id },
			data: { lastActive: new Date() },
		});
		io.of('/friends').to(user.id).emit('friend:status', {
			userId: user.id,
			online: true,
		});
		socket.on('disconnect', () => {
			io.of('/friends').to(user.id).emit('friend:status', {
				userId: user.id,
				online: false,
			});
		});
	});

	// --- Chat Namespace ---
	io.of('/chat').on('connection', (socket) => {
		const user = getSessionUser(socket);
		if (!user) return socket.disconnect();
		socket.join(user.id);

		// Direct message
		socket.on(
			'chat:message',
			async ({ toUserId, message }, cb) => {
				if (!rateLimit(user.id + ':chat', 20, 60000))
					return cb?.({ error: 'Rate limit' });
				try {
					const msg = await prisma.message.create({
						data: {
							senderId: user.id,
							receiverId: toUserId,
							message,
							sentAt: new Date(),
						},
					});
					io.of('/chat')
						.to(toUserId)
						.emit('chat:message', msg);
					cb?.({ success: true, msg });
				} catch (e) {
					cb?.({ error: 'Failed to send' });
				}
			}
		);

		// Group message
		socket.on(
			'chat:group:message',
			async ({ groupId, message }, cb) => {
				if (!rateLimit(user.id + ':groupchat', 20, 60000))
					return cb?.({ error: 'Rate limit' });
				try {
					const msg = await prisma.message.create({
						data: {
							senderId: user.id,
							groupId,
							message,
							sentAt: new Date(),
						},
					});
					// Broadcast to all group members
					const group = await prisma.groupChat.findUnique({
						where: { id: groupId },
						include: { members: true },
					});
					group.members.forEach((m) => {
						io.of('/chat')
							.to(m.userId)
							.emit('chat:group:message', msg);
					});
					cb?.({ success: true, msg });
				} catch (e) {
					cb?.({ error: 'Failed to send' });
				}
			}
		);

		// Typing indicator
		socket.on('chat:typing', ({ toUserId }) => {
			io.of('/chat')
				.to(toUserId)
				.emit('chat:typing', { from: user.id });
		});
	});

	// --- Matchmaking Namespace ---
	io.of('/matchmaking').on('connection', (socket) => {
		const user = getSessionUser(socket);
		if (!user) return socket.disconnect();
		socket.join(user.id);
		// Simple in-memory queue for demo; use Redis for production
		if (!io.matchmakingQueue) io.matchmakingQueue = [];
		socket.on('matchmaking:join', () => {
			if (io.matchmakingQueue.includes(user.id)) return;
			io.matchmakingQueue.push(user.id);
			// Try to match with another user
			if (io.matchmakingQueue.length >= 2) {
				const [p1, p2] = io.matchmakingQueue.splice(0, 2);
				const room = `mmatch_${p1}_${p2}_${Date.now()}`;
				io.of('/matchmaking')
					.to(p1)
					.emit('matchmaking:found', {
						opponentId: p2,
						room,
					});
				io.of('/matchmaking')
					.to(p2)
					.emit('matchmaking:found', {
						opponentId: p1,
						room,
					});
			}
		});
		socket.on('matchmaking:leave', () => {
			io.matchmakingQueue = io.matchmakingQueue.filter(
				(id) => id !== user.id
			);
		});
		socket.on('disconnect', () => {
			io.matchmakingQueue = io.matchmakingQueue.filter(
				(id) => id !== user.id
			);
		});
	});

	// --- Room Namespace ---
	io.of('/room').on('connection', (socket) => {
		const user = getSessionUser(socket);
		if (!user) return socket.disconnect();
		socket.on('room:create', ({ roomCode }, cb) => {
			socket.join(roomCode);
			cb?.({ success: true, roomCode });
		});
		socket.on('room:join', ({ roomCode }, cb) => {
			socket.join(roomCode);
			io.of('/room')
				.to(roomCode)
				.emit('room:joined', { userId: user.id });
			cb?.({ success: true });
		});
		socket.on('room:leave', ({ roomCode }, cb) => {
			socket.leave(roomCode);
			io.of('/room')
				.to(roomCode)
				.emit('room:left', { userId: user.id });
			cb?.({ success: true });
		});
	});

	// --- Game Namespace ---
	io.of('/game').on('connection', (socket) => {
		const user = getSessionUser(socket);
		if (!user) return socket.disconnect();
		socket.on('game:state', ({ roomCode, state }) => {
			// Broadcast game state to room
			socket
				.to(roomCode)
				.emit('game:state', { userId: user.id, state });
		});
		socket.on('game:progress', ({ roomCode, progress }) => {
			socket.to(roomCode).emit('game:progress', {
				userId: user.id,
				progress,
			});
		});
		socket.on('game:end', async ({ roomCode, result }) => {
			// Save match result to DB, notify users
			// ...
			io.of('/game')
				.to(roomCode)
				.emit('game:end', { userId: user.id, result });
		});
		// In-match chat
		socket.on('game:chat', ({ roomCode, message }) => {
			io.of('/game')
				.to(roomCode)
				.emit('game:chat', { userId: user.id, message });
		});
	});

	// --- Notifications Namespace ---
	io.of('/notifications').on('connection', (socket) => {
		const user = getSessionUser(socket);
		if (!user) return socket.disconnect();
		socket.join(user.id);
		// Real-time push for notifications
		socket.on(
			'notification:read',
			async ({ notificationId }) => {
				await prisma.notification.update({
					where: { id: notificationId },
					data: { read: true },
				});
			}
		);
	});

	// --- Achievements Namespace ---
	io.of('/achievements').on('connection', (socket) => {
		const user = getSessionUser(socket);
		if (!user) return socket.disconnect();

		// Client requests all unlocked achievements
		socket.on('achievement:list', async (_, cb) => {
			try {
				const unlocked =
					await prisma.userAchievement.findMany({
						where: { userId: user.id },
						include: { achievement: true },
					});
				cb && cb(unlocked);
			} catch (err) {
				cb && cb([]);
			}
		});

		// Server emits when an achievement is unlocked
		// socket.emit('achievement:unlocked', { achievement });
		// Server emits for real-time toast/modal
		// socket.emit('achievement:notify', { achievement });
		// Server emits to sync new achievement states
		// socket.emit('achievement:sync', { achievements });
	});

	return io;
}

module.exports = { createSocketServer };
