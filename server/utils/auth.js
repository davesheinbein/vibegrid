// Auth utilities for VibeGrid backend
const jwt = require('jsonwebtoken');

function getSessionUser(reqOrSocket) {
	// Support both Express req and Socket.io socket
	let token;
	if (reqOrSocket.headers) {
		// Express req
		token = reqOrSocket.headers['authorization'];
	} else if (reqOrSocket.handshake) {
		// Socket.io
		token =
			reqOrSocket.handshake.auth?.token ||
			reqOrSocket.handshake.headers['authorization'];
	}
	if (!token) return null;
	try {
		const user = jwt.verify(
			token.replace('Bearer ', ''),
			process.env.JWT_SECRET
		);
		return user;
	} catch (e) {
		return null;
	}
}

module.exports = { getSessionUser };
