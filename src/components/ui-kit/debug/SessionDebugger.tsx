// src/components/ui-kit/debug/SessionDebugger.tsx
// A debug component to help track session persistence issues

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface SessionDebuggerProps {
	enabled?: boolean;
}

const SessionDebugger: React.FC<SessionDebuggerProps> = ({
	enabled = process.env.NODE_ENV === 'development',
}) => {
	const { data: session, status } = useSession();
	const [clientTime, setClientTime] = useState<string | null>(null);

	useEffect(() => {
		// Only set the time on the client to avoid hydration mismatch
		setClientTime(new Date().toLocaleTimeString());
	}, []);

	if (!enabled) return null;

	return (
		<div
			style={{
				position: 'fixed',
				top: 10,
				left: 10,
				backgroundColor: 'rgba(0,0,0,0.8)',
				color: 'white',
				padding: '10px',
				borderRadius: '5px',
				fontSize: '12px',
				zIndex: 9999,
				maxWidth: '300px',
			}}
		>
			<div>
				<strong>Session Status:</strong> {status}
			</div>
			<div>
				<strong>User ID:</strong>{' '}
				{session?.user ? (session.user as any).id : 'None'}
			</div>
			<div>
				<strong>Email:</strong>{' '}
				{session?.user?.email || 'None'}
			</div>
			<div>
				<strong>Session Exists:</strong>{' '}
				{session ? 'Yes' : 'No'}
			</div>
			<div>
				<strong>Timestamp:</strong>{' '}
				{clientTime || '...'}
			</div>
		</div>
	);
};

export default SessionDebugger;
