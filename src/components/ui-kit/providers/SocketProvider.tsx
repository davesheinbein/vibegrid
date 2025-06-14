// src/components/ui-kit/providers/SocketProvider.tsx
// Socket.IO context provider for the application

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	error: string | null;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
	error: null,
});

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error(
			'useSocket must be used within a SocketProvider'
		);
	}
	return context;
};

interface SocketProviderProps {
	children: React.ReactNode;
}

export const SocketProvider: React.FC<
	SocketProviderProps
> = ({ children }) => {
	const { data: session } = useSession();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!session?.user) return;

		const userId = (session.user as any).id;
		const userEmail = session.user.email;

		console.log('🔌 Initializing Socket.IO connection...');

		// Initialize Socket.IO connection with limited reconnection attempts
		const socketInstance = io({
			path: '/api/socket',
			query: {
				userId,
				userEmail,
			},
			transports: ['polling', 'websocket'],
			upgrade: true,
			reconnectionAttempts: 5, // Limit to 5 tries
			reconnectionDelay: 2000, // 2 seconds between attempts
		});

		// Connection event handlers
		socketInstance.on('connect', () => {
			console.log(
				'✅ Socket.IO connected:',
				socketInstance.id
			);
			setIsConnected(true);
			setError(null);
		});

		socketInstance.on('disconnect', (reason) => {
			console.log('❌ Socket.IO disconnected:', reason);
			setIsConnected(false);
			if (reason === 'io server disconnect') {
				// Server disconnected, try to reconnect
				socketInstance.connect();
			}
		});

		socketInstance.on('connect_error', (err) => {
			console.error('❌ Socket.IO connection error:', err);
			setError(err.message);
			setIsConnected(false);
		});

		socketInstance.on('reconnect', (attemptNumber) => {
			console.log(
				'🔄 Socket.IO reconnected after',
				attemptNumber,
				'attempts'
			);
			setError(null);
		});

		socketInstance.on('reconnect_error', (err) => {
			console.error(
				'❌ Socket.IO reconnection error:',
				err
			);
			setError(err.message);
		});

		// Subscribe to relevant channels
		socketInstance.emit('achievement:subscribe');
		socketInstance.emit('friends:subscribe');
		socketInstance.emit('notifications:subscribe');

		setSocket(socketInstance);

		// Cleanup on unmount
		return () => {
			console.log('🔌 Cleaning up Socket.IO connection...');
			socketInstance.disconnect();
			setSocket(null);
			setIsConnected(false);
			setError(null);
		};
	}, [session?.user]);

	return (
		<SocketContext.Provider
			value={{ socket, isConnected, error }}
		>
			{children}
		</SocketContext.Provider>
	);
};
