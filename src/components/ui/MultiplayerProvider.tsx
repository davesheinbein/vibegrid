import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface MultiplayerContextType {
	socket: Socket | null;
	roomCode: string | null;
	isHost: boolean;
	isConnected: boolean;
	matchStarted: boolean;
	opponentJoined: boolean;
	setRoomCode: (code: string | null) => void;
	createRoom: (roomCode: string) => void;
	joinRoom: (roomCode: string) => void;
	leaveRoom: () => void;
	startMatch: () => void;
	// Add more multiplayer state/actions as needed
}

const MultiplayerContext = createContext<
	MultiplayerContextType | undefined
>(undefined);

export const useMultiplayer = () => {
	const ctx = useContext(MultiplayerContext);
	if (!ctx)
		throw new Error(
			'useMultiplayer must be used within MultiplayerProvider'
		);
	return ctx;
};

export const MultiplayerProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [roomCode, setRoomCode] = useState<string | null>(
		null
	);
	const [isHost, setIsHost] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [matchStarted, setMatchStarted] = useState(false);
	const [opponentJoined, setOpponentJoined] =
		useState(false);
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		const s = io(
			process.env.NEXT_PUBLIC_SOCKET_URL ||
				'http://localhost:4000'
		);
		setSocket(s);
		socketRef.current = s;
		s.on('connect', () => setIsConnected(true));
		s.on('disconnect', () => setIsConnected(false));
		s.on('roomJoined', ({ roomCode, isHost }) => {
			setRoomCode(roomCode);
			setIsHost(isHost);
		});
		s.on('opponentJoined', () => setOpponentJoined(true));
		s.on('startMatch', () => setMatchStarted(true));
		s.on('leftRoom', () => {
			setRoomCode(null);
			setIsHost(false);
			setOpponentJoined(false);
			setMatchStarted(false);
		});
		return () => {
			s.disconnect();
		};
	}, []);

	const createRoom = (code: string) => {
		socketRef.current?.emit('createRoom', {
			roomCode: code,
		});
		setIsHost(true);
		setRoomCode(code);
	};
	const joinRoom = (code: string) => {
		socketRef.current?.emit('joinRoom', { roomCode: code });
		setIsHost(false);
		setRoomCode(code);
	};
	const leaveRoom = () => {
		socketRef.current?.emit('leaveRoom');
		setRoomCode(null);
		setIsHost(false);
		setOpponentJoined(false);
		setMatchStarted(false);
	};
	const startMatch = () => {
		socketRef.current?.emit('startMatch', { roomCode });
	};

	return (
		<MultiplayerContext.Provider
			value={{
				socket,
				roomCode,
				isHost,
				isConnected,
				matchStarted,
				opponentJoined,
				setRoomCode,
				createRoom,
				joinRoom,
				leaveRoom,
				startMatch,
			}}
		>
			{children}
		</MultiplayerContext.Provider>
	);
};
