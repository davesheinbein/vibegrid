import React, { useContext } from 'react';
import { UserSettingsContext } from './UserSettingsProvider';

const SettingsPanel: React.FC = () => {
	const { settings, setSettings } = useContext(
		UserSettingsContext
	);

	return (
		<div
			style={{
				padding: 24,
				maxWidth: 400,
				margin: '0 auto',
			}}
		>
			<h2>User Settings</h2>
			<div style={{ margin: '18px 0' }}>
				<label
					style={{ display: 'block', marginBottom: 12 }}
				>
					<input
						type='checkbox'
						checked={settings.chatEnabled}
						onChange={(e) =>
							setSettings({
								...settings,
								chatEnabled: e.target.checked,
							})
						}
					/>{' '}
					Enable In-Game Chat
				</label>
				<label
					style={{ display: 'block', marginBottom: 12 }}
				>
					<input
						type='checkbox'
						checked={settings.profanityFilter}
						onChange={(e) =>
							setSettings({
								...settings,
								profanityFilter: e.target.checked,
							})
						}
					/>{' '}
					Profanity Filter
				</label>
				<label
					style={{ display: 'block', marginBottom: 12 }}
				>
					<input
						type='checkbox'
						checked={settings.notificationsEnabled}
						onChange={(e) =>
							setSettings({
								...settings,
								notificationsEnabled: e.target.checked,
							})
						}
					/>{' '}
					Enable Notification Banners
				</label>
			</div>
		</div>
	);
};

export default SettingsPanel;
