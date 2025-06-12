import React, { useContext } from 'react';
import { UserSettingsContext } from '../providers/UserSettingsProvider';
import { useSession, signIn } from 'next-auth/react';
import SignInModal from '../modals/SignInModal';
import styles from '../../../styles/SettingsPanel.module.scss';

const SettingsPanel: React.FC = () => {
	const { settings, setSettings } = useContext(
		UserSettingsContext
	);
	const { data: session } = useSession();

	if (!session) {
		return (
			<SignInModal
				open={true}
				onClose={() => {}}
				onSignIn={() => signIn()}
			/>
		);
	}

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
					Notifications
				</label>
			</div>
		</div>
	);
};

export default SettingsPanel;
