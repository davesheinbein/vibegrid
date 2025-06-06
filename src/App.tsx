import React, { useState, useEffect } from 'react';
import './App.scss';
import DailyPage from './pages/DailyPage';
import StartupPage from './pages/StartupPage';

function App() {
	const [darkMode, setDarkMode] = useState(true);
	const [user, setUser] = useState<null | {
		name: string;
		email: string;
		photoUrl?: string;
	}>({
		name: 'Jane Doe',
		email: 'jane@example.com',
		photoUrl: '',
	}); // set to null to simulate logged out

	useEffect(() => {
		document.body.classList.toggle('dark-mode', darkMode);
	}, [darkMode]);

	// --- Render main page (replace with router if needed) ---
	return (
		<div className={darkMode ? 'dark-mode' : ''}>
			{/* Replace below with a router or navigation as needed */}
			<DailyPage />
		</div>
	);
}

export default App;
