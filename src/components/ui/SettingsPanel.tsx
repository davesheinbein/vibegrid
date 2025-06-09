import React, { useContext } from 'react';
import { UserSettingsContext } from './UserSettingsProvider';
import styles from '../../styles/SettingsPanel.module.scss';

/**
 * SettingsPanel - Modular user settings panel for toggling chat, profanity filter, and notifications.
 * Uses UserSettingsContext for state. Styles are extracted to SCSS module for maintainability.
 *
 * Architectural note: Add new settings here as features grow. Keep UI presentational and logic in context/helpers.
 */
const SettingsPanel: React.FC = () => {
	const { settings, setSettings } = useContext(
		UserSettingsContext
	);

	return (
		<div className={styles.settingsPanelContainer}>
			<h2>User Settings</h2>
			<div className={styles.settingsPanelOptions}>
				<label className={styles.settingsPanelLabel}>
					<input
						type='checkbox'
						checked={settings.chatEnabled}
						onChange={(e) =>
							setSettings({
								...settings,
								chatEnabled: e.target.checked,
							})
						}
					/>
					Enable In-Game Chat
				</label>
				<label className={styles.settingsPanelLabel}>
					<input
						type='checkbox'
						checked={settings.profanityFilter}
						onChange={(e) =>
							setSettings({
								...settings,
								profanityFilter: e.target.checked,
							})
						}
					/>
					Profanity Filter
				</label>
				<label className={styles.settingsPanelLabel}>
					<input
						type='checkbox'
						checked={settings.notificationsEnabled}
						onChange={(e) =>
							setSettings({
								...settings,
								notificationsEnabled: e.target.checked,
							})
						}
					/>
					Enable Notification Banners
				</label>
			</div>
		</div>
	);
};

export default SettingsPanel;
