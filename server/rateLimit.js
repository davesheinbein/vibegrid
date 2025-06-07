// Simple rate limiting middleware for Express/Socket.io
const rateLimitMap = new Map();

function rateLimit(key, limit, windowMs) {
	const now = Date.now();
	if (!rateLimitMap.has(key)) {
		rateLimitMap.set(key, []);
	}
	const timestamps = rateLimitMap
		.get(key)
		.filter((ts) => now - ts < windowMs);
	if (timestamps.length >= limit) return false;
	timestamps.push(now);
	rateLimitMap.set(key, timestamps);
	return true;
}

module.exports = { rateLimit };
